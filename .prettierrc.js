/** @type {import('prettier').Config} */
const prettierConfig = {
  // Core formatting
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',

  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Line length
  printWidth: 80,

  // JSX
  jsxSingleQuote: false,

  // Prose
  proseWrap: 'preserve',

  // HTML
  htmlWhitespaceSensitivity: 'css',

  // End of line
  endOfLine: 'lf',

  // Embedded languages
  embeddedLanguageFormatting: 'auto',

  // Plugins
  plugins: ['prettier-plugin-tailwindcss'],

  // Plugin options
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'tw'],

  // File overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
    {
      files: '*.{yaml,yml}',
      options: {
        singleQuote: false,
      },
    },
  ],
};

export default prettierConfig;
