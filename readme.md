## Laravel Accessibility

This plug-in helps with a variety of common accessibility problems.
Accessibility adds a number of helpful accessibility features with a minimum amount of setup or expert knowledge.

## Installation

Require this package with composer.

```shell
composer require oh4d/laravel-accessibility
```

Laravel 5.5 uses Package Auto-Discovery, so doesn't require you to manually add the ServiceProvider.

The Accessibility will be enabled by default, to change that update your .env file.

```text
ACCESSIBILITY_ENABLED=true
``` 

### Laravel 5.5+:

If you don't use auto-discovery, add the ServiceProvider to the providers array in config/app.php

```php
Oh4d\Accessibility\ServiceProvider::class
```

Copy the package config and translation files to your local with the publish command:

```shell
php artisan vendor:publish --provider="Oh4d\Accessibility\ServiceProvider"
```