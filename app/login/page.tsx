"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// --- Reused Threat Network Background ---
function ThreatNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(window.innerWidth / 15, 100);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.8 ? "#ff3333" : "#00ccff",
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - distance / 150;
            ctx.strokeStyle = `rgba(0, 204, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// --- Giant Screen-Spanning Red Cross ---
function GiantUnavailableCross() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute w-[200vw] h-[200vw] md:w-[150vw] md:h-[150vw] text-[#ff3333] select-none"
        style={{ filter: "drop-shadow(0 0 40px rgba(255,51,51,0.5))" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.1, 0.25, 0.1], // Slow, ominous pulse
          scale: [1, 1.02, 1], // Very subtle breathing effect
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {/* Massive 2-line Cross */}
        <div className="absolute top-1/2 left-0 w-full h-[8px] md:h-[12px] bg-current rounded-full rotate-45 transform origin-center -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 w-full h-[8px] md:h-[12px] bg-current rounded-full -rotate-45 transform origin-center -translate-y-1/2" />
      </motion.div>
    </div>
  );
}

// --- Background Event Date Popup ---
function EventDatePopup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: [0.5, 0.8, 0.5], 
        y: [0, -10, 0] 
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="absolute top-1/4 right-8 md:right-[15%] z-0 border border-[#00ccff]/30 bg-[#050505]/80 backdrop-blur-md p-5 shadow-[0_0_20px_rgba(0,204,255,0.1)] hidden sm:block"
    >
      {/* Cyber Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00ccff]"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00ccff]"></div>
      
      <div className="flex items-center gap-3 mb-3">
        <span className="w-2 h-2 bg-[#00ccff] animate-pulse rounded-full"></span>
        <span className="text-[#00ccff] font-mono text-[10px] uppercase tracking-widest">
          System Broadcast
        </span>
      </div>
      <div className="text-white font-mono text-xs uppercase tracking-wider space-y-1">
        <p className="text-gray-400 text-[10px]">Access restricted until:</p>
        <p className="text-xl text-white tracking-widest font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          12TH MAY
        </p>
      </div>
    </motion.div>
  );
}

// --- Full Screen Analog Glitch FX (Blur, Aberration, Flicker) ---
function AnalogScreenGlitchFX() {
  return (
    <>
      <style>{`
        /* The main container wrapper applying the FX */
        .analog-glitch-wrapper {
          width: 100vw;
          height: 100vh;
          position: fixed;
          inset: 0;
          animation: global-analog-flicker 1s infinite;
          overflow: hidden;
        }

        /* Duplicated layer for RGB shift/Chromatic Aberration */
        .chromatic-layer {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          opacity: 0.2; /* Subtle effect */
          background-image: inherit; /* inherit the background of parent */
          background-size: inherit;
          mix-blend-mode: screen; /* mix red/blue */
          filter: blur(2px); /* Base blurry feel */
        }

        .chromatic-red {
          color: #ff0000;
          animation: red-shift 1.2s infinite;
          transform: translateX(-2px);
        }

        .chromatic-blue {
          color: #0000ff;
          animation: blue-shift 1.5s infinite;
          transform: translateX(2px);
        }

        /* --- Keyframes --- */
        
        /* Red chromatic layer horizontal twitch */
        @keyframes red-shift {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          45% { transform: translate(-1px, 0); opacity: 0.3; }
          46% { transform: translate(-4px, 1px) scale(1.02); opacity: 0.1; }
          47% { transform: translate(-1px, 0); opacity: 0.2; }
          85% { transform: translate(0, 0); }
          86% { transform: translate(3px, -1px); opacity: 0.3; }
          87% { transform: translate(0, 0); }
        }

        /* Blue chromatic layer horizontal twitch */
        @keyframes blue-shift {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          48% { transform: translate(1px, 0); opacity: 0.3; }
          49% { transform: translate(4px, -1px) scale(0.98); opacity: 0.1; }
          50% { transform: translate(1px, 0); opacity: 0.2; }
          82% { transform: translate(0, 0); }
          83% { transform: translate(-3px, 1px); opacity: 0.3; }
          84% { transform: translate(0, 0); }
        }

        /* Ominous brightness/blur flicker on the whole screen */
        @keyframes global-analog-flicker {
          0% { filter: blur(0px) brightness(1); }
          12% { filter: blur(0px) brightness(1.1); }
          13% { filter: blur(1px) brightness(1.3); } /* Temporary blur boost */
          14% { filter: blur(0px) brightness(1); }
          50% { filter: blur(0px) brightness(1); }
          51% { filter: blur(2px) brightness(1.2); } /* Quick heavy blur flash */
          52% { filter: blur(0px) brightness(1); }
          85% { filter: blur(0px) brightness(1.05); }
          86% { filter: blur(1.5px) brightness(1.4); } /* Slower blur swell */
          87% { filter: blur(0px) brightness(1); }
          100% { filter: blur(0px) brightness(1); }
        }

        @keyframes scanlines-scrolling {
          0% { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
      `}</style>

      {/* Subtle Scanlines overlay */}
      <div 
        className="fixed inset-0 z-[110] pointer-events-none mix-blend-overlay opacity-30"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)",
          animation: "scanlines-scrolling 10s linear infinite"
          
        }}
      />
    </>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [mounted, setMounted] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Tilt Animation Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    e.currentTarget.style.setProperty("--x", `${mouseX}px`);
    e.currentTarget.style.setProperty("--y", `${mouseY}px`);

    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      console.log("AFTER LOGIN");

      // force fresh state read AFTER set()
      const user = useAuthStore.getState().user;
      if (user) {
        router.replace("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.message || "ERR: Auth token rejected. Connection terminated."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#030303] text-[#f2f2f2] font-sans overflow-hidden selection:bg-[#00ccff] selection:text-black">
      
      {/* ── INJECT GLITCH KEYFRAMES ── */}
      {mounted && <AnalogScreenGlitchFX />}

      {/* ── GLOBAL GLITCH WRAPPER ── */}
      <div className="analog-glitch-wrapper">
        
        {/* DUPLICATE LAYER: BLUE SHIFT */}
        <div className="chromatic-layer chromatic-blue bg-[#030303]">
          {/* We must repeat the background color and grid here */}
           <div
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.2]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #666 1px, transparent 1px), linear-gradient(to bottom, #666 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
              maskImage: "radial-gradient(circle at center, black, transparent 90%)",
            }}
          />
        </div>

        {/* DUPLICATE LAYER: RED SHIFT */}
        <div className="chromatic-layer chromatic-red bg-[#030303]">
           <div
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.2]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #666 1px, transparent 1px), linear-gradient(to bottom, #666 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
              maskImage: "radial-gradient(circle at center, black, transparent 90%)",
            }}
          />
        </div>

        {/* ── MAIN CONTENT LAYER ── */}
        <div className="relative w-full h-full z-10">
          
          {/* Animated background on main layer */}
          <div
            className="fixed inset-0 z-0 pointer-events-none opacity-[0.2]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #666 1px, transparent 1px), linear-gradient(to bottom, #666 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
              maskImage: "radial-gradient(circle at center, black, transparent 90%)",
            }}
          />

          <div className="fixed inset-0 z-0">
            {mounted && <ThreatNetwork />}
          </div>

          {/* ── GIANT EVENT CROSS OVERLAY ── */}
          {/* {mounted && <GiantUnavailableCross />} */}

          {/* ── BACKGROUND EVENT DATE POPUP ── */}
          {mounted && <EventDatePopup />}

          {/* ── HUD RADAR RINGS ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40 overflow-hidden">
            <div className="relative w-full aspect-square max-w-[800px] max-h-[800px] md:max-w-[1000px] md:max-h-[1000px]">
              <div className="absolute inset-0 rounded-full border border-[#00ccff]/20 border-dashed animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute inset-8 md:inset-16 rounded-full border border-white/5 animate-[spin_40s_linear_infinite_reverse] shadow-[inset_0_0_80px_rgba(0,204,255,0.03)]"></div>
            </div>
          </div>

          {/* ── TELEMETRY ── */}
          <div className="absolute left-6 top-6 flex flex-col gap-2 font-mono text-[9px] text-[#00ccff]/70 tracking-widest uppercase pointer-events-none hidden sm:flex z-10">
            <span>
              SYS_AUTH: <span className="text-white animate-pulse">STANDBY</span>
            </span>
            <span>UPLINK: SECURE</span>
          </div>

          {/* ── LOGIN CONTAINER ── */}
          <main className="relative z-10 flex items-center justify-center h-screen w-full px-6">
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-md w-full relative group"
            >
              {/* Spotlight Glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at var(--x) var(--y), rgba(0, 204, 255, 0.15), transparent 60%)",
                }}
              />

              {/* Card Body */}
              <div
                style={{ transform: "translateZ(30px)" }}
                className="relative bg-black/60 backdrop-blur-xl border border-white/10 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                {/* Cyber Targeting Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 group-hover:border-[#00ccff] transition-colors duration-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 group-hover:border-[#00ccff] transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 group-hover:border-[#00ccff] transition-colors duration-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 group-hover:border-[#00ccff] transition-colors duration-500"></div>

                {/* Header */}
                <div
                  className="mb-10 select-none text-center"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ff3333]/30 bg-[#ff3333]/10 text-[#ff3333] font-mono text-[10px] uppercase tracking-widest mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff3333] animate-pulse"></span>
                    Event Status: UNAVAILABLE
                  </div>

                  <h1 className="text-3xl font-mono tracking-widest uppercase text-white group-hover:text-gray-300 transition-colors">
                    breach<span className="text-[#00ccff]">@</span>trix
                  </h1>
                  <p className="text-[9px] tracking-[0.4em] text-gray-500 mt-2 uppercase font-mono">
                    System Login // v.2026
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Output */}
                  {error && (
                    <div
                      style={{ transform: "translateZ(10px)" }}
                      className="px-4 py-3 border border-[#ff3333]/30 bg-[#ff3333]/10"
                    >
                      <p className="text-[10px] font-mono text-[#ff3333] uppercase tracking-widest flex items-center gap-2">
                        <span className="animate-pulse">!</span> {error}
                      </p>
                    </div>
                  )}

                  {/* Username Input */}
                  <div style={{ transform: "translateZ(10px)" }} className="relative">
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#00ccff]/70 mb-2">
                      Innovator ID
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
                        {">"}
                      </span>
                      <input
                        className="w-full bg-[#050505] border border-white/10 px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-[#00ccff] focus:shadow-[0_0_15px_rgba(0,204,255,0.2)] transition-all rounded-none"
                        placeholder="sys.admin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div style={{ transform: "translateZ(10px)" }} className="relative">
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#00ccff]/70 mb-2">
                      Auth Key
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
                        {">"}
                      </span>
                      <input
                        type="password"
                        className="w-full bg-[#050505] border border-white/10 px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-[#00ccff] focus:shadow-[0_0_15px_rgba(0,204,255,0.2)] transition-all rounded-none"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ transform: "translateZ(20px)" }} className="pt-4">
                    <button
                      type="submit"
                      disabled={true} // <-- Disabled permanently here
                      className="w-full relative inline-flex items-center justify-center overflow-hidden border border-white/20 bg-[#050505] px-10 py-4 text-xs font-mono uppercase tracking-[0.2em] text-white transition-all duration-500 group/btn disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center gap-3 text-[#ff3333]">
                        AWAITING ACCESS
                      </span>
                    </button>
                  </div>
                </form>

                {/* Footer / Register Link */}
                <div
                  className="mt-8 pt-6 border-t border-white/10 text-center"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                    Unregistered Vector?{" "}
                    <button
                      onClick={() => router.push("/register")}
                      className="text-[#00ccff] hover:text-white transition-colors relative group inline-block ml-1"
                    >
                      Initialize Here
                      <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#00ccff] transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </main>
        </div> {/* end Main content layer */}
      </div> {/* end Glitch wrapper */}
    </div>
  );
}