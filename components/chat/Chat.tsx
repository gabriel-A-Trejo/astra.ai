"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast, Toaster } from "sonner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useImprovePrompt } from "@/hooks/useImprovePrompt";
import { useGenerateResponse } from "@/hooks/useGeneratesResponse";
import { ChatViewProps } from "@/types/chat.types";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { WorkspaceError } from "./WorkspaceError";
import { useChatLogic } from "@/hooks/useChatLogic";
import { useWorkspaceValidation } from "@/hooks/useWorkspaceValidation";

type Message = {
  role: "You" | "AI";
  content: string;
  _id: Id<"messages">;
  _creationTime: number;
  workspaceId: Id<"workspace">;
};

const ChatView: React.FC<ChatViewProps> = ({
  userKindeId,
  workspaceIdParam,
}) => {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const originalPromptRef = useRef<string>("");

  const workspaceState = useWorkspaceValidation(
    userKindeId,
    workspaceIdParam,
    router
  );

  const {
    messages,
    status,
    messagesEndRef,
    messagesContainerRef,
    setShouldAutoScroll,
    handleScroll,
  } = useChatLogic(workspaceState.workspaceId, workspaceState.error);

  const {
    generateResponse,
    isGenerating,
    cleanup: cleanupGenerateResponse,
  } = useGenerateResponse(
    workspaceState.workspaceId ?? undefined,
    workspaceState.error
  );

  const { handleImprovePrompt, handleRevertPrompt, hasOriginalPrompt } =
    useImprovePrompt({ setIsImprovingPrompt, originalPromptRef });

  const addMessage = useMutation(api.messages.addMessage);

  useEffect(() => {
    if (!messages?.length || isGenerating) return;

    const [firstMessage] = messages;
    const isOnlyUserMessage =
      messages.length === 1 && firstMessage.role === "You";
    const hasAIResponse = messages.some((m) => m.role === "AI");

    if (isOnlyUserMessage && !hasAIResponse) {
      generateResponse(firstMessage.content);
    }
  }, [messages, isGenerating, generateResponse]);

  useEffect(() => cleanupGenerateResponse, [cleanupGenerateResponse]);

  const isLoading = isSending || isGenerating || isImprovingPrompt;
  const canSend =
    userInput.trim() &&
    !isLoading &&
    workspaceState.workspaceId &&
    !workspaceState.error;

  const handleSendMessage = useCallback(async () => {
    if (!canSend) return;

    const input = userInput.trim();
    setUserInput("");
    setIsSending(true);
    setShouldAutoScroll(true);
    originalPromptRef.current = "";

    try {
      await addMessage({
        workspaceId: workspaceState.workspaceId as Id<"workspace">,
        content: input,
        role: "You",
      });

      await generateResponse(input);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message");
      setUserInput(input);
    } finally {
      setIsSending(false);
    }
  }, [
    canSend,
    userInput,
    workspaceState.workspaceId,
    addMessage,
    generateResponse,
    setShouldAutoScroll,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && canSend) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [canSend, handleSendMessage]
  );

  if (workspaceState.error) {
    return <WorkspaceError onNavigateHome={() => router.push("/")} />;
  }

  return (
    <main className="relative p-2 flex flex-col h-[90vh]">
      <Toaster position="top-center" richColors />

      <MessageList
        ref={messagesContainerRef}
        messages={messages as Message[]}
        status={status}
        isGenerating={isGenerating}
        onScroll={handleScroll}
        messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
      />

      <MessageInput
        userInput={userInput}
        setUserInput={setUserInput}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        isLoading={isLoading}
        canSend={!!canSend}
        workspaceError={workspaceState.error}
        isSending={isSending}
        isImprovingPrompt={isImprovingPrompt}
        handleImprovePrompt={(prompt) =>
          handleImprovePrompt(prompt, setUserInput)
        }
        handleRevertPrompt={() => handleRevertPrompt(setUserInput)}
        hasOriginalPrompt={hasOriginalPrompt}
      />
    </main>
  );
};

export default ChatView;
