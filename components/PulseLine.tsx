type Props = { severity: string | null };

const SPEED: Record<string, string> = {
    Low: "3s",
    Moderate: "2s",
    High: "1.1s",
    Critical: "0.55s",
};

const COLOR: Record<string, string> = {
    Low: "#3ddc97",
    Moderate: "#f2b84b",
    High: "#f2914b",
    Critical: "#e5484d",
};

export default function PulseLine({ severity }: Props) {
    const color = severity ? COLOR[severity] : "#3ddc97";
    const speed = severity ? SPEED[severity] : "3s";

    return (
        <div className="w-full h-10 bg-[var(--eiq-bg)] border-y border-[var(--eiq-border)] overflow-hidden relative">
            {/* Subtle glow behind the line */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700"
                style={{
                    background: `radial-gradient(ellipse at 50% 50%, ${color}20 0%, transparent 70%)`,
                }}
            />
            <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full h-full relative z-10">
                <polyline
                    points="0,20 150,20 165,4 178,36 190,20 400,20"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    style={{
                        strokeDasharray: 400,
                        strokeDashoffset: 400,
                        animation: `ecgMove ${speed} linear infinite`,
                        filter: `drop-shadow(0 0 6px ${color})`,
                        transition: "stroke 0.5s ease, filter 0.5s ease",
                    }}
                />
            </svg>
        </div>
    );
}