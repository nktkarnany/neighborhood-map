var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');

// Minify JS
gulp.task('minify-js', function () {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'));
});

// Minify Css
gulp.task('minify-css', function () {
    return gulp.src('src/css/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.watch('src/js/*.js', ['minify-js']);
gulp.watch('src/css/*css', ['minify-css']);

gulp.task('default', ['minify-js', 'minify-css']);
