// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint'),
    htmlMinify = require('gulp-minify-html'),
    stylus = require('gulp-stylus'),
    koutoSwiss = require('kouto-swiss');
    jeet = require('jeet');
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    imagemin  = require('gulp-image-optimization'),
    rename = require('gulp-rename');

// Path
var source = 'dev/',
    dist = 'staging/';

// Html Minification
gulp.task('htmlMinify', function() {

    var options = {
        empty: false,
        cdata: false,
        comments: false,
        conditionals: false,
        spare: true,
        quotes: true,
        loose: false
    };

    return gulp.src(
            [
                source + '*.html',
                source + '*/*.html',
                source + '*/*/*.html'
            ]
        )
        .pipe(htmlMinify(options))
        .pipe(gulp.dest(dist))
        .pipe(livereload());
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src(source + 'js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Stylus
gulp.task('stylus', function() {

    var options = {
        use: [koutoSwiss(), jeet()]
    };

    return gulp.src(source + 'stylus/*.styl')
        .pipe(stylus(options))
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest(dist + 'css'))
        .pipe(livereload());
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(source + 'js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest(dist + 'js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist + 'js'));
});

// Image minification
gulp.task('imagemin', function(cb) {
    gulp.src(
        [
            'assets/images/*.png',
            'assets/images/*.jpg',
            'assets/images/*.gif',
            'assets/images/*.jpeg'
        ]
    )
    .pipe(
        imagemin(
            {
                optimizationLevel: 5,
                progressive: true,
                interlaced: true
            }
        )
    )
    .pipe(gulp.dest('assets/images-min')).on('end', cb).on('error', cb);
});

// Watch Files For Changes
gulp.task('watch', function() {
    livereload.listen({basePath: dist});
    gulp.watch(source + '/*.html', ['htmlMinify']);
    gulp.watch(source + 'stylus/*.styl', ['stylus']);
    gulp.watch(source + 'js/*.js', ['lint', 'scripts']);
    gulp.watch('assets/images/*', ['imagemin']);
});

// Default Task
gulp.task('default', ['htmlMinify', 'stylus', 'lint', 'scripts', 'imagemin', 'watch']);
