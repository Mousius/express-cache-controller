var isNumber = require('lodash.isnumber');
var util = require('util');
var onHeaders = require('on-headers');

module.exports = function (defaults) {
  return function cacheControl(req, res, next) {
    res.cacheControl = defaults;

    onHeaders(res, function () {
      var options = this.cacheControl || {};
      var cacheControl = [];

      if (options.private) {
        cacheControl.push('private');
      } else if (options.public) {
        cacheControl.push('public');
      }

      if (options.noStore) {
        options.noCache = true;
        cacheControl.push('no-store');
      }

      if (options.noCache) {
        options.maxAge = 0;
        delete options.sMaxAge;
        cacheControl.push('no-cache');
      }

      if (options.noTransform) {
        cacheControl.push('no-transform');
      }

      if (options.proxyRevalidate) {
        cacheControl.push('proxy-revalidate');
      }

      if (options.mustRevalidate) {
        cacheControl.push('must-revalidate');
      } else if (!options.noCache) {
        if (options.staleIfError) {
          cacheControl.push(util.format('stale-if-error=%d', options.staleIfError));
        }

        if (options.staleWhileRevalidate) {
          cacheControl.push(util.format('stale-while-revalidate=%d', options.staleWhileRevalidate));
        }
      }

      if (isNumber(options.maxAge)) {
        cacheControl.push(util.format('max-age=%d', options.maxAge));
      }

      if (isNumber(options.sMaxAge)) {
        cacheControl.push(util.format('s-maxage=%d', options.sMaxAge));
      }

      if (cacheControl.length) {
        this.setHeader('Cache-Control', cacheControl.join(','));
      }
    });

    next();
  }
}
