module.exports = function (gulp) {
  const config = require('./config/config')

  gulp.task('eslint', function () {
    const eslint = require('gulp-eslint')
    const plumber = require('gulp-plumber')

    gulp.src(config.srcPc + 'js/*.js')
      .pipe(plumber())
      .pipe(eslint({
        useEslintrc: true
      }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  })

  gulp.task('cleanjs', function () {
    const del = require('del')
    return del(config.destPc + 'js/*', { force: true })
  })

  gulp.task('js', [ 'cleanjs', 'eslint' ], function () {
    const rename = require('gulp-rename')
    const browserify = require('browserify')
    const source = require('vinyl-source-stream')
    const buffer = require('vinyl-buffer')
    const uglify = require('gulp-uglify')

    browserify({
      entries: [ config.srcPc + 'js/script.js' ],
      transform: [['babelify', {
        comments: false
      }]]
    })
      .bundle()
      .pipe(source('script.js'))
      .pipe(buffer())
      .pipe(gulp.dest(config.destPc + 'js/'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(config.destPc + 'js/'))
  })

  gulp.task('lib', function () {
    const del = require('del')
    del(config.destPc + 'lib/*', { force: true })

    gulp.src([
      config.srcPc + 'lib/*',
      './node_modules/pixi.js/dist/pixi.min.js',
      './node_modules/pixi.js/dist/pixi.min.js.map'
    ])
      .pipe(gulp.dest(config.destPc + 'lib/'))
  })
}
