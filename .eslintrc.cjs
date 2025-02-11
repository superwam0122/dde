/** @type {import('eslint').Linter.Config} */
module.exports = {
  overrides: [
    {
      files: "**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}",
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
      ],
      plugins: ["@typescript-eslint", "prettier"],
      rules: {
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/consistent-type-imports": "warn",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
    {
      files: [".eslintrc.cjs", "postcss.config.js", "tailwind.config.js"],
      env: {
        node: true,
      },
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: "**/*.{html}",
      extends: ["eslint:recommended", "plugin:prettier/recommended"],
      plugins: ["prettier"],
    },
  ],
  ignorePatterns: ["dist", "next-env.d.ts", "public"],
  root: true,
};
