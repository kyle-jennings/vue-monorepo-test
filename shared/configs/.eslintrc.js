module.exports = {
  // root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'import/order': ['off'],
    'vue/no-v-model-argument': 'off',
    'max-len': [
      'error', {
        code: 120,
        tabWidth: 2,
      },
    ],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unused-vars': ['error'],
    camelcase: ['error', { properties: 'never' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.stories.*',
          '**/.storybook/**/*.*',
        ],
        peerDependencies: true,
      },
    ],
    'import/no-unresolved': 'off',
    'import/extensions': ['error', { ts: 'never', vue: 'always' }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.vue'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
