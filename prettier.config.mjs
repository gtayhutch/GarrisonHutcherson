// Prettier with Google's gts settings (STY-01; values copied from gts).
// plus the Astro plugin for .astro files.
export default {
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  plugins: ['prettier-plugin-astro'],
  overrides: [{files: '*.astro', options: {parser: 'astro'}}],
};
