const path = require('path');
const rootPath  = path.resolve(__dirname, '..', '..')

module.exports = (settings) => ({
  // adds our title to the app
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        /* eslint-disable-next-line no-param-reassign */
        args[0].title = settings.title || 'APP';
        return args;
      });
  },
  transpileDependencies: true,
  publicPath: process.env.VUE_APP_PUBLIC_PATH || null,
  css: {
    sourceMap: process.env.NODE_ENV === 'development',
  },
  // web pack configs
  configureWebpack: {
    plugins: [...settings.plugins || []],
    resolve: {
      modules: [path.resolve(__dirname, '..','node_modules'), 'node_modules'],
      // we are aliasing a buefy path reference to our copy (with our own configs)
      alias: {
        vue: path.resolve('./node_modules/vue'),
        '../../utils/config': path.resolve(rootPath, 'shared/configs/Buefy-configs.js'),
        '^': rootPath, // root
        '^shared': path.resolve(__dirname, '..'), // shared path
        '^shared-components': path.resolve(__dirname, '..', 'components'), // ui-components components
        ...settings.aliases
      },
    },
  },
});