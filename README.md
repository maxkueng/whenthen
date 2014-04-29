whenthen
========

A "whenthen" holds function executions back until it has been resolved by a (asynchronous) "worker" function and optionally passes arguments to all the held-back functions. Once the "whenthen" has been resolved all functions will be executed immediately, even those added after it's been resolved.

It is particularly useful when functions have to wait until something happened, or wait for data to become available.

## Installation

```bash
npm install whenthen
```

## API

### `whenSomething = whenthen([function worker])`

Returns a new object that can be used to hold back functions until the worker has resolved. If provided, the `worker` will be executed the first time a function is added using `.do()`.

The `worker` will receive a function `resolve` as its only argument that can be used to resolve the "whenthen". All arguments passed to `resolve` will be passed on to every task function.

### `whenSomething.do(function task)`

Adds a task function to the "whenthen". The function will be held back until the "whenthen" has been resolved.

### `whenSomething.resolve(...)`

Resolves the "whenthen". All arguments passed passed to `.resolve` will be passed on to every task function.

This can be used as an alternavie to passing a worker function to `whenthen()`.


## Examples

Run the functions `doStuff` and `doMoreStuff` only after `fakeAsyncLogin` is done:

```javascript
var whenthen = require('whenthen');

var whenLoggedIn = whenthen(function (resolve) {
  setTimeout(function fakeAsyncLogin () {
    console.log('Logged in')
    resolve();
  }, 1000);
});

whenLoggedIn.do(function doStuff () {
  console.log('Doing stuff after logged in');
});

whenLoggedIn.do(function doMoreStuff () {
  console.log('Doing more stuff after logged in');
});
```

Run `doStuffWithData` and `doMoreStuffWithData` after `fakeFetchSomeData` has some data:

```javascript
var whenthen = require('whenthen');

var whenDataReady = whenthen(function (resolve) {
  setTimeout(function fakeFetchSomeData () {
    console.log('Fetched some data');
    resolve(null, { x: 100, y: 200});
  }, 2000);
});

whenDataReady.do(function doStuffWithData (err, data) {
  if (err) { return console.log('O-oh', err); }

  console.log('X is', data.x);
});

whenDataReady.do(function doMoreStuffWithData (err, data) {
  if (err) { return console.log('O-oh', err); }

  console.log('Y is', data.y);
});
```

Alternatively resolve then whenthen from outside using `.resolve()`:

```javascript
var whenKittensBorn = whenthen();

whenKittensBorn.do(function announceKittens (date) {
	console.log('Kittens born', date);
});

console.log('Waiting for kittens birth');
setTimeout(function awaitKittens () {
	whenKittensBorn.resolve(Date.now());
}, 3000);
```

## License

Copyright (c) 2012 Max Kueng

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
