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
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'accessibility');

        $routeConfig = [
            'namespace' => 'Oh4d\Accessibility\Http\Controllers',
            'prefix' => $this->app['config']->get('accessibility.route_prefix'),
            // 'domain' => $this->app['config']->get('accessibility.route_domain'),
            // 'middleware' => [DebugbarEnabled::class],
        ];

        $kernel = $this->app[Kernel::class];
        $kernel->pushMiddleware(InjectMenu::class);
    }
}