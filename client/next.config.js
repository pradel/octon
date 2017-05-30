const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

// Only require dotenv in dev mode
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

module.exports = {
  webpack: (config) => {
    const plugin = new webpack.DefinePlugin({
      'process.env.GRAPHCOOL_URL': JSON.stringify(process.env.GRAPHCOOL_URL),
      'process.env.AUTH0_CLIENT_ID': JSON.stringify(process.env.AUTH0_CLIENT_ID),
      'process.env.AUTH0_CLIENT_DOMAIN': JSON.stringify(process.env.AUTH0_CLIENT_DOMAIN),
    });
    config.plugins.push(plugin);
    return config;
  },
};
