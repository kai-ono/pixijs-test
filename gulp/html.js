module.exports = function (gulp) {
  const config = require('./config/config')

  gulp.task('html', function () {
    const del = require('del')

    del(config.dest + '*.html', { force: true })

    return gulp.src(config.src + '**/*.html')
      .pipe(gulp.dest(config.dest))
  })
}
