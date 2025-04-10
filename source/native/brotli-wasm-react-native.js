module.exports = {
  compress: () => {
    throw new Error('Brotli compression is not supported in React Native');
  },
};
