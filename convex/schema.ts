import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspace: defineTable({
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
    files: v.optional(v.any()),
    userKindeId: v.string(),
  }),
});
