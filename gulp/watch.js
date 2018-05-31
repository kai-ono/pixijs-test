module.exports = function (gulp) {
  const config = require('./config/config')

  gulp.task('watch', function () {
    gulp.watch(config.src + '*.html', [ 'html' ])
    gulp.watch(config.src + 'css/*.scss', [ 'css' ])
    gulp.watch(config.src + 'js/**/*.js', [ 'js' ])
  })
}
