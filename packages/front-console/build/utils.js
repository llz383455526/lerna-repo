let path = require('path')
let config = require('../config')
let ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function(_path) {
	let assetsSubDirectory
	switch (process.env.NODE_ENV) {
		case 'prod':
			assetsSubDirectory = config.prod.assetsSubDirectory
			break
		default:
			assetsSubDirectory = config.dev.assetsSubDirectory
	}
	console.log(assetsSubDirectory)
    //let assetsSubDirectory = process.env.NODE_ENV === 'prod' ? config.prod.assetsSubDirectory : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
    options = options || {}
    
    function generateLoaders(loaders) {
        let sourceLoader = loaders.map(function(loader) {
            let extraParamChar
            if (/\?/.test(loader)) {
                loader = loader.replace(/\?/, '-loader?')
                extraParamChar = '&'
            } else {
                loader = loader + '-loader'
                extraParamChar = '?'
            }
            return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
        }).join('!')
	    
        if (options.extract) {
            return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
        } else {
            return ['vue-style-loader', sourceLoader].join('!')
        }
    }
	
    return {
        css: generateLoaders(['css']),
        postcss: generateLoaders(['css']),
        less: generateLoaders(['css', 'less']),
        sass: generateLoaders(['css', 'sass?indentedSyntax']),
        scss: generateLoaders(['css', 'sass']),
        stylus: generateLoaders(['css', 'stylus']),
        styl: generateLoaders(['css', 'stylus'])
    }
}

exports.styleLoaders = function(options) {
    let output = []
    let loaders = exports.cssLoaders(options)
    for (let extension in loaders) {
        let loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            loader: loader
        })
    }
    return output
}