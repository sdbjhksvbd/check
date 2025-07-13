/**
 * Displayed when the dashboard contains external URLs that are not in the Dashboard Trusted Domains List
 */

 define([
    'jquery',
    'underscore',
    'module',
    'views/shared/Modal',
    'uri/route',
    'util/keyboard',
    './ExternalUrlModal.pcss'
],

function(
    $,
    _,
    module,
    Modal,
    route,
    keyboard,
    css
) {

    return Modal.extend({
        moduleId: module.id,
        /**
         * @param {Object} options {
         *     model: {
         *         externalUrls: TODO
         *         application: <models.Application>
         *     }
         * }
         */
        className: Modal.CLASS_NAME + " external-url-modal",
        initialize: function(options) {
            Modal.prototype.initialize.apply(this, arguments);
            var defaults = {
                warningText: _("The dashboard is attempting to receive content from outside of Splunk. The content URLs are not in the Dashboards Trusted Domains List.").t()
            };
            _.defaults(this.options, defaults);
            this.listenTo(this, 'shown', function(options) {
                document.body.classList.remove('body-modal-open');
                this.$el.on('keyup.dismiss.modal', function(e) {
                    if (this.options.keyboard && e.which === keyboard.KEYS.ESCAPE) {
                        this.trigger('cancel');
                    }
                }.bind(this));
                $('.modal-backdrop').on('click.' + this.cid, function(e) {
                    if (this.options.backdrop) {
                        this.trigger('cancel');
                    }
                }.bind(this));
            }.bind(this));

            this.listenTo(this, 'hidden', function(options) {
                this.$el.off('keyup.dismiss.modal');
                $('.modal-backdrop').off('click.' + this.cid);
            }.bind(this));
        },

        events: Object.assign({}, Modal.prototype.events, {
            'click .modal-btn-confirm': function(e) {
                this.hide();
                this.trigger('continue');
                e.preventDefault();
            },

            'click .modal-btn-cancel, .close': function(e) {
                this.trigger('cancel');
            }
        }),

        render: function() {
            this.$el.html(Modal.TEMPLATE);
            var warningText = '<span>' + _("Continue with external content?").t() +'</span>';
            this.$(Modal.HEADER_TITLE_SELECTOR).html(warningText);

            this.$(Modal.BODY_SELECTOR).html(this.compiledTemplate({
                _: _,
                externalUrls: this.model.externalUrls,
                warningText: this.options.warningText,
                learnMoreLink: route.docHelp(
                    this.model.application.get("root"),
                    this.model.application.get("locale"),
                    'dashboards.trusted.domains'),
            }));

            this.$(Modal.FOOTER_SELECTOR).append(Modal.BUTTON_CANCEL);
            this.$(Modal.FOOTER_SELECTOR).append('<a href="#" class="btn btn-primary modal-btn-confirm">' + _('Continue').t() + '</a>');
            return this;
        },

        template: '\
            <div class="body">\
                <span class="icon-wrapper"><i class="icon-alert"></i></span>\
                <div class="warning-content">\
                    <%- warningText %><a class="learn-more-link" href="<%- learnMoreLink %>" target="_blank" rel="noopener noreferrer" title="<%- _("Splunk help").t()%>"><%- _("Learn more").t() %> <i class="icon-external"></i></a>\
                    </br>\
                    </br>\
                    <%- _("The URLs are:").t() %>\
                    <ul>\
                    <% _.each(externalUrls, function(externalUrl) { %>\
                        <li><%- externalUrl %></li>\
                    <% }); %>\
                    </ul>\
                </div>\
            </div>\
        '
    });
}
);
