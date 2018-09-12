<?php

namespace Oh4d\Accessibility\Services;

use Oh4d\Accessibility\LaravelAccessibility;

class AssetService
{
    protected $jsFiles = [];

    protected $cssFiles = [];

    /**
     * @var LaravelAccessibility
     */
    protected $accessibility;

    /**
     * AssetService constructor.
     *
     * @param LaravelAccessibility $accessibility
     */
    public function __construct(LaravelAccessibility $accessibility)
    {
        $this->accessibility = $accessibility;

        $this->bindAssets();
    }

    /**
     * @param $type
     * @return string
     */
    public function render($type)
    {
        $content = '';
        $files = $this->getAssets($type);

        foreach ($files as $file) {
            $content .= file_get_contents($file) . "\n";
        }

        return $content;
    }

    /**
     *
     */
    public function getAssets($type = null)
    {

    }

    /**
     * Bind Assets Path
     */
    protected function bindAssets()
    {
        $this->jsFiles[] = $this->accessibility->getBasePath('resources/dist/js/app.js');
        $this->cssFiles[] = $this->accessibility->getBasePath('resources/dist/css/style.css');
    }
}