define([
    'module',
    'jquery',
    'underscore',
    'views/dashboard/Base',
    'views/shared/dialogs/ExternalUrlModal',
    'services/web_features/CSPHeader',
    'splunkjs/mvc/tokenawaremodel',
    'splunkjs/mvc/tokenutils',
    'splunkjs/mvc/messages',
    'splunk.util',
    'splunkjs/mvc/utils',
    'splunkjs/mvc/simplexml/dashboard/tokendeps',
    'util/dashboard_utils',
    'uri/route',
    'util/htmlcleaner',
    'util/xml'
], function(
    module,
    $,
    _,
    BaseDashboardView,
    ExternalUrlModal,
    CSPHeaderService,
    TokenAwareModel,
    TokenUtils,
    Messages,
    SplunkUtils,
    Utils,
    TokenDependenciesMixin,
    DashboardUtils,
    Route,
    HtmlCleaner,
    XML
) {
    /**
     * This defines the <html> element used in SXML dashboards. It'll be nested
     * in <panel> like this:
     *
     * <dashboard>
     *   <row>
     *     <panel>
     *       <html> <-- This is Html.js. We use util/htmlcleaner.js on content:
     *         <h1>Hi!</h1>
     *         <div style="width:200px;height:200px;background:red;"/>
     *       </html>
     *     </panel>
     *   </row>
     * </dashboard>
     *
     * In the DOM this is rendered as a `<div class="panel-body html">` node.
     * The entire class (BaseDashboardView) is initialize()'d and render()'d
     * from scratch when the user moves between the Edit and View modes of SXML.
     * 
     * The code flow is wild... To save you the headache it goes:
     *   initialize()
     *     async getStaticFile()
     *       .then() // waiting on network call
     *         elementModel.set({ error and/or html })
     *         // this.listenTo('change:html change:error') will call:
     *           render()
     *             updateHtmlContent()
     *               HtmlCleaner.cleanWithRefs()
     *               async CSPHeaderService.getFeatureSettings()
     *                 .then().finally() // waiting on network call
     *                   showExternalUrlModal()
     *                     new ExternalUrlModal
     *                     .render().appendTo($("body"));
     *                     .show();
     *                     // waiting for user to press the modal button
     *                     // this.listenTo(modal, 'continue cancel') will call:
     *                       $body.html(updatedHtml) // dashboard is shown
     *
     * FIX ME:
     *  - localizeHtmlContent() is hugely destructive to DOM references because
     *    it uses jQuery's .html() to serialize and deserialize content. It's
     *    also wasteful, and it's jQuery :( #useThePlatform
     *
     *  - Uses legacy Deferred async system instead of promises
     *  - Uses legacy $.ajax instead of fetch()
     *  - Hell of `}.bind(this));` please use `() => {}` which maintains `this`
     */
    var LINK_ELEMENTS = {
        "a": ["href"],
        "iframe": ["src", "srcdoc"],
        "img": ["src"]
    };

    return BaseDashboardView.extend(_.extend({}, TokenDependenciesMixin, {
        moduleId: module.id,
        viewOptions: {
            register: true
        },
        className: 'dashboard-element html',
        initialize: function() {
            BaseDashboardView.prototype.initialize.apply(this, arguments);
            /**
             * @typedef {object} ElementModel
             * @property {string} html The HTML string from the SXML editor
             * view...? Maybe? It looks like we fetch-then-sync it into the
             * synced Settings model...
             * @property {string} serverSideInclude The src-URI used to fetch
             * the HTML content (???)
             * @property {string} tokenDependencies Magic
             * @property {string} useTokens Magic
            */
            /** @type {import('backbone').Model<ElementModel>} */
            this.elementModel = new TokenAwareModel({}, {
                retainUnmatchedTokens: true,
                tokenEscaper: TokenUtils.getEscaper('html'),
                allowNoEscape: false,
            });
            Utils.syncModels(this.settings, this.elementModel, {
                include: ['html', 'serverSideInclude', 'tokenDependencies', 'useTokens'],
                auto: 'push',
            });

            this.listenTo(this.settings, "change:serverSideInclude", this.getStaticFile);
            if (this.settings.has("serverSideInclude")) {
                this.contentLoadedDfd = $.Deferred();
                _.defer(_.bind(this.getStaticFile, this));
            } else {
                this.contentLoadedDfd = $.Deferred().resolve();
            }
            this.listenTo(this.elementModel, 'change:html change:error', this.render);
            this.setupTokenDependencies();
        },
        /**
         * Similar to this.$el (provided by "Base" view). I tried using `get
         * $body() {...}` as an ES6 getter but Backbone breaks */
        $body: function() {
            var el = this.$el.children('.panel-body');
            if (!el.length) {
                el = $('<div class="panel-body html"></div>').appendTo(this.$el);
            }
            return el;
        },
        getVisualizationType: function() {
            return "html";
        },
        getStaticFile: function() {
            var srcUri = this.settings.get('serverSideInclude');
            if (!srcUri) {
                return;
            }
            var source = DashboardUtils.getAppAndSource(srcUri, this.model.view.entry.acl.get('app'));
            var root = this.model.application.get('root');
            var locale = this.model.application.get('locale');
            var contentUrl = Route.appStaticFile(root, locale, source.app, source.src);
            var useTokens = this.settings.get('useTokens');
            // test if srcUrl is accessing any of following unauthorized resource
            // absolute urls (containing http: or https:),
            // parent directory references (containing ..),
            // server-relative url (beginning with /)
            var elementModel = this.elementModel;
            var dfd = this.contentLoadedDfd;
            if (/^https?:/.test(srcUri) || /(^|\/)\.\.\//.test(srcUri) || /^\//.test(srcUri)) {
                elementModel.set('error', _("Error loading HTML panel content: Invalid src attribute value specified.").t());
                dfd.resolve();
            } else {
                $.ajax({
                    dataType: "html",
                    type: "GET",
                    url: contentUrl,
                    error: function(xhr) {
                        elementModel.set('error', xhr.status === 404 ?
                            SplunkUtils.sprintf(_("Error loading HTML panel content: HTML file \"%s\" not found.").t(), srcUri) :
                            SplunkUtils.sprintf(_("Error loading HTML panel content: Error loading HTML file (HTTP status %d).").t(), xhr.statusCode)
                        );
                        dfd.resolve();
                    },
                    success: function(data) {
                        if (data !== "") {
                            elementModel.set({
                                error: null,
                                html: data
                            }, { tokens: useTokens });
                        }
                        dfd.resolve();
                    }
                });
            }
        },
        normalizeLinks: function($el) {
            // SPL-70655 root-endpoint/locale prefix for server-relative URLs
            _(LINK_ELEMENTS).each(function(attrs, name) {
                attrs.forEach(function(attr) {
                    $el.find(`${name}[${attr}]`).each(function() {
                        var linkEl = $(this);
                        var url = linkEl.attr(attr);
                        if (url && url[0] === '/' && url[1] !== '/') {
                            linkEl.attr(attr, SplunkUtils.make_url(url));
                        }
                    });
                });
            });
        },
        /**
         * Not the best function name; writeToDom is what _actually_ updates
         * the content. This should be called "cleanHtmlContent" can't break
         * API contracts */
        updateHtmlContent: function() {
            var html = this.elementModel.get('html');
            try {
                // Attempt to replace CDATA XML nodes within the HTML content
                var m = XML.serialize(XML.replaceCdataNodes(XML.$node('<tmp>' + html + '</tmp>'), true)).match(/^<tmp>([\s\S]*)<\/tmp>$/i);
                if (m) {
                    html = m[1];
                }
            } catch(e) {
                // ignore if not valid XML
            }
            var cleanerRefs = HtmlCleaner.cleanWithRefs(html, {
                allowInlineStyles: DashboardUtils.allowInlineStyles(),
                allowIframes: DashboardUtils.allowIframes(),
                allowEmbeds: DashboardUtils.allowEmbeds(),
                wrapEmbedTags: DashboardUtils.allowWrapEmbed(),
                allowedDomains: DashboardUtils.allowedDomains(),
                // This allows us to modify the DOM to remove external URLs
                returnDom: true,
                dashboardTelemetry: true,
            });
            if (!cleanerRefs || !cleanerRefs.cleanHtmlOrDom) {
                // Historical - jQuery's .html() knows how to handle `null`
                this.writeToDom(null);
                return;
            }
            var htmlOrDom = cleanerRefs.cleanHtmlOrDom;
            this.externalUrls = cleanerRefs.externalUrlDomRefs;
            if (this.externalUrls.size === 0) {
                this.writeToDom(htmlOrDom);
                return;
            }
            // Else...
            CSPHeaderService.getFeatureSettings()
                .then(function() {
                    let data = CSPHeaderService.getFeatureSettingsSync(); 
                    this.trustedDomains = DashboardUtils.extractTrustedDomains(data);
                }.bind(this))
                .catch(function() {
                    this.trustedDomains = []
                }.bind(this))
                .finally(function() {
                    var urls = Array.from(this.externalUrls.keys());
                    urls = DashboardUtils.getExternalUrls(urls, this.trustedDomains);
                        // Do we need to get consent before rendering dashboard?
                        if (urls.length === 0) {
                            this.writeToDom(htmlOrDom);
                        } else {
                            this.showExternalUrlModal(htmlOrDom, urls);
                        }
                }.bind(this));
        },
        render: function() {
            if (this.elementModel.has('error')) {
                Messages.render({
                    icon: "warning-sign",
                    level: "error",
                    message: this.elementModel.get('error')
                }, this.$body());
            } else if (this.elementModel.has('html')) {
                this.updateHtmlContent();
            }
            return this;
        },
        writeToDom: function(htmlOrDom) {
            // Note that localizeHtmlContent is destructive of all DOM
            // references such as externalUrlDomRefs. It's also terribly
            // inefficient.
            htmlOrDom = DashboardUtils.localizeHtmlContent(htmlOrDom);
            this.$body().html(htmlOrDom);
            this.normalizeLinks(this.$body());
        },
        showExternalUrlModal: function(htmlOrDom, urls) {
            this.externalUrlModal = new ExternalUrlModal({
                model: {
                    externalUrls: urls,
                    application: this.model.application
                },
                onHiddenRemove:true
            });
            this.listenTo(this.externalUrlModal, "continue", function(options) {
                // Proceed to render dashboard
                this.writeToDom(htmlOrDom);
            }.bind(this));
            this.listenTo(this.externalUrlModal, "cancel", function() {
                // This MUST happen first since localizeHtmlContent will step on
                // our dom and kill the references cleanFn is pointing to
                this.externalUrls.forEach(function(cleanFn, url) {
                    if (urls.includes(url)) cleanFn();
                });
                this.writeToDom(htmlOrDom);
            }.bind(this));
            this.externalUrlModal.render().appendTo($("body"));
            this.externalUrlModal.show();
        },
        getExportParams: function() {
            // Nothing to export
            return {};
        },
        componentReady: function() {
            return this.contentLoadedDfd.promise();
        },
        remove: function() {
            this.stopListeningToTokenDependencyChange();
            BaseDashboardView.prototype.remove.apply(this, arguments);
        }
    }));
});
