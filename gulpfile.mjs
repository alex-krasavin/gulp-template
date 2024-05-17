import gulp from "gulp";
import fileInclude from "gulp-file-include";
import nodeSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(nodeSass);

const {src,dest} = gulp;


// Таска для добавления Html шаблонов
gulp.task("includeFiles", function () {
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