/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#08080c',
          card: '#11111c',
          border: 'rgba(255, 255, 255, 0.08)',
          indigo: '#6366f1',
          purple: '#818cf8',
          text: '#ffffff',
          muted: 'rgba(255, 255, 255, 0.6)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
