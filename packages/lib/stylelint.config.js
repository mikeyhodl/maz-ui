module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recommended-vue',
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['screen', 'layer', 'tailwind', 'each'] },
    ],
    'selector-class-pattern': null,
    'no-descending-specificity': null,
  },
}
