const themeName = 'main',
	dest = './',
	mainStylesheet = 'src/css/style.scss';

const gulp = require("gulp");
const babel = require('gulp-babel');
const del = require('del');
const sass = require("gulp-sass");
const rename = require('gulp-rename');
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require("gulp-autoprefixer"),
	browserSync = require('browser-sync').create(),
	rollup = require('gulp-better-rollup'),
	minify = require('gulp-babel-minify'),
	// alias = require('rollup-plugin-alias'),
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
gulp.task('js', function () {
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
				replace({
					'process.env.NODE_ENV': JSON.stringify('production')
				}),
				babel({
					exclude: 'node_modules/**',
					presets: [['env', {
						"modules": false,
						"debug": true
					}], 'stage-3'],
					babelrc: false,
					plugins: ['external-helpers']
				})
			]}, {
			format: 'iife'})
		).on('error', function(e) {
			console.log(e);
			this.emit('end');
		})
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
				eslint({}),
				babel({
					exclude: 'node_modules/**',
					presets: [['env', {
						"modules": false,
						"debug": true
					}], 'stage-3'],
					babelrc: false,
					plugins: ['external-helpers']
				})
			]}, {
			format: 'iife'})
		).on('error', function(e) {
			console.log(e);
			this.emit('end');
		})
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
	gulp.watch("scss/**/*", ["scss"]);
	gulp.watch("js/**/*", ["js"]);
});


// Clear development files for production
gulp.task("clean", function () {
	console.log('Deleting map files…\n');
	return del(['maps/**/*.map']);
});


// Build files for production
gulp.task("build", ["clean", "compress_scss", "buildjs"], function() {
	gulp.task("js/**/*", ["buildjs"]);
	gulp.task(mainStylesheet, ["compress_scss"]);
	console.log('Production build complete!\n');
});


// Set watch as default task
gulp.task("default", ["watch"]);

