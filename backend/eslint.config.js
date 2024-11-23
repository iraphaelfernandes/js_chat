const js = require('@eslint/js');
const stylisticJs = require('@stylistic/eslint-plugin-js');
const globals = require('globals');



module.exports = [
  js.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylisticJs 
    },
    rules: {
      '@stylistic/js/indent': ['warn', 2],
      '@stylistic/js/array-bracket-spacing': ['warn', 'never'],
      '@stylistic/js/quotes': ['warn', 'single'],
      '@stylistic/js/arrow-spacing': ['error'],
      '@stylistic/js/block-spacing': 'warn',
      '@stylistic/js/brace-style': 'warn',
      '@stylistic/js/comma-dangle': 'warn',
      '@stylistic/js/comma-spacing': 'warn',
      '@stylistic/js/comma-style': 'warn'
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    files: ['test/**/*.js']
  },
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    files: ['*.js']
  }
];
