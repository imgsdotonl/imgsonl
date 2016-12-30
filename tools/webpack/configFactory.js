/* @flow */

import path from 'path';
import { sync as globSync } from 'glob';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import appRootDir from 'app-root-dir';
import WebpackMd5Hash from 'webpack-md5-hash';
import { removeEmpty, ifElse, merge, happyPackPlugin } from '../utils';
import type { BuildOptions } from '../types';
import config, { clientConfig } from '../../config';

export default function webpackConfigFactory(buildOptions: BuildOptions) {
  const { target, mode } = buildOptions;
  console.log(`==> Creating webpack config for "${target}" in "${mode}" mode`);

  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isNode = !isClient;

  const ifDev = ifElse(isDev);
  const ifNode = ifElse(isNode);
  const ifClient = ifElse(isClient);
  const ifDevClient = ifElse(isDev && isClient);
  const ifProdClient = ifElse(isProd && isClient);

  const bundleConfig = isServer || isClient
    ? config.bundles[target]
    : config.additionalNodeBundles[target];

  if (!bundleConfig) {
    throw new Error('No bundle configuration exists for target:', target);
  }

  const webpackConfig = {
    performance: {
      hints: false,
    },

    target: isClient
      ? 'web'
      : 'node',
    node: {
      __dirname: true,
      __filename: true,
    },
    externals: removeEmpty([
      ifNode(
        () => nodeExternals({
          whitelist: [].concat(
            config.nodeBundlesIncludeNodeModuleFileTypes
          ),
        }),
      ),
    ]),
    devtool: ifElse(
        isNode
        || isDev
        || config.includeSourceMapsForProductionBuilds,
      )(
      'source-map',
      'none',
    ),
    entry: {
      index: removeEmpty([
        ifDevClient('react-hot-loader/patch'),
        ifDevClient(() => `webpack-hot-middleware/client?reload=true&path=http://${config.host}:${config.clientDevServerPort}/__webpack_hmr`), // eslint-disable-line
        path.resolve(appRootDir.get(), bundleConfig.srcEntryFile),
      ]),
    },
    output: merge(
      {
        path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
        filename: ifProdClient(
          '[name]-[chunkhash].js',
          '[name].js',
        ),
        chunkFilename: '[name]-[chunkhash].js',
        libraryTarget: ifNode('commonjs2', 'var'),
      },
      ifElse(isServer || isClient)(() => ({
        publicPath: ifDev(
          `http://${config.host}:${config.clientDevServerPort}${config.bundles.client.webPath}`,
          bundleConfig.webPath,
        ),
      })),
    ),

    resolve: {
      // These extensions are tried when resolving a file.
      extensions: config.bundleSrcTypes.map(ext => `.${ext}`),
    },

    plugins: removeEmpty([
      ifClient(() => new WebpackMd5Hash()),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
        // Is this the "client" bundle?
        'process.env.IS_CLIENT': JSON.stringify(isClient),
        // Is this the "server" bundle?
        'process.env.IS_SERVER': JSON.stringify(isServer),
        // Is this a node bundle?
        'process.env.IS_NODE': JSON.stringify(isNode),
        __SERVER__: JSON.stringify(isServer),
      }),

      ifClient(() =>
        new AssetsPlugin({
          filename: config.bundleAssetsFileName,
          path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
        }),
      ),
      ifDev(() => new webpack.NoErrorsPlugin()),
      ifDevClient(() => new webpack.HotModuleReplacementPlugin()),
      ifProdClient(
        () => new webpack.LoaderOptionsPlugin({
          minimize: config.optimizeProductionBuilds,
        }),
      ),
      ifProdClient(
        ifElse(config.optimizeProductionBuilds)(
          () => new webpack.optimize.UglifyJsPlugin({
            sourceMap: config.includeSourceMapsForProductionBuilds,
            compress: {
              screw_ie8: true,
              warnings: false,
            },
            mangle: {
              screw_ie8: true,
            },
            output: {
              comments: false,
              screw_ie8: true,
            },
          }),
        ),
      ),
      ifProdClient(
        () => new ExtractTextPlugin({
          filename: '[name]-[chunkhash].css', allChunks: true,
        }),
      ),
      happyPackPlugin({
        name: 'happypack-javascript',
        loaders: [{
          path: 'babel-loader',
          query: config.plugins.babelConfig(buildOptions),
        }],
      }),
      ifDevClient(
        () => happyPackPlugin({
          name: 'happypack-devclient-css',
          loaders: [
            { path: 'style-loader' },
            {
              path: 'css-loader',
              options: {
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]',
                modules: true,
                sourceMap: true,
              },
            },
            { path: 'postcss-loader' },
            {
              path: 'sass-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
              },
            },
          ],
        }),
      ),
    ]),
    module: {
      rules: removeEmpty([
        {
          test: /\.jsx?$/,
          loader: 'happypack/loader?id=happypack-javascript',
          include: removeEmpty([
            ...bundleConfig.srcPaths.map(srcPath =>
              path.resolve(appRootDir.get(), srcPath),
            ),
            ifProdClient(path.resolve(appRootDir.get(), 'src/html')),
          ]),
        },
        ifElse(isClient || isServer)(
          merge(
            { test: /(\.scss|\.css)$/ },
            ifDevClient({
              loaders: ['happypack/loader?id=happypack-devclient-css'],
            }),
            ifProdClient(() => ({
              loader: ExtractTextPlugin.extract({
                fallbackLoader: 'style-loader',
                loader: 'css-loader?sourceMap&importLoaders=2!postcss-loader!sass-loader?outputStyle=expanded&sourceMap&sourceMapContents', // eslint-disable-line
              }),
            })),
            ifNode({
              loaders: [
                'css-loader/locals',
                'postcss-loader',
                'sass-loader',
              ],
            }),
          ),
        ),
        ifElse(isClient || isServer)(() => ({
          test: new RegExp(`\\.(${config.bundleAssetTypes.join('|')})$`, 'i'),
          loader: 'file-loader',
          query: {
            publicPath: isDev
              ? `http://${config.host}:${config.clientDevServerPort}${config.bundles.client.webPath}`
              : config.bundles.client.webPath,
            emitFile: isClient,
          },
        })),
      ]),
    },
  };
  return config.plugins.webpackConfig(webpackConfig, buildOptions);
}
