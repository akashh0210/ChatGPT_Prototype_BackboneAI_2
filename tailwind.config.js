/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ─── ChatGPT chrome: pure neutral grays, no blue tint ─── */
        'bg-primary': '#212121',   // main pane
        'bg-secondary': '#181818', // sidebar
        'bg-composer': '#303030',  // composer pill + user bubble
        'bg-hover': '#2F2F2F',     // row hover
        'bg-raised': '#2A2A2A',    // cards on top of main pane
        'bg-sunken': '#232323',    // nested card
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-strong': 'rgba(255,255,255,0.16)',
        'text-primary': '#ECECEC',
        'text-secondary': '#AFAFAF',
        'text-muted': '#8F8F8F',
        'accent-blue': '#3A7DE8',      // voice button fill
        'accent-blue-text': '#5DA2FF', // Upgrade label

        /* ─── Backbone signal colors: the only saturation on screen ─── */
        'green-accent': '#10A37F',
        'red-orange': '#D97757',
        'amber-accent': '#E5A155',
        'blue-accent': '#5B8DBE',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        body: ['16px', { lineHeight: '1.7' }],
      },
      borderRadius: {
        composer: '28px',
      },
    },
  },
  plugins: [],
}
