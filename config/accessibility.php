<?php

return [

    /*
     |--------------------------------------------------------------------------
     | Accessibility Settings
     |--------------------------------------------------------------------------
     |
     | Accessibility is enabled by default.
     | You can override the value by setting enable to false instead of true.
     |
     */

    'enabled' => env('ACCESSIBILITY_ENABLED', true),

    'except' => [
        // '_debugbar/*'
    ],

    /*
     |--------------------------------------------------------------------------
     | Accessibility Features
     |--------------------------------------------------------------------------
     |
     | Enable/Disable Accessibility Features
     */

    'features' => [
        'monochrome'                => true, // Monochrome
        'darkContrast'              => true, // Dark Contrast
        'brightContrast'            => true, // Bright Contrast
        'decreaseFontSize'          => true, // In\Decrease Font Size
        'increaseFontSize'          => true, // In\Decrease Font Size
        'fontFamily'                => true, // Change Font Family For Readable One
        'cursorBw'                  => true, // Big White Cursor
        'cursorBb'                  => true, // Big Black Cursor
        'zoom'                      => true, // Zoom In\Out
        'highlightLinks'            => true, // Highlight Links
        'highlightTitles'           => true, // Highlight Titles
        'altDescription'            => true, // Alt Description Box
    ],

    'route_prefix' => '__accessibility'
];