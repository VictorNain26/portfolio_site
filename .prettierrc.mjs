/** @type {import('prettier').Config} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  printWidth: 100,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    { files: '*.astro', options: { parser: 'astro' } },
    { files: '*.md', options: { proseWrap: 'always', printWidth: 80 } },
  ],
};
