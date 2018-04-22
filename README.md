jN-npp-cjs-require
==================

Build commonjs `require` function.

The `require` function provided by this library *is not* compatible with jN's builtin `require`. cjs-require introduce a module scope just like Node.js. So:

1. Variables defined through `var` are defined in module scope instead of global.
2. Each module has its own `require` function instead of sharing a global `require`.
3. Based on (2), it is possible to do relative-require (`require(./foo)`).
4. All cjs-require functions share the same module cache, but not with jN's builtin require.

Usage example
-------------

*jN/includes/my-script.js*
```js
// inject cjsRequireFactory to global
require("includes/cjs-require.js");

(function() {
  // get the require function
  var require = cjsRequireFactory(Editor.nppDir + "/plugins/jN/includes/my-script.js");
  
  // now just require any cjs module
  var test = require("./cjs-modules/test");
  test();
})();
```

*jN/includes/cjs-modules/test.js*
```js
module.exports = function() {
  alert("Test function is called");
};
```

API
----

This library define one function in the global scope.

### cjsRequireFactory(filename: string): function

Get the commonjs `require` function for `filename`.

Changelog
=========

* 0.1.0 (Apr 23, 2018)

  - Initial release.
