"use client";

import { motion } from "framer-motion";

type Props = { question: string | null; reason: string | null };

export default function NextQuestionCard({ question, reason }: Props) {
    if (!question) {
        return (
            <div className="eiq-card p-6 min-h-[140px] flex items-center justify-center text-center text-[var(--eiq-muted)] text-sm">
                AI Dispatcher Guidance will appear once the call begins.
            </div>
        );
    }

    return (
        <motion.div
            className="relative rounded-[var(--eiq-radius)] p-6 min-h-[140px] bg-blue-950/30 border border-[var(--eiq-blue)]/30 overflow-hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={question}
            style={{
                boxShadow: `0 4px 32px var(--eiq-blue-glow)`,
            }}
        >
            {/* Glowing left border */}
            <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[var(--eiq-radius)]"
                style={{
                    background: `linear-gradient(180deg, var(--eiq-blue), #60a5fa, var(--eiq-blue))`,
                    animation: "glowPulse 3s ease-in-out infinite",
                    boxShadow: `0 0 12px var(--eiq-blue-glow)`,
                }}
            />

            <div className="pl-3">
                <h2 className="eiq-section-label mb-3 flex items-center gap-2.5 text-[var(--eiq-blue)]">
                    🧠 AI Dispatcher Guidance
                    <span className="text-[9px] bg-[var(--eiq-blue)]/15 text-blue-300 px-2 py-0.5 rounded-full normal-case tracking-normal font-medium border border-[var(--eiq-blue)]/20">
                        Key Recommendation
                    </span>
                </h2>
                <p className="text-white font-bold text-lg leading-snug mb-2">{question}</p>
                <p className="text-sm text-blue-200/70 leading-relaxed">{reason}</p>
            </div>
        </motion.div>
    );
}