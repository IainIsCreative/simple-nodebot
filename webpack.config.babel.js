// @flow

import path from 'path';

export default {

  entry: [
    './browser.js',
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.js'],
  },

  devtool: 'source-map',

};
