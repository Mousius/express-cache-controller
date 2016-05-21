# express-cache-controller

A simple and lightweight module for managing cache control headers from within your application. It also tries to provide a simple set of rules for common use cases such as setting 'max-age=0' when 'no-cache' is present by default.

## Example
Configuring noCache easily:
```js
app.use(cacheControl({
  noCache: true
}));
```
Creates a cache-control header of `no-cache, max-age=0`

## Usage
To start using cacheControl, just use the middleware in your application:
```js
app.use(cacheControl());
```

### Default Cache Headers
When initialising the middleware you can set default options when you use it in your application:
```js
app.use(cacheControl({
    maxAge: 5
}));
```

### Overriding Defaults
Just set the cacheControl property of the response object after the cacheControl() middleware is loaded:
```js
app.use(cacheControl({ maxAge: 60 }));
app.get('/', function (req, res, next){
  res.cacheControl = {
      maxAge: 30
  };

  res.send('hai');
});
```

This is useful in error conditions where you can setup cache headers before and after a request is processed:
```js
app.use(cacheControl({ maxAge: 60} ));
app.get('/', function (req, res, next) {
  next(Error('BOOM!'));
});
app.use(function (err, req, res, next) {
  res.cacheControl = {
      maxAge: 5
  };

  res.status(500).send('oh no!');
});
```

## Options
Name | Value | Description
----|----|---
private | Boolean | Adds 'private' flag, overrides 'public' option
public | Boolean | Adds 'public' flag
noStore | Boolean | Adds 'no-store' flag and includes noCache
noCache | Boolean | Adds 'no-cache' flag, sets maxAge to 0 and removes sMaxAge, staleIfError and staleWhileRevalidate
noTransform | Boolean | Adds 'no-transform' flag
mustRevalidate | Boolean | Adds 'must-revalidate' flag and removes staleIfError and staleWhileRevalidate
staleIfError | Number | Adds 'stale-if-error=%d' flag
staleWhileRevalidate | Number | Adds 'stale-while-revalidate=%d' flag
maxAge | Number | Adds 'max-age=%d' flag
sMaxAge | Number | Adds 's-maxage=%d' flag
