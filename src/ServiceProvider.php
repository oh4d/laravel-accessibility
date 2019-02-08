<?php

namespace Oh4d\Accessibility;

use Illuminate\Contracts\Http\Kernel;
use Oh4d\Accessibility\Http\Middleware\InjectMenu;

class ServiceProvider extends \Illuminate\Support\ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/accessibility.php', 'accessibility');

        $this->app->singleton(LaravelAccessibility::class, function () {
            return new LaravelAccessibility($this->app);
        });

        $this->app->alias(LaravelAccessibility::class, 'accessibility');
    }

    /**
     * Bootstrap the application events.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadTranslationsFrom(__DIR__ . '/../resources/lang', 'accessibility');

        $this->publishes([
            __DIR__ . '/../resources/lang' => resource_path('lang/vendor/accessibility'),
        ]);

        $this->publishes([__DIR__ . '/../config/accessibility.php' => config_path('accessibility.php')], 'config');

        // Escape case plugin is disabled
        if (!$this->app['accessibility']->isEnabled())
            return;

        // Append routes for assets providing
        $this->appendAssetsRoutes();

        $kernel = $this->app[Kernel::class];
        $kernel->pushMiddleware(InjectMenu::class);
    }

    /**
     * Append Assets Routes To Application Router
     */
    protected function appendAssetsRoutes()
    {
        $router = $this->app['router'];

        $config = [
            'namespace' => 'Oh4d\Accessibility\Http\Controllers',
            'prefix' => $this->app['config']->get('accessibility.route_prefix'),
            // 'domain' => $this->app['config']->get('accessibility.route_domain'),
            // 'middleware' => [DebugbarEnabled::class],
        ];

        $router->group($config, function($router) {
            $router->get('assets/js', 'AssetsController@js')->name('accessibility.assets.js');
            $router->get('assets/css', 'AssetsController@css')->name('accessibility.assets.css');
            $router->get('assets/fonts/{fileName}', 'AssetsController@fonts')->name('accessibility.assets.fonts');
            $router->get('assets/images/{fileName}', 'AssetsController@images')->name('accessibility.assets.images');
        });
    }
}
