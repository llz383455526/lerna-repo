let path = require('path')

module.exports = {
    prod: {
        env: {
            NODE_ENV: 'prod'
        },
        index: path.resolve(__dirname, '../product/index.html'),
        assetsRoot: path.resolve(__dirname, '../product'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],
	    cssSourceMap: true
    },
    dev: {
        env: {
            NODE_ENV: '"development"'
        },
        port: 8022,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        context: [ //代理路径
	        '/api'
        ],
        proxypath: 'https://openadmintest92.aiyuangong.com',
        cssSourceMap: false
    }
}
