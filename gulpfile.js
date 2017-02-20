var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var postcss = require('gulp-postcss');
var sprites = require('postcss-sprites');
var autoprefixer = require('autoprefixer');
var csso = require('gulp-csso');

var connect = require('gulp-connect');
var path = require('path');

gulp.task('connect', function () {
  connect.server({
    root: path.resolve('./'),
    port: 8203
  });
});

gulp.task('minify-script', function () {
  gulp.src('./js/main.js')
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./js/'));
});

gulp.task('sprite-style', function () {
  gulp.src('./css/*.css')
    .pipe(postcss([
      sprites({
        stylesheetPath: './*.css',
        spritePath: './img/'
      })
    ]))
    .pipe(gulp.dest('./css'))
});

gulp.task('prefix-style', function () {
  gulp.src('./css/style.css')
    .pipe(postcss([
      autoprefixer({
        browsers: [
          '> 1% in RU',
          'last 2 versions',
          'ie >=10'
        ],
        cascade: false
      })
    ]))
    .pipe(gulp.dest('./css/'));
});

gulp.task('minify-style', function () {
  gulp.src(['./css/*.css', '!./css/*.min.css'], {base: './css/'})
    .pipe(csso())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./css'))
});
