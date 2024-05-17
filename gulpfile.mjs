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
const sass = gulpSass(nodeSass);
const {src,dest} = gulp;

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
        .pipe(plumber({
            errorHandler: notify.onError ({
                title:"html",
                message: "Error <%= error.message%>",
                sound:false
            })
        }
        ))
        .pipe(fileInclude ({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(dest("./dist/"))
})

// Таска для компиляции scss
gulp.task("sass",function () {
    return src("./src/scss/*.scss")
        .pipe(plumber({
            errorHandler: notify.onError ({
                title:"style",
                message: "Error <%= error.message%>",
                sound:false
            })
        }
        ))
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

// Слежение за файлами
gulp.task("watch", function () {
    gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass"))
    gulp.watch("./src/img/**/*", gulp.parallel("img"))
    gulp.watch("./src/fonts/**/*", gulp.parallel("fonts"))
    gulp.watch("./src/**/*.html", gulp.parallel("html"))

})

gulp.task ("default", gulp.series(
    "clean",
    gulp.parallel("html","sass","img","fonts"),
    gulp.parallel("watch","server"),
))