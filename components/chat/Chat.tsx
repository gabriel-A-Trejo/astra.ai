"use client";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import { ArrowBigRight, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { AiModelsDropDown } from "../AiModels/AiModelsDropDown";
import { api } from "@/convex/_generated/api";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import rehypeSanitize from "rehype-sanitize";
import { TextShimmer } from "../animations/text-shimmer";

const ChatView = ({
  userKindeId,
  workspaceIdParam,
}: Readonly<{ userKindeId: string; workspaceIdParam: string }>) => {
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevMessageCountRef = useRef<number>(0);

  const updateMessage = useMutation(api.messages.addMessage);
  const getWorkspaceId = useQuery(api.workspace.getWorkspaceId, {
    userKindeId,
    workspaceStringId: workspaceIdParam,
  });

  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.getMessagesByWorkspace,
    getWorkspaceId
      ? { workspaceId: getWorkspaceId as Id<"workspace"> }
      : "skip",
    { initialNumItems: 20 }
  );

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearTop = scrollTop < 100;

    if (isNearTop && status === "CanLoadMore") {
      loadMore(10);
    }

    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShouldAutoScroll(isAtBottom);
  }, [status, loadMore]);

  const scrollHandler = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
  }, [handleScroll]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", scrollHandler);
    return () => container.removeEventListener("scroll", scrollHandler);
  }, [scrollHandler]);

  useEffect(() => {
    const prevCount = prevMessageCountRef.current;
    const currentCount = messages.length;
    const isAppended = currentCount > prevCount;

    if (shouldAutoScroll && isAppended && currentCount != 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevMessageCountRef.current = currentCount;
  }, [messages, shouldAutoScroll]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const isLoading = isSending || isGenerating;
  const canSend = userInput.trim() && !isLoading && getWorkspaceId;

  const generateResponse = useCallback(
    async (prompt: string) => {
      if (!getWorkspaceId) return;
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
          workspaceId: getWorkspaceId as Id<"workspace">,
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
    [getWorkspaceId, updateMessage]
  );

  const HandleImprovePrompt = async () => {
    try {
    } catch (error: any) {
      console.error("Improve prompt error:", error);
      toast.error("Failed to improve prompt");
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!canSend) return;
    const currentInput = userInput.trim();
    setUserInput("");
    setIsSending(true);
    setShouldAutoScroll(true);

    try {
      await updateMessage({
        workspaceId: getWorkspaceId as Id<"workspace">,
        content: currentInput,
        role: "You",
      });

      await generateResponse(currentInput);
    } catch (error: any) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
      setUserInput(currentInput);
    } finally {
      setIsSending(false);
    }
  }, [canSend, userInput, getWorkspaceId, updateMessage, generateResponse]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && canSend) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [canSend, handleSendMessage]
  );

  const wordCount = userInput.trim().split(/\s+/).filter(Boolean).length;
  const canImprovePrompt = wordCount > 6 && !isLoading;

  return (
    <main className="relative p-2 flex flex-col h-[90vh]">
      <Toaster position="top-center" richColors />

      <section
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar"
      >
        {status === "LoadingFirstPage" ? (
          <div className="p-5 text-gray-400 animate-pulse">
            Loading messages...
          </div>
        ) : (
          <>
            {status === "LoadingMore" && prevMessageCountRef.current !== 0 && (
              <div className="flex justify-center p-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading older messages...</span>
                </div>
              </div>
            )}

            {messages
              .slice()
              .reverse()
              .map((message) => (
                <div
                  key={message._id}
                  className="p-5 rounded-xl border mb-2 max-h-screen"
                >
                  <h1 className="font-bold mb-2">
                    {message.role === "You" ? "You" : "AI"}
                  </h1>
                  <ReactMarkdown
                    rehypePlugins={[rehypeSanitize]}
                    className="prose prose-invert max-w-none"
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ))}

            {isGenerating && (
              <div className="flex items-center gap-2 p-5 rounded-xl border mb-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <TextShimmer className="font-mono text-sm" duration={1}>
                  Generating response...
                </TextShimmer>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </section>

      <section className="border rounded-2xl p-1">
        <div className="flex items-center justify-center gap-2 p-1">
          <textarea
            placeholder="What should we do next?"
            className="w-full resize-none outline-none bg-transparent text-white placeholder-gray-400 p-4 rounded-2xl no-scrollbar min-h-[60px] max-h-[200px]"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />

          {userInput && (
            <aside className="flex flex-col items-center justify-center gap-2">
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer p-6 hover:bg-gray-800 transition disabled:opacity-50"
                aria-label="send message"
                disabled={!canSend}
                onClick={handleSendMessage}
              >
                {isSending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ArrowBigRight className="size-5" />
                )}
              </Button>
              {!isLoading && <p className="text-sm text-gray-300">↵ Enter</p>}
            </aside>
          )}
        </div>

        <section className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="lg"
            className="cursor-pointer p-6 hover:bg-gray-800 transition disabled:opacity-50"
            aria-label="improve prompt"
            disabled={!canImprovePrompt}
            onClick={() => HandleImprovePrompt}
          >
            <Sparkles className="size-5" />
          </Button>
          <AiModelsDropDown />
        </section>
      </section>
    </main>
  );
};

export default ChatView;
