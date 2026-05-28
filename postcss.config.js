/** @type {import('postcss').ProcessOptions} */
export default {
  plugins: {
    // Tailwind v4 (@tailwindcss/postcss) gère le préfixage via Lightning CSS ;
    // autoprefixer n'est plus nécessaire (cf. docs Tailwind v4).
    '@tailwindcss/postcss': {},
  },
};
