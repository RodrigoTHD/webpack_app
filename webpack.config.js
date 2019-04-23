const path = require('path');
const Fiber = require('fibers');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV == 'production';

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        app: './src/app.js',        
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './static/js/[name].bundle.js',
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        clientLogLevel: 'error', // 'none' | 'info' | 'error' | 'warning'
        compress: true,
        port: 5000,
        open: true,
        stats: 'errors-only'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }, {
                test: /\.scss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader                    
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        implementation: require("sass"),
                        fiber: Fiber,
                        outputPath: 'static/css'
                    }
                }]
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'static/media'
                    }
                }]
            }, {
                test: /\.(ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '/'
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "static/css/[name].css",
            chunkFilename: "static/css/[id].css",
        }),
        new HtmlWebpackPlugin({
            // chunks: ['contact'], // add especific file.
            //excludeChunks: ['contact'], allows you ignore other files.
            title: 'Webpack 4 - Starter App',
            filename: 'index.html',
            template: path.resolve(__dirname, 'public/index.ejs'),
            hash: true,
            minify: {
                collapseWhitespace: isProd,
                removeComments: isProd,
                removeRedundantAttributes: isProd,
                removeScriptTypeAttributes: isProd,
                removeStyleLinkTypeAttributes: isProd,
                useShortDoctype: isProd
            }
        })
    ]
}