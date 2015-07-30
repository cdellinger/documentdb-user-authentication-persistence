var gulp = require('gulp');

var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('lint', function() {
	return gulp.src('./lib/*.js')
		//.pipe(jshint('.jshintrc'))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mocha', function () {
	gulp.src('./test/*.js')
		.pipe(mocha({ reporter: 'nyan' }));
});


gulp.task('test', ['lint', 'mocha']);