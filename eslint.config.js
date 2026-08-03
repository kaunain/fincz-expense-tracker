export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.angular/**', 'tmp/**'],
  },
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: {
      'no-debugger': 'error',
    },
  },
];
