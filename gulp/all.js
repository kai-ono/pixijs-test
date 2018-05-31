module.exports = function (gulp) {
  gulp.task('all', [ 'html', 'img', 'css', 'js', 'lib' ])
  gulp.task('default', [ 'server', 'watch' ])
}
