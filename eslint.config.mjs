// eslint.config.mjs
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  // Next core rules (flat export)
  ...nextCoreWebVitals,

  // TS files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      camelcase: "off",
      "no-unused-vars": "off",

      // React hooks
      ...reactHooks.configs.recommended.rules,
    },
  },

  // JS files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      ...compat
        .extends("eslint:recommended")
        .flatMap((c) => c.rules ?? {})
        .reduce((a, b) => ({ ...a, ...b }), {}),
    },
  },

  // Prettier last
  ...compat.extends("prettier"),
];

export default eslintConfig;
