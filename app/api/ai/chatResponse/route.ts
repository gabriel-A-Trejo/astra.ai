import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getAuthSession } from "@/app/actions/auth/isAuth";
import { chatPrompt } from "@/data/chatPrompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Single optimal tool configuration
const optimalTools = [{ codeExecution: {} }];

function shouldUseCodeExecution(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();

  const executionTriggers = [
    // Performance & benchmarking
    "performance",
    "faster",
    "slower",
    "benchmark",
    "compare performance",

    // Validation & demonstration
    "validate",
    "prove",
    "demonstrate",
    "show example",
    "test",

    // Architecture validation
    "which approach",
    "better pattern",
    "trade-offs",
    "measure",

    // Component patterns
    "component composition",
    "render props vs",
    "context vs",

    // State management
    "state management comparison",
    "redux vs zustand",
    "performance difference",
  ];

  // Skip execution for pure architectural questions
  const architecturalOnly = [
    "how should i structure",
    "best practice for",
    "folder structure",
    "project organization",
    "team workflow",
    "deployment strategy",
  ];

  const needsExecution = executionTriggers.some((trigger) =>
    lowerPrompt.includes(trigger)
  );
  const isArchitecturalOnly = architecturalOnly.some((pattern) =>
    lowerPrompt.includes(pattern)
  );

  return needsExecution && !isArchitecturalOnly;
}

async function chatSession(prompt: string) {
  const useCodeExecution = shouldUseCodeExecution(prompt);
  const tools = useCodeExecution ? optimalTools : [];

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      systemInstruction: chatPrompt,
      maxOutputTokens: 600,
      temperature: 0.3,
      topK: 40,
      topP: 0.9,
      responseMimeType: "text/plain",
      tools,
    },
  });

  return {
    text: result.text,
    usedCodeExecution: useCodeExecution,
  };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await chatSession(prompt);

    return NextResponse.json(
      {
        response: result.text,
        meta: {
          usedCodeExecution: result.usedCodeExecution,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Chat error:", err);

    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to process request",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
