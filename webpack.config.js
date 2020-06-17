const chokidar = require('chokidar')
const path = require('path')
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin')
const pugIncludeGlob = require('pug-include-glob')
const globImporter = require('node-sass-glob-importer')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SvgStorePlugin = require('external-svg-sprite-loader')
const CssUrlRelativePlugin = require('css-url-relative-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (_, { mode }) => ({
  devServer: {
    port: 3000,
    stats: 'errors-only',
    before(app, server) {
      chokidar
        .watch(['./src/pages/**/*.pug', './src/blocks/**/*.pug', './src/blocks/*/data.json'])
        .on('all', () => server.sockWrite(server.sockets, 'content-changed'))
    }
  },
  entry: WebpackWatchedGlobEntries.getEntries([
    path.resolve(__dirname, 'src/blocks/*/index.js'),
    path.resolve(__dirname, 'src/scss/index.scss')
  ]),
  output: {
    filename: `assets/js/[name]-[hash:8].${mode === 'production' ? 'min.js' : 'js'}`,
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              plugins: [pugIncludeGlob()]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                ctx: {
                  mode
                }
              }
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                importer: globImporter(),
              },
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: SvgStorePlugin.loader,
            options: {
              iconName: 'icon-[name]',
              name: 'assets/svg/sprite.svg'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: 'assets/fonts/[folder]/[name].[ext]' }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/img/[1]/[name].[ext]',
              regExp: /blocks\/([a-z0-9-_]+)\//
            }
          }
        ]
      }
    ]
  },
  plugins: mode === 'development' ? [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './src/pages/index.pug'
    }),
    new SvgStorePlugin(),
    new WebpackWatchedGlobEntries()
  ] : [
      new CleanWebpackPlugin(),
      new HTMLWebpackPlugin({
        filename: 'index.html',
        inject: true,
        template: './src/pages/index.pug'
      }),
      new SvgStorePlugin(),
      new WebpackWatchedGlobEntries(),
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name]-[hash:8].min.css'
      }),
      new CssUrlRelativePlugin()
    ],
  resolve: {
    modules: ['node_modules', './src/blocks']
  }
})
