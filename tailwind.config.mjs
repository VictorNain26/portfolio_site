/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-sora)', 'sans-serif'],
      },
      /* ─── Couleurs pilotées par les variables CSS ─── */
      colors: {
        /* bases */
        background:           'hsl(var(--background) / <alpha-value>)',
        foreground:           'hsl(var(--foreground) / <alpha-value>)',

        /* composants */
        card:                 'hsl(var(--card) / <alpha-value>)',
        'card-foreground':    'hsl(var(--card-foreground) / <alpha-value>)',
        popover:              'hsl(var(--popover) / <alpha-value>)',
        'popover-foreground': 'hsl(var(--popover-foreground) / <alpha-value>)',

        primary:              'hsl(var(--primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
        secondary:            'hsl(var(--secondary) / <alpha-value>)',
        'secondary-foreground':
                               'hsl(var(--secondary-foreground) / <alpha-value>)',

        muted:                'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground':   'hsl(var(--muted-foreground) / <alpha-value>)',

        accent:               'hsl(var(--accent) / <alpha-value>)',
        'accent-foreground':  'hsl(var(--accent-foreground) / <alpha-value>)',

        destructive:          'hsl(var(--destructive) / <alpha-value>)',

        /* indispensables pour `border-border`, `ring-ring`… */
        border:               'hsl(var(--border) / <alpha-value>)',
        input:                'hsl(var(--input) / <alpha-value>)',
        ring:                 'hsl(var(--ring) / <alpha-value>)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
