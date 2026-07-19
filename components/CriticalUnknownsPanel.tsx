"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";

const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Props = {
    unknowns: string[];
};

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 10,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: EASE_OUT_QUINT,
        },
    },
    exit: {
        opacity: 0,
        y: -6,
        transition: {
            duration: 0.2,
        },
    },
};

export default function CriticalUnknownsPanel({ unknowns }: Props) {
    return (
        <div className="eiq-card p-5">
            <h2 className="eiq-section-label mb-4">
                ⚠ Critical Information Still Needed
            </h2>

            {unknowns.length === 0 ? (
                <div className="flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full bg-[var(--eiq-green)]"
                        style={{
                            boxShadow: "0 0 8px var(--eiq-green-glow)",
                        }}
                    />
                    <p className="text-sm text-[var(--eiq-green)]">
                        All critical facts confirmed.
                    </p>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {unknowns.map((u) => (
                            <motion.div
                                key={u}
                                variants={cardVariants}
                                layout
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
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}