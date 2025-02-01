module.exports = {
    bracketSpacing: false,
    singleQuote: true,
    bracketSameLine: true,
    printWidth: 80,
    tabWidth: 4,
    semi: true,
    trailingComma: 'all',
    htmlWhitespaceSensitivity: 'ignore',
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrder: [
        '<THIRD_PARTY_MODULES>', // node_modules
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
    plugins: [
        'prettier-plugin-tailwindcss',
        '@trivago/prettier-plugin-sort-imports',
    ],
};
