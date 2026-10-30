module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules', '*.d.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-hooks', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-empty': 'off',
    'no-useless-escape': 'off',
    'no-control-regex': 'off',
    'no-case-declarations': 'off',
    'prefer-const': 'warn',
  },
};
