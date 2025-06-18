import { v } from "convex/values";
import { action } from "./_generated/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { api } from "./_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter();

export const generateChatTitle = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const { query } = args;
      const { text } = await generateText({
        model: openrouter("openai/gpt-4.1-nano"),
        messages: [
          {
            role: "user",
            content: `Generate a descriptive title for the following text. 2-3 words max.
            Text: ${query}`,
          },
        ],
      });

      return text;
    } catch (error) {
      console.error("Error generating chat title", error);
      return "Error generating chat title";
    }
  },
});

export const generateTitleAndInsertChat = action({
  args: {
    chatId: v.string(),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {

    try {
      const title = await ctx.runAction(api.ai.generateChatTitle, {
        query: args.userMessage,
      });

      await ctx.runMutation(api.chats.insertChat, {
        chatId: args.chatId,
        title: title,
      });
    } catch (error) {
      console.error("Error in generateTitleAndInsertChat:", error);
      throw error;
    }
  },
});
