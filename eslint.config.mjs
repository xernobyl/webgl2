import js from '@eslint/js'
import globals from 'globals'
//import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // apply recommended rules to JS files
  {
    name: 'your-project/recommended-rules',
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js
    },
    languageOptions: { 
      globals: { 
        ...globals.browser,
        ...globals.node 
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    extends: ['js/recommended'/*, "eslint:recommended", "plugin:import/recommended"*/],
    rules: {
      // Code Quality
      'complexity': ['error', 12],
      'max-depth': ['error', 4],
      'max-lines': ['error', 512],
      'max-lines-per-function': ['error', 100],
      'max-params': ['error', 5],
      'no-magic-numbers': 'off',
      'require-await': 'error',

      // Best Practices
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always'],
      'no-implicit-coercion': 'error',
      'no-else-return': ['error', { 'allowElseIf': false }],
      'no-unneeded-ternary': 'error',
      'prefer-const': ['error', {
        'destructuring': 'all',
        'ignoreReadBeforeAssign': false
      }],
      'prefer-template': 'error',

      // Stylistic
      'quotes': ['error', 'single', { 
        'avoidEscape': true,
        'allowTemplateLiterals': true 
      }],
      'semi': ['error', 'never'],
      'indent': ['error', 2, {
        'SwitchCase': 1,
        'VariableDeclarator': 'first',
        'outerIIFEBody': 1,
        'MemberExpression': 1,
        'FunctionDeclaration': { 'parameters': 'first' },
        'FunctionExpression': { 'parameters': 'first' },
        'CallExpression': { 'arguments': 'first' },
        'ArrayExpression': 'first',
        'ObjectExpression': 'first',
        'ImportDeclaration': 'first',
        'flatTernaryExpressions': false,
        'ignoreComments': false
      }],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-parens': ['error', 'as-needed'],

      // ES6+ Features
      'prefer-arrow-callback': 'error',
      'prefer-destructuring': ['error', { 'array': true, 'object': true }],
      'no-var': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'template-curly-spacing': ['error', 'never'],

      // Import/Module
      //'import/order': 'error',
      //'import/no-default-export': 'error',
      //'import/no-anonymous-default-export': 'error',
      //'import/no-duplicates': 'error',
      //'import/newline-after-import': 'error',
      'sort-imports': ['error', {
        'ignoreCase': true,
        'ignoreDeclarationSort': true,
        'ignoreMemberSort': false,
        'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
      }],

      // Error Prevention
      'no-unsafe-optional-chaining': 'error',
      'no-await-in-loop': 'error',
      'no-constant-binary-expression': 'error',
      'no-constructor-return': 'error',
      'no-promise-executor-return': 'error'
    }
  }
])
