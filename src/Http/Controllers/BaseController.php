<?php

namespace Oh4d\Accessibility\Http\Controllers;

use Illuminate\Http\Request;
use Oh4d\Accessibility\LaravelAccessibility;

class BaseController
{
    protected $accessibility;

    public function __construct(Request $request, LaravelAccessibility $accessibility)
    {
        $this->accessibility = $accessibility;

        /*if ($request->hasSession()) {
            $request->session()->reflash();
        }*/
    }
}