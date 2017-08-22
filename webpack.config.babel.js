const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const { resolve, join } = require('path');
const rulesBuilder = require('./webpack.rules');

module.exports = (env = { dev: true }) => {
  const inProductionMode = env.prod || false;
  const inTestMode = env.test || false;
  const inDevelopmentMode = env.dev || false;

  const ifProd = obj => inProductionMode ? obj : undefined;
  const ifDev = obj => inDevelopmentMode ? obj : undefined;
  const removeEmpty = array => array.filter(p => !!p);

  const host = 'localhost';
  const port = 6001;

  const rules = rulesBuilder();

  return {
    devtool: inProductionMode ? 'source-map' : 'cheap-module-eval-source-map',
    name: 'client',
    context: resolve(__dirname),
    entry: {
      js: removeEmpty([
        'babel-polyfill',
        ifDev('react-hot-loader/patch'),
        ifDev(`webpack-dev-server/client?http://${host}:${port}`),
        './index.jsx',
      ]),
      vendor: [ 'react', 'react-dom' ],
    },
    output: {
      path: resolve('dist'),
      library: `[name]${inProductionMode ? '_[hash]' : ''}`,
      filename: `[name]${inProductionMode ? '_[hash]' : ''}.js`,
      chunkFilename: `[id].[name]${inProductionMode ? '_[chunkhash]' : ''}.js`,
      publicPath: '/',
      sourceMapFilename: `[name]${inProductionMode ? '_[hash]' : ''}.js.map`,
    },
    plugins: removeEmpty([
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
      }),
      new webpack.DefinePlugin({
        __DEVELOPMENT__: inDevelopmentMode,
        __PRODUCTION__: inProductionMode,
        __TEST__: inTestMode,
      }),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|html)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      new HtmlWebpackPlugin({
        favicon: resolve(__dirname, 'favicon.ico'),
        template: resolve(__dirname, 'index.tpl.html'),
        chunksSortMode: 'dependency',
        minify: { collapseWhitespace: true },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.[hash].js',
        chunks: ['vendor'],
      }),
      ifDev(new webpack.HotModuleReplacementPlugin()),
      ifDev(new webpack.HashedModuleIdsPlugin()),
      ifDev(new webpack.NamedModulesPlugin()),
      ifProd(new ExtractTextPlugin({
        filename: `[name]${inProductionMode ? '.[contenthash]' : ''}.css`,
        allChunks: true,
      })),
      ifProd(new webpack.optimize.OccurrenceOrderPlugin()),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        beautify: false,
        comments: false,
        parallel: {
          cache: true,
          workers: 2,
        },
        compress: {
          warnings: false,
          drop_console: true,
          screw_ie8: true,
        },
        mangle: {
          except: [
            '$', 'webpackJsonp',
          ],
          screw_ie8: true,
          keep_fnames: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      })),
    ]),
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        assets: resolve(__dirname, 'assets'),
      },
    },
    module: {
      rules: removeEmpty([
        rules.js,
        rules.style,
        rules.blocksDefinition,
        rules.fonts,
        rules.images,
      ]),
      noParse: [
        /react-with-addons\.js$/,
      ],
    },
    profile: inDevelopmentMode,
    devServer: {
      contentBase: join(__dirname, 'assets'),
      publicPath: '/',
      overlay: true,
      compress: true,
      host,
      port,
      hot: true,
      historyApiFallback: true,
      noInfo: true,
    }
  };
};
