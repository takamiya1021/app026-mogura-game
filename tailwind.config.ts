import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        meadow: {
          100: "#f6fee6",
          200: "#e5f9c5",
          300: "#c4f082",
          400: "#9adb4d",
        },
        earth: {
          500: "#8b4b2f",
          600: "#6a3822",
        },
        mole: {
          body: "#503431",
          belly: "#f4d7c5",
          nose: "#ff6b6b",
        },
      },
      boxShadow: {
        mound: "inset 0 8px 0 rgba(0,0,0,0.18), inset 0 -10px 0 rgba(0,0,0,0.1)",
        badge: "0 12px 24px rgba(0, 0, 0, 0.2)",
      },
      keyframes: {
        "mole-pop": {
          "0%": { transform: "translateY(70%) scale(0.6)", opacity: "0" },
          "60%": { transform: "translateY(-6%) scale(1.05)", opacity: "1" },
          "100%": { transform: "translateY(0%) scale(1)", opacity: "1" },
        },
        "hit-bounce": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "score-pop": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "70%": { transform: "translateY(-12px)", opacity: "0.2" },
          "100%": { transform: "translateY(-16px)", opacity: "0" },
        },
      },
      animation: {
        "mole-pop": "mole-pop 260ms ease-out forwards",
        "hit-bounce": "hit-bounce 400ms ease-out",
        "score-pop": "score-pop 500ms ease-out",
      },
      backgroundImage: {
        "sunburst":
          "radial-gradient(circle at top, rgba(255,255,255,0.8), rgba(255,255,255,0) 60%), linear-gradient(135deg, #c4f082 0%, #7ed956 50%, #4cc48d 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

