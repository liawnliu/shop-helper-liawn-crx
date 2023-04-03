import { resolve, posix } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import Components from 'unplugin-vue-components/webpack'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from "unplugin-icons/webpack"
import AutoImport from 'unplugin-auto-import/webpack';
import type { Configuration } from 'webpack'
import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'

function assetsPath(_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? './static'
    : 'static'
  return posix.join(assetsSubDirectory, _path)
}
const mode: 'production' | 'development' =
  (process.env.MODE as any) ?? 'development'

const pathSrc = resolve(__dirname, 'src')

const config: Configuration = {
  devtool: "source-map",	// 启用sourceMap
  mode,
  entry: {
    'background': resolve('src', 'pages/background'),
    'content': resolve('src', 'pages/content'),
    'option': resolve('src', 'pages/option'),
    'popup': resolve('src', 'pages/popup'),
    'my_xhr': resolve('src', 'inject/my_xhr.ts'),
    'content_xhr': resolve('src', 'inject/content_xhr.ts'),
  },
  output: {
    path: resolve(__dirname, './chrome'),
    publicPath: './',
    filename: '[name].main.js'
  },
  resolve: {
    alias: {
      '@': pathSrc,
      'static': resolve('static'),
    },
    extensions: ['.ts', '.js', '.mjs', '.json'],
    fallback: { path: require.resolve("path-browserify") }
  },
  module: {
    rules: [
      {
        test: /\.mjs$/i,
        resolve: { byDependency: { esm: { fullySpecified: false } } },
      },
      { test: /\.vue$/, loader: 'vue-loader' },
      {
        test: /\.m?[tj]s$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      }, {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    /* new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }), */
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'src/pages/popup/popup.html',
      inject: 'body',
      chunks: ["popup"],
      minify: { //压缩
        removeComments: true,
        collapseWhitespace: true,
      }
    }),
    new webpack.DefinePlugin({
      '__VUE_OPTIONS_API__': true,
      '__VUE_PROD_DEVTOOLS__': false
    }),
    new HtmlWebpackPlugin({
      filename: 'option.html',
      template: 'src/pages/option/option.html',
      inject: 'body',
      chunks: ["option"],
      minify: { //压缩
        removeComments: true,
        collapseWhitespace: true,
      }
    }),
    new CopyWebpackPlugin([{
      from: resolve(__dirname, 'src/manifest.json'),
      to: ''
    },
    {
      from: resolve(__dirname, 'static/'),
      to: 'static/'
    }
    ], {
      copyUnmodified: true
    }),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'i',
        })
      ],
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        ElementPlusResolver()
      ],
    }),
    Icons({
      autoInstall: true,
    }),
  ],
}

export default config
