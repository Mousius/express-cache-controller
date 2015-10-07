var _ = require('lodash');
var util = require('util');

module.exports = function (defaults) {
  return function* cacheControl(next) {
    yield* next;

    var options = _.defaults(this.cacheControl || {}, defaults),
      cacheControl = [];

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

    if (_.isNumber(options.maxAge)) {
      cacheControl.push(util.format('max-age=%d', options.maxAge));
    }

    if (_.isNumber(options.sMaxAge)) {
      cacheControl.push(util.format('s-maxage=%d', options.sMaxAge));
    }

    if (cacheControl.length) {
      this.set('Cache-Control', cacheControl.join(','));
    }
  }
}
