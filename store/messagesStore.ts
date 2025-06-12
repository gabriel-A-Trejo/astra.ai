import { MessagesStore } from "@/interface/MessageInterface";
import { create } from "zustand";

export const useMessage = create<MessagesStore>((set) => ({
  messages: [],
  setMessage: (id, role, message) =>
    set((state) => ({
      messages: [...state.messages, { id, role, content: message }],
    })),
  setMessages: (messages) => set(() => ({ messages })),
  clearMessages: () => set({ messages: [] }),
}));
