define(
    [
        'underscore',
        'module',
        'views/Base',
        'views/shared/datasetcontrols/details/Master'
    ],
    function(
        _,
        module,
        BaseView,
        DetailView
    ) {
        return BaseView.extend({
            moduleId: module.id,
            tagName: 'tr',
            className: 'more-info',

            /**
             * @param {Object} options {
             *     model: {
             *         dataset: <models.Dataset>,
             *         application: <models.Application>,
             *         appLocal: <models.services.AppLocal>,
             *         user: <models.service.admin.user>
             *     },
             *     collection: {
             *          roles: <collections.services.authorization.Roles>,
             *          apps: <collections.services.AppLocals>
             *     },
             *     index: <index_of_the_row>,
             *     alternateApp: <alternate_app_to_open>,
             *     colSpan: <colSpan for the moreinfo td>
             * }
             */
            initialize: function() {
                BaseView.prototype.initialize.apply(this, arguments);
                // unless otherwise specified, hide this component
                if (!this.options.showInitially) {
                    this.$el.addClass((this.options.index % 2) ? 'even' : 'odd').css('display', 'none');
                }
                this.children.details = new DetailView({
                    model: {
                        dataset: this.model.dataset,
                        application: this.model.application,
                        user: this.model.user,
                        appLocal: this.model.appLocal,
                        serverInfo: this.model.serverInfo
                    },
                    collection: {
                        roles: this.collection.roles
                    }
                });

                BaseView.prototype.initialize.apply(this, arguments);
                this.activate();
            },
            activate: function(options) {
                if (this.active) {
                    return BaseView.prototype.activate.call(this, options);
                }
                BaseView.prototype.activate.call(this, options);
                if (this.el.innerHTML) {
                    this.render();
                }
                return this;
            },
            startListening: function() {
                this.listenTo(this.model.dataset.entry, 'change:updated', function() {
                    _.debounce(this.render());
                });
            },
            render: function() {
                this.$el.html(this.compiledTemplate({
                    description: this.model.dataset.getDescription(),
                    cols: this.options.colSpan
                }));

                this.children.details.render().appendTo(this.$('td.details'));
                return this;
            },

            template: '\
                <td class="details" colspan="<%= cols %>">\
                <% if (description) { %>\
                    <p class="description">\
                        <%- description %>\
                    </p>\
                <% } %>\
                </td>\
            '
        });
    }
);
