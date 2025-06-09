"use client";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import { ArrowBigRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { AiModelsDropDown } from "../AiModels/AiModelsDropDown";
import { useMessage } from "@/store/messagesStore";

const ChatView = () => {
  const [userInput, setUserInput] = useState("");
  const [isloading, setIsloading] = useState(false);
  const { setMessage, messages, clearMessages } = useMessage();

  return (
    <section className="p-2 flex flex-col justify-center min-h-screen">
      <div className="flex-1 overflow-y-auto no-scrollbar max-h-[70vh]">
        {messages.map((message) => (
          <div
            className="p-5  rounded-xl border mb-2 flex flex-col gap-2 item-center justify-start leading-7 border-white/10"
            key={message.id}
          >
            <h1 className="font-bold">
              {message.role === "You" ? "You" : "AI"}
            </h1>

            <ReactMarkdown className="flex flex-col">
              {message.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
      <section className="border rounded-2xl  mb-20 p-1">
        <div className="flex items-center   gap-2 p-1">
          <textarea
            placeholder="What should we do next?"
            name="userInput"
            id="userInput"
            className="w-full  resize-none outline-none bg-transparent text-white placeholder-gray-400 p-4   rounded-2xl   no-scrollbar"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          {userInput && (
            <aside className="flex flex-col items-center justify-center gap-2">
              <Button
                variant="outline"
                size="lg"
                className={
                  isloading
                    ? "animate-pulse cursor-pointer p-6 hover:bg-gray-800 transition "
                    : "cursor-pointer p-6 hover:bg-gray-800 transition"
                }
                aria-label="send"
              >
                <ArrowBigRight
                  className={isloading ? "animated-pulse size-5 " : "size-5"}
                />
              </Button>
              <p className="text-sm text-gray-300">↵ Enter</p>
            </aside>
          )}
        </div>
        <section className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="lg"
            className="cursor-pointer p-6 hover:bg-gray-800 transition"
            aria-label="improved prompt"
            disabled={userInput.trim().split(/\s+/).filter(Boolean).length <= 6}
          >
            <Sparkles className={"size-5"} />
          </Button>
          <AiModelsDropDown />
        </section>
      </section>
    </section>
  );
};

export default ChatView;
