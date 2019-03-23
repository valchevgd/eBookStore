'use strict';

let gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cp = require("child_process"),
    browserSync = require('browser-sync').create()
;

gulp.task('css', function() {
    return gulp.src( '_assets/css/**/*.css' )
        .pipe( autoprefixer() )
        .pipe( gulp.dest( './docs/css/' ) )
        .pipe(browserSync.stream({ match: '**/*.css' }))
        ;
});


gulp.task('jekyll', function () {

    return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit", shell:true });


});

gulp.task('watch', function() {

    browserSync.init({
        server: {
            baseDir: './docs/'
        }
    });

    gulp.watch( '_assets/css/**/*.css', gulp.series('css') );

    gulp.watch( 'docs/**/*.html' ).on('change', browserSync.reload );
    gulp.watch( 'docs/**/*.js' ).on('change', browserSync.reload );

    gulp.watch(
        [
            './*.html',
            './_includes/**/*',
            './_layouts/**/*',
            './_pages/**/*',
            './_posts/**/*',
            './_projects/**/*'
        ]).on('change',  gulp.series('jekyll', 'css'));

});

gulp.task('default', gulp.series('css', 'watch'));
