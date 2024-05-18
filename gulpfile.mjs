import gulp from "gulp";
import fileInclude from "gulp-file-include";
import nodeSass from 'sass';
import gulpSass from 'gulp-sass';
import server from "gulp-server-livereload";
import clean from "gulp-clean";
import fs from "fs";
import map from "gulp-sourcemaps";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import webpack from "webpack-stream";
import config from "./webpack.config.mjs"
import babel from "gulp-babel";
const sass = gulpSass(nodeSass);
const {src,dest} = gulp;

const notifyConfig = (title) => { 
    return {
        errorHandler: notify.onError ({
        title,
        message: "Error <%= error.message%>",
        sound:false 
        })
    }
};

// Таска для очищения dist
gulp.task("clean", function (done) {
    if(fs.existsSync("./dist/")) {
        return src("./dist/", {read:false})
            .pipe(clean({force:true}))
    };
    done();
})

// Таска для добавления Html шаблонов
gulp.task("html", function () {
    return src("./src/*.html")
        .pipe(plumber(notifyConfig("HTML")))
        .pipe(fileInclude ({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(dest("./dist/"))
})

// Таска для компиляции scss
gulp.task("sass",function () {
    return src("./src/scss/*.scss")
        .pipe(plumber(notifyConfig("SCSS")))
        .pipe(map.init())
        .pipe(sass())
        .pipe(map.write())
        .pipe(dest("./dist/css/"))
})

// Копирование картинок
gulp.task("img", function() {
    return src("./src/img/**/*").pipe(dest("./dist/img/"))
})

// Копирование Шрифтов
gulp.task("fonts", function() {
    return src("./src/fonts/**/*").pipe(dest("./dist/fonts/"))
})

// Автообновление сервера
gulp.task("server", function() {
    return src("./dist").pipe(server({
        livereload:true,
        open:true
    }))
})

// Таска для js файлов
gulp.task("js", function () {
    return src("./src/js/*.js")
    .pipe(plumber(notifyConfig("JS")))
    .pipe(babel())
    .pipe(webpack(config))
    .pipe(dest("./dist/js/"))
})

// Слежение за файлами
gulp.task("watch", function () {
    gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass"))
    gulp.watch("./src/img/**/*", gulp.parallel("img"))
    gulp.watch("./src/fonts/**/*", gulp.parallel("fonts"))
    gulp.watch("./src/**/*.html", gulp.parallel("html"))
    gulp.watch("./src/js/**/*.js", gulp.parallel("js"))
})

gulp.task ("default", gulp.series(
    "clean",
    gulp.parallel("html","sass","img","fonts","js"),
    gulp.parallel("watch","server"),
))