define(
    [
        'underscore',
        'module',
        'views/Base',
        'splunk.util'
    ],
    function(_, module, Base, splunkUtil) {
        return Base.extend({
            moduleId: module.id,
            tagName: 'span',
            initialize: function() {
                Base.prototype.initialize.apply(this, arguments);
                this.activate();
            },
            activate: function(options) {
                if (this.active) {
                    return Base.prototype.activate.call(this, options);
                }
                Base.prototype.activate.call(this, options);
                if (this.el.innerHTML) {
                    this.render();
                }
                return this;
            },
            startListening: function() {
                this.listenTo(this.model.entry.content, 'change:auto_summarize change:auto_summarize.dispatch.earliest_time', this.debouncedRender);
            },
            render: function() {
                this.$el.html(this.compiledTemplate({
                    model: this.model,
                    _: _,
                    splunkUtil: splunkUtil
                }));
                return this;
            },
            convertSummarizeTime: function(relTime) {
                switch(relTime)
                {
                    case '-1d@h':
                        return _('1 Day').t();
                    case '-7d@d':
                        return _('1 Week').t();
                    case '-1mon@d':
                        return _('1 Month').t();
                    case '-3mon@d':
                        return _('3 Months').t();
                    case '-1y@d':
                        return _('1 Year').t();
                    case '0':
                        return _('All Time').t();
                    default:
                        return _('Custom').t();
                }
            },
            template: '\
                <% if (model.entry.content.get("auto_summarize")) { %>\
                    <%- splunkUtil.sprintf(_("Enabled. Summary Range: %s.").t(), this.convertSummarizeTime(model.entry.content.get("auto_summarize.dispatch.earliest_time"))) %>\
                <% } else { %>\
                    <%- _("Disabled.").t() %>\
                <% } %>\
            '
        });
    }
);
