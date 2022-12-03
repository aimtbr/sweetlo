require('dotenv/config');

const config = require('./config');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const { NODE_ENV, HOST, PORT, APP_LOCATION } = process.env;
  const { name } = config;
  const environment = argv.mode || NODE_ENV;

  const assetsDir = 'assets/';
  const entryPoint = 'src/index.jsx';
  const outputDir = 'dist/';
  const resolveExtensions = ['*', '.js', '.jsx', '.json', '.scss'];
  // SET TO true IF USING THE ServiceWorker
  const writeToDisk = false;

  // PROVIDE THE WEBSITE TITLE!
  const title = 'sweetlo';
  // PROVIDE THE WEBSITE DESCRIPTION (OPTIONAL)
  const description = '';
  const location = APP_LOCATION;

  const mode = environment;
  const port = PORT;
  const host = HOST;
  let devtool = 'inline-source-map';
  let styleLoader = 'style-loader';

  const plugins = [
    new HtmlWebpackPlugin({
      template: `${assetsDir}index.ejs`,
      filename: 'index.html',
      publicPath: './',
      name,
      title,
      description,
      location,
    }),
    new Dotenv({
      allowEmptyValues: true,
      systemvars: true,
    }),
  ];

  if (environment === 'production') {
    // disable the devtool
    devtool = false;

    styleLoader = MiniCssExtractPlugin.loader;

    plugins.push(new MiniCssExtractPlugin());
  }

  return [
    {
      entry: [path.resolve(__dirname, entryPoint)],
      mode,
      devtool,
      output: {
        filename: '[name].[contenthash].js',
        assetModuleFilename: `${assetsDir}[name]_[hash][ext][query]`,
        path: path.resolve(__dirname, outputDir),
        publicPath: '/',
        clean: true,
      },
      devServer: {
        static: path.resolve(__dirname, assetsDir),
        host,
        port,
        hot: true,
        historyApiFallback: true,
        devMiddleware: {
          writeToDisk,
        },
      },
      resolve: {
        extensions: resolveExtensions,
        fallback: {
          fs: false,
          path: false,
        },
      },
      plugins,
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            include: [path.resolve(__dirname, 'src')],
            use: ['babel-loader'],
          },
          {
            test: /\.(s[ac]|c)ss$/,
            use: [styleLoader, 'css-loader', 'sass-loader'],
          },
          {
            test: /\.(svg|png|jpe?g|gif)$/,
            include: [path.resolve(__dirname, assetsDir, 'images')],
            exclude: [path.resolve(__dirname, assetsDir, 'images', 'favicons')],
            type: 'asset/resource',
          },
          {
            test: /\.(svg|png|jpe?g)$/,
            include: [path.resolve(__dirname, assetsDir, 'images', 'favicons')],
            type: 'asset/resource',
            // do not add a hash to these resources, that is keep the original filename
            generator: {
              filename: `${assetsDir}[name][ext]`,
            },
          },
          {
            // transform the included resources into React components
            test: /\.svg$/,
            include: [path.resolve(__dirname, assetsDir, 'icons')],
            use: ['@svgr/webpack'],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            include: [path.resolve(__dirname, assetsDir, 'fonts')],
            type: 'asset/resource',
          },
        ],
      },
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      },
    },
  ];
};
