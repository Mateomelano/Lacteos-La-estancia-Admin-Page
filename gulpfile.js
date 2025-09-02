import { src, dest, watch, series } from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import cleanCSS from 'gulp-clean-css'

const sass = gulpSass(dartSass)

export function js( done ) {
    src('src/js/app.js')
        .pipe( dest('build/js') ) 

    done()
}

export function css(done) {
    src('src/scss/app.scss', { sourcemaps: true })
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({ compatibility: 'ie8' })) // ← minifica CSS
        .pipe(dest('build/css', { sourcemaps: '.' }))

    done()
}

export function dev() {
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', js)
}

export default series( js, css, dev )