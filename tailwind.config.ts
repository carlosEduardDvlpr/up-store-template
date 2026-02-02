import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import animate from 'tailwindcss-animate'
import aspectRatio from '@tailwindcss/aspect-ratio'
import typography from '@tailwindcss/typography'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        xsm: '390px',
        sm: '640px',
        md: '768px',
        '2xl': '1400px',
      },
    },
    extend: {
      fontWeight: {
        extralight: '100',
        light: '200', // Custom light weight
        base: '400', // Default base weight (can also keep existing)
        normal: '500', // Default weight (can also keep existing)
        medium: '600', // Custom medium weight
        semibold: '700', // Custom semibold weight
        bold: '800', // Default bold weight (can also keep existing)
        extrabold: '900', // Custom extra bold weight
        black: '900', // Default black weight (can also keep existing)
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        tiffany: {
          300: '#81d8d0',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },

        // AUTO SLIDER
        autoSlide: {
          from: { left: '100%' },
          to: { left: '-100%' },
        },
        reverseSlide: {
          from: { left: '-100%' },
          to: { left: '100%' },
        },
        slide: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(-100%)' },

          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',

        // AUTO SLIDER
        autoSlide: 'autoSlide 35s linear infinite',
        reverseSlide: 'reverseSlide 35s linear infinite',
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slide: 'slide 35s linear infinite',
      },
      spacing: {
        // AUTO SLIDER
        'slider-100': '100px',
        'slider-200': '200px',
      },
    },
  },
  plugins: [animate, forms, aspectRatio, typography],
} satisfies Config

export default config
