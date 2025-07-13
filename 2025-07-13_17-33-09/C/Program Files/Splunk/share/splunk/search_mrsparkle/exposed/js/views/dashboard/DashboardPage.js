define([
    'module',
    'jquery',
    'underscore',
    'backbone',
    'views/dashboard/editor/ToolBar',
    'splunkjs/mvc/headerview',
    'views/Base',
    'helpers/TourHelper',
    'models/dashboard/DashboardDisplayProps',
    './panelEditor.pcss',
    './toolbar.pcss',
    './DashboardPage.pcss'
], function(module,
            $,
            _,
            Backbone,
            ToolBarView,
            HeaderView,
            BaseView,
            TourHelper) {

    return BaseView.extend({
        moduleId: module.id,
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);
            this.deferreds = options.deferreds;
            this.model.renderState = new Backbone.Model();
            this.children = {};
            this.listenTo(this.model.page, 'change', this.render);
            this.listenTo(this.model.renderState, 'change:hideChrome change:hideSplunkBar change:hideAppBar', this.updateHeaderView);
            this.listenTo(this.model.renderState, 'change:showToolbar', this.updateToolbarView);
            this.listenTo(this.model.renderState, 'change:loading', this.renderLoadingMessage);
            this.listenTo(this.model.renderState, 'change:targetTop', this.updateTargetTop);
        },
        updateHeaderView: function() {
            // don't render header until deferred is resolved
            this.options.deferreds.xmlParsed.done(function() {
                if (!this.model.renderState.get('hideChrome')) {
                    if (!this.children.header) {
                        var view = this.children.header = new HeaderView({
                            id: 'header',
                            section: 'dashboards',
                            acceleratedAppNav: true,
                            useSessionStorageCache: false,
                            splunkbar: !this.model.renderState.get('hideSplunkBar'),
                            appbar: !this.model.renderState.get('hideAppBar'),
                            litebar: this.model.serverInfo.isLite(),
                            model: {
                                appNav: this.model.appNav
                            }
                        });
                        view.render().$el.prependTo(this.$el.children('header'));
                    }
                    this.children.header.settings.set({
                        splunkbar: !this.model.renderState.get('hideSplunkBar'),
                        appbar: !this.model.renderState.get('hideAppBar')
                    });
                } else {
                    if (this.children.header) {
                        this.children.header.remove();
                        this.children.header = null;
                    }
                }
            }.bind(this));
        },
        updateToolbarView: function() {
            if (this.children.toolbar) {
                this.children.toolbar.remove();
                this.children.toolbar = null;
            }
            if (this.model.renderState.get('showToolbar')) {
                this.children.toolbar = new ToolBarView({
                    id: 'dashboard-edit-toolbar',
                    model: this.model,
                    collection: this.collection,
                    deferreds: this.deferreds
                }).render();
                this.children.toolbar.$el.appendTo(this.$el.children('header'));
            }
        },
        renderLoadingMessage: function() {
            if (this.model.renderState.get('loading')) {
                $('<div class="loading-message"></div>').text(_('Loading...').t()).appendTo(this.$el.children('.main-section-body').empty());
            } else {
                this.$el.children('.main-section-body').children('.loading-message').remove();
            }
        },
        updateTargetTop: function() {
            $('head>base[target]').remove();
            if (this.model.renderState.get('targetTop')) {
                $('<base target="_top" />').appendTo($('head'));
            }
        },
        renderTour: function() {
            if (!this.tourRendered) {
                TourHelper.renderTour(this.model.tour, this.model.application, this.model.user, this.collection.tours);
                this.tourRendered = true;
            }
        },
        render: function() {
            if (!this.structureRendered) {
                var html = this.compiledTemplate({ _: _ });
                this.$el.html(html);
                this.structureRendered = true;
            }
            this.model.renderState.set(this.model.page.toJSON());

            this.renderTour();
            return this;
        },
        template: '\
            <a aria-label="<%- _("Click here to skip the navigation bar").t() %>"\
                class="navSkip" href="#navSkip"><%- _("Skip Navigation").t() %> &gt;\
            </a>\
            <header role="banner"></header>\
            <div id="navSkip" tabindex="-1"></div> \
            <div class="main-section-body dashboard-body" role="main">\
            </div>'
    });
});
