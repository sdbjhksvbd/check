define(
    [
         'jquery',
         'underscore',
         'module',
         'views/Base',
         'views/shared/reportcontrols/dialogs/dashboardpanel/Master'
     ],
     function($, _, module, Base, DashboardDialog) {
        return Base.extend({
            moduleId: module.id,
            className: 'create-dashboard-panel',
            tagName: 'li',
            initialize: function() {
                Base.prototype.initialize.apply(this, arguments);
            },
            events: {
                'click a': function(e) {
                    e.preventDefault();

                    this.children.dashboardDialog = new DashboardDialog({
                        model:  {
                            report: this.model.report,
                            searchJob: this.model.searchJob,
                            application: this.model.application,
                            user: this.model.user,
                            serverInfo: this.model.serverInfo
                        },
                        onHiddenRemove: true
                    });

                    this.children.dashboardDialog.render().appendTo($('body')).show();

                    this.listenTo(this.children.dashboardDialog, 'createSuccess', function () {
                        this.model.report.trigger('createDashboardPanel', { status: 'success' });
                    }.bind(this));
                }
            },
            render: function() {
                this.$el.html(this.compiledTemplate({
                    _: _
                }));

                return this;
            },
            template: '\
                <a href="#"><%- _("Dashboard Panel").t() %></a>\
            '
        });
    }
);
