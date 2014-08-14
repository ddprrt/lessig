var gulp = require('gulp'),
  less   = require('gulp-less'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin');

gulp.task('less', function() {
	return gulp.src('app/styles/main.less')
		.pipe(less())
		.pipe(gulp.dest('dist/styles'));
});

gulp.task('default', ['less']);
