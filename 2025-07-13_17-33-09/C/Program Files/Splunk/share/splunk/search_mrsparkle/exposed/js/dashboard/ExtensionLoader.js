define([
    'jquery',
    'underscore',
    'backbone',
    'util/dashboard_utils',
    'uri/route',
    'splunk.util',
    'util/console'
], function($,
            _,
            Backbone,
            DashboardUtils,
            Route,
            SplunkUtil,
            console) {

    var sprintf = SplunkUtil.sprintf;

    var DEFAULT_JS = "dashboard.js";
    var DEFAULT_STYLE = "dashboard.css";

    var EXTENSIONS = {script: '.js', stylesheet: '.css'};

    var ExtensionLoader = function(options) {
        this.model = _.extend({}, options.model);
        this.collection = _.extend({}, options.collection);
        this.clearExtensions();

        this.listenTo(this, 'loaded:script', function(resolvedSrc, isDefaultExtension) {
            this._loadedScripts++;
            if (isDefaultExtension) {
                this._loadedDefaultScripts++;
            }
        });
        this.listenTo(this, 'loaded:stylesheet', function(resolvedSrc, isDefaultExtension) {
            this._loadedStylesheets++;
            if (isDefaultExtension) {
                this._loadedDefaultStylesheets++;
            }
        });
    };

    /**
     *  All the extensions will be loaded only once, unless the registry been cleared.
     */
    _.extend(ExtensionLoader.prototype, Backbone.Events, {
        loadDefaultExtensions: function(app, locale, root) {
            this.loadScriptExtension(app, locale, root, DEFAULT_JS, true);
            this.loadStylesheetExtension(app, locale, root, DEFAULT_STYLE, true);
        },
        loadScriptExtension: function(app, locale, root, src, isDefaultExtension) {
            var resolvedSrc = this._resolveExtensionFile(app, locale, root, src);
            var key = this._getKey(app, src);
            if (!this._scriptRegistry[key]) {
                this._scriptRegistry[key] = resolvedSrc;
                return this._loadExtension('script', resolvedSrc, isDefaultExtension);
            } else {
                var script = this._scriptContent[resolvedSrc];
                this._runScript(script);
                return $.Deferred().reject(sprintf('Script %s already loaded', key));
            }
        },
        loadStylesheetExtension: function(app, locale, root, styleSrc, isDefaultExtension) {
            var resolvedSrc = this._resolveExtensionFile(app, locale, root, styleSrc);
            var key = this._getKey(app, styleSrc);
            if (!this._stylesRegistry[key]) {
                this._stylesRegistry[key] = resolvedSrc;
                return this._loadExtension('stylesheet', resolvedSrc, isDefaultExtension);
            } else {
                return $.Deferred().reject(sprintf('Stylesheet %s already loaded', key));
            }
        },
        hasExtension: function() {
            return this._loadedScripts + this._loadedStylesheets > 0;
        },
        hasExtensionScript: function() {
            return this._loadedScripts > 0;
        },
        hasNonDefaultExtensionScript: function () {
            return this._loadedDefaultScripts !== this._loadedScripts;
        },
        hasExtensionStylesheet: function() {
            return this._loadedStylesheets > 0;
        },
        clearExtensions: function() {
            this._scriptRegistry = {};
            this._stylesRegistry = {};
            this._scriptContent = {}; 
            this._scriptPromises = [];
            this._loadedScripts = 0;
            this._loadedStylesheets = 0;
            this._loadedDefaultScripts = 0;
            this._loadedDefaultStylesheets = 0;
        },
        _getKey: function(app, src) {
            var source = DashboardUtils.getAppAndSource(src, app);
            return sprintf("%s:%s", source.app, source.src);
        },
        _loadExtension: function(type, resolvedSrc, isDefaultExtension) {
            if (!ExtensionLoader.isValidExtensionPath(resolvedSrc, type)) {
                var msg = sprintf('Invalid extension path: "%s" for extension type %s', resolvedSrc, type);
                console.error(msg);
                return $.Deferred().reject(msg);
            }
            switch (type) {
                case 'script':
                    return this._loadScript(resolvedSrc).then(function() {
                        this.trigger('loaded:script', resolvedSrc, isDefaultExtension);
                    }.bind(this));
                case 'stylesheet':
                    return this._loadStylesheet(resolvedSrc).then(function() {
                        this.trigger('loaded:stylesheet', resolvedSrc, isDefaultExtension);
                    }.bind(this));
            }
        },
        _loadScript: function(src) {
            var dfd = $.Deferred();
            var prevScriptPromises = this._scriptPromises.slice();
            // Add always-resolving promise to the scriptPromises list, so subsequent scripts can wait
            // for previous scripts being either executed or fail
            var promise = $.Deferred();
            this._scriptPromises.push(promise.promise());
            dfd.always(promise.resolve);
            this._getScript(src)
              .then(function(scriptContent) {
                  if (ExtensionLoader.isFallbackScriptContent(scriptContent)) {
                      // Don't report script to be successfully loaded if
                      // it's the fallback dashboard.js for apps
                      return dfd.reject();
                  } else {
                      // Wait until all previous scripts have been executed
                      $.when.apply($, prevScriptPromises).then(function() {
                          try {
                              this._runScript(scriptContent);
                              this._scriptContent[src] = scriptContent;
                              dfd.resolve();
                          } catch (e) {
                              dfd.reject();
                          }
                      }.bind(this));
                  }
              }.bind(this))
              .fail(dfd.reject);
            return dfd;
        },
        _runScript: function(script) {
            // Must make an indirect call to eval to execute globally.
            // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
            var globalEval = eval;
            globalEval(script);

        },
        _getScript: function(src) {
            return $.ajax({
                dataType: 'text',
                url: src,
                cache: true
            });
        },
        _loadStylesheet: function(src) {
            var dfd = $.Deferred();
            var node = document.createElement("link");
            node.rel = "stylesheet";
            node.type = "text/css";
            node.href = src;
            node.onload = dfd.resolve;
            node.onerror = dfd.reject;
            document.head.appendChild(node);
            return dfd.promise();
        },
        _resolveExtensionFile: function(app, locale, root, src) {
            var source = DashboardUtils.getAppAndSource(src, app);
            var appVersion = undefined;
            var localApp = this.collection.appLocals.find(function(localApp) { return localApp.entry.get('name') == app; });
            if (localApp) {
                appVersion = localApp.getBuild();
            }
            return Route.appStaticFileAppVersioned(root, locale, appVersion, source.app, source.src);
        }
    });

    _.extend(ExtensionLoader, {
        isValidExtensionPath: function(src, type) {
            var ext = EXTENSIONS[type];
            return ext &&
                src.indexOf('../') == -1 &&
                src.slice(src.length - ext.length) == ext &&
                !/^\w+:/.test(src);
        },
        isFallbackScriptContent: function(scriptContent) {
            return !!(scriptContent && scriptContent.slice(0, 14) == '/*--fallback--');
        }
    });

    return ExtensionLoader;
});
