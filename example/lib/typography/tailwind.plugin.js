/** Add to tailwind.config.js */
const plugin = require('tailwindcss/plugin');

module.exports = {
  theme: {
    extend: {}
  },
  plugins: [
    plugin(function({ addUtilities, theme }) {
      const vars = {
        '.t-display': {
          fontSize: 'var(--size-display)',
          lineHeight: '1.2',
          fontWeight: '700',
          letterSpacing: '-0.01em'
        },
        '.t-headline': {
          fontSize: 'var(--size-headline)',
          lineHeight: '1.25',
          fontWeight: '600'
        },
        '.t-title': {
          fontSize: 'var(--size-title)',
          lineHeight: '1.25',
          fontWeight: '600'
        },
        '.t-body': {
          fontSize: 'var(--size-body)',
          lineHeight: '1.5'
        },
        '.t-label': {
          fontSize: 'var(--size-label)',
          lineHeight: '1.3',
          fontWeight: '500'
        }
      };
      addUtilities(vars, ['responsive']);
    })
  ]
};