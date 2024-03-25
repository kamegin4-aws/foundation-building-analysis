/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  env: {
    browser: true,
    es2023: true,
  },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "google",
    "prettier",
    "next/babel",
  ],
  ignorePatterns: ["node_modules", "dist"],
  rules: {},
};
