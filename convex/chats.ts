import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const insertChat = mutation({
  args: {
    chatId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      await ctx.db.insert("chats", {
        id: args.chatId,
        title: args.title,
        userId: userId,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Error inserting chat", error);
    }
  },
});

export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    await ctx.db.delete(args.chatId);
  },
});

export const getChatById = query({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("id"), args.chatId))
      .first();

    return chat;
  },
});

export const insertMessage = mutation({
  args: {
    chatId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    userId: v.id("users"),
    model: v.string(),
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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: args.role,
      userId: args.userId,
      parts: args.parts,
      createdAt: Date.now(),
      model: args.model,
    });
  },
});

export const insertMessageWithAuth = mutation({
  args: {
    chatId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    model: v.string(),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: args.role,
      userId: userId,
      parts: args.parts,
      createdAt: Date.now(),
      model: args.model,
    });
  },
});

export const getChatThread = query({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("id"), args.chatId))
      .first();

    return chat;
  },
});

export const getAllChats = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    // if (!userId) {
    //   throw new Error("User not authenticated");
    // }

    const chats = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
    return chats;
  },
});

export const getChatMessages = query({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .order("asc")
      .collect();

    return messages;
  },
});

export const searchChatAction = action({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const chats = await ctx.runQuery(api.chats.searchChat, {
      title: args.title,
    });

    return chats;
  },
});

export const searchChat = query({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const chats = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const filteredChats = chats.filter((chat) =>
      chat.title.toLowerCase().includes(args.title.toLowerCase()),
    );

    return filteredChats;
  },
});

export const appendStreamId = mutation({
  args: {
    chatId: v.string(),
    streamId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("streams", {
      chatId: args.chatId,
      streamId: args.streamId,
      createdAt: Date.now(),
    });
  },
});

export const getStreamIds = query({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const streamIds = await ctx.db
      .query("streams")
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .collect();

    return streamIds.map((stream) => stream.streamId);
  },
});
