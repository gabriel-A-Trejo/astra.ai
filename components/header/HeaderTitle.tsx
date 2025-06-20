"use client";
import { useParams, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import React, { memo, useMemo, startTransition } from "react";

// Minimal loading skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse" aria-label="Loading workspace title">
    <p>Loading title</p>
  </div>
);

const HeroTitle = memo(
  ({ userKindeId }: Readonly<{ userKindeId: string }>) => {
    const params = useParams();
    const pathname = usePathname();

    // Early check to avoid unnecessary work
    const workspaceId = params?.id as string;
    const isWorkspacePage = pathname.startsWith("/workspaces");

    const shouldQuery = isWorkspacePage && workspaceId && userKindeId;

    const workspaceTitle = useQuery(
      api.workspace.getworkspaceTitle,
      shouldQuery
        ? {
            userKindeId,
            workspaceStringId: workspaceId,
          }
        : "skip"
    );

    // Early returns for non-workspace pages
    if (!isWorkspacePage || !workspaceId) {
      return null;
    }

    if (workspaceTitle === undefined) {
      return <LoadingSkeleton />;
    }

    if (workspaceTitle === null) {
      return (
        <p
          className="font-medium text-gray-500"
          role="status"
          aria-live="polite"
        >
          Workspace not found
        </p>
      );
    }

    return (
      <p className="font-bold truncate" title={workspaceTitle}>
        {workspaceTitle.length > 40
          ? workspaceTitle.slice(0, 40) + "..."
          : workspaceTitle}
      </p>
    );
  },

  (prevProps, nextProps) => prevProps.userKindeId === nextProps.userKindeId
);

HeroTitle.displayName = "HeroTitle";

export default HeroTitle;
