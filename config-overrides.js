const path = require('path');

module.exports = {
  webpack: function (config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      crypto: require.resolve('crypto-browserify'),
      assert: require.resolve('assert/'),
    };
    return config;
  }
};
