"use client";

import { motion } from "framer-motion";

type Props = { timeline: { time: string; event: string }[] };

export default function Timeline({ timeline }: Props) {
    return (
        <div className="eiq-card p-5">
            <h2 className="eiq-section-label mb-4">🕐 Incident Timeline</h2>
            {timeline.length === 0 ? (
                <p className="text-sm text-[var(--eiq-muted)]">No events yet.</p>
            ) : (
                <div className="relative pl-5">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--eiq-border)]" />

                    {timeline.map((t, i) => (
                        <motion.div
                            key={i}
                            className="relative flex gap-4 items-start group mb-3 last:mb-0"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.25 }}
                        >
                            {/* Glowing dot */}
                            <div className="absolute left-[-13px] top-1.5 z-10">
                                <span
                                    className="block w-2.5 h-2.5 rounded-full bg-[var(--eiq-green)] ring-2 ring-[var(--eiq-surface)] group-hover:ring-[var(--eiq-green)]/20 transition-all duration-200"
                                    style={{ boxShadow: `0 0 6px var(--eiq-green-glow)` }}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-0 group-hover:translate-x-0.5 transition-transform duration-200">
                                <span className="text-[10px] font-mono text-[var(--eiq-muted)] tracking-wide">
                                    {t.time}
                                </span>
                                <p className="text-sm text-[var(--eiq-text)] mt-0.5 leading-relaxed">
                                    {t.event}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}