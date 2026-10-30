/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Craft Docs design system — Craft.do sky aesthetic
        canvas:     '#bcdff0',  // now sky blue (body bg)
        ink:        '#030302',
        white:      '#ffffff',
        linen:      '#f5f5f5',
        cloud:      '#efefef',
        ash:        '#e0e0e0',
        stone:      '#9e9e9e',
        graphite:   '#424242',
        mint:       '#9bd8a9',
        marigold:   '#fde99b',
        periwinkle: '#b8caf5',
        sky:        '#9ed4ef',
        'sky-base': '#bcdff0',
        'sky-light':'#d8eef8',
        'sky-pale': '#e9f5fb',
        papaya:     '#ef4444',
        azure:      '#0087ff',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans:  ['Figtree', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'caption':    ['12px',  { lineHeight: '1.5',  letterSpacing:  '0.12px'  }],
        'body-sm':    ['14px',  { lineHeight: '1.5',  letterSpacing:  '0.14px'  }],
        'body':       ['16px',  { lineHeight: '1.5',  letterSpacing: '-0.24px'  }],
        'subheading': ['24px',  { lineHeight: '1.4',  letterSpacing: '-0.72px'  }],
        'heading-sm': ['36px',  { lineHeight: '1.2',  letterSpacing: '-0.72px'  }],
        'heading':    ['46px',  { lineHeight: '1.1',  letterSpacing: '-1.38px'  }],
        'heading-lg': ['56px',  { lineHeight: '1.05', letterSpacing: '-2.24px'  }],
        'display':    ['66px',  { lineHeight: '1.1',  letterSpacing: '-2.64px'  }],
      },
      borderRadius: {
        'xl':   '14px',
        '2xl':  '20px',
        '3xl':  '24px',
        '4xl':  '32px',
        'pill': '9999px',
      },
      boxShadow: {
        'craft-xl':     'rgba(0,0,0,0.01) 0px 50px 40px 0px, rgba(0,0,0,0.02) 0px 50px 40px 0px, rgba(0,0,0,0.05) 0px 20px 40px 0px, rgba(0,0,0,0.08) 0px 3px 10px 0px',
        'craft-md':     'rgba(0,0,0,0.1) 0px 12px 12px 2px, rgba(0,0,0,0.06) 0px 2px 4px -1px',
        'craft-sm':     'rgba(0,0,0,0.1) 0px 4px 6px -1px, rgba(0,0,0,0.1) 0px 2px 4px -2px',
        'craft-subtle': 'rgba(0,0,0,0.1) 0px 1px 3px 0px, rgba(0,0,0,0.1) 0px 1px 2px -1px',
        'craft-md2':    'rgba(0,0,0,0.08) 0px 4px 16px 0px',
        'craft-md3':    'rgba(0,0,0,0.1) 0px 4px 12px 0px',
      },
      spacing: {
        '18': '72px',
      },
      animation: {
        'fade-in':  'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
