import globals from "globals";
import pluginJs from "@eslint/js";

const { node, browser, webextensions } = globals;

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" }
  },
  {
    files: ["**/scripts/**/*.js"],
    languageOptions: { globals: node }
  },
  {
    languageOptions: { globals: { ...browser, ...webextensions } }
  },
  pluginJs.configs.recommended,
];
