import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getMetadataAndImageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const metadata = await ctx.db.system.get(args.storageId);
    const url = await ctx.storage.getUrl(args.storageId);
    return {
      url,
      metadata,
    };
  },
});
