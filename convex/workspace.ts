import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createWorkspace = mutation({
  args: {
    message: v.string(),
    userKindeId: v.string(),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.insert("workspace", {
      messages: args.message,
      userKindeId: args.userKindeId,
    });
    return workspace;
  },
});

export const UpdateMessages = mutation({
  args: {
    message: v.string(),
    workspace: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspace, {
      messages: args.message,
    });
    return result;
  },
});

export const UpdateFiles = mutation({
  args: {
    files: v.any(),
    workspace: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspace, {
      files: args.files,
    });
    return result;
  },
});
