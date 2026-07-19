// app/api/situation-engine/route.ts
import { GoogleGenAI } from "@google/genai";
import { situationSchema } from "@/lib/schema";
import { buildPrompt } from "@/lib/prompts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { conversation } = await req.json();
        // conversation: { speaker: "caller" | "dispatcher", text: string }[]

        if (!Array.isArray(conversation) || conversation.length === 0) {
            return Response.json(
                { ok: false, error: "conversation must be a non-empty array" },
                { status: 400 }
            );
        }

        const conversationText = conversation
            .map((m: any) => `${m.speaker}: ${m.text}`)
            .join("\n");

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: buildPrompt(conversationText),
            config: {
                responseMimeType: "application/json",
                responseSchema: situationSchema
            }
        });

        const situationState = JSON.parse(response.text);
        return Response.json({ ok: true, situationState });
    } catch (err) {
        console.error("Situation engine error:", err);
        return Response.json({ ok: false, error: "Engine failed" }, { status: 500 });
    }
}