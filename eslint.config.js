import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettier from "eslint-plugin-prettier";

// parsers
const tsParser = tseslint.parser;
const astroParser = astro.parser;

export default defineConfig([
  // Global configuration
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Base configs
  tseslint.configs.recommended,

  // Prettier config
  {
    plugins: {
      prettier,
    },
  },

  // astro setup with a11y
  astro.configs.recommended,
  astro.configs["jsx-a11y-recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
        sourceType: "module",
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
    },
    rules: {
      "no-undef": "off", // Disable "not defined" errors for specific Astro types that are globally available (ImageMetadata)
      "@typescript-eslint/no-explicit-any": "off", // you may want this as it can get annoying
    },
  },

  // Ignore patterns
  {
    ignores: ["dist/**", "**/*.d.ts", ".github/"],
  },
]);
