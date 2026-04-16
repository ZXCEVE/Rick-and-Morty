import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      prettier
    },
    settings: {
      react: {
        versions: 'detect'
      }
    },
    rules: {
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'default-param-last': 'error',
      'import/no-default-export': 'warn',
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/no-unused-modules': [
        'warn',
        {
          unusedExports: true,
          considerExportedString: true,
          src: ['src']
        }
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/no-array-index-key': 'warn',
      'react/jsx-no-bind': ['warn', { ignoreRefs: true }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'any', prev: 'export', next: 'export' }
      ],
      'prettier/prettier': 'error'
    }
  }
];
