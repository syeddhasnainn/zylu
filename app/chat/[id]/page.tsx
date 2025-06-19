import ChatInterface from "@/components/chat-interface";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DataModel } from "@/convex/_generated/dataModel";
import { UIMessage, Attachment } from "ai";
import { preloadQuery, fetchQuery } from "convex/nextjs";
import { convertToUIMessages } from "@/lib/utils";
import { getAuthUserId } from "@convex-dev/auth/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function ChatPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const initialMessages = await fetchQuery(api.chats.getChatMessages, {
    chatId: id,
  });

  // const messages = initialMessages._valueJSON;

  // console.log(messages);

  return (
    <ChatInterface
      chatid={id}
      autoResume={true}
      initialMessages={convertToUIMessages(initialMessages)}
    />
  );
}
