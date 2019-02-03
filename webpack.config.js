const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Fiber = require('fibers');

const isProd = process.env.NODE_ENV == 'production';

module.exports = {
    entry: {
        app: './src/app.js',
        contact: './src/contact.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        clientLogLevel: 'error', // 'none' | 'info' | 'error' | 'warning'
        compress: isProd,
        port: 9000,
        open: true // open in new window every time we are running.        
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
                options: {
                    implementation: require("sass"),
                    fiber: Fiber
                }
                // ,
                // options: {
                //     includePaths: ['src/scss/']
                // }
            }]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            title: 'Index Page',
            filename: 'index.html',
            template: './src/template/index.ejs',
            excludeChunks: ['contact'],
            hash: true,
            // minify: {
            //     collapseWhitespace: isProd,
            //     removeComments: isProd,
            //     removeRedundantAttributes: isProd,
            //     removeScriptTypeAttributes: isProd,
            //     removeStyleLinkTypeAttributes: isProd,
            //     useShortDoctype: isProd                
            // }           
        }),
        new HtmlWebpackPlugin({
            title: 'Contact Page',
            filename: 'contact.html',
            template: './src/template/index.ejs',
            chunks: ['contact'],
            hash: true  
        })
    ]
}