// lib/schema.ts

// ---- TypeScript type used throughout the frontend ----
export type SituationState = {
    incidentType: string;
    confidence: number;

    victim: {
        role: string;
        age?: string;
        condition: string[];
    };

    knownFacts: {
        victimStatus: string[];
        hazards: string[];
        medicalHistory: string[];
        locationFacts: string[];
    };

    severity: "Low" | "Moderate" | "High" | "Critical";
    severityScore: number;
    severityReason: string;

    criticalUnknowns: string[];

    nextQuestion: string;
    nextQuestionReason: string;

    recommendedResources: string[];
    dispatchPriority: string;

    timeline: { time: string; event: string }[];
};

// ---- JSON Schema passed to Gemini's responseSchema ----
export const situationSchema = {
    type: "object",
    properties: {
        incidentType: { type: "string" },
        confidence: { type: "integer" },
        victim: {
            type: "object",
            properties: {
                role: { type: "string" },
                age: { type: "string" },
                condition: { type: "array", items: { type: "string" } }
            },
            required: ["role", "condition"]
        },
        knownFacts: {
            type: "object",
            properties: {
                victimStatus: { type: "array", items: { type: "string" } },
                hazards: { type: "array", items: { type: "string" } },
                medicalHistory: { type: "array", items: { type: "string" } },
                locationFacts: { type: "array", items: { type: "string" } }
            },
            required: ["victimStatus", "hazards", "medicalHistory", "locationFacts"]
        },
        severity: { type: "string", enum: ["Low", "Moderate", "High", "Critical"] },
        severityScore: { type: "integer" },
        severityReason: { type: "string" },
        criticalUnknowns: { type: "array", items: { type: "string" } },
        nextQuestion: { type: "string" },
        nextQuestionReason: { type: "string" },
        recommendedResources: { type: "array", items: { type: "string" } },
        dispatchPriority: { type: "string" },
        timeline: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    time: { type: "string" },
                    event: { type: "string" }
                },
                required: ["time", "event"]
            }
        }
    },
    required: [
        "incidentType", "confidence", "victim", "knownFacts",
        "severity", "severityScore", "severityReason",
        "criticalUnknowns", "nextQuestion", "nextQuestionReason",
        "recommendedResources", "dispatchPriority", "timeline"
    ]
};
// add to lib/schema.ts
export type Message = {
    speaker: "caller" | "dispatcher";
    text: string;
    timestamp: string;
};