let config = require('../config')
let webpack = require('webpack')
let merge = require('webpack-merge')
let utils = require('./utils')
let baseWebpackConfig = require('./webpack.base.conf')
let HtmlWebpackPlugin = require('html-webpack-plugin')

Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['webpack-hot-middleware/client?noInfo=true'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    module: {
        rules:[{
	        test: /\.css/,
	        use: [{
		        loader: "style-loader" // creates style nodes from JS strings
	        }, {
		        loader: "css-loader", // translates CSS into CommonJS
	        }]
        }, {
	        test: /\.scss$/,
	        use: [{
		        loader: "style-loader" // creates style nodes from JS strings
	        }, {
		        loader: "css-loader", // translates CSS into CommonJS
	        }, {
		        loader: "fast-sass-loader", // compiles Sass to CSS
	        }]
        }]
    },
    devtool: 'eval',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            favicon: 'favicon.ico',
            inject: true
        })
    ]
})