import { defineConfig } from "eslint/config";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  // JavaScript files
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
    extends: ["plugin:js/recommended"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-console": "warn",
      eqeqeq: ["warn", "always"],
      curly: "error",
    },
  },

  // TypeScript files (.ts, .cts, .mts)
  {
    files: ["**/*.ts", "**/*.cts", "**/*.mts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json", // required for some TS rules
      },
      globals: globals.browser,
    },
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/strict-boolean-expressions": "warn",
      "no-console": "warn",
      eqeqeq: ["warn", "always"],
      curly: "error",
    },
  },

  // Common rules for all files
  {
    files: ["**/*.{js,ts,cts,mts}"],
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "max-len": ["warn", { code: 120, ignoreComments: true }],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
    },
  },
]);
