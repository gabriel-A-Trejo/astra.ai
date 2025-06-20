import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";

import { WorkspaceState } from "@/types/chat.types";

export const useWorkspaceValidation = (
  userKindeId: string,
  workspaceIdParam: string,
  router: ReturnType<typeof useRouter>
): WorkspaceState => {
  const [workspaceError, setWorkspaceError] = useState(false);

  const workspaceId = useQuery(api.workspace.getWorkspaceId, {
    userKindeId,
    workspaceStringId: workspaceIdParam,
  });

  useEffect(() => {
    if (workspaceId === null) {
      setWorkspaceError(true);
      toast.error("This workspace no longer exists and may have been deleted.");

      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 3000);

      return () => clearTimeout(redirectTimer);
    } else if (workspaceId !== undefined) {
      setWorkspaceError(false);
    }
  }, [workspaceId, router]);

  return {
    isLoading: workspaceId === undefined,
    error: workspaceError,
    workspaceId,
  };
};
