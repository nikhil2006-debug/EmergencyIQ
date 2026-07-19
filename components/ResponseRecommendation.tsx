"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = { resources: string[]; priority: string | null };

const RESOURCE_ICONS: Record<string, string> = {
    ambulance: "🚑",
    als: "🏥",
    bls: "🏥",
    paramedic: "🚑",
    police: "🚓",
    fire: "🚒",
    hazmat: "☣️",
    helicopter: "🚁",
    default: "🚑",
};

function getIcon(resource: string): string {
    const lower = resource.toLowerCase();
    for (const [key, icon] of Object.entries(RESOURCE_ICONS)) {
        if (key !== "default" && lower.includes(key)) return icon;
    }
    return RESOURCE_ICONS.default;
}

export default function ResponseRecommendation({ resources, priority }: Props) {
    return (
        <div className="eiq-card p-5">
            <h2 className="eiq-section-label mb-3">🚑 Response Recommendation</h2>
            {resources.length === 0 ? (
                <p className="text-sm text-[var(--eiq-muted)]">No recommendation yet.</p>
            ) : (
                <div className="space-y-2 mb-3">
                    <AnimatePresence>
                        {resources.map((r, i) => (
                            <motion.div
                                key={r}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.25 }}
                                className="eiq-card-interactive flex items-center gap-3 border border-[var(--eiq-border)] rounded-[var(--eiq-radius-sm)] px-4 py-2.5 bg-[var(--eiq-bg)]"
                            >
                                <span className="text-lg">{getIcon(r)}</span>
                                <span className="text-sm text-[var(--eiq-text)] font-medium">{r}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
            {priority && (
                <div className="border-t border-[var(--eiq-border)] pt-3 mt-3">
                    <p className="text-[9px] uppercase tracking-wider text-[var(--eiq-muted)] mb-1">Dispatch Priority</p>
                    <p className="text-sm font-bold text-[var(--eiq-red)]">{priority}</p>
                </div>
            )}
        </div>
    );
}