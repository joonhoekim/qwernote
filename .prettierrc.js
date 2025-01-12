module.exports = {
  bracketSpacing: false,
  singleQuote: true,
  bracketSameLine: true,
  printWidth: 80,
  trailingComma: 'all',
  htmlWhitespaceSensitivity: 'ignore',
  // prettier-plugin-sort-imports
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',  // node_modules
    '^@utils/(.*)$',
    '^@apis/(.*)$',
    '^@hooks/(.*)$',
    '^@recoils/(.*)$',
    '^@pages/(.*)$',
    '^@base/(.*)$',
    '^@common/(.*)$',
    '^@components/(.*)$',
    '^@styles/(.*)$',
    '^[./]',
  ],
  // prettier plugins
  "plugins": [
    "prettier-plugin-tailwindcss",
    "prettier-plugin-sort-imports",
  ]
} 