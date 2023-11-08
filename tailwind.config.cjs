

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}",
  "./node_modules/tw-elements/dist/js/**/*.js"],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1920px',
      // => @media (min-width: 1536px) { ... }
    },
    colors: {
      blue: {
        100: '#F1F4F9',
        200: '#1A73E8',
        300: '#174EA6',
        400: '#173DFF',
        500: '#004777',
      },
      gray: {
        50: '#F2F2F2',
        100: '#E6E6E6',
        200: '#DFECF4',
        300: '#dadce0',
        400: '#717A83',
        500: '#323238',
      },
      green: {
        100: '#D9EBBD',
        200: '#DFECF4',
        300: '#AAB3BA',
        400: '#238536',
        500: '#323238',
      },
      red: {
        100: '#EFF5F9',
        200: '#DFECF4',
        300: '#AAB3BA',
        400: '#DE2834',
        500: '#A5202D',
      },
      yellow: {
        400: '#FFCF00',
      },
      white: '#FFFFFF',
    },

    fontFamily: {
      sans: 'Ubuntu, sans-serif'
    },
    extend: {
      scale: {
        'full': '1000.5',
      },
      backdropFilter: ['blur(10px)'],

      gridTemplateRows: {
        // Simple 8 row grid
       '7': 'repeat(7, minmax(0, 1fr))',
      },

      animation: {
         'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
        },
        backgroundImage: {
          bg1: 'url(/src/assets/background_ilustracao.png)'
        },
        backgroundSize: {
          'bg': '100% auto' ,
        }
    },
  },
  plugins: [],
 
}


