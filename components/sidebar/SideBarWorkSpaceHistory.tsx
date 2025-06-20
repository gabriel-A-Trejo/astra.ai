"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { Button } from "../ui/button";
import { History, Search, X, Folder, Trash2 } from "lucide-react";
import { Input } from "../ui/input";

import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const SideBarWorkSpaceHistory: React.FC<{
  userKindeId: string;
  onWorkspaceDeleted?: () => void;
}> = ({ userKindeId, onWorkspaceDeleted }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<{
    id: Id<"workspace">;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const workspaces = useQuery(
    api.workspace.getWorkspaces,
    userKindeId ? { userKindeId } : "skip"
  );

  const searchResults = useQuery(
    api.workspace.searchWorkspaces,
    userKindeId && searchQuery.trim() && isSearchMode
      ? { userKindeId, query: searchQuery.trim() }
      : "skip"
  );

  const deleteWorkspace = useMutation(api.workspace.deleteWorkspaceBatch);

  const displayWorkspaces = useMemo(() => {
    if (isSearchMode && searchQuery.trim()) {
      return searchResults || [];
    }
    return workspaces?.slice(0, 10) || [];
  }, [workspaces, searchResults, isSearchMode, searchQuery]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      setIsSearchMode(value.trim().length > 0);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearchMode(false);
  }, []);

  const handleDeleteWorkspace = useCallback(
    async (workspaceId: Id<"workspace">, title: string) => {
      setWorkspaceToDelete({ id: workspaceId, title });
      setDeleteDialogOpen(true);
    },
    []
  );

  const confirmDeleteWorkspace = useCallback(async () => {
    if (!workspaceToDelete || isDeleting) return;

    setIsDeleting(true);
    onWorkspaceDeleted?.();

    try {
      const currentWorkspaceId = pathname.split("/workspaces/")[1];
      const isCurrentWorkspace =
        currentWorkspaceId &&
        displayWorkspaces.find(
          (ws) => ws.workspaceStringId === currentWorkspaceId
        )?._id === workspaceToDelete.id;

      await deleteWorkspace({
        workspaceId: workspaceToDelete.id,
        userKindeId,
      });

      setDeleteDialogOpen(false);
      setWorkspaceToDelete(null);

      if (isCurrentWorkspace) {
        toast.warning("Redirecting to homepage");
        router.push("/");
      }
    } catch (error) {
      console.error("Delete workspace error:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [
    workspaceToDelete,
    deleteWorkspace,
    router,
    isDeleting,
    pathname,
    displayWorkspaces,
  ]);

  const formatTimestamp = useCallback((timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  }, []);

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-10 bg-gray-800/50 border-gray-700/50 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => clearSearch()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <section className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <History className="size-4 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-200">
            {isSearchMode ? "Search Results" : "Recent Workspaces"}
          </h2>
          {!isSearchMode && workspaces && (
            <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
              {workspaces.length}
            </span>
          )}
        </div>

        <div className="space-y-2 overflow-y-auto max-h-96 custom-scrollbar no-scrollbar">
          {!workspaces && !searchResults ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-gray-800/30 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-4 bg-gray-700 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayWorkspaces.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Folder className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {isSearchMode ? "No workspaces found" : "No workspaces yet"}
              </p>
              {!isSearchMode && (
                <p className="text-xs mt-1">Create your first workspace!</p>
              )}
            </div>
          ) : (
            displayWorkspaces.map((workspace) => (
              <motion.div
                key={workspace._id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
              >
                <Link
                  href={`/workspaces/${workspace.workspaceStringId}`}
                  className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 transition-all duration-200 border border-transparent hover:border-gray-600/50 pr-12"
                >
                  <div className="flex items-start gap-3">
                    <Folder className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white">
                        {workspace.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(workspace._creationTime)}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 focus:text-red-600 hover:bg-red-100/10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteWorkspace(workspace._id, workspace.title);
                    }}
                    aria-label="Delete workspace"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{workspaceToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteWorkspace}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SideBarWorkSpaceHistory;
