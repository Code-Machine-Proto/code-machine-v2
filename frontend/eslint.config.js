import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import * as reactHooks from "eslint-plugin-react-hooks";


export default defineConfig([ 
    globalIgnores(["build/*", "node_modules/*", ".react-router/*", "src/coverage/*"]),
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
    tseslint.configs.strict,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
    reactHooks.configs["recommended-latest"],
    {
        linterOptions: {
            reportUnusedDisableDirectives: "error",
        },
        rules : {
            "array-callback-return": ["error", { allowImplicit: true, checkForEach: true, allowVoid: true }],
            "no-duplicate-imports": "error",
            "camelcase": ["error", { ignoreGlobals: true, }],
            "class-methods-use-this": "warn",
            "curly": "error",
            "dot-notation": "error",
            "max-classes-per-file": "error",
            "new-cap": "error",
            "no-bitwise": "error",
            "no-console": "error",
            "no-magic-numbers": ["error", { ignore: [-1, 0, 1] }],
            "no-var": "error",
            "prefer-const": "error",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "_" }],
            "react-hooks/exhaustive-deps": "off",
        },
        settings:{
            "react": {
                "version": "detect",
            },
        },
    },
]);
