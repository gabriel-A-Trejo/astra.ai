import React, { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { Loader2 } from "lucide-react";
import { TextShimmer } from "../animations/text-shimmer";
import { Message } from "@/types/chat.types";

interface MessageListProps {
  messages: Message[] | undefined;
  status: "LoadingFirstPage" | "LoadingMore" | "CanLoadMore" | "Exhausted";
  isGenerating: boolean;
  onScroll: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, status, isGenerating, onScroll, messagesEndRef }, ref) => {
    return (
      <section
        ref={ref}
        className="flex-1 overflow-y-auto no-scrollbar"
        onScroll={onScroll}
      >
        {status === "LoadingFirstPage" ? (
          <div className="p-5 text-gray-400 animate-pulse">
            Loading messages...
          </div>
        ) : (
          <>
            {status === "LoadingMore" && (
              <div className="flex justify-center p-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading older messages...</span>
                </div>
              </div>
            )}

            {messages
              ?.slice()
              .reverse()
              .map((message) => (
                <MessageBubble key={message._id} message={message} />
              ))}

            {isGenerating && <GeneratingIndicator />}

            <div ref={messagesEndRef} />
          </>
        )}
      </section>
    );
  }
);

MessageList.displayName = "MessageList";

// Message bubble component
interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({ message }) => (
    <div className="p-5 rounded-xl border mb-2 max-h-screen">
      <h1 className="font-bold mb-2" role="heading" aria-level={2}>
        {message.role === "You" ? "You" : "AI"}
      </h1>
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize]}
        className="prose prose-invert max-w-none"
      >
        {message.content}
      </ReactMarkdown>
    </div>
  )
);

MessageBubble.displayName = "MessageBubble";

const GeneratingIndicator: React.FC = () => (
  <div className="flex items-center gap-2 p-5 rounded-xl border mb-2">
    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
    <TextShimmer className="font-mono text-sm" duration={1}>
      Generating response...
    </TextShimmer>
  </div>
);
