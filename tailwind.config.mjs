/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx,mdx}'],

  theme: {
    extend: {
      /* ───── Couleurs pilotées par des variables CSS ───── */
      colors: {
        /** fond principal (hero + pages) */
        background: 'hsl(var(--c-bg) / <alpha-value>)',
        /** fond du header : même teinte, +clair */
        header:     'hsl(var(--c-header) / <alpha-value>)',

        /** design-tokens shadcn/ui (nécessaires aux composants) */
        border:              'hsl(var(--c-border) / <alpha-value>)',
        input:               'hsl(var(--c-input) / <alpha-value>)',
        ring:                'hsl(var(--c-ring) / <alpha-value>)',

        card:                'hsl(var(--c-card) / <alpha-value>)',
        'card-foreground':   'hsl(var(--c-card-fg) / <alpha-value>)',
        popover:             'hsl(var(--c-popover) / <alpha-value>)',
        'popover-foreground':'hsl(var(--c-popover-fg) / <alpha-value>)',

        primary:             'hsl(var(--c-primary) / <alpha-value>)',
        'primary-foreground':'hsl(var(--c-primary-fg) / <alpha-value>)',
        secondary:           'hsl(var(--c-secondary) / <alpha-value>)',
        'secondary-foreground':
                              'hsl(var(--c-secondary-fg) / <alpha-value>)',

        muted:               'hsl(var(--c-muted) / <alpha-value>)',
        'muted-foreground':  'hsl(var(--c-muted-fg) / <alpha-value>)',

        accent:              'hsl(var(--c-accent) / <alpha-value>)',
        'accent-foreground': 'hsl(var(--c-accent-fg) / <alpha-value>)',

        destructive:         'hsl(var(--c-destructive) / <alpha-value>)',
      },

      /* polices */
      fontFamily: {
        sans:    ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-sora)',  'sans-serif'],
      },

      /* micro-animations */
      keyframes: {
        'fade-in':     { from:{opacity:0,transform:'translateY(4px)'},
                         to:{opacity:1,transform:'translateY(0)'} },
        gradient:      { '0%,100%':{backgroundPosition:'0% 50%'},
                         '50%':    {backgroundPosition:'100% 50%'} },
        'bounce-slow': { '0%,100%':{transform:'translateY(0)'},
                         '50%':    {transform:'translateY(-6px)'} },
      },
      animation: {
        'fade-in':'fade-in .5s ease both',
        gradient :'gradient 8s ease infinite',
        'bounce-slow':'bounce-slow 2s infinite',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
