/* global Editor ActiveXObject readFile System */

/* global cjsRequireFactory: true */
cjsRequireFactory = typeof cjsRequireFactory != "undefined" ? cjsRequireFactory : function() {
  var PLUGIN_DIR = Editor.nppDir + "/Plugins/jN";
  var cache = {};
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  function factory(importer) {
    var importerDir = fso.GetFile(importer).ParentFolder.Path;
    function requireFunction(importee) {
      var file = fso.GetFile(resolvePath(importee)).Path;
      
      if (!cache[file]) {
        // prevent circular deps
        cache[file] = {exports: {}};
        
        // prepare env
        var _require = cjsRequireFactory.require;
        var _module = cjsRequireFactory.module;
        cjsRequireFactory.require = cjsRequireFactory(file);
        cjsRequireFactory.module = cache[file];
        
        // load module
        var script = "(function(require, module, exports) {" + readFile(file, "UTF-8") + "})(cjsRequireFactory.require, cjsRequireFactory.module, cjsRequireFactory.module.exports)";
        try {
          System.addScript(script, file);
        } catch (err) {
          delete cache[file];
          throw err;
        } finally {
          // cache
          cjsRequireFactory.require = _require;
          cjsRequireFactory.module = _module;
        }
      }
      
      return cache[file].exports;
      
      function resolvePath(path) {
        if (path[0] == ".") {
          if (fso.FileExists(importerDir + path)) {
            return importerDir + path;
          }
          if (fso.FileExists(importerDir + path + ".js")) {
            return importerDir + path + ".js";
          }
        } else {
          if (fso.FileExists(PLUGIN_DIR + "/" + path)) {
            return PLUGIN_DIR + "/" + path;
          }
          if (fso.FileExists(PLUGIN_DIR + "/" + path + ".js")) {
            return PLUGIN_DIR + "/" + path + ".js";
          }
        }
        throw new Error("Can't resolve importee: " + path + "\nimporter: " + importer);
      }
    }
    requireFunction.cache = cache;
    return requireFunction;
  }
  return factory;
}();
