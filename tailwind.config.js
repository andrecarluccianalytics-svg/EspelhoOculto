/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sang: { DEFAULT: '#FFD54F', dark: '#F9A825', light: '#FFF8E1' },
        col:  { DEFAULT: '#E53935', dark: '#B71C1C', light: '#FFEBEE' },
        mel:  { DEFAULT: '#1E88E5', dark: '#0D47A1', light: '#E3F2FD' },
        fleu: { DEFAULT: '#43A047', dark: '#1B5E20', light: '#E8F5E9' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

