/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#212121',
        'bg-secondary': '#171717',
        'bg-tertiary': '#2F2F3A',
        'card-top': '#2A2B32',
        'card-bottom': '#25262C',
        'card-border': '#353641',
        'border-subtle': '#2D2D3A',
        'text-primary': '#ECECF1',
        'text-secondary': '#B4B4B4',
        'text-muted': '#8A8A8A',
        'green-accent': '#10A37F',
        'red-orange': '#D97757',
        'amber-accent': '#E5A155',
        'blue-accent': '#5B8DBE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        body: ['15px', { lineHeight: '1.65' }],
      },
    },
  },
  plugins: [],
}
