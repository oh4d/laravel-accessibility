let mix = require('laravel-mix');
mix.options({ processCssUrls: false });
mix.setPublicPath('resources/dist');

mix.js('resources/src/js/accessibility.js', 'js/app.js')
    .sass('resources/src/sass/accessibility.scss', 'css/style.css');