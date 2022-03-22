/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const {getDefaultConfig} = require('metro-config');
const path = require('path');
const nodeModules = require('node-libs-react-native');

const extraNodeModules = {
  source: path.resolve(__dirname + '/../'),
  navigation: path.resolve(__dirname + '/../navigation'),
  scenes: path.resolve(__dirname + '/../scenes'),
  hooks: path.resolve(__dirname + '/../hooks'),
  components: path.resolve(__dirname + '/../components'),
  constants: path.resolve(__dirname + '/../constants'),
  selectors: path.resolve(__dirname + '/../selectors'),
  state: path.resolve(__dirname + '/../state'),
  types: path.resolve(__dirname + '/../types'),
  utils: path.resolve(__dirname + '/../utils'),
  assets: path.resolve(__dirname + '/../assets'),
  scripts: path.resolve(__dirname + '/../scripts'),
  process: nodeModules.process,
  crypto: nodeModules.crypto,
  stream: nodeModules.stream,
  http: nodeModules.http,
  https: nodeModules.https,
  os: nodeModules.os,
  fs: require.resolve('react-native-fs'),
  'react-native': require.resolve('react-native-web'),
};

const nodeModulesPaths = [
  path.resolve(__dirname + '/node_modules'),
  path.resolve(__dirname + '/../../node_modules'),
];

const watchFolders = [
  path.resolve(__dirname + '/../../source'),
  path.resolve(__dirname + '/../../node_modules'),
];

module.exports = async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('./transformerHandler.js'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      extraNodeModules,
      nodeModulesPaths,
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
    watchFolders,
  };
};
