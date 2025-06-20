import { UIMessage } from "ai";
import { DataModel } from "@/convex/_generated/dataModel";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getConvexSiteUrl() {
  let convexSiteUrl;
  if (process.env.NEXT_PUBLIC_CONVEX_URL?.includes(".cloud")) {
    convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
      /\.cloud$/,
      ".site",
    );
  } else {
    const url = new URL(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");
    url.port = String(Number(url.port) + 1);
    convexSiteUrl = url.toString();
  }
  return convexSiteUrl;
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function convertToUIMessages(
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
