import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const updateEventImage = mutation({
  args: {
    eventId: v.id("events"),
    storageId: v.union(v.id("_storage"), v.null()),
  },
  handler: async (ctx, { eventId, storageId }) => {
    await ctx.db.patch(eventId, {
      imageStorageId: storageId ?? undefined,
    });
  },
});

export const deleteImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
  },
});
