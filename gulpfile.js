var gulp = require('gulp');
//browser sync
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})

//scss -> css
var sass = require('gulp-sass');

gulp.task('sass', () => {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

//watch
gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

//concatenate and minify
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

gulp.task('useref', () => {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

//concatenate and minify js
var gutil = require('gulp-util');
var concat = require('gulp-concat');
const babel = require("gulp-babel-minify");

gulp.task('scripts', function () {
    return gulp.src(['app/js/*.js'])
        .pipe(concat('main.min.js'))
        .pipe(babel({
            mangle: {
                keepClassNames: true
            }
        }))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/js'));
})

//cleaning dist folder
var del = require('del');

gulp.task('clean:dist', function () {
    return del.sync('dist');
})


//Tasks sequence
//gulp
var runSequence = require('run-sequence');

gulp.task('default', function (callback) {
    runSequence(['watch', 'sass', 'browserSync'],
        callback
    )
})

//gulp build
gulp.task('build', function (callback) {
    runSequence('clean:dist', ['default'], 'useref', 'scripts',
        callback)
})