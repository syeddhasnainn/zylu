"use client";
import { memo, useState } from "react";
import { Loader } from "@/components/ui/loader";
import { ChevronDown } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import type { UseChatHelpers } from "@ai-sdk/react";

export default function ChatMessages({
  messages,
  status,
}: {
  messages: UseChatHelpers["messages"];
  status: UseChatHelpers["status"];
}) {
  return (
    <div className="pb-16 pt-10 space-y-6 text-white">
      {messages.map((message) => (
        <div key={message.id} className="space-y-3">
          {message.role === "user" && (
            <div className="flex justify-end">
              <div className="border border-white/20 px-4 py-3 max-w-fit rounded-2xl bg-white/5">
                {message.parts[0].type === "text" ? message.parts[0].text : ""}
              </div>
            </div>
          )}
          {message.role === "assistant" && (
            <div className="space-y-4">
              {message.parts.map((part: any, i: number) => {
                switch (part.type) {
                  case "reasoning":
                    return (
                      <MemoizedDropown
                        key={`${message.id}-${i}`}
                        reasoning={part.reasoning}
                      />
                    );
                  case "text":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="prose prose-invert max-w-none"
                      >
                        <Markdown>{part.text}</Markdown>
                      </div>
                    );
                }
              })}
            </div>
          )}
        </div>
      ))}
      {status === "submitted" && (
        <div className="flex justify-start py-4">
          <Loader />
        </div>
      )}
    </div>
  );
}

function ReasoningDropdown({ reasoning }: { reasoning: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
      >
        <span
          className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <ChevronDown size={16} />
        </span>
        <span>Reasoning</span>
      </button>
      {isExpanded && (
        <div className="mt-3 p-4 border-l-2 border-white/20 bg-white/5 text-white/90 text-sm rounded-r-lg">
          <div className="whitespace-pre-wrap">{reasoning}</div>
        </div>
      )}
    </div>
  );
}

const MemoizedDropown = memo(ReasoningDropdown);
