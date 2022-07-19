const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const paths = require('./utils/paths');
const getClientEnvironment = require('./utils/env');

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }
  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

console.log(`NEW_JSX_TRANSFORM=${hasJsxRuntime}`);

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const cssSourceMap = isEnvProduction ? shouldUseSourceMap : isEnvDevelopment;

  const plugins = [
    new HtmlWebpackPlugin(
      Object.assign(
        {
          inject: true,
          template: paths.appHtml
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            }
          : undefined
      )
    ),
    new MiniCssExtractPlugin({
      filename: isEnvDevelopment
        ? 'static/css/[name].css'
        : 'static/css/[name].[contenthash].css',
      chunkFilename: isEnvDevelopment
        ? 'static/css/[id].css'
        : 'static/css/[id].[contenthash].css'
    }),
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: paths.publicUrlOrPath,
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints.main.filter(
          fileName => !fileName.endsWith('.map')
        );
        return {
          files: manifestFiles,
          entrypoints: entrypointFiles
        };
      }
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw)
  ];

  if (isEnvDevelopment) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (isEnvProduction && shouldInlineRuntimeChunk) {
    plugins.push(
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/])
    );
  }

  const devtoolModuleFilenameTemplate = isEnvProduction
    ? info =>
        path
          .relative(paths.appSrc, info.absoluteResourcePath)
          .replace(/\\/g, '/')
    : isEnvDevelopment &&
      (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'));

  return {
    target: ['browserslist'],
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    bail: true,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    entry: paths.appIndexJs,
    output: {
      path: paths.appBuild,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath: paths.publicUrlOrPath,
      devtoolModuleFilenameTemplate
    },
    //cache: VERIFY
    infrastructureLogging: {
      level: 'none'
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          }
        }),
        new CssMinimizerPlugin()
      ]
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        shouldUseSourceMap && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader')
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // https://webpack.js.org/guides/typescript/
            // {
            //   //test: /\.tsx?$/,
            //   test: /\.(js|mjs|jsx|ts|tsx)$/,
            //   exclude: /@babel(?:\/|\\{1,2})runtime/,
            //   use: [
            //     {
            //       loader: require.resolve('ts-loader'),
            //       options: {
            //         // configFile: false,
            //         // compact: false,
            //         // cacheDirectory: true,
            //         // cacheCompression: false,
            //         // sourceMap: isEnvProduction
            //         //   ? shouldUseSourceMap
            //         //   : isEnvDevelopment
            //       }
            //     }
            //   ]
            // },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                compact: isEnvProduction,
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                presets: [
                  [
                    require.resolve('babel-preset-react-app'),
                    {
                      runtime: hasJsxRuntime ? 'automatic' : 'classic'
                    }
                  ]
                ]
              }
              // use: [
              //   {
              //     loader: require.resolve('babel-loader'),
              //     options: {
              //       sourceMaps: shouldUseSourceMap,
              //       inputSourceMap: shouldUseSourceMap
              //     }
              //   }
              // ]
            },
            {
              test: /\.(png|svg|jpe?g|gif|bmp)$/,
              loader: require.resolve('file-loader'),
              options: {
                name: '[name].[hash].[ext]',
                outputPath: 'static/media'
              }
            },
            {
              test: /\.(sa|sc|c)ss$/,
              use: [
                isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: cssSourceMap
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: cssSourceMap
                  }
                }
              ]
            },
            {
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource'
            }
          ]
        }
      ].filter(Boolean)
    },
    // https://webpack.js.org/guides/typescript/
    resolve: {
      // VERIFY
      extensions: ['.tsx', '.jsx', '.ts', '.js']
    },
    plugins: plugins
  };
};
