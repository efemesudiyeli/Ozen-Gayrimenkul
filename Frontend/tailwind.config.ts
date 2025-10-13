
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
  theme: {
    extend: {
      colors: {
        anthracite: {
          100: 'var(--color-anthracite-100)',
          200: 'var(--color-anthracite-200)',
          300: 'var(--color-anthracite-300)',
          400: 'var(--color-anthracite-400)',
          500: 'var(--color-anthracite-500)',
          600: 'var(--color-anthracite-600)',
          700: 'var(--color-anthracite-700)',
          800: 'var(--color-anthracite-800)',
          900: 'var(--color-anthracite-900)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
    
  
      
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            h1: {
              fontSize: '2.25rem',
              fontWeight: '800',
              marginTop: '1.5em',
              marginBottom: '0.6em',
              lineHeight: '1.2',
              color: theme('colors.gray.900'),
            },
            h2: {
              fontSize: '1.875rem', 
              fontWeight: '700',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              color: theme('colors.gray.900'),
            },
            h3: {
              fontSize: '1.5rem',
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              color: theme('colors.gray.900'),
            },
            strong: {
              color: theme('colors.anthracite.900'),
            },
         },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config