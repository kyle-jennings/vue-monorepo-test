const defaults = require('../shared/configs/.eslintrc');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  ...defaults,
};
