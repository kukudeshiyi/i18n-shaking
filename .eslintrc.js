module.exports = {
    extends: ["prettier"],
    parser: '@typescript-eslint/parser',
    env: {
      es6: true,
      browser: true
    },
    plugins: [
      '@typescript-eslint',
      "prettier",
    ]
  };