"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/schema";
import { motion, AnimatePresence } from "framer-motion";

const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Props = {
    messages: Message[];
    onSendCallerLine: (text: string) => void;
    loading: boolean;
};

export default function ConversationPanel({
    messages,
    onSendCallerLine,
    loading,
}: Props) {
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    function handleSend() {
        const text = input.trim();

        if (!text || loading) return;

        onSendCallerLine(text);
        setInput("");
    }

    return (
        <div className="flex flex-col h-full eiq-card p-5">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[var(--eiq-border)]">
                <span
                    className="w-2 h-2 rounded-full bg-[var(--eiq-red)]"
                    style={{ animation: "livePulse 1.5s infinite" }}
                />

                <h2 className="eiq-section-label">Live Emergency Call</h2>

                <span className="ml-auto text-[10px] font-mono text-[var(--eiq-muted)]">
                    {messages.length} entries
                </span>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[200px]"
            >
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-[var(--eiq-muted)] text-sm text-center">
                            No active call. Type a caller line or run a scenario.
                        </p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.25,
                                ease: EASE_OUT_QUINT,
                            }}
                            className="group"
                        >
                            <div className="flex items-center gap-2 text-[11px] mb-1.5">
                                <span className="font-mono text-[var(--eiq-muted)]">
                                    {m.timestamp}
                                </span>

                                {m.speaker === "caller" ? (
                                    <span className="text-[var(--eiq-text-secondary)] font-semibold tracking-wide">
                                        📞 CALLER
                                    </span>
                                ) : (
                                    <span className="text-[var(--eiq-blue)] font-semibold tracking-wide">
                                        🎧 DISPATCHER
                                    </span>
                                )}
                            </div>

                            <p
                                className={`text-sm pl-4 py-2 border-l-2 rounded-r-lg transition-colors duration-200 ${m.speaker === "caller"
                                        ? "border-[var(--eiq-border-hover)] text-[var(--eiq-text)] bg-[var(--eiq-surface)]/40 group-hover:bg-[var(--eiq-surface-hover)]"
                                        : "border-[var(--eiq-blue)] text-blue-100 bg-[var(--eiq-blue-glow)] group-hover:bg-blue-950/30"
                                    }`}
                            >
                                &ldquo;{m.text}&rdquo;
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="flex items-center gap-1.5 px-1 py-2">
                        {[0, 1, 2].map((d) => (
                            <span
                                key={d}
                                className="w-1.5 h-1.5 rounded-full bg-[var(--eiq-blue)]"
                                style={{
                                    animation: `dotPulse 1.2s ease-in-out ${d * 0.15}s infinite`,
                                }}
                            />
                        ))}

                        <span className="text-xs text-[var(--eiq-muted)] ml-2">
                            Analyzing latest input…
                        </span>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex gap-2.5">
                <input
                    className="flex-1 bg-[var(--eiq-bg)] border border-[var(--eiq-border)] rounded-[var(--eiq-radius-sm)] px-4 py-2.5 text-sm text-white font-mono placeholder:text-[var(--eiq-muted)] focus:outline-none focus:border-[var(--eiq-blue)] focus:ring-1 focus:ring-[var(--eiq-blue)]/20 transition-all duration-200"
                    placeholder="Type caller line…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={loading}
                />

                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="eiq-btn-primary px-5 py-2.5"
                >
                    Send
                </button>
            </div>
        </div>
    );
}