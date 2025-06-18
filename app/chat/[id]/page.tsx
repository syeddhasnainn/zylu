import ChatInterface from "@/components/chat-interface";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DataModel } from "@/convex/_generated/dataModel";
import { UIMessage, Attachment } from "ai";
import { preloadQuery, fetchQuery } from "convex/nextjs";

export default async function ChatPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const initialMessages = await fetchQuery(api.chats.getChatMessages, {
    chatId: id,
  });

  return (
    <ChatInterface
      chatid={id}
      autoResume={true}
      initialMessages={convertToUIMessages(initialMessages)}
    />
  );
}

function convertToUIMessages(
  messages: Array<DataModel["messages"]["document"]>,
): Array<UIMessage> {
  return messages.map((message) => ({
    id: message._id,
    parts: message.parts as UIMessage["parts"],
    role: message.role as UIMessage["role"],
    // Note: content will soon be deprecated in @ai-sdk/react
    content: "",
    createdAt: new Date(message.createdAt),
    experimental_attachments: [],
  }));
}
