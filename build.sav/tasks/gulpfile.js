require('es6-symbol/implement'); // used by babel-dts-generator (using node 10.0.2)

var gulp = require("gulp");
var rename = require('gulp-rename');
var to5 = require('gulp-babel');
//var clean = require("gulp-clean");
var runSequence = require("run-sequence");
var assign = Object.assign || require('object.assign');
//var gulpTypings = require("gulp-typings");
//var exec = require('child_process').exec;
//var git = require("gulp-git");
var path = require('path');
var fs = require("fs");

var paths = require('../paths');
var compilerOptions = require('../babel-options');

require('./clean');
require('./doc');
require('./lint');
require('./install-typings');
require('./prepare-release');

var jsName = paths.packageName + '.js';

// Build to es5.
gulp.task('build-commonjs', function () {
  return gulp.src(paths.root + 'index.js')
    .pipe(rename(jsName))
    .pipe(to5(assign({}, compilerOptions.commonjs())))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-dts', function(){
  return gulp.src(paths.root + 'index.d.ts')
      .pipe(rename(paths.packageName + '.d.ts'))
      .pipe(gulp.dest(paths.output))
});

gulp.task("git-add", function() {
  return gulp.src("dist/**")
    .pipe(git.add());
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    'lint',
    'clean-typings',
    'install-typings',
    'build-commonjs',
    'build-dts',
    callback
  );
});
