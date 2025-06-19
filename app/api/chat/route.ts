import { api } from "@/convex/_generated/api";
import { getProviderByModelName } from "@/lib/models";
import { generateId, smoothStream, streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { revalidatePath } from "next/cache";
import { Id } from "@/convex/_generated/dataModel";
import { after } from "next/server";
import { createDataStream } from "ai";

import {
  createResumableStreamContext,
  ResumableStreamContext,
} from "resumable-stream";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
  prefix: "zylu-ratelimit",
});

let globalStreamContext: ResumableStreamContext | null = null;

function getGlobalStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after, // Integrates with Vercel's `waitUntil` for background tasks
      });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL",
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");
  const streamContext = getGlobalStreamContext();

  if (!streamContext) {
    return new Response(null, { status: 204 });
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  convex.setAuth(token);

  if (!chatId) {
    return new Response("id is required", { status: 400 });
  }

  //Todo: it can error here
  const streamIds = await convex.query(api.chats.getStreamIds, {
    chatId: chatId,
  });

  if (!streamIds.length) {
    return new Response("No streams found", { status: 404 });
  }

  const recentStreamId = streamIds.at(-1);

  if (!recentStreamId) {
    return new Response("No recent stream found", { status: 404 });
  }

  const emptyDataStream = createDataStream({
    execute: () => {},
  });

  const stream = await streamContext.resumableStream(
    recentStreamId,
    () => emptyDataStream,
  );

  if (stream) {
    return new Response(stream, { status: 200 });
  }

  /*
   * For when the generation is "active" during SSR but the
   * resumable stream has concluded after reaching this point.
   */

  const messages = await convex.query(api.chats.getChatMessages, {
    chatId: chatId,
  });

  const mostRecentMessage = messages.at(-1);

  if (!mostRecentMessage || mostRecentMessage.role !== "assistant") {
    return new Response(emptyDataStream, { status: 200 });
  }

  const messageCreatedAt = new Date(mostRecentMessage.createdAt);

  const streamWithMessage = createDataStream({
    execute: (buffer) => {
      buffer.writeData({
        type: "append-message",
        message: JSON.stringify(mostRecentMessage),
      });
    },
  });

  return new Response(streamWithMessage, { status: 200 });
}

export async function POST(request: NextRequest) {
  const identifier = "api";
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { chatid, model, options, messages, systemPrompt, apiKey } =
    await request.json();

  const openrouter = createOpenRouter({
    apiKey: apiKey || process.env.OPENROUTER_API_KEY,
  });

  // Extract the auth token from the Authorization header
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);

  const streamId = generateId();

  try {
    // Create a Convex client with authentication
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    convex.setAuth(token);

    const userMessage = messages[messages.length - 1];

    const chat = await convex.query(api.chats.getChatById, {
      chatId: chatid,
    });

    if (!chat) {
      await convex.action(api.ai.generateTitleAndInsertChat, {
        chatId: chatid,
        userMessage: userMessage.content,
      });
    }

    await convex.mutation(api.chats.appendStreamId, {
      chatId: chatid,
      streamId: streamId,
    });

    let attachments: any[] = [];

    if (userMessage.experimental_attachments) {
      attachments = userMessage.experimental_attachments.map(
        (attachment: any) => {
          return {
            type: "image",
            image: attachment.url,
          };
        },
      );
    }

    // Insert the user message
    await convex.mutation(api.chats.insertMessageWithAuth, {
      chatId: chatid,
      role: "user",
      parts: [{ type: "text", text: userMessage.content }, ...attachments],
      model: model,
    });

    const modelInfo = getProviderByModelName(model);

    if (!modelInfo) {
      throw new Error("Provider not found");
    }

    const { instanceFactory, config } = modelInfo;

    const reasoningOption = {
      reasoning: {
        effort: options.reasoningEffort,
      },
    };

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: openrouter(
            options.webSearch ? `${model}:online` : model,
            config.capabilities.supportsReasoning ? reasoningOption : {},
          ),
          messages,

          experimental_transform: smoothStream({
            chunking: "word",
          }),

          system: `${systemPrompt}. You are a helpful assistant that can answer questions and help with tasks. When presenting mathematical equations or formulas, format them using the following structure: Begin each section with a descriptive title in bold markdown formatting, followed by the equation rendered in LaTeX display mode using double dollar signs. For multiple related equations, group them using the aligned environment within a single display math block, ensuring proper alignment using ampersands before equal signs and double backslashes between lines. Each equation should be properly spaced with blank lines separating different mathematical concepts or topics. Use standard LaTeX notation for all mathematical symbols, operators, vectors, matrices, and special functions. Ensure that complex equations like differential equations, matrix operations, integrals, and multi-line derivations are clearly formatted with appropriate mathematical typography. Always use display mode rather than inline math to make the equations prominent and readable`,

          onFinish: async (message) => {
            // Insert the assistant message
            await convex.mutation(api.chats.insertMessageWithAuth, {
              chatId: chatid,
              role: "assistant",
              parts: config.capabilities.supportsReasoning
                ? [
                    { type: "reasoning", reasoning: message.reasoning },
                    { type: "text", text: message.text },
                  ]
                : [{ type: "text", text: message.text }],
              model: model,
            });
          },

          onError: (error) => {
            console.error("Error in stream", error);
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
    });

    const streamContext = getGlobalStreamContext();
    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () => stream),
      );
    } else {
      return new Response(stream);
    }

    // return new Response(
    //   await streamContext.resumableStream(streamId, () => stream),
    // );
  } catch (error) {
    console.error("Authentication or processing error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 401 },
    );
  }
}
