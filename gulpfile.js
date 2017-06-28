var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

// js压缩
gulp.task('script', function () {
    return gulp.src('lib/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
});

//默认
gulp.task('default', function(){
    gulp.start('script');
});