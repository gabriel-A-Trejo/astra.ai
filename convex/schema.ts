import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspace: defineTable({
    files: v.optional(v.any()),
    userKindeId: v.string(),
    workspaceStringId: v.string(),
  }).index("by_workspaceStringId_userKindeId", [
    "workspaceStringId",
    "userKindeId",
  ]),
  messages: defineTable({
    workspaceId: v.string(),
    role: v.string(),
    content: v.string(),
  }).index("by_workspaceId", ["workspaceId"]),
});
