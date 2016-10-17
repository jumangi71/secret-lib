'use strict';

// Depends
var path         = require('path');
var webpack      = require('webpack');
var Manifest     = require('manifest-revision-webpack-plugin');
var TextPlugin   = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
//var HtmlPlugin   = require('html-webpack-plugin');

/**
 * Global webpack config
 * @param  {[type]} _path [description]
 * @return {[type]}       [description]
 */
module.exports = function(_path) {
  // define local variables
  // var dependencies  = Object.keys(require(_path + '/package').dependencies);
  var rootAssetPath = './assets';

  console.log(path.join(_path + '/config', 'manifest.json'));
  // return objecy
  return {
    // entry points
    entry: {
      application: _path + '/assets/js/app.js',
      //vendors: dependencies
    },

    // output system
    output: {
      path: path.join(_path, '.tmp', 'public'),
      filename: path.join('assets', 'js', '[name].[hash].js'),
      chunkFilename: '[id].bundle.[chunkhash].js',
      publicPath: '/'
    },

    // resolves modules
    resolve: {
      extensions: ['', '.js'],
      modulesDirectories: ['node_modules'],
      alias: {
        //_svg: path.join(_path, 'assets', 'svg'),
        //_fonts: path.join(_path, 'assets', 'fonts'),
        //_modules: path.join(_path, 'modules'),
        _images: path.join(_path, 'assets', 'images'),
        _styles: path.join(_path, 'assets', 'styles'),
        //_templates: path.join(_path, 'assets', 'templates')
      }
    },

    // modules resolvers
    module: {
      loaders: [
        { test: /\.styl$/, loader: TextPlugin.extract('style', 'css!postcss!stylus') },
        { test: /\.(svg)$/i, loaders: ['file?context=' + rootAssetPath + '&name=assets/images/[name].[ext]'] },
        { test: /\.(css|ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif)$/i, loaders: ['file?context=' + rootAssetPath + '&name=assets/static/[name].[hash].[ext]'] },
        { loader: 'babel',
          test: /\.js$/,
          exclude: /(node_modules|autoprefixer|vendors)/,
          query: {
            presets: ['es2015'],
            ignore: ['node_modules', 'bower_components']
          },
        }
      ]
    },

    // post css
    postcss: [autoprefixer({ browsers: ['last 5 versions'] })],

    // load plugins
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('vendors', 'assets/js/vendors.[hash].js'),
      new TextPlugin('assets/styles/[name].[chunkhash].css'),
      new Manifest(path.join(_path + '/config', 'manifest.json'), {
        rootAssetPath: rootAssetPath,
        ignorePaths: ['/stylesheets', '/js', '/svg', '.DS_Store', 'robots.txt']
      }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/)
      // create instance for entrypoint index.html building
      //new HtmlPlugin({
      //  title: 'Rambler Webpack Dev Boilerplate',
      //  chunks: ['application', 'vendors'],
      //  filename: 'index.html',
      //  template: path.join(_path, 'app', 'assets', 'templates', 'layouts', 'index.html')
      //})
    ]
  };
};
