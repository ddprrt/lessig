var gulp 	= require('gulp'),
  less   	= require('gulp-less'),
  concat 	= require('gulp-concat'),
  uglify 	= require('gulp-uglify'),
  connect 	= require('gulp-connect'),
  cssmin	= require('gulp-cssmin'),
  prefix	= require('gulp-autoprefixer'),
  useref 	= require('gulp-useref');

gulp.task('less', function() {
	return gulp.src('app/styles/main.less')
		.pipe(less())
		.pipe(prefix())
		.pipe(connect.reload())
		.pipe(gulp.dest('dist/styles'));
});

gulp.task('watch', function() {
	gulp.watch('app/styles/**/*.less', ['less']);
});

gulp.task('connect', function() {
	connect.server({
		root: ['app','dist'],
		livereload: true,
		port: 3000
	});
});

gulp.task('useref', function() {
	var assets = useref.assets();

	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('styles', ['less', 'useref'], function() {
	return gulp.src('dist/styles/*.css')
		.pipe(cssmin())
		.pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', ['useref'], function() {
	return gulp.src('dist/scripts/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'));
});

gulp.task('default', ['less']);

gulp.task('dev', ['less', 'connect', 'watch']);

gulp.task('build', ['styles', 'scripts']);
