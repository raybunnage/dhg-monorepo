/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Modern blue palette
          50: '#EFF6FF',  // Lightest blue - great for backgrounds
          100: '#DBEAFE', // Very light blue - hover states
          200: '#BFDBFE', // Light blue - borders
          300: '#93C5FD', // Medium light blue
          400: '#60A5FA', // Primary blue - buttons, links
          500: '#3B82F6', // Core brand blue
          600: '#2563EB', // Darker blue - hover states
          700: '#1D4ED8', // Dark blue - active states
          800: '#1E40AF', // Very dark blue
          900: '#1E3A8A', // Darkest blue
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 