<?php

namespace Oh4d\Accessibility\Http\Controllers;

class AssetsController extends BaseController
{
    public function css()
    {

    }

    public function js()
    {

    }

    public function icons()
    {

    }

    /**
     * Cache the response 1 year (31536000 sec)
     */
    protected function cacheResponse(Response $response)
    {
        $response->setSharedMaxAge(31536000);
        $response->setMaxAge(31536000);
        $response->setExpires(new \DateTime('+1 year'));

        return $response;
    }
}