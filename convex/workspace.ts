import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createChat = mutation({
  args: {
    message: v.any(),
    kindeId: v.string(),
  },
  handler: async (ctx, args) => {
    const chatId = await ctx.db.insert("workspace", {
      message: args.message,
      userKindeId: args.kindeId,
    });
    return chatId;
  },
});

export const getWorkspace = mutation({
  args: {
    kindeId: v.string(),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("workspace")
      .filter((q) => q.eq(q.field("userKindeId"), args.kindeId))
      .collect();
    return workspace;
  },
});

export const updateMessages = mutation({
  args: {
    id: v.id("workspace"),
    message: v.any(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db.patch(args.id, {
      message: args.message,
    });
    return messages;
  },
});

export const UpdateFiles = mutation({
  args: {
    id: v.id("workspace"),
    fileData: v.any(),
  },
  handler: async (ctx, args) => {
    const files = await ctx.db.patch(args.id, {
      fileData: args.fileData,
    });
    return files;
  },
});

export const getAllChats = mutation({
  args: {
    kindeId: v.string(),
  },

  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("workspace")
      .filter((q) => q.eq(q.field("userKindeId"), args.kindeId))
      .collect();
  },
});
