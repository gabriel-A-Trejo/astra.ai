import React from "react";
import { Button } from "../ui/button";
import { ArrowBigRight, Loader2 } from "lucide-react";
import { AiModelsDropDown } from "../AiModels/AiModelsDropDown";
import { ImprovePromptControls } from "@/components/improvementPrompt/ImprovePromptControls";

interface MessageInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  canSend: boolean;
  workspaceError: boolean;
  isSending: boolean;
  isImprovingPrompt: boolean;
  handleImprovePrompt: (prompt: string) => Promise<void>;
  handleRevertPrompt: () => void;
  hasOriginalPrompt: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  userInput,
  setUserInput,
  onSendMessage,
  onKeyDown,
  isLoading,
  canSend,
  workspaceError,
  isSending,
  isImprovingPrompt,
  handleImprovePrompt,
  handleRevertPrompt,
  hasOriginalPrompt,
}) => {
  return (
    <section className="border rounded-2xl p-1">
      <div className="flex items-center justify-center gap-2 p-1 relative">
        <div className="w-full relative">
          <textarea
            placeholder={
              workspaceError
                ? "Workspace no longer available..."
                : "What should we do next?"
            }
            className="w-full resize-none outline-none bg-transparent text-white placeholder-gray-400 p-4 rounded-2xl no-scrollbar min-h-[60px] max-h-[200px]"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isLoading || workspaceError}
            rows={1}
            aria-label="Message input"
          />
        </div>

        {userInput && !workspaceError && (
          <aside className="flex flex-col items-center justify-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer p-6 hover:bg-gray-800 transition disabled:opacity-50"
              aria-label="Send message"
              disabled={!canSend}
              onClick={onSendMessage}
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

      <div className="flex gap-4 items-center">
        {!workspaceError && (
          <ImprovePromptControls
            userInput={userInput}
            setUserInput={setUserInput}
            isloading={isLoading}
            isImprovingPrompt={isImprovingPrompt}
            handleImprovePrompt={handleImprovePrompt}
            handleRevertPrompt={handleRevertPrompt}
            hasOriginalPrompt={hasOriginalPrompt}
          />
        )}

        {!workspaceError && <AiModelsDropDown />}
      </div>
    </section>
  );
};
