"use client";
// app/brackets/reset/page.tsx
// Hidden admin reset page — only accessible at /brackets/reset
// Calls POST /api/brackets/reset with the secret token

import { useState, useRef, useEffect } from "react";

const RESET_SECRET = process.env.NEXT_PUBLIC_BRACKET_RESET_SECRET ?? "breachtrix-reset-2026";

function Cursor() {
    const dot = useRef(null);
    const ring = useRef(null);
    const mouse = useRef({ x: -200, y: -200 });
    const lag = useRef({ x: -200, y: -200 });
    useEffect(() => {
        const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
        window.addEventListener("mousemove", onMove);
        let raf;
        const tick = () => {
            lag.current.x += (mouse.current.x - lag.current.x) * 0.11;
            lag.current.y += (mouse.current.y - lag.current.y) * 0.11;
            if (dot.current) dot.current.style.transform = `translate(${mouse.current.x - 4}px,${mouse.current.y - 4}px)`;
            if (ring.current) ring.current.style.transform = `translate(${lag.current.x - 18}px,${lag.current.y - 18}px)`;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
    }, []);
    return (
        <>
            <div ref={dot} style={{ position: "fixed", top: 0, left: 0, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", zIndex: 9999, pointerEvents: "none", willChange: "transform" }} />
            <div ref={ring} style={{ position: "fixed", top: 0, left: 0, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(239,68,68,0.3)", zIndex: 9998, pointerEvents: "none", willChange: "transform" }} />
        </>
    );
}

type Status = "idle" | "confirm" | "loading" | "success" | "error";

export default function BracketResetPage() {
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");
    const [typed, setTyped] = useState("");

    const handleReset = async () => {
        setStatus("loading");
        try {
            const res = await fetch("/api/brackets/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secret: RESET_SECRET }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Reset failed");
            setMessage(`Reset at ${new Date(data.state.resetAt).toLocaleTimeString()}`);
            setStatus("success");
        } catch (e: any) {
            setMessage(e.message);
            setStatus("error");
        }
    };

    const accentColor = status === "success" ? "#22c55e"
        : status === "error" ? "#ef4444"
            : "#ef4444";

    return (
        <div style={{
            minHeight: "100vh", background: "#07070a", color: "#f9fafb",
            fontFamily: "'SF Mono','Fira Code','Courier New',monospace",
            cursor: "none", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            <style>{`
        *{cursor:none!important;box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

            <Cursor />

            {/* faint grid */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
                backgroundSize: "64px 64px",
                maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%,black 20%,transparent 100%)",
            }} />

            <div style={{
                position: "relative", zIndex: 1, width: "100%", maxWidth: 400,
                margin: "0 auto", padding: "0 24px",
                animation: "fadeUp 0.4s ease both",
            }}>

                {/* top label */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
                    fontSize: 9, letterSpacing: "0.3em", color: "#374151", textTransform: "uppercase",
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
                    Admin Access · /brackets/reset
                </div>

                <h1 style={{
                    fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.025em",
                    color: "#f9fafb", marginBottom: 8, lineHeight: 1.1,
                }}>
                    Reset Bracket
                </h1>
                <p style={{ fontSize: 11, color: "#374151", letterSpacing: "0.04em", lineHeight: 1.6, marginBottom: 36 }}>
                    This will clear all match results and team roles, returning the bracket to its initial state. This action cannot be undone.
                </p>

                {/* divider */}
                <div style={{ height: 1, background: "linear-gradient(to right,rgba(239,68,68,0.3),transparent)", marginBottom: 32 }} />

                {status === "idle" && (
                    <button onClick={() => setStatus("confirm")} style={{
                        width: "100%", padding: "13px 20px",
                        background: "transparent",
                        border: "1px solid rgba(239,68,68,0.4)",
                        borderRadius: 8, color: "#ef4444",
                        fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
                        fontFamily: "inherit", transition: "all 0.15s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "#ef4444"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
                    >
                        <span>⚠</span> Initiate Reset
                    </button>
                )}

                {status === "confirm" && (
                    <div style={{ animation: "fadeUp 0.3s ease both" }}>
                        <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 16, letterSpacing: "0.04em" }}>
                            Type <span style={{ color: "#ef4444" }}>RESET</span> to confirm:
                        </p>
                        <input
                            autoFocus
                            value={typed}
                            onChange={e => setTyped(e.target.value)}
                            placeholder="RESET"
                            style={{
                                width: "100%", padding: "11px 14px", marginBottom: 12,
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 6, color: "#f9fafb", fontSize: 12,
                                fontFamily: "inherit", letterSpacing: "0.1em", outline: "none",
                            }}
                        />
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => { setStatus("idle"); setTyped(""); }} style={{
                                flex: 1, padding: "11px", background: "transparent",
                                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
                                color: "#4b5563", fontSize: 10, letterSpacing: "0.12em",
                                textTransform: "uppercase", fontFamily: "inherit", transition: "all 0.15s",
                            }}>
                                Cancel
                            </button>
                            <button
                                disabled={typed !== "RESET"}
                                onClick={handleReset}
                                style={{
                                    flex: 2, padding: "11px",
                                    background: typed === "RESET" ? "rgba(239,68,68,0.15)" : "transparent",
                                    border: `1px solid ${typed === "RESET" ? "#ef4444" : "rgba(255,255,255,0.06)"}`,
                                    borderRadius: 6,
                                    color: typed === "RESET" ? "#ef4444" : "#374151",
                                    fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                                    fontFamily: "inherit", transition: "all 0.2s",
                                    opacity: typed === "RESET" ? 1 : 0.5,
                                }}
                            >
                                Confirm Reset
                            </button>
                        </div>
                    </div>
                )}

                {status === "loading" && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "20px 0", animation: "fadeUp 0.3s ease both" }}>
                        <div style={{ width: 14, height: 14, border: "1.5px solid #ef4444", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        <span style={{ fontSize: 10, color: "#4b5563", letterSpacing: "0.2em", textTransform: "uppercase" }}>Resetting…</span>
                    </div>
                )}

                {status === "success" && (
                    <div style={{ animation: "fadeUp 0.3s ease both", textAlign: "center" }}>
                        <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
                        <p style={{ fontSize: 12, color: "#22c55e", letterSpacing: "0.08em", marginBottom: 6 }}>Bracket reset successfully</p>
                        <p style={{ fontSize: 10, color: "#374151", letterSpacing: "0.08em", marginBottom: 24 }}>{message}</p>
                        <a href="/brackets" style={{
                            display: "inline-block", fontSize: 10, color: "#4b5563",
                            letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none",
                            border: "1px solid rgba(255,255,255,0.08)", padding: "8px 20px", borderRadius: 6,
                            transition: "all 0.15s",
                        }}>
                            ← Back to bracket
                        </a>
                    </div>
                )}

                {status === "error" && (
                    <div style={{ animation: "fadeUp 0.3s ease both", textAlign: "center" }}>
                        <p style={{ fontSize: 12, color: "#ef4444", letterSpacing: "0.06em", marginBottom: 6 }}>Reset failed</p>
                        <p style={{ fontSize: 10, color: "#374151", marginBottom: 24 }}>{message}</p>
                        <button onClick={() => setStatus("idle")} style={{
                            fontSize: 10, color: "#4b5563", letterSpacing: "0.15em", textTransform: "uppercase",
                            background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                            padding: "8px 20px", borderRadius: 6, fontFamily: "inherit", transition: "all 0.15s",
                        }}>Try again</button>
                    </div>
                )}

                {/* footer */}
                <div style={{
                    marginTop: 56, fontSize: 9, color: "#1f2937", letterSpacing: "0.14em",
                    borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: 16,
                    display: "flex", justifyContent: "space-between",
                }}>
                    <span>BREACH@TRIX</span>
                    <span>Admin Panel</span>
                </div>
            </div>
        </div>
    );
}