import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspace: defineTable({
    message: v.any(),
    fileData: v.optional(v.any()),
    userKindeId: v.string(),
  }),
});
