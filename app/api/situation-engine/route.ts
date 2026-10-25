import { GoogleGenAI } from "@google/genai";
import { situationSchema } from "@/lib/schema";
import { buildPrompt } from "@/lib/prompts";

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MAX_BODY_SIZE = 25000;
const MAX_MESSAGES = 100;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TOTAL_LENGTH = 20000;

type ConversationMessage = {
    speaker: "caller" | "dispatcher";
    text: string;
};

function isConversationMessage(value: unknown): value is ConversationMessage {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const message = value as Record<string, unknown>;

    return (
        (message.speaker === "caller" || message.speaker === "dispatcher") &&
        typeof message.text === "string" &&
        message.text.trim().length > 0 &&
        message.text.length <= MAX_MESSAGE_LENGTH
    );
}

export async function POST(req: Request) {
    const contentLength = req.headers.get("content-length");

    if (contentLength !== null) {
        const size = Number(contentLength);

        if (
            !Number.isSafeInteger(size) ||
            size < 0 ||
            size > MAX_BODY_SIZE
        ) {
            return Response.json(
                {
                    ok: false,
                    error: "Request body exceeds the maximum allowed size.",
                },
                { status: 413 }
            );
        }
    }

    let body: unknown;

    try {
        const rawBody = await req.text();

        if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_SIZE) {
            return Response.json(
                {
                    ok: false,
                    error: "Request body exceeds the maximum allowed size.",
                },
                { status: 413 }
            );
        }

        body = JSON.parse(rawBody);
    } catch {
        return Response.json(
            { ok: false, error: "Request body must be valid JSON." },
            { status: 400 }
        );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return Response.json(
            { ok: false, error: "Request body must be a JSON object." },
            { status: 400 }
        );
    }

    const conversation = (body as Record<string, unknown>).conversation;

    if (
        !Array.isArray(conversation) ||
        conversation.length === 0 ||
        conversation.length > MAX_MESSAGES ||
        !conversation.every(isConversationMessage)
    ) {
        return Response.json(
            {
                ok: false,
                error: "Conversation must contain 1–100 valid messages. Each message must have a valid speaker and non-empty text of at most 2000 characters.",
            },
            { status: 400 }
        );
    }

    const conversationText = conversation
        .map((message) => `${message.speaker}: ${message.text}`)
        .join("\n");

    if (conversationText.length > MAX_TOTAL_LENGTH) {
        return Response.json(
            {
                ok: false,
                error: "Conversation exceeds the maximum allowed length.",
            },
            { status: 400 }
        );
    }

    if (!ai) {
        console.error(
            "Situation engine is unavailable: GEMINI_API_KEY is not configured."
        );

        return Response.json(
            {
                ok: false,
                error: "Situation engine is temporarily unavailable.",
            },
            { status: 503 }
        );
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: buildPrompt(conversationText),
            config: {
                responseMimeType: "application/json",
                responseSchema: situationSchema,
            },
        });

        const text = response.text ?? "";

        if (!text) {
            throw new Error("Gemini returned an empty response.");
        }

        const situationState: unknown = JSON.parse(text);

        return Response.json({
            ok: true,
            situationState,
        });
    } catch (err) {
        console.error("Situation engine error:", err);

        return Response.json(
            {
                ok: false,
                error: "Unable to process the situation right now. Please try again.",
            },
            { status: 502 }
        );
    }
}