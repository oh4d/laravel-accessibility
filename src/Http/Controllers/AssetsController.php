<?php

namespace Oh4d\Accessibility\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;

class AssetsController extends BaseController
{
    /**
     * @return Response
     */
    public function css()
    {
        $assetService = $this->accessibility->getAssetService();

        $content = $assetService->assetToString('css');

        $response = new Response($content, 200, ['Content-Type' => 'text/css']);
        return $this->cacheResponse($response);
    }

    /**
     * @return Response
     */
    public function js()
    {
        $assetService = $this->accessibility->getAssetService();

        $content = $assetService->assetToString('js');

        $response = new Response($content, 200, ['Content-Type' => 'text/javascript']);
        return $this->cacheResponse($response);
    }

    /**
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
        return $this->cacheResponse($response);
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