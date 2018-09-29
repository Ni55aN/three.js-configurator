var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

var config = {
  entry: {
    THREEConfigurator: __dirname + '/src/index.js', 
    init: __dirname + '/src/init.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    // chunkFilename: '[name].bundle.js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(bin|gltf|png|jpg|gif)$/,
        use: [ 'file-loader' ]
      },
      {
        test: /\.bin$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "/"
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/public/index.html'
    })
  ]
};

module.exports = config;