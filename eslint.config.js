import antfu from "@antfu/eslint-config";

export default antfu({
    stylistic: {
        indent: 4,
        quotes: "double",
    },
    svelte: true,
    typescript: true,
    rules: {
        "style/semi": ["error", "always"],
        "unused-imports/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
        }],
        "no-console": "off",
    // 'brace-style': ['error', '1tbs'],
    },
});
