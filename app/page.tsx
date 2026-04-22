"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";


function ThreatNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
      const numParticles = Math.min(window.innerWidth / 15, 100); // Adjust density based on screen size
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.8 ? '#ff3333' : '#00ccff' // 20% red threats, 80% cyan data
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw Particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Draw connections
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Opacity fades as they get further apart
            const opacity = 1 - (distance / 150);
            ctx.strokeStyle = `rgba(0, 204, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
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

const RULES = [
  { id: "01", tag: "MANDATORY", text: "Teams must have exactly two participants." },
  { id: "02", tag: "ELIGIBILITY", text: "Open to students of Classes IX–XII only." },
  { id: "03", tag: "CRITICAL", text: "No pre-built exploits or external tools allowed." },
  { id: "04", tag: "RESTRICTION", text: "All actions must stay within the provided environment." },
  { id: "05", tag: "FINAL", text: "All decisions by organizers are final." },
];

const TERMINAL_COMMANDS = [
  "./execute_sandbox.sh --bypass-auth",
  "nmap -sS -p- 192.168.1.100 -v",
  "Establishing secure SSH tunnel...",
  "Decrypting payload [████████░░] 80%",
  "Access granted. Root privileges escalated.",
  "tail -f /var/log/syslog | grep 'CRITICAL'",
];

function TerminalTypewriter() {
  const [text, setText] = useState("");
  const [cmdIndex, setCmdIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentCmd = TERMINAL_COMMANDS[cmdIndex];
    const typeSpeed = isDeleting ? 20 : Math.random() * 50 + 30; // Randomize typing speed for realism
    
    const timer = setTimeout(() => {
      if (!isDeleting && text === currentCmd) {
        setTimeout(() => setIsDeleting(true), 2500); // Pause at the end of the command
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setCmdIndex((prev) => (prev + 1) % TERMINAL_COMMANDS.length);
      } else {
        setText(currentCmd.substring(0, text.length + (isDeleting ? -1 : 1)));
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, cmdIndex]);

  return <span className="text-gray-300 ml-2 font-mono">{text}</span>;
}

const RED_ATTACKS = [
  "SQL Injection",
  "Cross-Site Scripting (XSS)",
  "Authentication Bypass",
  "System Exploitation",
];

const BLUE_DEFENSES = [
  "Threat Detection",
  "Vulnerability Patching",
  "Access Control",
  "Incident Response",
];

// --- Unified Animation Hook ---
function useAnimations() {
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal-up");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-8");
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealElements.forEach((el) => revealObserver.observe(el));

    const staggerElements = document.querySelectorAll(".reveal-stagger");
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const index = Array.from(staggerElements).indexOf(e.target);
            (e.target as HTMLElement).style.transitionDelay = `${index * 150}ms`;
            
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-12");
            staggerObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    staggerElements.forEach((el) => staggerObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      staggerObserver.disconnect();
    };
  }, []);
}

// --- NEW: Interactive Tilt & Spotlight Card Component ---
function InteractiveTiltCard({ children, glowColor, delayClass }: { children: React.ReactNode, glowColor: string, delayClass: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
    setIsHovered(true);

    // Calculate rotation (-5 to +5 degrees based on cursor position)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5; 
    const rotateY = ((x - centerX) / centerX) * 5;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className={`reveal-up opacity-0 translate-y-8 transition-all duration-1000 ease-out ${delayClass}`} style={{ perspective: "1000px" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 overflow-hidden"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: isHovered ? "none" : "transform 0.5s ease-out",
          transformStyle: "preserve-3d" // Allows inner elements to pop out in 3D
        }}
      >
        {/* Dynamic Spotlight Gradient that follows the cursor */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`
          }}
        />
        
        {/* Card Content - Popped out slightly in 3D space for parallax effect */}
        <div className="relative z-10 transition-transform duration-300 ease-out" style={{ transform: isHovered ? "translateZ(30px)" : "translateZ(0px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useAnimations();

  return (
    <div className="bg-[#030303] text-[#f2f2f2] font-sans min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ── ANIMATED GRID BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.2] animate-gridFlicker" 
           style={{ backgroundImage: 'linear-gradient(to right, #666 1px, transparent 1px), linear-gradient(to bottom, #666 1px, transparent 1px)', backgroundSize: '4rem 4rem', maskImage: 'radial-gradient(circle at center, black, transparent 90%)' }} />

      {/* ── REDESIGNED FLOATING NAV (TACTICAL PILL) ── */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-full w-[95%] max-w-5xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        
        {/* Logo */}
        <a href="/" className="group flex items-center gap-3 select-none">
          {/* Live Threat Indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3333] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3333]"></span>
          </span>
          {/* Typographic Logo - No Spaces */}
          <span className="font-mono text-sm tracking-widest uppercase text-white group-hover:text-gray-300 transition-colors">
            breach<span className="text-[#00ccff]">@</span>trix
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-[10px] lg:text-xs font-mono tracking-[0.2em] uppercase text-gray-500">
          <a href="#about" className="group flex items-center gap-2 hover:text-white transition-colors">
            <span className="text-[#00ccff] opacity-0 group-hover:opacity-100 transition-opacity">/</span>
            Sys.Intel
          </a>
          <a href="#teams" className="group flex items-center gap-2 hover:text-white transition-colors">
            <span className="text-[#00ccff] opacity-0 group-hover:opacity-100 transition-opacity">/</span>
            Teams
          </a>
          <a href="#rules" className="group flex items-center gap-2 hover:text-white transition-colors">
            <span className="text-[#00ccff] opacity-0 group-hover:opacity-100 transition-opacity">/</span>
            Protocol
          </a>
        </div>

        {/* CTA Button */}
        <a
          href="/login"
          className="group relative flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,204,255,0.4)]"
        >
          {/* Hover color shift effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-[#00ccff] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full z-0"></span>
          
          <span className="relative z-10 flex items-center gap-2">
            Login
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
          </span>
        </a>

        {/* Mobile Menu Toggle (Hamburger) - Only shows on small screens */}
        <button className="md:hidden text-gray-400 hover:text-white p-2 ml-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </nav>

      {/* ── REDESIGNED HERO (THREAT NETWORK & HUD) ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-20 overflow-hidden bg-[#050505]">
        
        {/* 1. New Background: Cyber Grid & Active Threat Network */}
        <div className="absolute inset-0 z-0">
          {/* Perspective Data Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ccff10_1px,transparent_1px),linear-gradient(to_bottom,#00ccff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
          
          {/* Live Node Network */}
          {mounted && <ThreatNetwork />}
        </div>

        {/* 2. HUD Radar Rings (Subtle backdrop overlay) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40">
          <div className="relative w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] md:max-w-[1000px] md:max-h-[1000px]">
            {/* Outer rotating dashed ring */}
            <div className="absolute inset-0 rounded-full border border-[#00ccff]/20 border-dashed animate-[spin_60s_linear_infinite]"></div>
            {/* Inner reverse rotating solid ring */}
            <div className="absolute inset-8 md:inset-16 rounded-full border border-white/5 animate-[spin_40s_linear_infinite_reverse] shadow-[inset_0_0_80px_rgba(255,51,51,0.03)]"></div>
          </div>
        </div>

        {/* 3. HUD Telemetry Elements (Edges of Screen) */}
        <div className="absolute left-4 md:left-10 top-1/3 flex flex-col gap-2 font-mono text-[9px] text-[#00ccff]/70 tracking-widest uppercase pointer-events-none hidden sm:flex z-10">
          <span>SYS.OP.VOL: <span className="text-white animate-pulse">NOMINAL</span></span>
          <span>NET.TRAFFIC: 8.4TB/S</span>
          <span>LAT: 28.6139° N</span>
          <span>LON: 77.2090° E</span>
          {/* Cyan Data Line */}
          <div className="w-px h-24 bg-gradient-to-b from-[#00ccff]/50 to-transparent mt-4"></div>
        </div>

        <div className="absolute right-4 md:right-10 bottom-1/3 flex flex-col gap-2 font-mono text-[9px] text-[#ff3333]/70 tracking-widest uppercase text-right items-end pointer-events-none hidden sm:flex z-10">
          {/* Red Data Line */}
          <div className="w-px h-24 bg-gradient-to-t from-[#ff3333]/50 to-transparent mb-4"></div>
          <span>THREAT LEVEL: <span className="text-white animate-pulse">ELEVATED</span></span>
          <span>DEF_PROTOCOLS: ENGAGED</span>
          <span>SANDBOX: ISOLATED</span>
        </div>

        {/* 4. Main Foreground Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center mt-10 pointer-events-none">
          
          {/* Top Badge */}
          <div className="reveal-up opacity-0 translate-y-8 transition-all duration-1000 ease-out flex items-center gap-4 mb-8">
            <span className="hidden md:block w-12 h-[1px] bg-gradient-to-r from-transparent to-[#00ccff]/50"></span>
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-none border border-[#00ccff]/30 bg-[#00ccff]/5 text-[10px] text-[#00ccff] font-mono uppercase tracking-[0.3em] backdrop-blur-sm shadow-[0_0_20px_rgba(0,204,255,0.15)]">
              <span className="w-1.5 h-1.5 bg-[#00ccff] animate-ping"></span>
              Ordin@trix 26.0
            </div>
            <span className="hidden md:block w-12 h-[1px] bg-gradient-to-l from-transparent to-[#00ccff]/50"></span>
          </div>

          {/* Clean, Sharp Title */}
          <div className="relative mb-12" ref={headlineRef}>
            <h1 className="relative font-black text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] tracking-tighter text-white uppercase select-none" style={{ textShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              <span className="block text-xl md:text-3xl text-gray-400 tracking-[0.3em] font-light mb-4 animate-pulse">Secure The</span>
              <span className="relative inline-block text-white">
                Mainframe<span className="text-[#ff3333]">.</span>
              </span>
            </h1>
          </div>
          
          {/* Subtitle in Targeting Brackets */}
          <div className="relative p-8 md:p-12 w-full max-w-4xl mx-auto reveal-up opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-[1.5s] backdrop-blur-md bg-black/40 border border-white/5 pointer-events-auto">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00ccff]/50"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00ccff]/50"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00ccff]/50"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00ccff]/50"></div>
            
           <p className="text-base md:text-xl text-gray-300 font-light tracking-wide leading-relaxed mx-auto">
  A cybersecurity showdown for Classes IX–XII, where teams of two battle through live exploits and <span className="inline-block mt-2 md:mt-0 font-mono text-[0.85em] text-[#00ccff] bg-[#00ccff]/10 px-3 py-1 rounded border border-[#00ccff]/30 mx-1 shadow-[0_0_10px_rgba(0,204,255,0.2)]">attack vs defense</span> challenges.
</p>
          </div>

          {/* Automated Scroll Line */}
          <a href="#about" className="reveal-up opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-[2s] group flex flex-col items-center gap-4 mt-16 cursor-pointer pointer-events-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 group-hover:text-[#00ccff] transition-colors">Commence Briefing</span>
            <div className="w-px h-16 bg-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#00ccff] to-transparent animate-[scan_2s_ease-in-out_infinite]">
                 <style>{`
                  @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                  }
                `}</style>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="about" className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          {[
  { num: "01", title: "Compete", desc: "Face against other schools in a competitive cybersecurity arena." },
  { num: "02", title: "Live Combat", desc: "Real-time attack vs defense in a controlled environment." },
  { num: "50K", title: "Prizes", desc: "Trophies, certifications, and industry exposure." }
].map((stat, i) => (
  <div key={i} className="reveal-stagger opacity-0 translate-y-12 transition-all duration-1000 ease-out relative flex flex-col items-center text-center">
    <span
      className="text-[12rem] md:text-[14rem] leading-none font-extrabold text-transparent absolute -top-16 md:-top-20 z-0 select-none opacity-10"
      style={{ WebkitTextStroke: '2px #ffffff' }}
    >
      {stat.num}
    </span>
    <div className="relative z-10 mt-16">
      <h3 className="text-2xl font-semibold mb-3 tracking-wide">{stat.title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
        {stat.desc}
      </p>
    </div>
  </div>
))}
        </div>
      </section>

      {/* ── DIVISIONS (NOW WITH INTERACTIVE HOVER) ── */}
      <section id="teams" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a] to-transparent z-0"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-24 reveal-up opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-light tracking-tight mb-4">Choose Your Vector</h2>
            <p className="text-gray-400 text-lg">Two disciplines. One objective. Specify your approach.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            
            {/* INTERACTIVE RED TEAM CARD */}
            <InteractiveTiltCard glowColor="rgba(255, 51, 51, 0.15)" delayClass="delay-100">
              <div className="w-12 h-12 bg-[#ff3333]/10 border border-[#ff3333]/30 text-[#ff3333] rounded-lg flex items-center justify-center text-xl mb-8 transition-transform group-hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h3 className="text-3xl font-semibold mb-2 tracking-wide">Offensive Security</h3>
              <p className="text-[#ff3333] text-xs font-bold font-mono tracking-[0.2em] uppercase mb-6 group-hover:animate-pulse">Red Team Division</p>
              <p className="text-gray-400 leading-relaxed mb-12 text-sm md:text-base font-light">
                Infiltrate the architecture. Identify critical vulnerabilities, bypass authentication protocols, and extract data before the opposition can respond.
              </p>
              <ul className="space-y-4">
                {RED_ATTACKS.map((a) => (
                  <li key={a} className="flex items-center gap-4 text-sm font-medium text-gray-300">
                    <span className="w-1 h-1 rounded-full bg-[#ff3333] group-hover:animate-pulse"></span>
                    {a}
                  </li>
                ))}
              </ul>
            </InteractiveTiltCard>

            {/* INTERACTIVE BLUE TEAM CARD */}
            <InteractiveTiltCard glowColor="rgba(0, 204, 255, 0.15)" delayClass="delay-200">
              <div className="w-12 h-12 bg-[#00ccff]/10 border border-[#00ccff]/30 text-[#00ccff] rounded-lg flex items-center justify-center text-xl mb-8 transition-transform group-hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 className="text-3xl font-semibold mb-2 tracking-wide">Defensive Architecture</h3>
              <p className="text-[#00ccff] text-xs font-bold font-mono tracking-[0.2em] uppercase mb-6 group-hover:animate-pulse">Blue Team Division</p>
              <p className="text-gray-400 leading-relaxed mb-12 text-sm md:text-base font-light">
                Fortify the network. Monitor live traffic anomalies, deploy rapid security patches, and maintain system integrity under heavy adversarial fire.
              </p>
              <ul className="space-y-4">
                {BLUE_DEFENSES.map((d) => (
                  <li key={d} className="flex items-center gap-4 text-sm font-medium text-gray-300">
                    <span className="w-1 h-1 rounded-full bg-[#00ccff] group-hover:animate-pulse"></span>
                    {d}
                  </li>
                ))}
              </ul>
            </InteractiveTiltCard>

          </div>
        </div>
      </section>

      {/* ── REDESIGNED PROTOCOL (TERMINAL UI) ── */}
      <section id="rules" className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto reveal-up opacity-0 translate-y-8 transition-all duration-1000 ease-out">

          <div className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
            <div>
              <p className="text-[#00ccff] text-xs font-bold font-mono tracking-[0.2em] uppercase mb-4 animate-pulse">System Parameters</p>
              <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-light tracking-tight">Engagement <span className="font-medium">Protocol</span></h2>
            </div>
            <div className="hidden md:flex items-center gap-3 text-gray-500 font-mono text-xs border border-white/10 px-5 py-2.5 rounded-full bg-white/[0.02]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffcc] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffcc]"></span>
              </span>
              SYSTEM LIVE // v.2026.01
            </div>
          </div>

          {/* Terminal/Console Window */}
          <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            
            {/* Terminal Header with macOS Buttons */}
            <div className="bg-[#111111] border-b border-white/5 px-4 py-3 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-inner"></div>
              </div>
              <p className="text-gray-500 font-mono text-[10px] tracking-wider md:mr-8">root@breachtrix:~/protocol</p>
              <div className="w-12"></div> {/* Spacer to center the title slightly */}
            </div>

            {/* Terminal Body */}
            <div className="p-6 md:p-10 bg-[#0a0a0a]">
              <p className="text-gray-400 font-mono text-sm mb-8 select-none">
                <span className="text-[#00ccff] font-bold">root@breachtrix</span>:<span className="text-white">~</span>$ cat engagement_rules.sys
              </p>

              <div className="space-y-3 relative">
                {RULES.map((rule, i) => (
                  <div
                    key={rule.id}
                    className="group relative flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-5 rounded-xl border border-transparent hover:border-white/5 transition-all duration-500 ease-out overflow-hidden reveal-stagger opacity-0 translate-y-8"
                  >
                    {/* Hover Effect: Cyber Scanline Wash */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ccff]/[0.03] via-transparent to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out z-0"></div>

                    {/* Hover Effect: Active Left Bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00ccff] to-[#ff3333] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-l-xl z-10"></div>

                    <div className="relative z-10 flex items-center gap-4 md:w-48 shrink-0 group-hover:translate-x-2 transition-transform duration-300 ease-out">
                      <span className="text-gray-600 font-mono text-xs">[{rule.id}]</span>
                      <span className={`text-[10px] font-bold font-mono tracking-[0.15em] uppercase px-2.5 py-1 rounded border ${
                        rule.tag === 'CRITICAL' ? 'bg-[#ff3333]/10 border-[#ff3333]/30 text-[#ff3333]' : 
                        rule.tag === 'MANDATORY' ? 'bg-[#00ccff]/10 border-[#00ccff]/30 text-[#00ccff]' : 
                        'bg-white/5 border-white/10 text-gray-400'
                      }`}>
                        {rule.tag}
                      </span>
                    </div>

                    <div className="relative z-10 flex-1 group-hover:translate-x-2 transition-transform duration-300 delay-75 ease-out">
                      <span className="text-gray-400 font-mono tracking-wide text-sm leading-relaxed group-hover:text-[#f2f2f2] transition-colors">{rule.text}</span>
                      {/* Hover Effect: Blinking Terminal Cursor */}
                      <span className="inline-block w-2 h-3.5 bg-[#00ccff] ml-2 opacity-0 group-hover:opacity-100 animate-pulse align-middle transition-opacity"></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Animated Commands */}
              <p className="text-gray-400 font-mono text-sm mt-10 select-none">
                <span className="text-[#00ccff] font-bold">root@breachtrix</span>:<span className="text-white">~</span>$ 
                <TerminalTypewriter />
                <span className="inline-block w-2 h-4 bg-white/70 align-middle animate-pulse ml-1"></span>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── REDESIGNED CTA (SECURITY CHECKPOINT) ── */}
      <section className="relative py-48 px-6 flex justify-center items-center border-t border-white/5 overflow-hidden">
        
        {/* Ambient Background Grid & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5 }}></div>

        {/* The Main Container - Uses 'group' to trigger nested hover states */}
        <div className="group relative z-10 max-w-4xl w-full flex flex-col items-center reveal-up opacity-0 translate-y-8 transition-all duration-1000 ease-out p-12 md:p-20">
          
          {/* Cyber Targeting Brackets (Corners) */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/20 group-hover:border-[#00ccff] group-hover:scale-110 transition-all duration-500 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/20 group-hover:border-[#00ccff] group-hover:scale-110 transition-all duration-500 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/20 group-hover:border-[#00ccff] group-hover:scale-110 transition-all duration-500 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/20 group-hover:border-[#00ccff] group-hover:scale-110 transition-all duration-500 rounded-br-xl"></div>

          {/* Scanner Laser Line (Activates on Hover) */}
          <div className="absolute left-0 right-0 h-[1px] bg-[#00ccff] shadow-[0_0_15px_#00ccff] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50"
               style={{ top: '50%', animation: 'scan 2s ease-in-out infinite alternate' }}>
            <style>{`
              @keyframes scan {
                0% { transform: translateY(-100px); }
                100% { transform: translateY(100px); }
              }
            `}</style>
          </div>

          {/* Dynamic Status Indicator */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#ff3333]/30 bg-[#ff3333]/10 text-[#ff3333] font-mono text-xs uppercase tracking-widest mb-10 transition-all duration-500 group-hover:border-[#00ccff]/50 group-hover:bg-[#00ccff]/10 group-hover:text-[#00ccff] group-hover:shadow-[0_0_20px_rgba(0,204,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#ff3333] animate-pulse group-hover:bg-[#00ccff]"></span>
            <span className="group-hover:hidden">Status: Clearance Pending</span>
            <span className="hidden group-hover:inline animate-glitch">Status: Access Granted</span>
          </div>

          {/* Headline */}
          <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-light tracking-tighter mb-4 text-center leading-[1.1]">
            Awaiting <br className="md:hidden" />
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 group-hover:from-white group-hover:to-[#00ccff] transition-all duration-500">Authorization.</span>
          </h2>

          <p className="text-gray-500 font-mono text-sm mb-12 tracking-widest uppercase">
            [ Action Required: Authenticate to proceed ]
          </p>
          
          {/* High-Tech Button */}
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSeEX8W68tbjlwDC-JaL4CULsdJVzkRGnNUejIlj53DnC4l71Q/viewform" className="relative inline-flex items-center justify-center overflow-hidden border border-white/20 bg-[#050505] px-10 py-5 text-sm md:text-base font-mono uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-[#00ccff] hover:shadow-[0_0_40px_rgba(0,204,255,0.3)] group/btn">
            {/* Button background fill effect */}
            <span className="absolute inset-0 bg-[#00ccff]/10 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out z-0"></span>
            
            <span className="relative z-10 flex items-center gap-4">
              Initiate Sequence
              <svg className="group-hover/btn:translate-x-2 transition-transform duration-300" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </a>

          {/* Decorative Hex Data */}
          <div className="absolute bottom-6 right-6 text-gray-700 font-mono text-[10px] hidden md:block opacity-50 select-none">
            0x00F8 0x11A2<br/>0xCC41 0x99B0
          </div>
          <div className="absolute top-6 left-6 text-gray-700 font-mono text-[10px] hidden md:block opacity-50 select-none">
            SYS.REQ.AUTH<br/>NET: SECURE
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#000]">
        <div className="text-sm tracking-widest font-bold uppercase text-gray-500">
          Breach<span className="text-white font-mono animate-pulse">@</span>Trix
        </div>
        <div className="text-xs tracking-wider text-gray-700 uppercase font-mono animate-glitch">
          © 2026 Ordin@trix • End of Transmission
        </div>
      </footer>
    </div>
  );
}