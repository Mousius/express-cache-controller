declare namespace Express {
    interface Response {
        cacheControl?: ExpressCacheController.CacheControlOptions;
    }
}

declare namespace ExpressCacheController {
    interface CacheControlOptions {
        maxAge?: number;
        sMaxAge?: number;
        private?: boolean;
        public?: boolean;
        noStore?: boolean;
        noCache?: boolean;
        noTransform?: boolean;
        proxyRevalidate?: boolean;
        mustRevalidate?: boolean;
        staleIfError?: number;
        staleWhileRevalidate?: number;
    }
}

declare module 'express-cache-controller' {
    import express = require('express');

    function cacheControl(options?: any): express.RequestHandler;

    export = cacheControl;
}