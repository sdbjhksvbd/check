define([
    'jquery',
    'underscore',
    'module',
    'views/Base',
    'views/shared/searchbarinput/Master',
    'models/services/authentication/User',
    'models/search/SearchBar',
    './SearchTextareaControl.pcss'
], function (
    $,
    _,
    module,
    BaseView,
    SearchInputView,
    UserModel,
    SearchBarModel,
    css
) {
    /**
     * @param {Object} options
     * @param {Object} options.controlOptions
     * @param {String} options.controlOptions.modelAttribute The attribute on the model to observe and update on selection
     * @param {Backbone.Model} options.controlOptions.model The model to operate on
     *
     * Other options are the same as TextareaControl component.
     */
    return BaseView.extend({
        moduleId: module.id,
        className: 'control-group',
        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);

            _.defaults(this.options, {
                label: _("Search String").t(),
                submitOnBlur: true,
                minSearchBarLines: 3,
                maxSearchBarLines: 12,
                enabled: true,
                readOnly: false,
                showRunSearch: true,
                showLabel: true,
                // Don't use user pref for search assistant if equal to full, it is too wide
                searchAssistant: (this.model.user.getSearchAssistant() === UserModel.SEARCH_ASSISTANT.FULL) ? UserModel.SEARCH_ASSISTANT.NONE : undefined
            });

            this.model.searchBar = new SearchBarModel();

            this.listenTo(this.model.searchBar, 'change:search', this.updateRunSearchLink);
        },
        events: {
            'click a.run-search': function(e) {
                e.preventDefault();
                this.trigger('runSearch', this.model.content.get('search'));
            }
        },
        updateRunSearchLink: function() {
            if (this.children.searchField && this.options.showRunSearch) {
                if (this.children.searchField.getText().length) {
                    this.ENABLED_RUN_SEARCH_LINK.show();
                    this.DISABLED_RUN_SEARCH_LINK.hide();
                } else {
                    this.ENABLED_RUN_SEARCH_LINK.hide();
                    this.DISABLED_RUN_SEARCH_LINK.show();
                }
            }
        },

        render: function() {
            this.$el.html(this.compiledTemplate({
                label: this.options.label,
                showLabel: this.options.showLabel
            }));
            var controls = this.$el.find('.controls');

            // make sure to new SearchInputView every time render is called, because SearchInputView
            // render function only creates $el once.
            this.children.searchField = new SearchInputView({
                model: {
                    user: this.model.user,
                    content: this.model.content,
                    application: this.model.application,
                    searchBar: this.model.searchBar
                },
                collection: {
                    searchBNFs: this.collection.searchBNFs
                },
                searchAttribute: this.options.searchAttribute,
                enabled: this.options.enabled,
                submitOnBlur: this.options.submitOnBlur,
                minSearchBarLines: this.options.minSearchBarLines,
                maxSearchBarLines: this.options.maxSearchBarLines,
                searchAssistant: this.options.searchAssistant,
                syntaxHighlighting: this.options.syntaxHighlighting,
                readOnly: this.options.readOnly
            });
            this.children.searchField.render().appendTo(controls);

            if (this.options.showRunSearch) {
                this.ENABLED_RUN_SEARCH_LINK = $('<a href="#" class="run-search">' + _("Run Search").t() + ' <i class="icon-external"></i></a>');
                this.DISABLED_RUN_SEARCH_LINK = $('<span class="run-search disabled">' + _("Run Search").t() + ' <i class="icon-external"></i></span>');
                this.ENABLED_RUN_SEARCH_LINK.appendTo(controls);
                this.DISABLED_RUN_SEARCH_LINK.appendTo(controls);
            }
            this.updateRunSearchLink();

            return this;
        },

        template:'\
        <% if (showLabel) { %>\
            <label class="control-label"><%- label %></label>\
        <% } %>\
        <div class="controls">\
        </div>\
        '
    });
});
