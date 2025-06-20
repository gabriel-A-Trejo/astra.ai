import React from "react";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";
import { Toaster } from "../ui/sonner";

interface WorkspaceErrorProps {
  onNavigateHome: () => void;
}

export const WorkspaceError: React.FC<WorkspaceErrorProps> = ({
  onNavigateHome,
}) => {
  return (
    <main className="absolute w-full min-h-screen ">
      <Toaster position="top-center" richColors />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="size-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-200">
            Workspace Not Found
          </h2>
          <p className="text-gray-400">
            This workspace no longer exists and may have been deleted.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to the home page in a few seconds...
          </p>
          <Button onClick={onNavigateHome} className="mt-4">
            Go to Home
          </Button>
        </div>
      </div>
    </main>
  );
};
