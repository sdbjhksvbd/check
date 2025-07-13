define(
    [
        'underscore',
        'jquery',
        'module',
        'views/Base',
        'uri/route',
        'splunk.util'
    ],
    function(
        _,
        $,
        module,
        BaseView,
        route,
        SplunkUtil
        ) {
        return BaseView.extend({
            moduleId: module.id,

            /**
             * @param {Object} options {
             *      model: {
             *          application: <models.Application>,
             *          appLocal: <models.services.AppLocal>
             *          user: <models.services.authentication.User>
             *      }
             *      collection: {
             *          apps: <collections.services.AppLocals>
             *      }
             * }
             */
            initialize: function() {
                BaseView.prototype.initialize.apply(this, arguments);
            },
            events: {
                'click .add-dataset': function() {
                    SplunkUtil.trackEvent({
                        type: 'tableUI.interact',
                        data: {
                            action: 'create_table_view',
                            location: 'datasets listing page',
                        },
                    });
                }
            },
            render: function() {
                var tableLink = route.table(
                    this.model.application.get('root'),
                    this.model.application.get('locale'),
                    this.model.application.get('app')
                );
                if (!this.$el.html()) {
                    this.$el.html(this.compiledTemplate({
                        tableLink: tableLink
                    }));
                }
                return this;
            },

            template: '\
                <a class="btn btn-primary add-dataset" href="<%- tableLink %>"><%- _("Create Table View").t() %></a>\
            '
        });
    }
);