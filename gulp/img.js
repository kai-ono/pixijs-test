module.exports = function (gulp) {
  const config = require('./config/config')

  gulp.task('img', function () {
    const del = require('del')

    del(config.dest + 'img/*', { force: true })

    return gulp.src(config.src + 'img/*')
      .pipe(gulp.dest(config.dest + 'img'))
  })
}
