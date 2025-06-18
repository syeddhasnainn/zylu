import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  chats: defineTable({
    id: v.string(),
    userId: v.id("users"),
    title: v.string(),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
    createdAt: v.number(),
  }),

  messages: defineTable({
    chatId: v.string(),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    parts: v.array(
      v.object({
        type: v.union(
          v.literal("text"),
          v.literal("reasoning"),
          v.literal("file"),
          v.literal("image"),
        ),
        text: v.optional(v.string()),
        reasoning: v.optional(v.string()),
        file: v.optional(v.string()),
        image: v.optional(v.string()),
      }),
    ),
    createdAt: v.number(),
    model: v.string(),
  }),

  streams: defineTable({
    chatId: v.string(),
    streamId: v.string(),
    createdAt: v.number(),
  }),

  publicChats: defineTable({
    id: v.string(),
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
  }),
});
