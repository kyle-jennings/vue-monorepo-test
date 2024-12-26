// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const sharedVueConfigs = require('../shared/configs/vue.config')({
  title: 'Title',
  aliases: {
    'buefy/src/components/tabs': path.resolve(__dirname, '..', 'ui-components/src/components/Tabs'),
  },
});

module.exports = defineConfig({
  ...sharedVueConfigs,
});
