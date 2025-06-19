import ChatInterface from "@/components/chat-interface";

export default function ChatPage() {
  const chatid = crypto.randomUUID();

  return (
    <ChatInterface chatid={chatid} initialMessages={[]} autoResume={false} />
  );
}
