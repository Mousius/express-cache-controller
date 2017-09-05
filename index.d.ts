declare namespace Express {
    interface Response {
        cacheControl?: ExpressCacheController.CacheControlOptions;
    }
}

declare namespace ExpressCacheController {
    interface CacheControlOptions {
        maxAge?: number;
    }
}

declare module 'express-cache-controller' {
    import express = require('express');

    function cacheControl(options?: any): express.RequestHandler;

    export = cacheControl;
}