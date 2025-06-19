"use client";
import { memo, useState } from "react";
import { Loader } from "@/components/ui/loader";
import { ChevronDown } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import type { UseChatHelpers } from "@ai-sdk/react";
import ReasoningBlock from "./reasoning-block";

export default function ChatMessages({
  messages,
  status,
}: {
  messages: UseChatHelpers["messages"];
  status: UseChatHelpers["status"];
}) {
  console.log(messages);
  return (
    <div className="pb-16 pt-10 space-y-6 text-white">
      {messages.map((message) => (
        <div key={message.id} className="space-y-3 flex">
          {message.role === "user" && (
            <div className="flex flex-col-reverse items-end gap-2 ml-auto">
              {message.parts.map((part: any, i: number) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        className="max-w-fit rounded-xl object-cover shadow-sm border border-white/20 p-3"
                        key={`${message.id}-${i}`}
                      >
                        {part.text}
                      </div>
                    );
                  case "image":
                    return (
                      <div className="items-start" key={`${message.id}-${i}`}>
                        <img
                          className="rounded-xl object-cover shadow-sm border border-white/20"
                          height={150}
                          width={150}
                          src={part.image}
                          alt=""
                        />
                      </div>
                    );
                }
              })}
            </div>
            // <div className="flex justify-end">
            //   <div className="border border-white/20 px-4 py-3 max-w-fit rounded-2xl bg-white/5">
            //     {message.parts[0].type === "text" ? message.parts[0].text : ""}
            //   </div>
            // </div>
          )}
          {message.role === "assistant" && (
            <div className="space-y-4">
              {message.parts.map((part: any, i: number) => {
                switch (part.type) {
                  case "reasoning":
                    return (
                      <ReasoningBlock
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
