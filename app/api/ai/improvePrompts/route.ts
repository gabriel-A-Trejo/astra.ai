import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getAuthSession } from "@/app/actions/auth/isAuth";
import { improvementPrompt } from "@/data/improvementPrompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function improvingPrompts(prompt: string) {
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      systemInstruction: improvementPrompt,
      maxOutputTokens: 150,
      temperature: 0.5,
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

    const improved = await improvingPrompts(prompt);

    return NextResponse.json({ improved }, { status: 200 });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
