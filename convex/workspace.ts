import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWorkspaceWithMessage = mutation({
  args: {
    userKindeId: v.string(),
    workspaceStringId: v.string(),
    initialMessage: v.object({
      role: v.string(),
      content: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("workspace")
      .withIndex("by_workspaceStringId_userKindeId", (q) =>
        q
          .eq("workspaceStringId", args.workspaceStringId)
          .eq("userKindeId", args.userKindeId)
      )
      .unique();

    if (existing) {
      throw new Error("Workspace ID already exists for this user.");
    }

    const workspaceId = await ctx.db.insert("workspace", {
      userKindeId: args.userKindeId,
      workspaceStringId: args.workspaceStringId,
    });

    await ctx.db.insert("messages", {
      workspaceId,
      role: args.initialMessage.role,
      content: args.initialMessage.content,
    });

    return workspaceId;
  },
});

export const doesWorkspaceExistForUser = query({
  args: {
    workspaceStringId: v.string(),
    userKindeId: v.string(),
  },
  handler: async ({ db }, { workspaceStringId, userKindeId }) => {
    const workspace = await db
      .query("workspace")
      .withIndex("by_workspaceStringId_userKindeId", (q) =>
        q
          .eq("workspaceStringId", workspaceStringId)
          .eq("userKindeId", userKindeId)
      )
      .unique();

    return workspace !== null;
  },
});

export const getWorkspaceId = query({
  args: {
    workspaceStringId: v.string(),
    userKindeId: v.string(),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("workspace")
      .withIndex("by_workspaceStringId_userKindeId", (q) =>
        q
          .eq("workspaceStringId", args.workspaceStringId)
          .eq("userKindeId", args.userKindeId)
      )
      .unique();

    if (!workspace) {
      throw new Error("Workspace not found.");
    }

    return workspace._id;
  },
});
