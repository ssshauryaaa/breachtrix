/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        gridFlicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
        typewriter: {
          to: { left: "100%" },
        },
        glitch: {
          "0%": { textShadow: "0.5px 0 0 #00ffff, -0.5px 0 0 #ff00ff" },
          "100%": { textShadow: "1px 0 0 #00ffff, -1px 0 0 #ff00ff" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,255,255, 0.2), 0 0 20px rgba(255,255,255, 0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(255,255,255, 0.6), 0 0 40px rgba(255,255,255, 0.3)' },
        },
      },
      animation: {
        gridFlicker: 'gridFlicker 3s infinite',
        typewriter: "typewriter 1.5s steps(20) forwards 0.5s", // delayed start
        glitch: "glitch 0.4s infinite alternate-reverse",
        float: "float 6s ease-in-out infinite",
        floatDelayed: "float 6s ease-in-out infinite 3s",
        glowPulse: 'glowPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};