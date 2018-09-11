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
        'dark_contrast'             => true, // Dark Contrast
        'brigth_contrast'           => true, // Bright Contrast
        'font_size'                 => true, // In\Decrease Font Size
        'font_family'               => true, // Change Font Family For Readable One
        'cursor_bw'                 => true, // Big White Cursor
        'cursor_bb'                 => true, // Big Black Cursor
        'zoom'                      => true, // Zoom In\Out
        'highlight_links'           => true, // Highlight Links
        'highlight_titles'          => true, // Highlight Titles
        'alt_description'           => true, // Alt Description Box
    ],

    'route_prefix' => '__accessibility'
];