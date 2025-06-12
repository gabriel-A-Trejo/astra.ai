import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getAuthSession } from "@/app/actions/auth/isAuth";
import { chatPrompt } from "@/data/chatPrompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function chatSession(prompt: string) {
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `${prompt}`,
    config: {
      systemInstruction: `${chatPrompt}`,
      maxOutputTokens: 500,
      temperature: 0.7,
      topK: 40,
      topP: 0.9,
    },
  });

  return result.text;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    const response = await chatSession(prompt);

    return NextResponse.json({ response }, { status: 200 });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
