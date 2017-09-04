const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

// Only require dotenv in dev mode
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

module.exports = {
  webpack: config => {
    const plugin = new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
      'process.env.GRAPHCOOL_URL': JSON.stringify(process.env.GRAPHCOOL_URL),
      'process.env.GITHUB_CLIENT_ID': JSON.stringify(
        process.env.GITHUB_CLIENT_ID
      ),
    });
    config.plugins.push(plugin);
    return config;
  },
};
