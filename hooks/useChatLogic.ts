import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useChatLogic = (
  workspaceId: Id<"workspace"> | null | undefined,
  workspaceError: boolean
) => {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);

  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.getMessagesByWorkspace,
    workspaceId && !workspaceError
      ? { workspaceId: workspaceId as Id<"workspace"> }
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
    const currentCount = messages?.length || 0;
    const isAppended = currentCount > prevCount;

    if (shouldAutoScroll && isAppended && currentCount !== 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevMessageCountRef.current = currentCount;
  }, [messages, shouldAutoScroll]);

  return {
    messages,
    status,
    loadMore,
    messagesEndRef,
    messagesContainerRef,
    shouldAutoScroll,
    setShouldAutoScroll,
    handleScroll,
  };
};
