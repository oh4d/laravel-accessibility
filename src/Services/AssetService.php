<?php

namespace Oh4d\Accessibility\Services;

use Oh4d\Accessibility\LaravelAccessibility;

class AssetService
{
    protected $jsFiles = [];

    protected $cssFiles = [];

    protected $fontsFiles = [];

    protected $imagesFiles = [];

    protected $enableJqueryNoConflict;

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
     * Checks if jQuery.noConflict() will be called
     *
     * @return boolean
     */
    public function isJqueryNoConflictEnabled()
    {
        return $this->enableJqueryNoConflict;
    }

    /**
     * @param $type
     * @param $filePath
     * @return string
     */
    public function assetToString($type, $filePath = null)
    {
        $content = '';
        $files = $this->{$type.'Files'};

        // $content .= $this->appendCustomAssetProps($type);

        foreach ($files as $file) {
            if (is_null($filePath)) {
                $content .= file_get_contents($file) . "\n";
                continue;
            }

            if ($filePath == $file) {
                $content .= file_get_contents($file) . "\n";
                return $content;
            }
        }

        return $content;
    }

    /**
     * @return string
     */
    public function renderLayoutHead()
    {
        $jsRoute = route('accessibility.assets.js');
        $cssRoute = route('accessibility.assets.css');

        // $cssRoute = preg_replace('/\Ahttps?:/', '', $cssRoute);
        // $jsRoute  = preg_replace('/\Ahttps?:/', '', $jsRoute);

        $html  = "<link rel='stylesheet' type='text/css' property='stylesheet' href='{$cssRoute}'>";
        $html .= "<script type='text/javascript' src='{$jsRoute}'></script>";

        if ($this->isJqueryNoConflictEnabled()) {
            $html .= '<script type="text/javascript">jQuery.noConflict(true);</script>' . "\n";
        }

        // $html .= $this->getInlineHtml();
        return $html;
    }

    /**
     * Render Accessibility Config
     * For Initialize JS Function
     *
     * @return string
     */
    public function renderConfig()
    {
        $config = [
            'locale' => config('app.locale'),
            'features' => config('accessibility.features'),
            'translates' => trans('accessibility::global'),
            'quickNavigation' => config('accessibility.quickNavigation', false),
        ];

        return json_encode($config);
    }

    /**
     * @return string
     */
    public function render()
    {
        $js = '';
        // $js .= sprintf("var %s = new %s(%s);\n", 'accessibility', 'AccessibilityForAll', $this->renderConfig());
        $js .= sprintf("var %s = new %s(%s);\n", 'accessibility', 'AccessibilityForAll', $this->renderConfig());

        return "<script type=\"text/javascript\">\n$js\n</script>\n";
    }


    /**
     *
     */
    public function getAssets($type = null)
    {
        return $this->{$type.'Files'};
    }

    /**
     * Bind Assets Path
     */
    protected function bindAssets()
    {
        $this->jsFiles[] = $this->accessibility->getBasePath('resources/dist/js/app.js');
        $this->cssFiles[] = $this->accessibility->getBasePath('resources/dist/css/style.css');

        $this->fontsFiles[] = $this->accessibility->getBasePath('resources/src/fonts/laravel-accessibility.eot');
        $this->fontsFiles[] = $this->accessibility->getBasePath('resources/src/fonts/laravel-accessibility.svg');
        $this->fontsFiles[] = $this->accessibility->getBasePath('resources/src/fonts/laravel-accessibility.ttf');
        $this->fontsFiles[] = $this->accessibility->getBasePath('resources/src/fonts/laravel-accessibility.woff');

        $this->imagesFiles[] = $this->accessibility->getBasePath("resources/src/images/bighandblack.cur");
        $this->imagesFiles[] = $this->accessibility->getBasePath("resources/src/images/bighandwhite.cur");
        $this->imagesFiles[] = $this->accessibility->getBasePath("resources/src/images/bigcursorblack.cur");
        $this->imagesFiles[] = $this->accessibility->getBasePath("resources/src/images/bigcursorwhite.cur");

        $this->enableJqueryNoConflict = config('accessibility.enableJqueryNoConflict', true);
    }

    protected function appendCustomAssetProps($type)
    {
        $content = '';

        if ($type == 'js') {
            $content .= sprintf('var trans = %s;', json_encode(trans('accessibility::global'))) . "\n";
        }

        return $content;
    }
}
