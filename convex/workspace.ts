import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createWorkspace = mutation({
  args: {
    userKindeId: v.string(),
    messages: v.array(v.object({ role: v.string(), content: v.string() })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workspace", {
      messages: args.messages,
      userKindeId: args.userKindeId,
    });
  },
});
