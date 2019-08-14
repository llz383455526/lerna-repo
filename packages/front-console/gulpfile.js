const { src, dest, series } = require('gulp')
const del = require('del')

function clean(cb) {
  del('./product/assets/**')
  cb()
}

function copyAssets(cb) {
  src(['./assets/**/*']).pipe(dest('./product/assets/'))
  cb()
}
exports.default = series(clean, copyAssets)
