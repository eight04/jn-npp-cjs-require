/* global cjsRequireFactory Editor debug */

// this is just a demo to show how to use cjs-require script.
require("includes/cjs-require/cjs-require.js");
(function(){
  var require = cjsRequireFactory(Editor.nppDir + "/plugins/jN/includes/cjs-require.js");
  debug(require("./cjs-require/foo"));
})();
