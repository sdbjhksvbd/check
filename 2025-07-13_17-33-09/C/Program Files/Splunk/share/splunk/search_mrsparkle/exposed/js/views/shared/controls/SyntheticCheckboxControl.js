define( [
    'underscore',
    'module',
    'views/shared/controls/Control',
    'util/keyboard',
    'splunk.util',
    './SyntheticCheckboxControl.pcssm'
], function(
    _,
    module,
    Control,
    keyboard,
    splunk_util,
    css
    )
{
    /**
     * @constructor
     * @memberOf views
     * @name SyntheticCheckboxControl
     * @extends {views.Control}
     *
     * @param {Object} options
     * @param {Backbone.Model} options.model The model to operate on
     * @param {String} options.modelAttribute The attribute on the model to observe and update on
     * selection
     * @param {Object[]} options.items An array of one-level deep data structures, for example:
     *
     *      {label: 'Foo Bar', value: 'foo', icon: 'bar'}
     *
     * @param {String} options.items[].label textual display
     * @param {Any} options.items[].value value to store in the model
     * @param {String} options.items[].icon name to show in menu and button labels
     * @param {Boolean} [options.invertValue = false] If true, then a checked checkBox has a value
     * of false and an unchecked has a value of true. This is useful for model attributes that
     * denote a negative (ex. disabled).
     * @param {String} [options.checkboxClassName = btn] Class attribute to the button element.
     * @param {String} [options.additionalClassNames] Class attribute(s) to add to control
     * @param {String} [options.ariaLabel] aria-label attribute of the control
     */
    var SyntheticCheckboxControl = Control.extend(/** @lends views.SyntheticCheckboxControl.prototype */{
        className: 'control ' + css.syntheticCheckbox,
        moduleId: module.id,
        initialize: function(){
            var defaults = {
                checkboxClassName: 'btn',
                defaultValue: false,
                label: ''
            };

            _.defaults(this.options, defaults);

            Control.prototype.initialize.apply(this, arguments);
        },
        events: {
            'click label': function(e) {
                this.toggleValue();
                e.preventDefault();
            },
            'click .btn': function(e) {
                e.preventDefault();
            },
            'keypress .btn': function(e) {
                if (e.which === keyboard.KEYS.SPACE_BAR) {
                    this.toggleValue();
                    e.preventDefault();
                }
            }
        },
        toggleValue: function() {
            !this.options.enabled || this.setValue(!this._value);
        },
        disable: function(){
            this.options.enabled = false;
            this.$('label').addClass(css.disabled);
            this.$('.btn').addClass(css.disabled);
            this.$('a').attr('tabindex', -1);
        },
        enable: function(){
            this.options.enabled = true;
            this.$('label').removeClass(css.disabled);
            this.$('.btn').removeClass(css.disabled);
            this.$('a').removeAttr('tabindex');
        },
        normalizeValue: function(value) {
            return splunk_util.normalizeBoolean(value) ? 1 : 0;
        },
        render: function(){
            var checked = this.options.invertValue ? !this.getValue() : this.getValue(),
                checkedClassName = 'checked';

            if (!this.el.innerHTML) {
                var template = _.template(this.template, {
                    id: 'control-' + this.cid,
                    options: this.options,
                    checked: checked,
                    checkedClassName: checked ? ' ' + checkedClassName : ''
                });
                this.$el.html(template);

                if (!this.options.enabled) {
                    this.disable();
                }
            } else {
                this.$('.icon-check')[checked ? 'show' : 'hide']();
                this.$('.checkbox')[checked ? 'addClass' : 'removeClass'](checkedClassName);
                this.$('.checkbox a[role=checkbox]').attr('aria-checked', checked ? 'true' : 'false');
            }

            var additionalClassNames = this.options.additionalClassNames;
            if (additionalClassNames) {
                this.$el.addClass(additionalClassNames);
            }

            return this;
        },
        template: '\
            <label class="checkbox<%- checkedClassName %>">\
                <a href="#" id="<%- id %>" \
                    data-name="<%- options.modelAttribute || "" %>" class="<%- options.checkboxClassName %>" \
                    aria-label="<%- options.ariaLabel || options.modelAttribute || "" %>" \
                    role="checkbox" aria-checked="<%- checked ? "true" : "false" %>" \
                    ><i class="icon-check" <% if (!checked) {%>style="display:none"<% } %>></i></a>\
                <%- options.label%>\
            </label>\
        '
    });

    return SyntheticCheckboxControl;
});
