const gulp = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const htmlmin = require("gulp-htmlmin");

// Clean dist folder (simple & safe)
function clean() {
  return gulp.src("dist", { read: false, allowEmpty: true })
    .pipe(require("gulp-clean")());
}

// Compile nunjucks templates
function templates() {
  return gulp.src("src/templates/pages/*.njk")
    .pipe(nunjucksRender({
      path: ["src/templates"]
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"));
}

// Copy assets
function assets() {
  return gulp.src("src/assets/**/*")
    .pipe(gulp.dest("dist/assets"));
}

exports.build = gulp.series(clean, templates, assets);
