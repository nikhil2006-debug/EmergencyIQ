"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = { unknowns: string[] };

const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
    }),
    exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

export default function CriticalUnknownsPanel({ unknowns }: Props) {
    return (
        <div className="eiq-card p-5">
            <h2 className="eiq-section-label mb-4">⚠ Critical Information Still Needed</h2>
            {unknowns.length === 0 ? (
                <div className="flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full bg-[var(--eiq-green)]"
                        style={{ boxShadow: `0 0 8px var(--eiq-green-glow)` }}
                    />
                    <p className="text-sm text-[var(--eiq-green)]">All critical facts confirmed.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <AnimatePresence mode="popLayout">
                        {unknowns.map((u, i) => (
                            <motion.div
                                key={u}
                                custom={i}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="eiq-card-interactive border border-[var(--eiq-amber)]/25 bg-[var(--eiq-amber-glow)] rounded-[var(--eiq-radius-sm)] p-3"
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[var(--eiq-amber)] text-xs">⚠</span>
                                    <span className="text-[9px] uppercase tracking-wider text-[var(--eiq-amber)] font-semibold">
                                        High Priority
                                    </span>
                                </div>
                                <p className="text-sm text-amber-100/90">{u}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}