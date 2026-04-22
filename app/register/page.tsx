"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
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

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
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
      await register(username, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "ERR: Registration failed. Systems may be offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#030303] text-[#f2f2f2] font-sans min-h-screen overflow-hidden selection:bg-[#00ccff] selection:text-black">
      
      {/* ── ANIMATED BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.2]" 
           style={{ backgroundImage: 'linear-gradient(to right, #666 1px, transparent 1px), linear-gradient(to bottom, #666 1px, transparent 1px)', backgroundSize: '4rem 4rem', maskImage: 'radial-gradient(circle at center, black, transparent 90%)' }} />
      
      <div className="fixed inset-0 z-0">
        {mounted && <ThreatNetwork />}
      </div>

      {/* ── HUD RADAR RINGS ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40">
        <div className="relative w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] md:max-w-[1000px] md:max-h-[1000px]">
          <div className="absolute inset-0 rounded-full border border-[#00ccff]/20 border-dashed animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute inset-8 md:inset-16 rounded-full border border-white/5 animate-[spin_40s_linear_infinite_reverse] shadow-[inset_0_0_80px_rgba(0,204,255,0.03)]"></div>
        </div>
      </div>

      {/* ── TELEMETRY ── */}
      <div className="absolute right-6 top-6 flex flex-col gap-2 font-mono text-[9px] text-[#00ccff]/70 tracking-widest uppercase text-right pointer-events-none hidden sm:flex z-10">
        <span>NEW_VECTOR: <span className="text-white animate-pulse">DETECTED</span></span>
        <span>PROTOCOL: REGISTRATION</span>
      </div>

      {/* ── REGISTER CONTAINER ── */}
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
            style={{ background: "radial-gradient(circle at var(--x) var(--y), rgba(0, 204, 255, 0.15), transparent 60%)" }}
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
            <div className="mb-10 select-none text-center" style={{ transform: "translateZ(20px)" }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00ccff]/30 bg-[#00ccff]/10 text-[#00ccff] font-mono text-[10px] uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ccff] animate-pulse"></span>
                Node Registration
              </div>
              
              <h1 className="text-3xl font-mono tracking-widest uppercase text-white group-hover:text-gray-300 transition-colors">
                breach<span className="text-[#00ccff]">@</span>trix
              </h1>
              <p className="text-[9px] tracking-[0.4em] text-gray-500 mt-2 uppercase font-mono">
                Join Ordin@trix 26'
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Output */}
              {error && (
                <div style={{ transform: "translateZ(10px)" }} className="px-4 py-3 border border-[#ff3333]/30 bg-[#ff3333]/10">
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
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">{">"}</span>
                  <input
                    className="w-full bg-[#050505] border border-white/10 px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-[#00ccff] focus:shadow-[0_0_15px_rgba(0,204,255,0.2)] transition-all rounded-none"
                    placeholder="Create your ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={{ transform: "translateZ(10px)" }} className="relative">
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#00ccff]/70 mb-2">
                  Secure Passcode
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">{">"}</span>
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
                  disabled={true} // <--- Changed this from {loading} to true
                  className="w-full relative inline-flex items-center justify-center overflow-hidden border border-white/20 bg-[#050505] px-10 py-4 text-xs font-mono uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-[#00ccff] hover:shadow-[0_0_30px_rgba(0,204,255,0.3)] group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:shadow-none"
                >
                  <span className="absolute inset-0 bg-[#00ccff]/10 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? "Initializing..." : "Initialize Account"}
                    {!loading && (
                      <svg className="group-hover/btn:translate-x-1 transition-transform duration-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Footer / Login Link */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center" style={{ transform: "translateZ(10px)" }}>
              <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                Already an operator?{" "}
                <Link
                  href="/login"
                  className="text-[#00ccff] hover:text-white transition-colors relative group inline-block ml-1"
                >
                  Establish Uplink
                  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#00ccff] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}