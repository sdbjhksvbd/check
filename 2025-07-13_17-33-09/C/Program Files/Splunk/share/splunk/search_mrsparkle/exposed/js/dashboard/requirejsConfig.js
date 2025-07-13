define(function(require) {
    var shimmedRequirejs = require('requirejs');
    var exposedModules = require('./exposedModules');
    shimmedRequirejs.exposeModules({
        modules: exposedModules,
        isAllowedList: true,
        blockPrivateImports: true,
    });
    return shimmedRequirejs;
});
