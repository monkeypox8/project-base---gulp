	const sources = {
		default: {
			outputPath: './'
		},
		styles: {
			inputPath: 'src/css/',
			inputFile: 'style.scss',
			inputFullPath: 'src/css/style.scss',
			outputFile: 'style.css'
		},
		scripts: {
			inputPath: 'src/js/',
			inputFile: 'main.js',
			inputFullPath: 'src/js/main.js',
			outputFile: 'app.js',
		},
		assets: {
			inputPath: 'src/img/',
			outputPath: 'assets/img/'
		},
		sourcemaps: {
			outputPath: 'src/maps/'
		}
	};


const gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	babel = require('rollup-plugin-babel'),
	browserSync = require('browser-sync').create(),
	del = require('del'),
	eslint = require('gulp-eslint'),
	imagemin = require('gulp-imagemin'),
	minify = require('gulp-babel-minify'),
	rename = require('gulp-rename'),
	rollup = require('gulp-better-rollup'),
	sass = require("gulp-sass"),
	sourcemaps = require('gulp-sourcemaps'),
	browserSyncPath = 'http://localhost:8080';


// Concat SCSS files to CSS for development
gulp.task("scss", function() {
	gulp.src(sources.styles.inputFullPath)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle : "compact"
		}))
		.pipe(autoprefixer({
			browsers : ["last 20 versions"]
		}))
		.pipe(rename(sources.styles.outputFile))
		.pipe(sourcemaps.write(sources.sourcemaps.outputpath))
		.pipe(gulp.dest(sources.default.outputPath))
		.pipe(browserSync.stream());
});


// Compress SCSS files for production
gulp.task("compress_scss", function() {
	gulp.src(sources.styles.inputFullPath)
		.pipe(sass({
			outputStyle : "compressed"
		}))
		.pipe(autoprefixer({
			browsers : ["last 20 versions"]
		}))
		.pipe(rename(sources.styles.outputFile))
		.pipe(gulp.dest(sources.default.outputPath));
});


// Conpile JS for development
gulp.task('js', function() {
	gulp.src(sources.scripts.inputFullPath)
		.pipe(sourcemaps.init())
        .pipe(rollup({
            plugins: [babel()]
        }, {
            format: 'iife',
        }))
		.pipe(rename(sources.scripts.outputFile))
		.pipe(sourcemaps.write(sources.sourcemaps.outputPath))
		.pipe(gulp.dest(sources.default.outputPath))
		.pipe(browserSync.stream());
});


// Compile JS for production
gulp.task('buildjs', function () {
	gulp.src(sources.scripts.inputFullPath)
		.pipe(rollup({
			plugins: [babel()]
		}, {
			format: 'iife',
		}))
		.pipe(minify({
			mangle: {
				keepClassName: true
			}
		}))
		.pipe(rename(sources.scripts.outputFile))
		.pipe(gulp.dest(sources.default.outputPath));
});


// Watch asset folder for local development changes
gulp.task("watch", ["scss", "js"], function() {
	console.log('Starting dev server…\n');
	browserSync.init({
		proxy: browserSyncPath,  // assumes http-server is running @ default port
		open: false,
		notify: true,
		reloadOnRestart: true,
		ghostMode: false,
		scrollThrottle: 200
	});
	gulp.watch(`${sources.styles.inputPath}**/*`, ["scss"]);
	gulp.watch(`${sources.scripts.inputPath}**/*`, ["js"]);
});


// Clear development files for production
gulp.task("clean", function () {
	console.log('Deleting map files…\n');
	return del([`${sources.sourcemaps.outputPath}**/*.map`]);
});


// Minify images
gulp.task("minify_images", function() {
	gulp.src(`${sources.assets.inputPath}*`)
		.pipe(imagemin([], {
			verbose: true
		}))
		.pipe(gulp.dest(sources.assets.outputPath));
});


// Build files for production
gulp.task("build", ["clean", "minify_images", "compress_scss", "buildjs"], function() {
	gulp.task(sources.scripts.inputFullPath, ["buildjs"]);
	gulp.task(sources.styles.inputFullPath, ["compress_scss"]);
	console.log('Production build complete!\n');
});


// Set watch as default task
gulp.task("default", ["watch"]);

