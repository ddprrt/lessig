var gulp 	= require('gulp'),
  less   	= require('gulp-less'),
  concat 	= require('gulp-concat'),
  uglify 	= require('gulp-uglify'),
  connect 	= require('gulp-connect'),
  usemin 	= require('gulp-usemin');

gulp.task('less', function() {
	return gulp.src('app/styles/main.less')
		.pipe(less())
		.pipe(connect.reload())
		.pipe(gulp.dest('dist/styles'));
});

gulp.task('watch', function() {
	gulp.watch('app/styles/**/*.less', ['less']);
});

gulp.task('connect', function() {
	connect.server({
		root: ['app','dist'],
		livereload: true
	});
});

gulp.task('default', ['less']);

gulp.task('dev', ['connect', 'watch']);
