'use strict';

/**
 * Development config
 * @param  {String} _path Absolute path to application
 * @return {Object}       Object of development settings
 */
module.exports = function(_path) {
  return {
    context: _path,
    debug: true,
    devtool: 'eval',
    devServer: {
      contentBase: '.tmp/public',
      info: true,
      hot: false,
      inline: true,
      proxy: {
        '**': 'http://localhost:1337'
      }
    },
    stylint: {
      config: '.stylintrc'
    },
    eslint: {
      configFile: '.eslintrc'
    },
    module: {
      preLoaders: [
        {
          test: /\.styl$/,
          loader: 'stylint'
        },
        {
          test: /\.js$/,
          loader: 'eslint',
          exclude: [/node_modules/, /bower_components/, /dependencies/]
        }
      ]
    }
  };
};
