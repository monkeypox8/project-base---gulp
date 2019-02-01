const themeName = 'main',
	dest = './',
	mainStylesheet = 'src/css/style.scss';

const gulp = require("gulp"),
	babel = require('gulp-babel'),
	eslint = require('gulp-eslint'),
	del = require('del'),
	sass = require("gulp-sass"),
	rename = require('gulp-rename');
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require("gulp-autoprefixer"),
	browserSync = require('browser-sync').create(),
	rollup = require('gulp-better-rollup'),
	minify = require('gulp-babel-minify'),
	resolve = require('rollup-plugin-node-resolve'),
	commonjs = require('rollup-plugin-commonjs'),
	rootImport = require('rollup-plugin-root-import'),
	replace = require('rollup-plugin-replace');



// Compile SCSS files to CSS
gulp.task("scss", function() {
	gulp.src(mainStylesheet)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle : "compact"
		}))
		.pipe(autoprefixer({
			browsers : ["last 20 versions"]
		}))
		.pipe(rename(`${themeName}.css`))
		.pipe(sourcemaps.write('src/maps'))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream());
});


// Compress SCSS files for production
gulp.task("compress_scss", function() {
	gulp.src(mainStylesheet)
		.pipe(sass({
			outputStyle : "compressed"
		}))
		.pipe(autoprefixer({
			browsers : ["last 20 versions"]
		}))
		.pipe(rename(`${themeName}.css`))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream());
});


// Compile JS
gulp.task('js', function() {
	gulp.src('src/js/main.js')
		.pipe(sourcemaps.init())
		.pipe(rollup({
			plugins: [
				resolve({
					preferBuiltins: false
				}),
				commonjs(),
				rootImport({
					root: `${__dirname}/src/js`,
					useEntry: 'prepend',
					extensions: '.js'
				}),
			]}, {
			format: 'iife'})
		).on('error', function(e) {
			console.log(e);
			this.emit('end');
		})
		.pipe(babel())
		.pipe(rename(`${themeName}.js`))
		.pipe(sourcemaps.write('src/maps'))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream());
});


gulp.task('buildjs', function () {
	gulp.src('src/js/main.js')
		.pipe(rollup({
			plugins: [
				resolve({
					preferBuiltins: false
				}),
				commonjs(),
				rootImport({
					root: `${__dirname}/src/js`,
					useEntry: 'prepend',
					extensions: '.js'
				}),
				replace({
					'process.env.NODE_ENV': JSON.stringify('production')
				}),
				eslint({})
			]}, {
			format: 'iife'})
		).on('error', function(e) {
			console.log(e);
			this.emit('end');
		})
		.pipe(babel())
		.pipe(minify({
			mangle: {
				keepClassName: true
			}
		}))
		.pipe(rename(`${themeName}.js`))
		.pipe(gulp.dest(dest));
});


// Watch asset folder for local development changes
gulp.task("watch", ["scss", "js"], function() {
	console.log('Starting dev server…\n');
	browserSync.init({
		proxy: 'http://localhost:8080',  // assumes http-server is running @ default port
		open: false,
		notify: true,
		reloadOnRestart: true,
		ghostMode: false,
		scrollThrottle: 200
	});
	gulp.watch("src/css/**/*", ["scss"]);
	gulp.watch("src/js/**/*", ["js"]);
});


// Clear development files for production
gulp.task("clean", function () {
	console.log('Deleting map files…\n');
	return del(['src/maps/**/*.map']);
});


// Build files for production
gulp.task("build", ["clean", "compress_scss", "buildjs"], function() {
	gulp.task("src/js/**/*", ["buildjs"]);
	gulp.task(mainStylesheet, ["compress_scss"]);
	console.log('Production build complete!\n');
});


// Set watch as default task
gulp.task("default", ["watch"]);

