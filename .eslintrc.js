module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true, // Puedes cambiar a true si prefieres comillas simples
        semi: true, // Asegurar que haya punto y coma
        trailingComma: 'none', // Sin coma final
        bracketSpacing: true, // Espacios dentro de objetos
        // tabWidth: 2, // Tabulación de 2 espacios
        // useTabs: false, // Preferir espacios sobre tabs
        endOfLine: 'auto',
      },
    ],
  },
};
