// app/api/situation-engine/route.ts

import { GoogleGenAI } from "@google/genai";
import { situationSchema } from "@/lib/schema";
import { buildPrompt } from "@/lib/prompts";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { conversation } = await req.json();

        if (!Array.isArray(conversation) || conversation.length === 0) {
            return Response.json(
                {
                    ok: false,
                    error: "conversation must be a non-empty array",
                },
                {
                    status: 400,
                }
            );
        }

        const conversationText = conversation
            .map((m: { speaker: string; text: string }) => `${m.speaker}: ${m.text}`)
            .join("\n");

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: buildPrompt(conversationText),
            config: {
                responseMimeType: "application/json",
                responseSchema: situationSchema,
            },
        });

        // Ensure TypeScript always sees a string
        const text = response.text ?? "";

        if (!text) {
            throw new Error("Gemini returned an empty response.");
        }

        const situationState = JSON.parse(text);

        return Response.json({
            ok: true,
            situationState,
        });
    } catch (err) {
        console.error("Situation engine error:", err);

        return Response.json(
            {
                ok: false,
                error: err instanceof Error ? err.message : "Engine failed",
            },
            {
                status: 500,
            }
        );
    }
}