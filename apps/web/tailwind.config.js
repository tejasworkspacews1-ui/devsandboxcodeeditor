/*!
 * Developer: Tejas Kamble
 * Email: tejasksocials@gmail.com
 * Website: https://tejaskambleportfolio.vercel.app/
 * LinkedIn: https://www.linkedin.com/in/tejaskambleportfolio/
 * Instagram: @tejask.co.in
 * GitHub: https://github.com/tejasworkspacews1-ui
 *
 * Project Disclaimer:
 * All project data shown/accessed is completely legal, free and publicly
 * accessible data and not proprietary data.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ide: {
          bg: '#18181b',
          panel: '#1f1f23',
          sidebar: '#141416',
          border: '#27272a',
          hover: '#27272a',
          active: '#2e2e33',
          text: '#f4f4f5',
          textSecondary: '#a1a1aa',
          accent: '#3b82f6',
          accentHover: '#2563eb',
          error: '#f87171',
          warning: '#fbbf24',
          success: '#34d399',
          scrollbar: '#3f3f46',
          scrollbarHover: '#52525b',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

