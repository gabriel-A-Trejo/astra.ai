"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { SandpackFileExplorer } from "sandpack-file-explorer";
import { files } from "@/data/Files";
import { dependencies } from "@/data/Dependencies";

const CodeView = () => {
  const [activeTab, setActiveTab] = useState("code");

  return (
    <section className="relative py-2">
      <header className="flex justify-between items-center w-full p-2 z-50 rounded-t-xl border  bg-[#151515]">
        <div className="flex items-center  p-1 rounded-full border border-white/10 bg-black ">
          <Button
            onClick={() => setActiveTab("code")}
            className={`text-sm px-4 py-2 rounded-full transition-all duration-200 ${
              activeTab === "code"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Code
          </Button>
          <Button
            onClick={() => setActiveTab("preview")}
            className={`text-sm px-4 py-2 rounded-full transition-all duration-200 ml-1 ${
              activeTab === "preview"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Preview
          </Button>
        </div>
      </header>

      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20">
        <SandpackProvider
          template="vite-react-ts"
          theme={"dark"}
          options={{
            autorun: true,
            autoReload: true,
            externalResources: ["https://cdn.tailwindcss.com"],
            showTabs: true,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
          }}
          extensions={[autocompletion()]}
          extensionsKeymap={[completionKeymap]}
          dependencies={{
            ...dependencies,
          }}
          files={{}}
        >
          <SandpackLayout>
            {activeTab === "code" ? (
              <>
                <SandpackFileExplorer style={{ height: "81vh" }} />
                <SandpackCodeEditor
                  style={{ height: "81vh" }}
                  showLineNumbers={true}
                  showInlineErrors={true}
                  wrapContent={true}
                />
              </>
            ) : (
              <SandpackPreview
                style={{
                  height: "75vh",
                  width: "100%",
                }}
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
              />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </section>
  );
};

export default CodeView;
