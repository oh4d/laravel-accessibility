<?php

namespace Oh4d\Accessibility\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;

class AssetsController extends BaseController
{
    /**
     * Return & Combine CSS Files
     *
     * @return Response
     */
    public function css()
    {
        $assetService = $this->accessibility->getAssetService();

        $content = $assetService->assetToString('css');

        $response = new Response($content, 200, ['Content-Type' => 'text/css']);
        return $this->cacheResponse($response, true);
    }

    /**
     * Return & Combine JS Files
     *
     * @return Response
     */
    public function js()
    {
        $assetService = $this->accessibility->getAssetService();

        $content = $assetService->assetToString('js');

        $response = new Response($content, 200, ['Content-Type' => 'text/javascript']);
        return $this->cacheResponse($response, true);
    }

    /**
     * Return Fonts Asset File By Name
     *
     * @param $fileName
     * @return Response
     */
    public function fonts($fileName)
    {
        $file = $this->accessibility->getBasePath("resources/src/fonts/{$fileName}");
        $assetService = $this->accessibility->getAssetService();

        $content = $assetService->assetToString('fonts', $file);
        $type = File::mimeType($file);

        $response = new Response($content, 200, ['Content-Type' => $type]);
        return $this->cacheResponse($response, true);
    }

    /**
     * Return Images Asset File By Name
     *
     * @param $fileName
     * @return Response
     */
    public function images($fileName)
    {
        $file = $this->accessibility->getBasePath("resources/src/images/{$fileName}");
        $assetService = $this->accessibility->getAssetService();

        $content = $assetService->assetToString('images', $file);
        $type = File::mimeType($file);

        $response = new Response($content, 200, ['Content-Type' => $type]);
        return $this->cacheResponse($response, true);
    }

    /**
     * Cache the response 1 year (31536000 sec)
     *
     * @param Response $response
     * @param $cache
     * @return Response
     */
    protected function cacheResponse(Response $response, $cache = false)
    {
        if (!$cache) {
            return $response;
        }

        $response->setSharedMaxAge(31536000);
        $response->setMaxAge(31536000);
        $response->setExpires(new \DateTime('+1 year'));

        return $response;
    }
}
