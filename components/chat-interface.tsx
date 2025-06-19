"use client";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { useChat } from "@ai-sdk/react";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { useAuthToken } from "@convex-dev/auth/react";
import { UIMessage } from "ai";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ChatInterface({
  chatid,
  initialMessages,
  autoResume,
}: {
  chatid: string;
  initialMessages: UIMessage[];
  autoResume: boolean;
}) {
  const user = useAuthToken();
  const [model, setModel] = useState(
    localStorage.getItem("model") || "openai/gpt-4.1-nano",
  );
  const [options, setOptions] = useState({
    reasoningEffort: "low",
    webSearch: false,
  });

  const systemPrompt = localStorage.getItem("system-prompt") || "";
  const apiKey = localStorage.getItem("openrouter-key") || "";

  const {
    experimental_resume,
    data,
    setMessages,
    messages,
    status,
    input,
    handleInputChange,
    handleSubmit,
    stop,
  } = useChat({
    id: chatid,
    initialMessages: initialMessages,
    body: {
      chatid,
      model: model,
      options: options,
      systemPrompt: systemPrompt,
      apiKey: apiKey,
    },
    headers: {
      Authorization: `Bearer ${user}`,
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  useAutoResume({
    autoResume: autoResume,
    initialMessages: initialMessages,
    experimental_resume,
    data,
    setMessages,
  });

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full">
      <div className="flex flex-col justify-between h-full px-2">
        <ChatMessages status={status} messages={messages} />

        <ChatInput
          model={model}
          options={options}
          setModel={setModel}
          setOptions={setOptions}
          status={status}
          chatid={chatid}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          stop={stop}
        />
      </div>
    </div>
  );
}
