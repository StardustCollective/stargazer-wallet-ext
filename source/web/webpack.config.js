/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const DotEnv = require('dotenv-webpack');
const ZipPlugin = require('zip-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WextManifestWebpackPlugin = require('wext-manifest-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const PnpWebpackPlugin = require('pnp-webpack-plugin');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

const viewsPath = path.join(__dirname, '../../views');
const destPath = path.join(__dirname, 'extension');
const rootPath = path.join(__dirname, '../../');
const sharedPath = path.join(__dirname, '../');
const nodeEnv = process.env.NODE_ENV || 'development';
const targetBrowser = process.env.TARGET_BROWSER;
const uploadSentry = process.env.UPLOAD_SENTRY === 'true';

const extensionReloaderPlugin = () => {
  this.apply = () => {};
};

const getExtensionFileType = (browser) => {
  if (browser === 'opera') {
    return 'crx';
  }

  if (browser === 'firefox') {
    return 'xpi';
  }

  return 'zip';
};

// Common configuration for all entry points
const commonConfig = {
  devtool: 'source-map',

  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },

  node: {
    fs: 'empty',
  },

  mode: nodeEnv,

  resolve: {
    plugins: [PnpWebpackPlugin],
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      assets: path.resolve(sharedPath, 'assets'),
      components: path.resolve(sharedPath, 'components'),
      scripts: path.resolve(sharedPath, 'scripts'),
      scenes: path.resolve(sharedPath, 'scenes'),
      pages: path.resolve(__dirname, 'pages'),
      navigation: path.resolve(sharedPath, 'navigation'),
      state: path.resolve(sharedPath, 'state'),
      constants: path.resolve(sharedPath, 'constants'),
      context: path.resolve(sharedPath, 'context'),
      hooks: path.resolve(sharedPath, 'hooks'),
      utils: path.resolve(sharedPath, 'utils'),
      selectors: path.resolve(sharedPath, 'selectors'),
      'react-native$': 'react-native-web',
    },
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  module: {
    rules: [
      {
        // prevent webpack handling json with its own loaders,
        type: 'javascript/auto',
        test: /manifest\.json$/,
        use: {
          loader: 'wext-manifest-loader',
          options: {
            // set to false to not use package.json version for manifest
            usePackageJSONVersion: true,
          },
        },
        exclude: [/node_modules/, /native/],
      },
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        // Exclude node_modules and react-native project folders.
        // Exclude react-native-flash-message (needs to be processed)
        // Exclude zipExtension.js
        exclude: (modulePath) => {
          return (
            /zipExtension\.js$/.test(modulePath) ||
            (!/node_modules\/react-native-flash-message/.test(modulePath) &&
              (/node_modules/.test(modulePath) || /native/.test(modulePath)))
          );
        },
        options: {
          ...JSON.parse(fs.readFileSync(path.resolve(__dirname, '.babelrc'))),
        },
      },
      {
        test: /\.(jpg|png|svg)x?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: 'style-loader', // It creates a CSS file per JS file which contains CSS
          },
          {
            loader: 'css-loader', // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
            options: {
              import: true,
              sourceMap: true,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader', // For autoprefixer
            options: {
              ident: 'postcss',
              // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
              plugins: [require('autoprefixer')()],
            },
          },
          'resolve-url-loader', // Rewrites relative paths in url() statements
          'sass-loader', // Takes the Sass/SCSS file and compiles to the CSS
        ],
      },
    ],
  },
};

// Configuration for UI components (popup, options, etc.)
const uiConfig = {
  ...commonConfig,
  entry: {
    manifest: path.join(__dirname, 'manifest.json'),
    contentScript: path.join(sharedPath, 'scripts/ContentScript', 'index.ts'),
    injectedScript: path.join(sharedPath, 'scripts/InjectedScript', 'index.ts'),
    app: path.join(__dirname, 'pages/App', 'index.tsx'),
    external: path.join(__dirname, 'pages/External', 'index.tsx'),
    ledger: path.join(__dirname, 'pages/Ledger', 'index.tsx'),
    bitfi: path.join(__dirname, 'pages/Bitfi', 'index.tsx'),
    options: path.join(__dirname, 'pages/Options', 'index.tsx'),
  },
  output: {
    path: path.join(destPath, targetBrowser),
    filename: 'js/[name].bundle.js',
  },
  plugins: [
    // Plugin to not generate js bundle for manifest entry
    new WextManifestWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.resolve(`${rootPath}tsconfig.json`),
    }),
    // environmental variables
    new webpack.EnvironmentPlugin(['NODE_ENV', 'TARGET_BROWSER']),
    // global variables
    new webpack.DefinePlugin({
      STARGAZER_WALLET_VERSION: JSON.stringify(
        JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'))).version
      ),
      global: 'globalThis',
    }),
    // delete previous build files
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), `extension/${targetBrowser}`),
        path.join(
          process.cwd(),
          `extension/${targetBrowser}.${getExtensionFileType(targetBrowser)}`
        ),
      ],
      cleanStaleWebpackAssets: false,
      verbose: true,
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'app.html'),
      inject: 'body',
      chunks: ['app'],
      filename: 'app.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'external.html'),
      inject: 'body',
      chunks: ['external'],
      filename: 'external.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'ledger.html'),
      inject: 'body',
      chunks: ['ledger'],
      filename: 'ledger.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'bitfi.html'),
      inject: 'body',
      chunks: ['bitfi'],
      filename: 'bitfi.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'options.html'),
      inject: 'body',
      chunks: ['options'],
      filename: 'options.html',
    }),
    new DotEnv({
      path: '../../.env',
    }),
    // write css file(s) to build folder
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    // copy static assets
    new CopyWebpackPlugin([{ from: `${sharedPath}assets`, to: 'assets' }]),
    // plugin to enable browser reloading in development mode
    extensionReloaderPlugin,
    ...(!uploadSentry
      ? []
      : [
          sentryWebpackPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'dor-technologies',
            project: 'stargazer-wallet-web',
          }),
        ]),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ],
  },
};

// Configuration specifically for the background script (service worker)
const backgroundConfig = {
  ...commonConfig,
  target: 'webworker', // This is crucial for service workers
  entry: {
    background: path.join(sharedPath, 'scripts/Background', 'index.ts'),
  },
  output: {
    path: path.join(destPath, targetBrowser, 'js'),
    filename: '[name].bundle.js',
    globalObject: 'self',
  },
  module: {
    ...commonConfig.module,
    rules: [
      ...commonConfig.module.rules,
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.resolve(`${rootPath}tsconfig.json`),
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'TARGET_BROWSER']),
    new webpack.DefinePlugin({
      STARGAZER_WALLET_VERSION: JSON.stringify(
        JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'))).version
      ),
      global: 'self',
      'process.env.IS_SERVICE_WORKER': JSON.stringify(true),
    }),
    new DotEnv({
      path: '../../.env',
    }),
    ...(!uploadSentry
      ? []
      : [
          sentryWebpackPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'dor-technologies',
            project: 'stargazer-wallet-web',
          }),
        ]),
  ],
};

// Export an array of configurations
module.exports = [uiConfig, backgroundConfig];
