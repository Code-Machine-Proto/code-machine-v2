import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([ 
    globalIgnores(["build/*", "node_modules/*", ".react-router/*", "src/coverage/*"]),
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        linterOptions: {
            reportUnusedDisableDirectives: "error",
        },
        rules : {
            // Introduit, car inutile en react 17+
            "react/react-in-jsx-scope": "off",
            // Idem
            "react/jsx-uses-react": "off",
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
            "no-magic-numbers": "error",
            "no-var": "error",
            "prefer-const": "error",
        },
        settings:{
            "react": {
                "version": "detect"
            }
        },
    },
]);
