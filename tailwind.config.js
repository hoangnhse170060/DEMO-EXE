/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // New Museum Color Palette
        'museum': {
          'beige': '#F1EEE1',      // Light Beige Background
          'gray': '#CCCCCC',       // Neutral Gray
          'black': '#171717',      // Deep Black
          'accent': '#FFC061',     // Warm Accent Yellow
        },
        'brand-base': '#000000ff',
        'brand-sand': '#1A1A1A',
        'brand-blue': {
          DEFAULT: '#FFD700',
          50: '#FFFACD',
          100: '#FFEF99',
          200: '#FFE66D',
          300: '#FFDD41',
          400: '#FFD700',
          500: '#FFD700',
          600: '#FFC700',
          700: '#FFB700',
          800: '#FFA700',
          900: '#FF9500',
        },
        'brand-sky': '#FFD700',
        'brand-text': '#FFD700',
        'brand-muted': '#FFD700',
        'accent-gold': '#FFD700',
        white: '#FFFFFF',
        transparent: 'transparent',
        'charcoal': {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#8A8A8A',
          400: '#5C5C5C',
          500: '#2D2D2D',
          600: '#1F1F1F',
          700: '#161616',
          800: '#0D0D0D',
          900: '#0A0A0A',
        },
      },
      fontFamily: {
        'serif': ['Cormorant', 'Playfair Display', 'Georgia', 'serif'],
        'sans': ['Montserrat', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Cormorant', 'Cormorant Garamond', 'Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'shine': 'shine 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'shine': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(255, 215, 0, 0.1)',
        'medium': '0 4px 25px 0 rgba(23, 23, 23, 0.1)',
        'strong': '0 10px 40px 0 rgba(255, 215, 0, 0.2)',
        'brand': '0 4px 20px 0 rgba(255, 192, 97, 0.3)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(255, 215, 0, 0.1)',
        'gold-glow': '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)',
        'paper': '0 1px 3px rgba(23, 23, 23, 0.08), 0 4px 12px rgba(23, 23, 23, 0.04)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)',
        'gradient-dark-gold': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
      },
    },
  },
  plugins: [],
};
