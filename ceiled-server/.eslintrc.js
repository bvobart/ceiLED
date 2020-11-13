module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:node/recommended',
  ],
  rules: {
    'no-console': 'off',
    'no-process-exit': 'off',
    'object-literal-sort-keys': 'off',
    'max-classes-per-file': 'off',
    'no-explicit-any': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    quotes: ['error', 'single', 'avoid-escape'],
    'no-trailing-spaces': 'error',
    '@typescript-eslint/no-floating-promises': ['error'],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'enumMember',
        'format': ['PascalCase'],
      }
    ],
    'no-return-await': 'warn',
    "node/no-unsupported-features/es-syntax": 'off',
    "node/no-missing-import": 'off',
  }
};
