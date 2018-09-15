<?php

namespace Oh4d\Accessibility;

use Oh4d\Accessibility\Services\AssetService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Contracts\Foundation\Application;

class LaravelAccessibility
{
    /**
     * The Laravel application instance.
     *
     * @var \Illuminate\Foundation\Application
     */
    protected $app;

    /**
     * True when enabled, false disabled an null for still unknown
     *
     * @var bool
     */
    protected $enabled = null;

    /**
     * @var AssetService
     */
    protected $assetService;

    /**
     * @var string
     */
    protected $basePath;

    /**
     * @param Application $app
     */
    public function __construct($app = null)
    {
        $this->app = ($app) ?: app();
        $this->basePath = realpath(__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR);

        $this->registerBaseConfig();
    }

    /**
     * Check if the Accessibility is enabled
     *
     * @return boolean
     */
    public function isEnabled()
    {
        return $this->enabled;
    }

    /**
     * Return Package Base Path
     *
     * @return bool|string
     */
    public function getBasePath($path = null)
    {
        if (!is_null($path)) {
            $path = DIRECTORY_SEPARATOR . trim($path, DIRECTORY_SEPARATOR);
        }

        return $this->basePath . $path;
    }

    /**
     * @param Response $response
     * @return Response
     */
    public function modifyResponse(Request $request, Response $response)
    {
        if (!$this->properLayoutCheck($request, $response)) {
            return $response;
        }

        $content = $response->getContent();

        $accContent = $this->renderLayout();

        $pos = strripos($content, '</body>');
        if (false !== $pos) {
            $content = substr($content, 0, $pos) . $accContent . substr($content, $pos);
        } else {
            $content = $content . $accContent;
        }

        // Update the new content and reset the content length
        $response->setContent($content);
        $response->headers->remove('Content-Length');

        return $response;
    }

    /**
     * @return string
     */
    protected function renderLayout()
    {
        $render = $this->getAssetService();

        return $render->renderLayoutHead() . $render->render();
    }

    /**
     *
     */
    protected function registerBaseConfig()
    {
        $this->enabled = config('accessibility.enabled', true);
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return boolean
     */
    protected function properLayoutCheck(Request $request, Response $response)
    {
        if ($request->isJson() || $request->ajax()) {
            return false;
        }

        if ($response->isRedirection()) {
            return false;
        }

        if (($response->headers->has('Content-Type') && strpos($response->headers->get('Content-Type'), 'html') === false)
            || $request->getRequestFormat() !== 'html' || $response->getContent() === false) {
            return false;
        }

        return true;
    }

    /**
     * Returns a Accessibility Assets Service
     *
     * @return AssetService
     */
    public function getAssetService()
    {
        if (is_null($this->assetService)) {
            $this->assetService = new AssetService($this);
        }

        return $this->assetService;
    }
}