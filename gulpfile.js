var gulp = require('gulp'),
    webpack = require('webpack-stream');

gulp.task('build', function() {
    return webpack(require('./webpack.config.js'))
           .pipe(gulp.dest('./build/'));
});