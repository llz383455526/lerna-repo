let path = require('path')

let proxypath = null

switch (process.env.NODE_SERVER_ENV) {
  case 'prod':
    proxypath = 'https://openadmin.aiyuangong.com'
    break
  case 'test':
    proxypath = 'https://openadmintest.aiyuangong.com'
    break
  case '94':
    proxypath = 'http://openadmintest94.aiyuangong.com'
    break
  case '92':
    proxypath = 'https://openadmintest92.aiyuangong.com'
    break
  default :
    break
}

console.log('proxypath = ', proxypath)

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
        port: 8023,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        context: [ //代理路径
	        '/api'
        ],
        proxypath: proxypath,
        cssSourceMap: false
    }
}
