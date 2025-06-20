import { Id } from "@/convex/_generated/dataModel";

export interface Message {
  _id: string;
  content: string;
  role: "You" | "AI";
  timestamp?: string;
}

export interface ChatViewProps {
  readonly userKindeId: string;
  readonly workspaceIdParam: string;
}

export interface WorkspaceState {
  isLoading: boolean;
  error: boolean;
  workspaceId: Id<"workspace"> | null | undefined;
}
