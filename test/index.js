var request = require('supertest');
var koa = require('koa');
var cacheControl = require('..');
var fs = require('fs');

describe('cacheControl()', function () {
  describe('default configuration', function () {
    it('uses defaults if nothing defined on request', function (done) {
      var app = koa();

      app.use(cacheControl({
        maxAge: 4
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'max-age=4')
        .end(done);
    })
  });

  describe('override default configuration', function () {
    it('allows middleware to override options in incoming requests', function (done) {
      var app = koa();

      app.use(cacheControl({
        maxAge: 4
      }));

      app.use(function*(next) {
        this.cacheControl = {
          maxAge: 60
        };

        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'max-age=60')
        .end(done);
    })

    it('allows middleware to override options on outgoing requests', function (done) {
      var app = koa();

      app.use(cacheControl({
        maxAge: 300
      }));

      app.use(function*(next) {
        try {
          yield next;
        } catch (err) {
          this.cacheControl = {
            noCache: true
          };
        }
      });

      app.use(function*(next) {
        this.throw(500);
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'no-cache,max-age=0')
        .end(done);
    })
  });

  describe('public is set', function () {
    it('adds public flag to cache-control header', function (done) {
      var app = koa();

      app.use(cacheControl({
        public: true
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'public')
        .end(done);
    });
  });

  describe('private is set', function () {
    it('adds private flag to cache-control header', function (done) {
      var app = koa();

      app.use(cacheControl({
        private: true
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'private')
        .end(done);
    });

    it('discards public flag in cache-control header', function (done) {
      var app = koa();

      app.use(cacheControl({
        private: true,
        public: true
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'private')
        .end(done);
    });
  });

  describe('maxAge is set', function () {
    it('sets cache-control max-age section', function (done) {
      var app = koa();

      app.use(cacheControl({
        maxAge: 4
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'max-age=4')
        .end(done);
    });
  });

  describe('staleIfError is set', function () {
    it('sets cache-control header with stale-if-error', function (done) {
      var app = koa();

      app.use(cacheControl({
        staleIfError: 320
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'stale-if-error=320')
        .end(done);
    });
  });

  describe('staleWhileRevalidate is set', function () {
    it('sets cache-control header with stale-while-revalidate', function (done) {
      var app = koa();

      app.use(cacheControl({
        staleWhileRevalidate: 320
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'stale-while-revalidate=320')
        .end(done);
    });
  });

  describe('mustRevalidate is set', function () {
    it('sets cache-control header with must-revalidate', function (done) {
      var app = koa();

      app.use(cacheControl({
        mustRevalidate: true
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'must-revalidate')
        .end(done);
    });

    it('overthrows stale-while-revalidate and stale-if-error', function (done) {
      var app = koa();

      app.use(cacheControl({
        mustRevalidate: true,
        staleWhileRevalidate: 320,
        staleIfError: 404
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'must-revalidate')
        .end(done);
    });
  });

  describe('when noCache is true', function () {
    it('adds no-cache to Cache-Control header', function (done) {
      var app = koa();

      app.use(cacheControl({
        noCache: true
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'no-cache,max-age=0')
        .end(done);
    });

    it('sets maxAge to 0', function (done) {
      var app = koa();

      app.use(cacheControl({
        noCache: true,
        maxAge: 60
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'no-cache,max-age=0')
        .end(done);
    });

    it('removes sMaxAge', function (done) {
      var app = koa();

      app.use(cacheControl({
        noCache: true,
        sMaxAge: 60
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'no-cache,max-age=0')
        .end(done);
    });

    it('ignores stale settings', function (done) {
      var app = koa();

      app.use(cacheControl({
        noCache: true,
        staleIfError: 404,
        staleWhileRevalidate: 10
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'no-cache,max-age=0')
        .end(done);
    });
  });

  describe('when noStore is true', function () {
    it('sets Cache-Control no-store and no-cache', function (done) {
      var app = koa();

      app.use(cacheControl({
        noStore: true
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'no-store,no-cache,max-age=0')
        .end(done);
    });

    it('sets maxAge to 0', function (done) {
      var app = koa();

      app.use(cacheControl({
        noStore: true,
        maxAge: 50
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'no-store,no-cache,max-age=0')
        .end(done);
    });
  });

  describe('when noTransform is set', function () {
    it('sets Cache-Control no-transform', function (done) {
      var app = koa();

      app.use(cacheControl({
        noTransform: true
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'no-transform')
        .end(done);
    });
  });

  describe('when proxyRevalidate', function () {
    it('sets Cache-Control proxy-revalidate', function (done) {
      var app = koa();

      app.use(cacheControl({
        proxyRevalidate: true
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 'proxy-revalidate')
        .end(done);
    });
  });


  describe('when sMaxAge', function () {
    it('sets Cache-Control s-maxage property', function (done) {
      var app = koa();

      app.use(cacheControl({
        sMaxAge: 10
      }));

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect('Cache-Control', 's-maxage=10')
        .end(done);
    });
  });

  describe('when no cache properties set', function () {
    it('does not set a cache-control header', function (done) {
      var app = koa();

      app.use(cacheControl());

      app.use(function*(next) {
        yield next;
      });

      request(app.listen())
        .get('/')
        .expect(function (res) {
          return res.headers['Cache-Control'] === undefined;
        })
        .end(done);
    });
  });
});
