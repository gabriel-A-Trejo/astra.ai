import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspace: defineTable({
    messages: v.any(),
    files: v.optional(v.any()),
    userKindeId: v.string(),
  }),
});
