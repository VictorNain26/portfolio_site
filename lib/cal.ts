/* Chemin public de l'événement Cal.com (namespace/type d'événement) et origine
 * de la page de réservation. Partagés par le loader d'embed et les CTA. */
export const CAL_LINK = 'victor-lenain-ejsjfb/echange-decouverte';
export const CAL_ORIGIN = 'https://cal.com';
export const CAL_URL = `${CAL_ORIGIN}/${CAL_LINK}?theme=dark&layout=month_view`;

/* Le Booker vit dans une iframe cross-origin : la seule prise de style est le
 * jeu de variables CSS documenté, transmis via `Cal("ui", { cssVarsPerTheme })`.
 * Les valeurs reprennent les tokens de `app/globals.css` — les surfaces et les
 * filets translucides du site sont aplatis sur l'encre `#0b0b1c`, parce que la
 * modale n'est pas posée sur le fond du site mais sur son propre calque.
 * Référence : https://cal.com/docs/developing/guides/embeds/customize-embed-css-variables
 */
const INK = '#0b0b1c'; // --color-background
const SURFACE_1 = '#101021'; // blanc 2 % aplati sur l'encre
const SURFACE_2 = '#121223'; // blanc 3 %
const SURFACE_4 = '#1a1a2a'; // blanc 6 %
const LINE_2 = '#1a1a2a'; // blanc 6 %
const LINE_3 = '#1f1f2e'; // blanc 8 %

const BRAND = '#4f46e5'; // --color-brand, indigo-600
const BRAND_HOVER = '#6366f1'; // --color-brand-hover, indigo-500
const BRAND_ACCENT = '#818cf8'; // --color-brand-accent, indigo-400
const WARM = '#fbbf24'; // --color-warm, amber-400

const FOREGROUND = '#f9fafb'; // --color-foreground
const MUTED_FOREGROUND = '#9ca3af'; // --color-muted-foreground
const DIM_FOREGROUND = '#6b7280'; // dates désactivées, placeholders

export const CAL_UI_CONFIG = {
  theme: 'dark',
  layout: 'month_view',
  hideEventTypeDetails: false,
  cssVarsPerTheme: {
    dark: {
      'cal-brand': BRAND,
      'cal-brand-emphasis': BRAND_HOVER,
      'cal-brand-text': '#ffffff',
      'cal-brand-subtle': BRAND_ACCENT,
      'cal-brand-accent': '#ffffff',

      'cal-text': FOREGROUND,
      'cal-text-emphasis': '#ffffff',
      'cal-text-subtle': MUTED_FOREGROUND,
      'cal-text-muted': DIM_FOREGROUND,
      'cal-text-inverted': INK,

      'cal-bg': INK,
      'cal-bg-subtle': SURFACE_2,
      'cal-bg-emphasis': SURFACE_4,
      'cal-bg-muted': SURFACE_1,
      'cal-bg-inverted': FOREGROUND,

      'cal-border': LINE_3,
      'cal-border-subtle': LINE_2,
      'cal-border-muted': '#151525',
      'cal-border-emphasis': BRAND_ACCENT, // anneau de focus, comme ring-brand-accent
      'cal-border-booker': LINE_3,
      'cal-border-booker-width': '1px',

      // Sémantique du site : ambre = attention, emerald = succès, indigo = info.
      'cal-text-info': BRAND_ACCENT,
      'cal-text-success': '#34d399',
      'cal-text-attention': WARM,
      'cal-text-error': '#f87171',
      'cal-text-semantic-info': BRAND_ACCENT,
      'cal-text-semantic-attention': WARM,
      'cal-text-semantic-error': '#f87171',
      'cal-bg-attention': '#2a2113',
      'cal-bg-error': '#2a1416',
      'cal-bg-semantic-info-subtle': '#171a2e',
      'cal-bg-semantic-attention-subtle': '#2a2113',
      'cal-bg-semantic-error-subtle': '#2a1416',
      'cal-border-error': '#7f1d1d',
      'cal-border-semantic-error': '#7f1d1d',
      'cal-border-semantic-error-subtle': '#3a1a1c',
      'cal-border-semantic-attention-subtle': '#3a2c14',

      radius: '0.5rem', // --radius
    },
    // Jamais employé — le thème est forcé en sombre. Présent pour que la marque
    // reste juste si l'embed retombait sur le thème clair.
    light: {
      'cal-brand': BRAND,
      'cal-brand-emphasis': BRAND_HOVER,
      'cal-brand-text': '#ffffff',
      radius: '0.5rem',
    },
  },
} as const;
