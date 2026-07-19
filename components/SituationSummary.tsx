"use client";

import { SituationState } from "@/lib/schema";
import { cleanFacts } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
    state: SituationState | null;
    previousConfidence?: number | null;
};

const CONFIDENCE_THRESHOLD = 75;

function confidencePrefix(confidence: number): string {
    return confidence >= CONFIDENCE_THRESHOLD ? "Confirmed" : "Suspected";
}

export default function SituationSummary({ state, previousConfidence }: Props) {
    if (!state) {
        return (
            <div className="eiq-card p-5 text-[var(--eiq-muted)] text-sm">
                Active incident details will appear once the call begins.
            </div>
        );
    }

    const condition = cleanFacts(state.victim.condition);
    const medicalHistory = cleanFacts(state.knownFacts.medicalHistory);
    const prefix = confidencePrefix(state.confidence);
    const delta = previousConfidence !== null && previousConfidence !== undefined
        ? state.confidence - previousConfidence
        : null;

    return (
        <motion.div
            className="eiq-card p-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-between items-start mb-4">
                <h2 className="eiq-section-label">🚨 Active Incident</h2>
                <div className="bg-[var(--eiq-blue-glow)] border border-[var(--eiq-blue)]/20 rounded-[var(--eiq-radius-xs)] px-3 py-1.5">
                    <p className="text-[9px] uppercase tracking-wider text-[var(--eiq-blue)] leading-none mb-1">
                        AI Confidence
                    </p>
                    <p className="text-sm font-bold text-blue-200 leading-none font-mono">
                        {state.confidence}%
                        {delta !== null && delta !== 0 && (
                            <span className={`ml-1.5 text-[10px] ${delta > 0 ? "text-[var(--eiq-green)]" : "text-[var(--eiq-muted)]"}`}>
                                {delta > 0 ? `↑${delta}` : `↓${Math.abs(delta)}`}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <p className="text-white font-bold text-xl mb-4 leading-tight">
                <span className={prefix === "Confirmed" ? "text-[var(--eiq-green)]" : "text-[var(--eiq-amber)]"}>
                    {prefix}
                </span>{" "}
                {state.incidentType}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
                {[
                    { label: "👤 Victim", value: `${state.victim.role}${state.victim.age ? `, ${state.victim.age}` : ""}` },
                    { label: "🌡 Symptoms", value: condition.length > 0 ? condition.join(", ") : "Unknown" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="eiq-card-interactive border border-[var(--eiq-border)] rounded-[var(--eiq-radius-sm)] p-3 bg-[var(--eiq-bg)]"
                    >
                        <p className="text-[9px] uppercase tracking-wider text-[var(--eiq-muted)] mb-1.5">{item.label}</p>
                        <p className="text-sm text-[var(--eiq-text)]">{item.value}</p>
                    </motion.div>
                ))}

                <motion.div
                    className="eiq-card-interactive border border-[var(--eiq-border)] rounded-[var(--eiq-radius-sm)] p-3 bg-[var(--eiq-bg)] col-span-2"
                >
                    <p className="text-[9px] uppercase tracking-wider text-[var(--eiq-muted)] mb-1.5">📋 Medical History</p>
                    <p className="text-sm text-[var(--eiq-text)]">
                        {medicalHistory.length > 0 ? medicalHistory.join(", ") : "None reported"}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}