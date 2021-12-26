// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./pages/**/*.tsx', './components/**/*.tsx', './layouts/**/*.tsx', './lib/**/*.ts'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        // @ts-ignore
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.teal,
        //@ts-ignore
        gray: colors.neutral, // TODO: Remove ts-ignore after tw types gets updated to v3
        moonlight: {
          desaturatedgray: '#7f85a3',
          darkblue: {
            DEFAULT: '#3E68D7',
            50: '#D6DFF7',
            100: '#C5D2F3',
            200: '#A3B7EC',
            300: '#829DE5',
            400: '#6082DE',
            500: '#3E68D7',
            600: '#264EB7',
            700: '#1C3A89',
            800: '#13265A',
            900: '#09132C',
          },
          blue: '#82aaff',
          skyblue: '#65bcff',
          cyan: {
            DEFAULT: '#86E1FC',
            50: '#FFFFFF',
            100: '#FFFFFF',
            200: '#FDFFFF',
            300: '#D6F5FE',
            400: '#AEEBFD',
            500: '#86E1FC',
            600: '#4FD3FB',
            700: '#19C6F9',
            800: '#05A5D4',
            900: '#047B9E',
          },
          red: '#ff757f',
          darkred: '#ff5370',
          lightred: {
            DEFAULT: '#FF98A4',
            50: '#FFFFFF',
            100: '#FFFFFF',
            200: '#FFFFFF',
            300: '#FFEAEC',
            400: '#FFC1C8',
            500: '#FF98A4',
            600: '#FF6072',
            700: '#FF2841',
            800: '#EF001C',
            900: '#B70015',
          },
          yellow: {
            DEFAULT: '#FFC777',
            50: '#FFFFFF',
            100: '#FFFFFF',
            200: '#FFF9F1',
            300: '#FFE9C9',
            400: '#FFD8A0',
            500: '#FFC777',
            600: '#FFB03F',
            700: '#FF9907',
            800: '#CE7900',
            900: '#965800',
          },
          orange: '#ff966c',
          darkorange: '#fc7b7b',
          teal: '#4fd6be',
          green: {
            DEFAULT: '#C3E88D',
            50: '#FFFFFF',
            100: '#FFFFFF',
            200: '#F9FDF3',
            300: '#E7F6D1',
            400: '#D5EFAF',
            500: '#C3E88D',
            600: '#AADF5E',
            700: '#92D530',
            800: '#73AA22',
            900: '#547C19',
          },
          purple: '#c099ff',
          pink: {
            DEFAULT: '#FCA7EA',
            50: '#FFFFFF',
            100: '#FFFFFF',
            200: '#FFFFFF',
            300: '#FFF6FD',
            400: '#FDCEF3',
            500: '#FCA7EA',
            600: '#FA71DD',
            700: '#F83AD0',
            800: '#F208C1',
            900: '#BC0696',
          },
          indigo: '#7a88cf',
          brightcyan: '#b4f9f8',
          gray: {
            900: '#b4c2f0',
            800: '#a9b8e8',
            700: '#828bb8',
            600: '#444a73',
            500: '#2f334d',
            400: '#222436',
            300: '#1e2030',
            200: '#191a2a',
            100: '#131421',
          },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.moonlight.green.900'),
              '&:hover': {
                color: theme('colors.moonlight.green.800'),
              },
              code: { color: theme('colors.moonlight.green.400') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.700'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.500'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            'h4,h5,h6': {
              color: theme('colors.gray.900'),
            },
            pre: {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.gray.900'),
            },
            code: {
              color: theme('colors.moonlight.pink.700'),
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            'code:before': {
              content: 'none',
            },
            'code:after': {
              content: 'none',
            },
            details: {
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            hr: { borderColor: theme('colors.gray.200') },
            'ol li:before': {
              fontWeight: '600',
              color: theme('colors.gray.500'),
            },
            'ul li:before': {
              backgroundColor: theme('colors.gray.500'),
            },
            strong: { color: theme('colors.gray.600') },
            blockquote: {
              color: theme('colors.gray.900'),
              borderLeftColor: theme('colors.gray.200'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.100'),
            a: {
              color: theme('colors.moonlight.green.500'),
              '&:hover': {
                color: theme('colors.moonlight.green.400'),
              },
              code: { color: theme('colors.moonlight.green.500') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.moonlight.lightred.500'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.moonlight.cyan.500'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.200'),
            },
            'h4,h5,h6': {
              color: theme('colors.gray.200'),
            },
            pre: {
              color: theme('colors.gray.100'),
              backgroundColor: theme('colors.moonlight.gray.200'),
            },
            code: {
              color: theme('colors.moonlight.pink.500'),
              backgroundColor: theme('colors.moonlight.gray.200'),
            },
            details: {
              backgroundColor: theme('colors.gray.800'),
            },
            hr: { borderColor: theme('colors.gray.700') },
            'ol li:before': {
              fontWeight: '600',
              color: theme('colors.gray.400'),
            },
            'ul li:before': {
              backgroundColor: theme('colors.gray.400'),
            },
            strong: { color: theme('colors.gray.100') },
            thead: {
              color: theme('colors.gray.100'),
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700'),
              },
            },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
