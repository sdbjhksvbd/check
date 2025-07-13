define(
    [
        'underscore',
        'jquery',
        'module',
        'views/shared/splunkbar/find/results/BaseResults',
        'uri/route',
        'splunk.util'
    ],
    function(
        _,
        $,
        module,
        BaseResultView,
        route,
        splunkUtils
    ){
        return BaseResultView.extend({
            className: 'reportResults',
            render: function() {
                var html = this.compiledTemplate({
                    _: _,
                    splunkUtils: splunkUtils,
                    collection: this.collection.reports || [],
                    css: this.css,
                    className: "reports",
                    title: _("Reports").t(),
                    modelRoute: route.report,
                    nameAttr: undefined,
                    managerRoute: route.manager(
                        this.model.application.get('root'),
                        this.model.application.get('locale'),
                        'system',
                        ['reports'],
                        {
                            data: {
                                search: this.model.state.get('search') || '',
                                rawSearch: this.model.rawSearch.get('rawSearch') || ''
                            }
                        }),
                    app: this.model.application,
                    apps: this.collection.apps,
                    alternateApp: this.options.alternateApp,
                    getViewingPageRoute: this.getViewingPageRoute
                });

                this.$el.html(html);
                this.addIcons(this.$('[data-role=main-link]'), 'report', 1.3333);
                this.addIcons(this.$('[data-role=secondary-link]'), 'external', 1);
                return this;
            }
    });
});
