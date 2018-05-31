module.exports = function (gulp) {
  const config = require('./config/config')

  gulp.task('css', function () {
    const del = require('del')
    const rename = require('gulp-rename')
    const postcss = require('gulp-postcss')
    const sourcemaps = require('gulp-sourcemaps')
    const cssnext = require('postcss-cssnext')
    const precss = require('precss')
    const csswring = require('csswring')
    const plugins = [
      cssnext({
        browsers: [
          'last 2 version',
          'ie >= 11',
          'iOS >= 7',
          'Android >= 4.4'
        ]
      }),
      precss(),
      csswring()
    ]

    del(config.dest + 'css/*', { force: true })

    return gulp.src(config.src + 'css/[!_]*.scss')
      .pipe(sourcemaps.init())
      .pipe(postcss(plugins))
      .pipe(rename({
        extname: '.css'
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.dest + 'css'))
  })
}
