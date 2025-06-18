"use client";
import { useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Paperclip, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import { getModels } from "@/lib/models";
import { useChat } from "@ai-sdk/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { Attachment } from "@ai-sdk/ui-utils";
import { Toggle } from "./ui/toggle";
import type { UseChatHelpers } from "@ai-sdk/react";
import { DeepSeek, Gemini, OpenAI, Qwen } from "@/lib/icons";
import { saveChatModelAsCookie } from "@/lib/actions";

export default function ChatInput({
  chatid,
  input,
  handleInputChange,
  handleSubmit,
  status,
  stop,
  model,
  options,
  setModel,
  setOptions,
}: {
  chatid: string;
  input: UseChatHelpers["input"];
  handleInputChange: UseChatHelpers["handleInputChange"];
  handleSubmit: UseChatHelpers["handleSubmit"];
  status: UseChatHelpers["status"];
  stop: UseChatHelpers["stop"];
  model: string;
  options: {
    reasoningEffort: string;
    webSearch: boolean;
  };
  setModel: (model: string) => void;
  setOptions: (options: {
    reasoningEffort: string;
    webSearch: boolean;
  }) => void;
}) {
  const user = useAuthToken();

  // [
  //   {
  //     name: "earth.png",
  //     contentType: "image/jpeg",
  //     url: "https://helpful-cuttlefish-605.convex.cloud/api/storage/739a9f64-7a10-4b38-8efd-de9fec302d19",
  //   },
  //   {
  //     name: "moon.png",
  //     contentType: "image/jpeg",
  //     url: "https://helpful-cuttlefish-605.convex.cloud/api/storage/739a9f64-7a10-4b38-8efd-de9fec302d19",
  //   },
  // ]

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const customHandleSubmit = () => {
    window.history.replaceState({}, "", `/chat/${chatid}`);

    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });
  };

  const generateUploadUrl = useMutation(api.fileUpload.generateUploadUrl);
  const getMetadataAndImageUrl = useMutation(
    api.fileUpload.getMetadataAndImageUrl,
  );

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const models = getModels();

  // Find the current model's configuration to check if it supports reasoning
  const currentModelConfig = models.find((m) => m.id === model);
  const supportsReasoning =
    currentModelConfig?.capabilities?.supportsReasoning ?? false;

  async function handleSendImage(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    const files = event.target.files;

    if (!files) {
      console.error("some error uploading attachments");
      return;
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      const { url, metadata } = await getMetadataAndImageUrl({ storageId });

      if (!url) {
        throw new Error("Error in getMetadataAndImageUrl");
      }

      return {
        name: `attachment-${crypto.randomUUID()}`,
        contentType: metadata?.contentType,
        url,
      };
    });

    const results = await Promise.allSettled(uploadPromises);
    const validAttachments = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    setSelectedImage(null);
    imageInput.current!.value = "";
    setAttachments((prev) => [...prev, ...validAttachments]);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      customHandleSubmit();
    }
  };

  return (
    <div className="flex flex-col border-2 border-white/10 rounded-t-lg sticky bottom-0 max-w-3xl w-full bg-background">
      {attachments.length > 0 && (
        <div className="flex flex-row gap-3 px-4 pt-4 pb-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                className="rounded-md object-cover shadow-sm border border-white/20"
                height={48}
                width={48}
                src={attachment.url}
                alt=""
              />
            </div>
          ))}
        </div>
      )}

      <div className="p-4 space-y-4">
        <textarea
          onKeyDown={handleKeyDown}
          className="resize-none outline-none w-full text-base placeholder:text-muted-foreground bg-transparent text-white"
          placeholder="Ask me anything..."
          value={input}
          onChange={handleInputChange}
          rows={input.length > 1000 ? 10 : 3}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select
              value={model}
              onValueChange={(value) => {
                setModel(value);
                saveChatModelAsCookie(value);
              }}
            >
              <SelectTrigger className="w-[180px] h-9 border-white/20 bg-background text-white hover:bg-white/5">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-background">
                {models.map((model: any) => (
                  <SelectItem
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                    key={model.id}
                    value={model.id}
                  >
                    <div className="flex items-center gap-2">
                      {model.id.includes("openai") && <OpenAI />}
                      {model.id.includes("deepseek") && <DeepSeek />}
                      {model.id.includes("qwen") && <Qwen />}
                      {model.id.includes("gemini") && <Gemini />}
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              className="flex items-center justify-center h-9 w-9 rounded-full border border-white/20 bg-background hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => imageInput.current?.click()}
            >
              <Paperclip className="text-white/70" size={16} />
              <input
                className="hidden"
                type="file"
                multiple
                accept="image/*"
                ref={imageInput}
                onChange={handleSendImage}
                disabled={selectedImage !== null}
              />
            </button>

            <Toggle
              className="h-9 w-9 border border-white/20 bg-background hover:bg-white/5 data-[state=on]:bg-white/10 text-white/70"
              aria-label="Toggle web search"
              pressed={options.webSearch}
              onPressedChange={(pressed) =>
                setOptions({ ...options, webSearch: pressed })
              }
            >
              <Globe className="h-4 w-4" />
            </Toggle>

            {supportsReasoning && (
              <Select
                value={options.reasoningEffort}
                onValueChange={(value) =>
                  setOptions({ ...options, reasoningEffort: value })
                }
              >
                <SelectTrigger className="w-[100px] h-9 border-white/20 bg-background text-white hover:bg-white/5">
                  <SelectValue placeholder="Reasoning" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-background">
                  <SelectItem
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                    value="low"
                  >
                    Low
                  </SelectItem>
                  <SelectItem
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                    value="medium"
                  >
                    Medium
                  </SelectItem>
                  <SelectItem
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                    value="high"
                  >
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            {status === "ready" && (
              <Button
                disabled={!input.trim()}
                onClick={handleSubmit}
                className="h-9 w-9 cursor-pointer border border-white/20 bg-background hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                size="icon"
              >
                <ArrowUp className="text-white/70" size={16} />
              </Button>
            )}
            {status === "submitted" && (
              <Button
                onClick={stop}
                className="h-9 w-9 cursor-pointer border border-white/20 bg-background hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                size="icon"
              >
                <StopCircle className="text-white/70" size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
