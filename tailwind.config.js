/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        che: {
          primary: '#0066cc',
          secondary: '#ff6600',
          dark: '#1a365d',
          light: '#f7fafc',
          accent: '#4a90e2',
          success: '#38a169',
          warning: '#d69e2e',
          error: '#e53e3e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'che': '0 4px 20px rgba(0, 102, 204, 0.15)',
        'che-lg': '0 10px 40px rgba(0, 102, 204, 0.2)',
      },
      borderRadius: {
        'che': '12px',
        'che-lg': '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
