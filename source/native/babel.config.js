module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'brotli-wasm': './brotli-wasm-react-native.js', // Replace with our own module
        },
      },
    ],
  ],
};
