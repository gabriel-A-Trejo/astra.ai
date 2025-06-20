import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { notFound } from "next/navigation";

export const createWorkspaceWithMessage = mutation({
  args: {
    userKindeId: v.string(),
    workspaceStringId: v.string(),
    initialMessage: v.object({
      role: v.string(),
      content: v.string(),
    }),
    title: v.string(),
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
      title: args.title,
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
      return null;
    }

    return workspace._id;
  },
});

export const getWorkspaces = query({
  args: {
    userKindeId: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await ctx.db
      .query("workspace")
      .withIndex("by_userKindeId", (q) => q.eq("userKindeId", args.userKindeId))
      .collect();

    return response;
  },
});

export const searchWorkspaces = query({
  args: {
    userKindeId: v.string(),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workspace")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.query).eq("userKindeId", args.userKindeId)
      )
      .take(10);
  },
});

export const deleteWorkspaceBatch = mutation({
  args: {
    workspaceId: v.id("workspace"),
    userKindeId: v.string(),
  },
  handler: async (ctx, { workspaceId, userKindeId }) => {
    // Fetch the workspace by Convex document ID
    const workspace = await ctx.db.get(workspaceId);

    // Check if workspace exists and belongs to the user
    if (!workspace || workspace.userKindeId !== userKindeId) {
      throw new Error(
        "Workspace not found or you don't have permission to delete it"
      );
    }

    // Query all messages for that workspace
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId))
      .collect();

    // Delete messages in batches (if large number)
    const batchSize = 100;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      await Promise.all(batch.map((m) => ctx.db.delete(m._id)));
    }

    await ctx.db.delete(workspaceId);

    return {
      success: true,
      deletedMessages: messages.length,
      workspaceDeleted: true,
    };
  },
});

export const getworkspaceTitle = query({
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
      return null;
    }
    return workspace.title;
  },
});
