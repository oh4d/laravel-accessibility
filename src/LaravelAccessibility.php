<?php

namespace Oh4d\Accessibility;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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
     * @param Application $app
     */
    public function __construct($app = null)
    {
        $this->app = ($app) ?: app();

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
     * @throws \Throwable
     */
    protected function renderLayout()
    {
        return view('accessibility::menu')->render();
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
     * @return Response
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
}