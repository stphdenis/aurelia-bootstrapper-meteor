var gulp = require("gulp");
var runSequence = require("run-sequence");

gulp.task("eslint", function() {
  var eslint = require("gulp-eslint");
  return gulp.src(["src/**/*.js",'!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task("lint", function(callback) {
  runSequence("eslint", callback);
});
