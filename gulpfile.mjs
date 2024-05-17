import gulp from "gulp";
import fileInclude from "gulp-file-include";

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