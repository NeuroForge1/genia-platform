module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'genia-primary': '#67f8c0',
        'genia-secondary': '#0e0e0e',
        'genia-accent': '#ff6b6b',
        'genia-light': '#f5f5f5',
        'genia-dark': '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'genia': '0 4px 14px 0 rgba(103, 248, 192, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
