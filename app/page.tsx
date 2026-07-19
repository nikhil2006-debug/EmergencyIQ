"use client";

import { useState, useRef, useEffect } from "react";
import { Message, SituationState } from "@/lib/schema";
import { scenarios } from "@/lib/scenarios";
import { nowTime, secondsAgoLabel } from "@/lib/utils";
import ConversationPanel from "@/components/ConversationPanel";
import SituationSummary from "@/components/SituationSummary";
import SeverityMeter from "@/components/SeverityMeter";
import CriticalUnknownsPanel from "@/components/CriticalUnknownsPanel";
import NextQuestionCard from "@/components/NextQuestionCard";
import Timeline from "@/components/Timeline";
import ResponseRecommendation from "@/components/ResponseRecommendation";
import PulseLine from "@/components/PulseLine";
import AIStatusIndicator from "@/components/AIStatusIndicator";
import DispatcherActionPanel from "@/components/DispatcherActionPanel";

export default function Home() {
    const [conversation, setConversation] = useState<Message[]>([]);
    const [situationState, setSituationState] = useState<SituationState | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState<string>("cardiac");
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);
    const [, setTick] = useState(0);
    const previousSeverity = useRef<SituationState["severity"] | null>(null);
    const previousConfidence = useRef<number | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    // Incident number is generated client-side only, after mount, to avoid
    // a server/client hydration mismatch (Math.random() must never run during
    // the initial render — server and client would each get a different value).
    const [incidentNumber, setIncidentNumber] = useState<number | null>(null);

    useEffect(() => {
        setIncidentNumber(Math.floor(1000 + Math.random() * 9000));
    }, []);

    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    // Toast auto-dismiss
    useEffect(() => {
        if (!toast) return;
        const id = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(id);
    }, [toast]);

    async function sendCallerLine(text: string, currentConversation: Message[] = conversation) {
        const withCaller = [
            ...currentConversation,
            { speaker: "caller" as const, text, timestamp: nowTime() },
        ];
        setLoading(true);

        try {
            const res = await fetch("/api/situation-engine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversation: withCaller }),
            });
            const data = await res.json();

            let finalConvo = withCaller;
            if (data.ok) {
                previousSeverity.current = situationState?.severity ?? null;
                previousConfidence.current = situationState?.confidence ?? null;
                setSituationState(data.situationState);
                setLastUpdated(Date.now());
                setToast("AI Situation Updated");
                finalConvo = [
                    ...withCaller,
                    { speaker: "dispatcher" as const, text: data.situationState.nextQuestion, timestamp: nowTime() },
                ];
            } else {
                console.error("Engine error:", data.error);
            }
            setConversation(finalConvo);
            setLoading(false);
            return finalConvo;
        } catch (err) {
            console.error("Request failed:", err);
            setConversation(withCaller);
            setLoading(false);
            return withCaller;
        }
    }

    function resetCall() {
        setConversation([]);
        setSituationState(null);
        setLastUpdated(null);
        previousSeverity.current = null;
        previousConfidence.current = null;
        setPlayingIndex(null);
    }

    async function playScenario() {
        resetCall();
        const lines = scenarios[selectedScenario].lines;
        let convo: Message[] = [];

        for (let i = 0; i < lines.length; i++) {
            setPlayingIndex(i);
            convo = await sendCallerLine(lines[i], convo);
            await new Promise((resolve) => setTimeout(resolve, 1800));
        }
        setPlayingIndex(null);
    }

    return (
        <main className="min-h-screen bg-[var(--eiq-bg)] text-white eiq-grid-bg relative">
            {/* ─── Command Center Header ─────────────────────── */}
            <header className="eiq-glass sticky top-0 z-30 border-b border-[var(--eiq-border)]">
                <div className="px-6 py-4">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        {/* Left — Branding */}
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                EmergencyIQ{" "}
                                <span className="text-[var(--eiq-blue)] font-semibold">
                                    — Command Center
                                </span>
                            </h1>
                            <p className="text-xs text-[var(--eiq-muted)] mt-1 tracking-wide">
                                Emergency Situation Intelligence Platform
                            </p>
                            <div className="flex items-center gap-3 mt-2.5 text-xs">
                                <span className="font-mono text-[var(--eiq-text-secondary)] bg-[var(--eiq-surface)] px-2 py-0.5 rounded-md border border-[var(--eiq-border)]">
                                    INC-{incidentNumber ?? "----"}
                                </span>
                                <span className="flex items-center gap-1.5 text-[var(--eiq-red)]">
                                    <span
                                        className="w-2 h-2 rounded-full bg-[var(--eiq-red)]"
                                        style={{ animation: "livePulse 1.5s infinite" }}
                                    />
                                    <span className="font-semibold tracking-wider">LIVE</span>
                                </span>
                                <span className="w-px h-3 bg-[var(--eiq-border)]" />
                                <span className="text-[var(--eiq-muted)] flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--eiq-green)]" />
                                    AI Monitoring Active
                                </span>
                            </div>
                        </div>

                        {/* Right — Controls */}
                        <div className="flex items-center gap-2.5">
                            <select
                                value={selectedScenario}
                                onChange={(e) => setSelectedScenario(e.target.value)}
                                disabled={playingIndex !== null}
                                className="bg-[var(--eiq-surface)] border border-[var(--eiq-border)] rounded-[var(--eiq-radius-sm)] px-3 py-2 text-sm text-white disabled:opacity-50 focus:outline-none focus:border-[var(--eiq-blue)] transition-colors cursor-pointer appearance-none pr-8"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 10px center",
                                }}
                            >
                                {Object.entries(scenarios).map(([key, s]) => (
                                    <option key={key} value={key}>{s.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={playScenario}
                                disabled={playingIndex !== null || loading}
                                className="eiq-btn-primary px-5 py-2"
                            >
                                {playingIndex !== null
                                    ? `Playing (${playingIndex + 1}/${scenarios[selectedScenario].lines.length})`
                                    : "▶ Play Scenario"}
                            </button>
                            <button
                                onClick={resetCall}
                                disabled={playingIndex !== null}
                                className="eiq-btn-secondary px-4 py-2"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ─── Heartbeat Line ────────────────────────────── */}
            <PulseLine severity={situationState?.severity ?? null} />

            {/* ─── Main Content ──────────────────────────────── */}
            <div className="px-6 py-5 space-y-5 relative z-10">
                {/* Hero — Severity Meter */}
                <SeverityMeter
                    severity={situationState?.severity ?? null}
                    severityScore={situationState?.severityScore ?? null}
                    previousSeverity={previousSeverity.current}
                />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Left — Conversation */}
                    <div className="h-[620px]">
                        <ConversationPanel
                            messages={conversation}
                            onSendCallerLine={(text) => sendCallerLine(text)}
                            loading={loading}
                        />
                    </div>

                    {/* Right — Intelligence Panels */}
                    <div className="space-y-4">
                        <AIStatusIndicator loading={loading} statusLabel={secondsAgoLabel(lastUpdated)} />
                        <SituationSummary state={situationState} previousConfidence={previousConfidence.current} />
                        <CriticalUnknownsPanel unknowns={situationState?.criticalUnknowns ?? []} />
                        <NextQuestionCard
                            question={situationState?.nextQuestion ?? null}
                            reason={situationState?.nextQuestionReason ?? null}
                        />
                        <ResponseRecommendation
                            resources={situationState?.recommendedResources ?? []}
                            priority={situationState?.dispatchPriority ?? null}
                        />
                        <Timeline timeline={situationState?.timeline ?? []} />
                        <DispatcherActionPanel
                            conversation={conversation}
                            situationState={situationState}
                            incidentNumber={incidentNumber}
                        />
                    </div>
                </div>
            </div>

            {/* ─── Toast Notification ────────────────────────── */}
            {toast && (
                <div
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--eiq-surface)] border border-[var(--eiq-green)]/30 rounded-[var(--eiq-radius-sm)] px-4 py-2.5 shadow-lg"
                    style={{
                        animation: "toastIn 0.3s ease-out",
                        boxShadow: `0 4px 24px ${`var(--eiq-green-glow)`}`,
                    }}
                >
                    <span className="w-2 h-2 rounded-full bg-[var(--eiq-green)]" />
                    <span className="text-sm text-[var(--eiq-green)] font-medium">{toast}</span>
                </div>
            )}
        </main>
    );
}