module.exports = (function () {
  const minimist = require('minimist')
  const env = minimist(process.argv.slice(2))
  this.srcRoot = './src/'
  this.srcPc = this.srcRoot
  this.srcSp = this.srcRoot + 'sp/'
  this.destRoot = './dest/'
  this.destPc = this.destRoot
  this.destSp = this.destRoot + 'sp/'

  if (env.sp) {
    this.dest = this.destSp
    this.src = this.srcSp
  } else {
    this.dest = this.destPc
    this.src = this.srcPc
  }

  return this
})()
