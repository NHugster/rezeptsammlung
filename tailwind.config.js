/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans:  ['Manrope', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg:            'var(--bg)',
        surface:       'var(--surface)',
        fg:            'var(--fg)',
        'fg-soft':     'var(--fg-soft)',
        muted:         'var(--muted)',
        accent:        'var(--accent)',
        'accent-deep': 'var(--accent-deep)',
        'accent-soft': 'var(--accent-soft)',
        'accent-fg':   'var(--accent-fg)',
      },
      fontSize: {
        '10': ['10px', { lineHeight: '12px' }],
        '11': ['11px', { lineHeight: '14px' }],
        '13': ['13px', { lineHeight: '18px' }],
        '15': ['15px', { lineHeight: '21px' }],
        '17': ['17px', { lineHeight: '1.15' }],
        '28': ['28px', { lineHeight: '1.05' }],
        '38': ['38px', { lineHeight: '1.0' }],
      },
    },
  },
  plugins: [],
}
