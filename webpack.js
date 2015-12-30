const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const devFlagPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
    APP_ENV: JSON.stringify('browser')
  }
});

module.exports = {
  entry: [
    './dist/client/index.js'
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
    extensions: ['', '.js', '.json']
  },
  //devtool: 'source-map',
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
