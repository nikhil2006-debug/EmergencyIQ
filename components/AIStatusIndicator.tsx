type Props = { loading: boolean; statusLabel: string };

export default function AIStatusIndicator({ loading, statusLabel }: Props) {
    return (
        <div className="flex items-center gap-4 eiq-card px-4 py-2.5 text-xs font-mono">
            {/* AI Status */}
            <span className="flex items-center gap-2">
                <span
                    className={`w-2 h-2 rounded-full ${loading ? "bg-[var(--eiq-amber)]" : "bg-[var(--eiq-green)]"}`}
                    style={{ animation: loading ? "softBlink 0.8s ease-in-out infinite" : undefined }}
                />
                <span className={`font-semibold tracking-wide ${loading ? "text-[var(--eiq-amber)]" : "text-[var(--eiq-green)]"}`}>
                    {loading ? "AI ANALYZING" : "AI MONITORING"}
                </span>
            </span>

            <span className="w-px h-3 bg-[var(--eiq-border)]" />

            {/* Last Updated */}
            <span className="text-[var(--eiq-muted)]">
                {loading ? "Processing situation data…" : statusLabel}
            </span>

            <span className="w-px h-3 bg-[var(--eiq-border)]" />

            {/* Connection */}
            <span className="flex items-center gap-1.5 text-[var(--eiq-muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--eiq-green)]" />
                Connection Stable
            </span>
        </div>
    );
}