"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useGenerateResponse(
  workspaceId: Id<"workspace"> | undefined,
  workspaceError: boolean
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateMessage = useMutation(api.messages.addMessage);

  const generateResponse = useCallback(
    async (prompt: string) => {
      if (!workspaceId || workspaceError) return;
      setIsGenerating(true);
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/ai/chatResponse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const aiResponse = await response.json();

        await updateMessage({
          workspaceId,
          content: aiResponse.response,
          role: "AI",
        });

        toast.success("Response generated successfully");
      } catch (error: any) {
        if (error.name === "AbortError") return;
        console.error("AI response error:", error);
        toast.error(
          error.message.includes("HTTP")
            ? "AI service temporarily unavailable"
            : "Failed to generate response"
        );
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [workspaceId, updateMessage, workspaceError]
  );

  // Clean up abort on unmount
  const cleanup = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { generateResponse, isGenerating, cleanup };
}
