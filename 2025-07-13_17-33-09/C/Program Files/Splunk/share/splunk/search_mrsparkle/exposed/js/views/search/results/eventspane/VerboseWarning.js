define(
    [
        'underscore',
        'module',
        'views/Base',
        'util/splunkd_utils'
    ],
    function(_, module, BaseView, splunkd_utils) {
        return BaseView.extend({
            moduleId: module.id,
            className: 'message-single',
            /**
             * @param {Object} options {
             *     model: {
             *          report: <models.services.SavedSearch>,
             *          searchJob: <models.Job>
             *     }
             * } 
             */            
            initialize: function() {
                BaseView.prototype.initialize.apply(this, arguments);
            },
            events: {
                'click a': function(e) {
                    e.preventDefault();
                    this.model.report.entry.content.set('display.page.search.mode', splunkd_utils.VERBOSE);
                }
            },
            render: function() {
                this.el.innerHTML = this.compiledTemplate({
                    _: _,
                    adhocSearchLevel: this.model.searchJob.getAdhocSearchMode(),
                    splunkd_utils: splunkd_utils
                });
                return false;
            },
            template: '\
                <div class="alert alert-warning">\
                    <% if (adhocSearchLevel==splunkd_utils.FAST) { %>\
                        <h2><%- _("Your search did not return any events because you are in Fast Mode.").t() %></h2>\
                    <% } else if (adhocSearchLevel==splunkd_utils.SMART) { %>\
                        <h2><%- _("Your search did not return any events because you are in Smart Mode.").t() %></h2>\
                    <% } %>\
                    <%= _(\'<a href="#">Search in Verbose Mode</a> to view events.\').t() %>\
                </div>\
            '
        });
    }
);
