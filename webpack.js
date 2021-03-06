const webpack = require('webpack');
const path = require('path');

const devFlagPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.SHOCK_ENV || 'development'),
    ISO_ENV: JSON.stringify('browser'),
    SHOCK_ENV: JSON.stringify(process.env.SHOCK_ENV || 'development'), //Development by default.
    SHOCK_URI: JSON.stringify('') // Leave empty for relative routing.
  }
});

module.exports = {
  entry: [
    './dist/client/client.js'
  ],
  output: {
    path: __dirname + '/dist/client/static/',
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    /*new webpack.optimize.UglifyJsPlugin({
      "compress": true
    }),*/
    devFlagPlugin
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json'],
    fallback: path.join(__dirname, "node_modules"),
    alias: {
      "react": path.resolve('./node_modules/react'),
      "react-dom": path.resolve('./node_modules/react-dom')
    }
  },
  resolveLoader: {
    fallback: path.join(__dirname, "node_modules")
  },
  devtool: 'source-map',
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
