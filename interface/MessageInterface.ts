import { Id } from "@/convex/_generated/dataModel";

export interface Message {
  id: Id<"messages">;
  role: string;
  content: string;
}

export interface MessagesStore {
  messages: Message[];
  setMessage: (id: Id<"messages">, role: "You" | "AI", message: string) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
}
