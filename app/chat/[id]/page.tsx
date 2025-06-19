import ChatInterface from "@/components/chat-interface";
import { api } from "@/convex/_generated/api";
import { preloadQuery, fetchQuery, preloadedQueryResult } from "convex/nextjs";
import { convertToUIMessages } from "@/lib/utils";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function ChatPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const token = await convexAuthNextjsToken();
  const preloadedMessages = await preloadQuery(
    api.chats.getChatMessages,
    {
      chatId: id,
    },
    {
      token,
    },
  );

  const initialMessages = preloadedQueryResult(preloadedMessages);

  return (
    <ChatInterface
      chatid={id}
      autoResume={true}
      initialMessages={convertToUIMessages(initialMessages)}
    />
  );
}
