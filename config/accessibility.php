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
        'dark-contrast'             => true, // Dark Contrast
        'bright-contrast'           => true, // Bright Contrast
        'decrease-font-size'        => true, // In\Decrease Font Size
        'increase-font-size'        => true, // In\Decrease Font Size
        'font-family'               => true, // Change Font Family For Readable One
        'cursor-bw'                 => true, // Big White Cursor
        'cursor-bb'                 => true, // Big Black Cursor
        'zoom'                      => true, // Zoom In\Out
        'highlight-links'           => true, // Highlight Links
        'highlight-titles'          => true, // Highlight Titles
        'alt-description'           => true, // Alt Description Box
    ],

    'route_prefix' => '__accessibility'
];