"use strict"

var gulp = require('gulp');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var glob = require("glob")
var sass = require('gulp-sass')

gulp.task("default", function() {
	gulp.watch("src/**/*.js", ["browserify"])
	gulp.start("browserify")
	
	gulp.watch("src/index.html", ["html"])
	gulp.start("html")
	
	gulp.watch("src/**/*.scss", ["scss"])
	gulp.start("scss")
	
})

gulp.task("html", () => {
	return gulp.src("src/index.html").pipe(gulp.dest("target"))
})

gulp.task("scss", () => {
	return gulp.src("src/**/*.scss")
	.pipe(sass().on("error", sass.logError))
	.pipe(gulp.dest("target"))
})

gulp.task("browserify", () => {
	return browserify()
	.add(glob.sync("src/**/*.js"))
	.bundle()
	.on("error", function(e) {
		console.log("Error in browserify: " + e.message)
	})
	.pipe(source("mixer.js"))
	.pipe(gulp.dest("target"))
})