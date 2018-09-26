<?php

namespace Oh4d\Accessibility\Http\Middleware;

use Illuminate\Http\Request;
use Oh4d\Accessibility\LaravelAccessibility;
use Illuminate\Contracts\Foundation\Application;

class InjectMenu
{
    /**
     * The App container
     *
     * @var Application
     */
    protected $app;

    /**
     * The Accessibility instance
     *
     * @var LaravelDebugbar
     */
    protected $accessibility;

    /**
     * The URIs that should be excluded.
     *
     * @var array
     */
    protected $except = [];

    /**
     * Create a new middleware instance.
     *
     * @param Application $container
     * @param LaravelAccessibility $debugbar
     */
    public function __construct(Application $app, LaravelAccessibility $accessibility)
    {
        $this->app = $app;
        $this->accessibility = $accessibility;
        $this->except = config('accessibility.except') ?: [];
    }

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, \Closure $next)
    {
        if ($this->inExceptArray($request) || !$this->accessibility->isEnabled()) {
            return $next($request);
        }

        $response = $next($request);

        $this->accessibility->modifyResponse($request, $response);
        return $response;
    }

    /**
     * Determine if the request has a URI that should be ignored.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function inExceptArray($request)
    {
        foreach ($this->except as $except) {
            if ($except !== '/') {
                $except = trim($except, '/');
            }

            if ($request->is($except)) {
                return true;
            }
        }

        return false;
    }
}