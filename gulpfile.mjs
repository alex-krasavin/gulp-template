import gulp from "gulp";
import fileInclude from "gulp-file-include";
import nodeSass from 'sass';
import gulpSass from 'gulp-sass';
import server from "gulp-server-livereload";
import clean from "gulp-clean";
import fs from "fs";
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
        .pipe(fileInclude ({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(dest("./dist/"))
})

// Таска для компиляции scss
gulp.task("sass",function () {
    return src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(dest("./dist/css/"))
})

// Копирование картинок
gulp.task("img", function() {
    return src("./src/img/**/*").pipe("./dist/img/")
})

// Автообновление сервера
gulp.task("server", function() {
    return src("./dist").pipe(server({
        livereload:true,
        open:true
    }))
})