import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspace: defineTable({
    files: v.optional(v.any()),
    userKindeId: v.string(),
    workspaceStringId: v.string(),
    title: v.string(),
  })
    .index("by_workspaceStringId_userKindeId", [
      "workspaceStringId",
      "userKindeId",
    ])
    .index("by_userKindeId", ["userKindeId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userKindeId"],
    }),

  messages: defineTable({
    workspaceId: v.id("workspace"),
    role: v.string(),
    content: v.string(),
  }).index("by_workspaceId", ["workspaceId"]),
});
