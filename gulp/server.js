module.exports = function (gulp) {
  const config = require('./config/config')

  gulp.task('server', function () {
    const webserver = require('gulp-webserver')

    gulp.src(config.destRoot)
      .pipe(webserver({
        livereload: true
      }))
  })
}
