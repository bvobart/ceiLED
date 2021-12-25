module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
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
    'plugin:prettier/recommended',
    'plugin:node/recommended',
  ],
  rules: {
    'no-console': 'off',
    'no-explicit-any': 'off',
    'no-process-exit': 'off',
    'no-trailing-spaces': 'error',
    'max-classes-per-file': 'off',
    'object-literal-sort-keys': 'off',
    quotes: ['error', 'single', 'avoid-escape'],
    '@typescript-eslint/explicit-module-boundary-types': ['warn', {
      allowArgumentsExplicitlyTypedAsAny: true,
    }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/no-floating-promises": ["error"],
    "@typescript-eslint/no-misused-promises": ["error"],
    "@typescript-eslint/prefer-optional-chain": ["error"],
    "@typescript-eslint/prefer-ts-expect-error": ["error"],
    "@typescript-eslint/promise-function-async": ["error"],
    "@typescript-eslint/no-unsafe-member-access": 'off',
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
    "node/no-unpublished-import": 'off'
  },
};
