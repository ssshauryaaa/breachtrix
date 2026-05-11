'use client'

import { useState, useEffect, useRef } from "react";

const TEAMS_DEFAULT = [
    { id: 1, seed: 1, name: "Amity International Sector 46" },
    { id: 2, seed: 2, name: "DPS Sector 45" },
    { id: 3, seed: 3, name: "Indraprastha" },
    { id: 4, seed: 4, name: "Bal Bharti Public School GRH" },
    { id: 5, seed: 5, name: "TIS EOK" },
    { id: 6, seed: 6, name: "Mayoor School" },
    { id: 7, seed: 7, name: "DPS SSL" },
    { id: 8, seed: 8, name: "St George School" },
];

const MATCHES_DEFAULT = [
    { id: "m1", round: 1, pos: 0, t1: 1, t2: 2, w: null },
    { id: "m2", round: 1, pos: 1, t1: 3, t2: 4, w: null },
    { id: "m3", round: 1, pos: 2, t1: 5, t2: 6, w: null },
    { id: "m4", round: 1, pos: 3, t1: 7, t2: 8, w: null },
    { id: "m5", round: 2, pos: 0, t1: null, t2: null, w: null },
    { id: "m6", round: 2, pos: 1, t1: null, t2: null, w: null },
    { id: "m7", round: 3, pos: 0, t1: null, t2: null, w: null },
];

// roles[teamId][matchId] = "attacker" | "defender" | null
const initRoles = () => {
    const r = {};
    TEAMS_DEFAULT.forEach(t => { r[t.id] = {}; });
    return r;
};

function clone(x) { return JSON.parse(JSON.stringify(x)); }

function propagate(matches) {
    const m = clone(matches);
    const r1 = m.filter(x => x.round === 1).sort((a, b) => a.pos - b.pos);
    const get = id => m.find(x => x.id === id);
    const m5 = get("m5"), m6 = get("m6"), m7 = get("m7");
    if (m5) { m5.t1 = r1[0]?.w ?? null; m5.t2 = r1[1]?.w ?? null; }
    if (m6) { m6.t1 = r1[2]?.w ?? null; m6.t2 = r1[3]?.w ?? null; }
    if (m7) { m7.t1 = m5?.w ?? null; m7.t2 = m6?.w ?? null; }
    return m;
}

// ── Custom cursor ──────────────────────────────────────────────────────────────
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
            lag.current.x += (mouse.current.x - lag.current.x) * 0.13;
            lag.current.y += (mouse.current.y - lag.current.y) * 0.13;
            if (dot.current) dot.current.style.transform = `translate(${mouse.current.x - 3}px,${mouse.current.y - 3}px)`;
            if (ring.current) ring.current.style.transform = `translate(${lag.current.x - 14}px,${lag.current.y - 14}px)`;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
    }, []);

    return (
        <>
            <div ref={dot} style={{ position: "fixed", top: 0, left: 0, width: 6, height: 6, borderRadius: "50%", background: "#e2e8f0", zIndex: 9999, pointerEvents: "none", willChange: "transform" }} />
            <div ref={ring} style={{ position: "fixed", top: 0, left: 0, width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(226,232,240,0.2)", zIndex: 9998, pointerEvents: "none", willChange: "transform" }} />
        </>
    );
}

const ATK_COLOR = "#f87171";
const DEF_COLOR = "#60a5fa";

// ── Slot ───────────────────────────────────────────────────────────────────────
function Slot({ team, winner, loser, canPick, onClick, role }) {
    const [hov, setHov] = useState(false);
    const c = role === "attacker" ? ATK_COLOR : role === "defender" ? DEF_COLOR : null;

    return (
        <div
            onClick={canPick && team ? onClick : undefined}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            title={team?.name ?? ""}
            style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 14px",
                transition: "background 0.15s, border-left-color 0.15s",
                borderLeft: `2px solid ${winner ? (c || "rgba(226,232,240,0.4)") : hov && canPick && team ? "rgba(226,232,240,0.15)" : "transparent"}`,
                background: winner
                    ? (c ? `${c}12` : "rgba(226,232,240,0.05)")
                    : hov && canPick && team ? "rgba(226,232,240,0.04)" : "transparent",
                opacity: loser ? 0.2 : 1,
                cursor: canPick && team ? "none" : "default",
            }}
        >
            <span style={{
                fontSize: 10, fontWeight: 600, color: "#334155",
                minWidth: 18, textAlign: "right", flexShrink: 0,
                letterSpacing: "0.04em",
            }}>
                {team?.seed ?? "—"}
            </span>
            <span style={{
                flex: 1, fontSize: 12, fontWeight: winner ? 600 : 400,
                letterSpacing: "0.02em",
                color: winner ? (c || "#e2e8f0") : team ? "#94a3b8" : "#1e2d3d",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                textShadow: winner && c ? `0 0 16px ${c}40` : "none",
                transition: "color 0.15s",
            }}>
                {team?.name ?? "TBD"}
            </span>
            {role && (
                <span style={{
                    fontSize: 8, letterSpacing: "0.16em", color: c, flexShrink: 0,
                    border: `1px solid ${c}45`, padding: "2px 6px", borderRadius: 3,
                    background: `${c}10`, textTransform: "uppercase", fontWeight: 700,
                }}>
                    {role === "attacker" ? "ATK" : "DEF"}
                </span>
            )}
            {winner && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, opacity: 0.6 }}>
                    <polyline points="1,5 4,8 9,2" stroke={c || "#e2e8f0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
    );
}

// ── Match card ────────────────────────────────────────────────────────────────
function MatchCard({ match, teams, roles, onWin, cardRef }) {
    const t1 = teams.find(t => t.id === match.t1) ?? null;
    const t2 = teams.find(t => t.id === match.t2) ?? null;
    const canPick = t1 && t2 && !match.w;

    const role1 = t1 ? (roles[t1.id]?.[match.id] ?? null) : null;
    const role2 = t2 ? (roles[t2.id]?.[match.id] ?? null) : null;

    return (
        <div ref={cardRef} style={{
            background: "#05080f",
            border: "1px solid #0f1823",
            borderRadius: 8, overflow: "hidden", width: 268, flexShrink: 0,
            boxShadow: "0 2px 20px rgba(0,0,0,0.7)",
        }}>
            <div style={{ height: 1, background: `linear-gradient(90deg, ${ATK_COLOR}40 0%, ${DEF_COLOR}40 100%)` }} />
            <Slot team={t1} winner={match.w === t1?.id} loser={!!match.w && match.w !== t1?.id}
                canPick={canPick} onClick={() => onWin(match.id, t1.id)} role={role1} />
            <div style={{ height: 1, background: "#0a1120", margin: "0 14px" }} />
            <Slot team={t2} winner={match.w === t2?.id} loser={!!match.w && match.w !== t2?.id}
                canPick={canPick} onClick={() => onWin(match.id, t2.id)} role={role2} />
            {canPick && (
                <div style={{ padding: "4px 14px 7px", fontSize: 8, color: "#1e2d3d", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    click to advance
                </div>
            )}
        </div>
    );
}

// ── SVG connectors ────────────────────────────────────────────────────────────
function Connectors({ fromRefs, toRefs }) {
    const svgRef = useRef(null);
    const [segs, setSegs] = useState([]);

    useEffect(() => {
        const compute = () => {
            if (!svgRef.current) return;
            const base = svgRef.current.getBoundingClientRect();
            const out = [];
            toRefs.forEach((toR, i) => {
                const fA = fromRefs[i * 2];
                const fB = fromRefs[i * 2 + 1];
                if (!fA?.current || !fB?.current || !toR?.current) return;
                const rA = fA.current.getBoundingClientRect();
                const rB = fB.current.getBoundingClientRect();
                const rT = toR.current.getBoundingClientRect();
                const yA = rA.top + rA.height / 2 - base.top;
                const yB = rB.top + rB.height / 2 - base.top;
                const yT = rT.top + rT.height / 2 - base.top;
                out.push({ yA, yB, yT });
            });
            setSegs(out);
        };
        compute();
        const id = setInterval(compute, 150);
        window.addEventListener("resize", compute);
        return () => { clearInterval(id); window.removeEventListener("resize", compute); };
    }, [fromRefs, toRefs]);

    const W = 48;
    return (
        <svg ref={svgRef} width={W} style={{ alignSelf: "stretch", flexShrink: 0, overflow: "visible" }}>
            {segs.map((s, i) => {
                const x0 = 0, xm = W / 2, x1 = W;
                const stroke = "rgba(255,255,255,0.07)";
                return (
                    <g key={i}>
                        <line x1={x0} y1={s.yA} x2={xm} y2={s.yA} stroke={stroke} strokeWidth={1} />
                        <line x1={x0} y1={s.yB} x2={xm} y2={s.yB} stroke={stroke} strokeWidth={1} />
                        <line x1={xm} y1={s.yA} x2={xm} y2={s.yB} stroke={stroke} strokeWidth={1} />
                        <line x1={xm} y1={s.yT} x2={x1} y2={s.yT} stroke={stroke} strokeWidth={1} />
                        <circle cx={xm} cy={s.yA} r={1.5} fill="rgba(255,255,255,0.1)" />
                        <circle cx={xm} cy={s.yB} r={1.5} fill="rgba(255,255,255,0.1)" />
                        <circle cx={xm} cy={s.yT} r={1.5} fill="rgba(255,255,255,0.1)" />
                    </g>
                );
            })}
        </svg>
    );
}

// ── Champion ──────────────────────────────────────────────────────────────────
function Champion({ team, roles, matchId }) {
    const role = team ? (roles[team.id]?.[matchId] ?? null) : null;
    const c = role === "attacker" ? ATK_COLOR : role === "defender" ? DEF_COLOR : "#1e2d3d";
    const activeC = team ? (role ? c : "#e2e8f0") : "#1e2d3d";

    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            padding: "28px 24px", borderRadius: 10, width: 210, textAlign: "center",
            background: team ? "#05080f" : "rgba(5,8,15,0.6)",
            border: `1px solid ${team ? (role ? c + "50" : "#0f1823") : "#070d18"}`,
            boxShadow: team && role ? `0 0 60px ${c}14` : "0 2px 24px rgba(0,0,0,0.5)",
            transition: "all 0.4s ease",
        }}>
            <div style={{ fontSize: 26, filter: team ? "none" : "grayscale(1) opacity(0.1)" }}>🏆</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 8, letterSpacing: "0.3em", color: team ? (role ? c : "#475569") : "#1e2d3d", textTransform: "uppercase", fontWeight: 600 }}>
                    {team ? "Champion" : "Awaiting"}
                </span>
                <span style={{
                    fontSize: 12, fontWeight: 600, color: team ? "#e2e8f0" : "#1e2d3d",
                    lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                    {team?.name ?? "—"}
                </span>
            </div>
            {role && (
                <span style={{
                    fontSize: 8, letterSpacing: "0.2em", color: c, fontWeight: 700,
                    border: `1px solid ${c}45`, padding: "3px 10px", borderRadius: 4,
                    background: `${c}10`, textTransform: "uppercase",
                }}>
                    {role === "attacker" ? "Red Team" : "Blue Team"}
                </span>
            )}
        </div>
    );
}

// ── Round label ───────────────────────────────────────────────────────────────
function RoundLabel({ text }) {
    return (
        <div style={{
            fontSize: 8, color: "#1e2d3d", letterSpacing: "0.3em",
            textTransform: "uppercase", marginBottom: 14, paddingLeft: 2,
            fontWeight: 700,
        }}>
            {text}
        </div>
    );
}

// ── Role assignment panel ──────────────────────────────────────────────────────
function RolePanel({ teams, matches, roles, onRoleChange }) {
    const [activeRound, setActiveRound] = useState(1);
    const rounds = [
        { label: "Quarterfinals", value: 1 },
        { label: "Semifinals", value: 2 },
        { label: "Grand Final", value: 3 },
    ];

    const roundMatches = matches.filter(m => m.round === activeRound).sort((a, b) => a.pos - b.pos);

    const CYCLE = [null, "attacker", "defender"];
    const getRole = (teamId, matchId) => roles[teamId]?.[matchId] ?? null;
    const cycleRole = (teamId, matchId) => {
        const cur = getRole(teamId, matchId);
        const next = CYCLE[(CYCLE.indexOf(cur) + 1) % 3];
        onRoleChange(teamId, matchId, next);
    };

    const colorFor = role => role === "attacker" ? ATK_COLOR : role === "defender" ? DEF_COLOR : null;

    return (
        <div>
            {/* Round tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 28, justifyContent: "center" }}>
                {rounds.map(r => {
                    const active = activeRound === r.value;
                    return (
                        <button key={r.value} onClick={() => setActiveRound(r.value)} style={{
                            padding: "7px 18px", borderRadius: 6, fontSize: 10,
                            letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600,
                            background: active ? "#0f1823" : "transparent",
                            border: `1px solid ${active ? "#1e3050" : "#0a1120"}`,
                            color: active ? "#94a3b8" : "#1e2d3d",
                            fontFamily: "inherit", transition: "all 0.15s",
                        }}>
                            {r.label}
                        </button>
                    );
                })}
            </div>

            {/* Matches in selected round */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {roundMatches.map(match => {
                    const t1 = teams.find(t => t.id === match.t1);
                    const t2 = teams.find(t => t.id === match.t2);

                    if (!t1 && !t2) {
                        return (
                            <div key={match.id} style={{
                                padding: "20px", borderRadius: 8,
                                border: "1px solid #070d18", background: "#03060b",
                                textAlign: "center", color: "#1e2d3d", fontSize: 10,
                                letterSpacing: "0.14em", textTransform: "uppercase",
                            }}>
                                Teams TBD — advance teams from previous round
                            </div>
                        );
                    }

                    const matchLabel = activeRound === 1
                        ? `Match ${match.pos + 1}`
                        : activeRound === 2
                            ? `Semifinal ${match.pos + 1}`
                            : "Grand Final";

                    return (
                        <div key={match.id} style={{
                            border: "1px solid #0a1120", borderRadius: 8,
                            background: "#03060b", overflow: "hidden",
                        }}>
                            <div style={{ padding: "10px 16px 8px", borderBottom: "1px solid #070d18" }}>
                                <span style={{ fontSize: 8, letterSpacing: "0.24em", color: "#1e2d3d", textTransform: "uppercase", fontWeight: 700 }}>
                                    {matchLabel}
                                </span>
                            </div>
                            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                                {[t1, t2].filter(Boolean).map(team => {
                                    const role = getRole(team.id, match.id);
                                    const c = colorFor(role);
                                    return (
                                        <div key={team.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <span style={{ fontSize: 9, color: "#2d3d52", minWidth: 16, textAlign: "right" }}>
                                                #{team.seed}
                                            </span>
                                            <span style={{
                                                flex: 1, fontSize: 12, color: c || "#475569",
                                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                fontWeight: role ? 500 : 400,
                                            }} title={team.name}>
                                                {team.name}
                                            </span>
                                            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                                                {[null, "attacker", "defender"].map(r => {
                                                    const active = role === r;
                                                    const rc = r === "attacker" ? ATK_COLOR : r === "defender" ? DEF_COLOR : null;
                                                    return (
                                                        <button key={String(r)} onClick={() => onRoleChange(team.id, match.id, r)} style={{
                                                            padding: "4px 10px", borderRadius: 4, fontSize: 8,
                                                            letterSpacing: "0.14em", textTransform: "uppercase",
                                                            fontWeight: 700, fontFamily: "inherit",
                                                            background: active ? (rc ? `${rc}18` : "rgba(226,232,240,0.06)") : "transparent",
                                                            border: `1px solid ${active ? (rc ? `${rc}55` : "rgba(226,232,240,0.2)") : "#0d1928"}`,
                                                            color: active ? (rc || "#94a3b8") : "#1e2d3d",
                                                            transition: "all 0.12s",
                                                        }}>
                                                            {r === null ? "—" : r === "attacker" ? "ATK" : "DEF"}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24 }}>
                {[[ATK_COLOR, "Attacker"], [DEF_COLOR, "Defender"], ["#1e2d3d", "Unassigned"]].map(([c, l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 9, color: "#2d3d52", letterSpacing: "0.08em" }}>
                        <div style={{ width: 6, height: 6, borderRadius: 2, background: c }} />
                        {l}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Reset button ───────────────────────────────────────────────────────────────
function ResetButton({ onReset }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onReset}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "7px 16px", borderRadius: 6,
                border: `1px solid ${hov ? "#1e3050" : "#0a1120"}`,
                background: hov ? "#070d18" : "transparent",
                color: "#2d3d52", fontSize: 9, letterSpacing: "0.2em",
                textTransform: "uppercase", fontFamily: "inherit",
                transition: "all 0.14s", fontWeight: 600,
            }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 5a4 4 0 1 1 1.2 2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <polyline points="1,3 1,5 3,5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Reset Bracket
        </button>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BracketPage() {
    const [teams] = useState(() => clone(TEAMS_DEFAULT));
    const [matches, setMatches] = useState(() => clone(MATCHES_DEFAULT));
    const [roles, setRoles] = useState(initRoles);

    const r1Refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const r2Refs = [useRef(null), useRef(null)];
    const r3Ref = useRef(null);

    const handleWin = (id, winnerId) => {
        setMatches(prev => propagate(prev.map(m => m.id === id ? { ...m, w: winnerId } : m)));
    };

    const handleRoleChange = (teamId, matchId, role) => {
        setRoles(prev => ({
            ...prev,
            [teamId]: { ...prev[teamId], [matchId]: role },
        }));
    };

    const handleReset = () => {
        setMatches(clone(MATCHES_DEFAULT));
        setRoles(initRoles());
    };

    const r1 = matches.filter(m => m.round === 1).sort((a, b) => a.pos - b.pos);
    const r2 = matches.filter(m => m.round === 2).sort((a, b) => a.pos - b.pos);
    const r3 = matches.filter(m => m.round === 3);
    const finalMatch = r3[0];
    const champ = finalMatch?.w ? teams.find(t => t.id === finalMatch.w) : null;

    return (
        <div style={{
            minHeight: "100vh",
            background: "#020508",
            color: "#e2e8f0",
            fontFamily: "'SF Mono','Fira Code','Cascadia Code','Courier New',monospace",
            cursor: "none",
            overflowX: "hidden",
            overflowY: "auto",
        }}>
            <style>{`
                * { cursor: none !important; box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
                ::-webkit-scrollbar { width: 2px; height: 2px; background: #020508; }
                ::-webkit-scrollbar-thumb { background: #0a1120; border-radius: 2px; }
            `}</style>

            <Cursor />

            {/* Subtle grid overlay */}
            <div style={{
                position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(255,255,255,0.014) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
                maskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 5%, transparent 100%)",
            }} />

            <div style={{
                position: "relative", zIndex: 1,
                maxWidth: 1480, margin: "0 auto",
                padding: "52px 36px 90px",
                animation: "fadeUp 0.45s ease both",
            }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 52 }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.4em", color: "#1e2d3d", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>
                        Breach@Trix &nbsp;·&nbsp; 2026
                    </div>
                    <h1 style={{
                        fontSize: "clamp(1.5rem, 2.4vw, 2.2rem)",
                        fontWeight: 700, letterSpacing: "-0.04em",
                        color: "#e2e8f0", lineHeight: 1, marginBottom: 20,
                    }}>
                        Tournament Bracket
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                        <div style={{ height: 1, width: 48, background: `linear-gradient(to right, transparent, ${ATK_COLOR}35)` }} />
                        <div style={{ width: 2, height: 2, borderRadius: "50%", background: "#1e2d3d" }} />
                        <div style={{ height: 1, width: 48, background: `linear-gradient(to left, transparent, ${DEF_COLOR}35)` }} />
                    </div>
                    {/* <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
                        <ResetButton onReset={handleReset} />
                    </div> */}
                </div>

                {/* Bracket */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 0, overflowX: "auto", paddingBottom: 16,
                }}>
                    {/* Round 1 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <RoundLabel text="Quarterfinals" />
                        {r1.map((m, i) => (
                            <MatchCard key={m.id} match={m} teams={teams} roles={roles}
                                onWin={handleWin} cardRef={r1Refs[i]} />
                        ))}
                    </div>

                    <Connectors fromRefs={r1Refs} toRefs={r2Refs} />

                    {/* Round 2 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignSelf: "center" }}>
                        <RoundLabel text="Semifinals" />
                        {r2.map((m, i) => (
                            <MatchCard key={m.id} match={m} teams={teams} roles={roles}
                                onWin={handleWin} cardRef={r2Refs[i]} />
                        ))}
                    </div>

                    <Connectors fromRefs={r2Refs} toRefs={[r3Ref]} />

                    {/* Round 3 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignSelf: "center" }}>
                        <RoundLabel text="Grand Final" />
                        {r3.map(m => (
                            <MatchCard key={m.id} match={m} teams={teams} roles={roles}
                                onWin={handleWin} cardRef={r3Ref} />
                        ))}
                    </div>

                    {/* Arrow */}
                    <div style={{
                        width: 48, flexShrink: 0, alignSelf: "center",
                        display: "flex", alignItems: "center",
                    }}>
                        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                        <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
                            <polyline points="1,1 4,4.5 1,8" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Champion */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <RoundLabel text="Champion" />
                        <Champion team={champ} roles={roles} matchId={finalMatch?.id} />
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    margin: "60px 0 44px",
                    height: 1,
                    background: "linear-gradient(to right, transparent, #0a1120 30%, #0a1120 70%, transparent)",
                }} />

                {/* Role Assignment */}
                <div style={{ maxWidth: 860, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <p style={{ fontSize: 8, color: "#1e2d3d", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>
                            Role Assignment
                        </p>
                        <p style={{ fontSize: 11, color: "#1e2d3d", letterSpacing: "0.03em" }}>
                            Set attacker / defender roles per team per round
                        </p>
                    </div>
                    <RolePanel
                        teams={teams}
                        matches={matches}
                        roles={roles}
                        onRoleChange={handleRoleChange}
                    />
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: 64,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontSize: 8, color: "#0d1928", letterSpacing: "0.2em", textTransform: "uppercase",
                    borderTop: "1px solid #070d18", paddingTop: 18,
                }}>
                    <span>Breach@Trix</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#22c55e", animation: "pulse 2.2s infinite", display: "inline-block" }} />
                        Live
                    </span>
                    <span>Finals · 2026</span>
                </div>
            </div>
        </div>
    );
}