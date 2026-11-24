import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080A",
          900: "#0B0D0F",
          850: "#101315",
          800: "#15181B",
          700: "#1C2024",
          600: "#262B30",
        },
        steel: {
          500: "#7C858D",
          400: "#9AA3AB",
          300: "#B9C0C6",
          200: "#D6DBDF",
          100: "#EDEFF0",
        },
        flame: {
          600: "#E8430A",
          500: "#FF5A1F",
          400: "#FF7A45",
          300: "#FF9F75",
        },
        safety: {
          500: "#FFB020",
          400: "#FFC24D",
        },
        success: "#3FB950",
        danger: "#F05252",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        cinematic: "0.22em",
      },
      maxWidth: {
        shell: "1440px",
      },
      boxShadow: {
        lift: "0 24px 60px -24px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(255,90,31,0.25), 0 18px 50px -22px rgba(255,90,31,0.45)",
        insetline: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
        "radial-flame":
          "radial-gradient(60% 60% at 70% 30%, rgba(255,90,31,0.22) 0%, rgba(255,90,31,0) 70%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        marquee: "marquee 34s linear infinite",
        float: "float 7s ease-in-out infinite",
        "pulse-line": "pulseLine 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
