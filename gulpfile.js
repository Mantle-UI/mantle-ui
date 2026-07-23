'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    flatten = require('gulp-flatten'),
    Transform = require('stream').Transform,
    rootPackage = require('./package.json');

function addPackageVersion() {
    return new Transform({
        objectMode: true,
        transform: function (file, encoding, callback) {
            try {
                var packageJson = JSON.parse(file.contents.toString());

                packageJson.version = rootPackage.version;
                file.contents = Buffer.from(JSON.stringify(packageJson, null, 4) + '\n');

                callback(null, file);
            } catch (error) {
                callback(error);
            }
        }
    });
}

/** @deprecated */
gulp.task('build-css', function () {
    return gulp
        .src([process.env.INPUT_DIR + 'common/Common.css', process.env.INPUT_DIR + '**/*.css'])
        .pipe(concat('mantle-ui-react.css'))
        .pipe(gulp.dest(process.env.OUTPUT_DIR + 'resources'))
        .pipe(uglifycss({ uglyComments: true }))
        .pipe(rename('mantle-ui-react.min.css'))
        .pipe(gulp.dest(process.env.OUTPUT_DIR + 'resources'));
});

gulp.task('build-mantle-ui-react-css', function () {
    return gulp.src(['./styles/mantle-ui-react.css']).pipe(concat('mantle-ui-react.css')).pipe(gulp.dest('dist/resources')).pipe(rename('mantle-ui-react.min.css')).pipe(gulp.dest('dist/resources'));
});

gulp.task('build-themes', function () {
    return (
        gulp
            .src(['public/themes/**/*'])
            //.pipe(uglifycss({"uglyComments": true}))
            .pipe(gulp.dest(process.env.OUTPUT_DIR + 'resources/themes'))
    );
});

gulp.task('copy-fonts', function () {
    return gulp.src(['public/themes/**/fonts/*'], { encoding: false }).pipe(gulp.dest(process.env.OUTPUT_DIR + 'resources/themes'));
});

/** @deprecated */
gulp.task('images', function () {
    return gulp
        .src([process.env.INPUT_DIR + '**/images/*.png', process.env.INPUT_DIR + '**/images/*.gif'])
        .pipe(flatten())
        .pipe(gulp.dest(process.env.OUTPUT_DIR + 'resources/images'));
});

gulp.task('build-exports', function () {
    return gulp.src(['exports/*.js', 'exports/*.d.ts']).pipe(gulp.dest(process.env.OUTPUT_DIR));
});

gulp.task('build-meta', function () {
    return gulp.src(['README.md', 'LICENSE.md']).pipe(gulp.dest(process.env.OUTPUT_DIR));
});

/** @deprecated */
gulp.task('copy-css', function () {
    return gulp
        .src([process.env.INPUT_DIR + '**/Common.css', process.env.INPUT_DIR + '**/*.css'])
        .pipe(uglifycss({ uglyComments: true }))
        .pipe(
            rename(function (path) {
                path.basename = path.basename.toLowerCase();
                path.extname = '.min' + path.extname;
            })
        )
        .pipe(gulp.dest('./' + process.env.OUTPUT_DIR));
});

gulp.task('copy-d.ts', function () {
    return gulp
        .src(process.env.INPUT_DIR + '**/*.d.ts')
        .pipe(
            rename(function (path) {
                path.basename = path.basename.toLowerCase();
            })
        )
        .pipe(gulp.dest('./' + process.env.OUTPUT_DIR));
});

gulp.task('copy-package.json', function () {
    return gulp.src(process.env.INPUT_DIR + '**/package.json').pipe(addPackageVersion()).pipe(gulp.dest('./' + process.env.OUTPUT_DIR));
});

gulp.task('copy-bin', function () {
    return gulp.src(['bin/mantle-ui-migrate.cjs']).pipe(gulp.dest('./' + process.env.OUTPUT_DIR + 'bin'));
});

//Building project with run sequence
gulp.task('copy-files', gulp.series('copy-d.ts', 'copy-package.json', 'copy-bin'));
gulp.task('build-resources', gulp.series('build-mantle-ui-react-css', 'images', 'build-themes', 'copy-fonts', 'build-meta', 'copy-files'));
