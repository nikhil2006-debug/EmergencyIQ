"use client";

import { useEffect, useRef, useState } from "react";
import { SituationState } from "@/lib/schema";
import { motion, useSpring, useTransform } from "framer-motion";

type Props = {
    severity: SituationState["severity"] | null;
    severityScore: number | null;
    previousSeverity?: SituationState["severity"] | null;
};

const CONFIG: Record<string, { color: string; label: string }> = {
    Low: { color: "#3ddc97", label: "Monitor Situation" },
    Moderate: { color: "#f2b84b", label: "Stay Alert — Evaluate Resources" },
    High: { color: "#f2914b", label: "Priority Response Required" },
    Critical: { color: "#e5484d", label: "Immediate Response Required" },
};

function AnimatedScore({ value }: { value: number }) {
    const spring = useSpring(0, { stiffness: 60, damping: 20 });
    const display = useTransform(spring, (v) => Math.round(v));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    useEffect(() => {
        const unsub = display.on("change", (v) => setDisplayValue(v));
        return () => unsub();
    }, [display]);

    return <>{displayValue}</>;
}

export default function SeverityMeter({ severity, severityScore, previousSeverity }: Props) {
    if (!severity) {
        return (
            <div className="w-full eiq-card p-8 text-center">
                <p className="eiq-section-label mb-2">🚨 Incident Priority</p>
                <p className="text-[var(--eiq-muted)] text-sm">
                    Incident priority will appear once the call begins.
                </p>
            </div>
        );
    }

    const cfg = CONFIG[severity];
    const changed = previousSeverity && previousSeverity !== severity;

    return (
        <motion.div
            className="w-full rounded-[var(--eiq-radius)] p-6 bg-[var(--eiq-surface)] border-2 relative overflow-hidden"
            style={{ borderColor: cfg.color }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            key={severity}
        >
            {/* Subtle severity glow */}
            <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at 30% 50%, ${cfg.color} 0%, transparent 70%)`,
                }}
            />

            <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div>
                    <p className="eiq-section-label mb-2">🚨 Incident Priority</p>
                    <p
                        className="text-5xl font-extrabold tracking-tight"
                        style={{
                            color: cfg.color,
                            textShadow: `0 0 40px ${cfg.color}40`,
                        }}
                    >
                        {severity.toUpperCase()}
                    </p>
                    <p className="text-sm text-[var(--eiq-text-secondary)] mt-1.5">{cfg.label}</p>
                </div>

                <div className="text-right">
                    <p className="text-5xl font-mono font-bold text-white">
                        <AnimatedScore value={severityScore ?? 0} />
                        <span className="text-lg text-[var(--eiq-muted)] ml-0.5">/100</span>
                    </p>
                    {changed && (
                        <motion.p
                            className="text-xs text-[var(--eiq-text-secondary)] mt-1 font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {previousSeverity} → {severity}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-2 bg-[var(--eiq-bg)] rounded-full overflow-hidden mt-5 relative z-10">
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        backgroundColor: cfg.color,
                        boxShadow: `0 0 12px ${cfg.color}60`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${severityScore}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
        </motion.div>
    );
}