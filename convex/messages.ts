import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { paginationOptsValidator } from "convex/server";

export const addMessage = mutation({
  args: {
    workspaceId: v.id("workspace"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { workspaceId, role, content }) => {
    return await ctx.db.insert("messages", {
      workspaceId,
      role,
      content,
    });
  },
});

export const getMessagesByWorkspace = query({
  args: v.object({
    workspaceId: v.id("workspace"),
    paginationOpts: paginationOptsValidator,
  }),
  handler: async (ctx, { workspaceId, paginationOpts }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .paginate(paginationOpts);
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
