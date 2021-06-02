const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.(woff|woff2|eot|ttf)$/,
  use: [{ loader: 'file-loader' }],
});

rules.push({
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  use: [{ loader: 'file-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
