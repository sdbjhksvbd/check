define([
    'jquery',
    'underscore',
    'backbone',
    'module',
    'views/shared/Modal',
    'views/shared/FlashMessages',
    'uri/route',
    'splunk.util'
    ],
    function(
        $,
        _,
        Backbone,
        module,
        Modal,
        FlashMessage,
        route,
        splunkUtil
    ) {
    return Modal.extend({
        moduleId: module.id,
        /**
        * @param {Object} options {
        *       model: <models.Report>
        * }
        */
        initialize: function(options) {
            Modal.prototype.initialize.apply(this, arguments);

            this.model = {
                report: this.model,
                inmem: this.model.clone()
            };
            this.action = this.model.inmem.entry.content.get('disabled') ? _('Enable').t() : _("Disable").t();

            this.children.flashMessage = new FlashMessage({model: this.model.inmem});
        },
        events: $.extend({}, Modal.prototype.events, {
            'click .btn-primary': function(e) {
                if (this.model.report.isDisabled()) {
                    this.model.report.enable()
                        .done(this.hide(), this.model.report.fetch());
                } else {
                    this.model.report.disable()
                        .done(this.hide(), this.model.report.fetch());
                }
                e.preventDefault();
            }
        }),
        render : function() {
            this.$el.html(Modal.TEMPLATE);

            this.$(Modal.HEADER_TITLE_SELECTOR).html(this.action);

            this.children.flashMessage.render().prependTo(this.$(Modal.BODY_SELECTOR));

            this.$(Modal.BODY_SELECTOR).append(this.compiledTemplate({
                _: _,
                model: this.model.inmem,
                splunkUtil: splunkUtil
            }));

            this.$(Modal.FOOTER_SELECTOR).append(Modal.BUTTON_CANCEL);

            this.$(Modal.FOOTER_SELECTOR).append('<a href="#" class="btn btn-primary">' + this.action + '</a>');

            return this;
        },
        template: '\
            <% if(model.entry.content.get("disabled")) { %>\
                <span><%- splunkUtil.sprintf(_(\'Are you sure you want to enable "%s"?\').t(), model.entry.get("name")) %></span>\
            <% } else { %>\
                <p><%- splunkUtil.sprintf(_(\'Are you sure you want to disable "%s"?\').t(), model.entry.get("name")) %></p>\
            <% } %>\
        '

    });
});
