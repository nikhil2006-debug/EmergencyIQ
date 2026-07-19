// lib/utils.ts

const SENTINELS = ["unknown", "none identified", "none reported", "not stated", "n/a"];

export function cleanFacts(facts: string[]): string[] {
    return facts.filter((f) => !SENTINELS.includes(f.trim().toLowerCase()));
}

export function nowTime(): string {
    return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export function secondsAgoLabel(lastUpdated: number | null): string {
    if (lastUpdated === null) return "Awaiting first input";
    const diff = Math.max(0, Math.floor((Date.now() - lastUpdated) / 1000));
    if (diff < 2) return "AI updated just now";
    return `AI updated ${diff}s ago`;
}