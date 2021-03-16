function log(message=''){
  console.group('function log in module-1-1')
  console.log(message)
}
module.exports = {
  log
}