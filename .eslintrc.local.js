// Overrides for local development - less strict rules for initial migration
module.exports = {
  extends: ['./eslint.config.js'],
  rules: {
    // Temporarily relax these rules during migration
    '@typescript-eslint/strict-boolean-expressions': 'warn',
    'no-magic-numbers': 'warn',
    'max-lines-per-function': 'warn',
    complexity: 'warn',
    'react/jsx-sort-props': 'warn',
    indent: 'off', // Let Prettier handle indentation
    'comma-dangle': 'off', // Let Prettier handle this
    quotes: 'off', // Let Prettier handle this
    semi: 'off', // Let Prettier handle this
    'object-curly-spacing': 'off', // Let Prettier handle this
    'no-trailing-spaces': 'off', // Let Prettier handle this
    'line-comment-position': 'warn',
    'react/jsx-pascal-case': 'warn',
    'quote-props': 'warn',
  },
};
