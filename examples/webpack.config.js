const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const host = 'localhost';
const port = 8081;
// port要修改的話,server.js也要改
const apiPort = 8082;

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    if (fs.statSync(path.join(__dirname, dir)).isDirectory()) {
      entries[dir] = path.join(__dirname, dir, 'index.js');
    }
    return entries;
  }, {}),
  output: {
    path: path.join(__dirname, '/'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
    ]
  },
  devServer: {
    host,
    port,
    contentBase: path.join(__dirname, '/'),
    compress: true,
    proxy: {
      '/api': {
        target: `http://${host}:${apiPort}`,
        secure: false,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /\/simple-component/,
          to: path.join(__dirname, 'simple-component', 'index.html'),
        },
        {
          from: /\/complex-call-api/,
          to: path.join(__dirname, 'complex-call-api', 'index.html'),
        },
        {
          from: /\/complex-axios/,
          to: path.join(__dirname, 'complex-axios', 'index.html'),
        },
        {
          from: /\/complex-hoc/,
          to: path.join(__dirname, 'complex-hoc', 'index.html'),
        }
      ]
    },
  },
  resolve: {
    alias: {
      'user-permissions': path.join(__dirname, '..', 'src'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV).trim(),
        'PROJECT_ENV': JSON.stringify(process.env.PROJECT_ENV).trim(),
      },
    }),
  ],
};