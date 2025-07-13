define(
    [
        'jquery',
        'underscore',
        'module',
        'backbone',
        'views/Base',
        'views/shared/controls/Control',
        'views/shared/controls/SyntheticSelectControl',
        'views/shared/controls/SyntheticRadioControl',
        'views/shared/controls/SyntheticCheckboxControl',
        'views/shared/controls/SyntheticSliderControl',
        'views/shared/controls/CheckboxGroup',
        'views/shared/controls/TextControl',
        'views/shared/controls/TextareaControl',
        'views/shared/controls/TextBrowseControl',
        'views/shared/controls/SpinnerControl',
        'views/shared/controls/DateControl',
        'views/shared/controls/LabelControl',
        'views/shared/controls/AccumulatorControl',
        'views/shared/controls/SliderControl',
        'views/shared/controls/MultiInputControl',
        'bootstrap.tooltip'
    ],
    function
    (
        $,
        _,
        module,
        Backbone,
        Base,
        Control,
        SyntheticSelectControl,
        SyntheticRadioControl,
        SyntheticCheckboxControl,
        SyntheticSliderControl,
        CheckboxGroupControl,
        TextControl,
        TextareaControl,
        TextBrowseControl,
        SpinnerControl,
        DateControl,
        LabelControl,
        Accumulator,
        SliderControl,
        MultiInputControl
        //tooltip
    )
{
    /**
     * @constructor
     * @memberOf views
     * @name ControlGroup
     * @extends {views.Base}
     * @description Wrapper around a Control that adds a label and an error state
     *
     * @param {Object} options
     * @param {String} options.controlType The attribute on the model to observe and update on
     * selection
     * @param {Object} options.controlOptions dictionary passed to the control
     * @param {String} options.controlsLayout How controls should fill or connect:
     *              join, separate, wrap or stack
     * @param {Backbone.View|Backbone.View[]|Object[]} options.controls An array of
     * dictionaries with types and options, and/or views, or a View
     * @param {String} [options.label] the contents of the label tag
     * @param {Boolean} [options.error] Whether or not the control group is in an error state
     * @param {Boolean} [options.validate = false] Whether controls should use validation when
     * setting model attributes.
     * @param {Boolean} [options.forceUpdate = false] Whether controls should force updates when
     * setting model attributes
     * @param {Boolean} [options.enabled = true] Whether the control group should appear enabled
     * @param {String} [options.tooltip] Text to display in the tooltip.
     * @param {String} [options.controlClass] an additional css class to add to the controls block
     * @param {String} [options.help] help text to add to the control group
     * @param {String} [options.additionalClassNames] Class attribute(s) to add to control
     */
    return Base.extend(/** @lends views.ControlGroup.prototype */{
        className: 'control-group',
        moduleId: module.id,
        initialize: function() {
            var controlType = this.options.controlType ||
                    this.options.controls && this.options.controls.length && this.options.controls[0].type,
                isListControl = controlType == 'CheckboxGroup',
                defaults = {
                    label: '',
                    controls:[],
                    error: false,
                    _errorMsg : "",
                    controlClass: '',
                    controlsLayout: isListControl ? 'stack' : 'join',
                    enabled: true,
                    size: 'default',
                    additionalClassNames: []
            };
            _.defaults(this.options, defaults);

            if (this.options.controls.length == 0) {
                this.options.controls = [{type: this.options.controlType, options: this.options.controlOptions}];
            }

            this.controlTypes= {
                    'SyntheticSelect': SyntheticSelectControl,
                    'SyntheticRadio': SyntheticRadioControl,
                    'SyntheticCheckbox': SyntheticCheckboxControl,
                    'SyntheticSlider': SyntheticSliderControl,
                    'CheckboxGroup': CheckboxGroupControl,
                    'Text': TextControl,
                    'Textarea': TextareaControl,
                    'TextBrowse': TextBrowseControl,
                    'Spinner': SpinnerControl,
                    'Date': DateControl,
                    'Label': LabelControl,
                    'Accumulator': Accumulator,
                'Slider': SliderControl,
                'MultiInput': MultiInputControl
            };

            // Allow user to pass in there own control component.
            $.extend(true, this.controlTypes, this.options.controlTypes || {});

            Base.prototype.initialize.apply(this, arguments);

            if(!this.options.enabled) {
                this.$el.addClass('disabled');
                this.$el.attr('aria-disabled', 'true');
            }

            // normalize controls to an array if it's a single item
            if(!_(this.options.controls).isArray()) {
                this.options.controls = [this.options.controls];
            }

            if (!_(this.options.additionalClassNames).isArray()) {
                this.options.additionalClassNames = [this.options.additionalClassNames];
            }

            // create a list to hold the controls (in addition to the children dictionary) so that order can be preserved
            this.childList = [];

            _.each(this.options.controls, function(control, index) {
                // if the control is already a view, just add it to the children object
                if(control instanceof Backbone.View) {
                    this.children['child' + index] = control;
                    this.childList.push(control);
                }
                // otherwise construct a new view using the "type" and "options" fields
                else {
                    // allow a control to inherit the "validate", "forceUpdate", "enabled", and size properties from the group options
                    var controlOptions = $.extend(
                        true,
                        {
                            ariaLabel: this.options.label,
                            validate: !!this.options.validate,
                            forceUpdate: !!this.options.forceUpdate,
                            enabled: !!this.options.enabled,
                            size: this.options.size
                        },
                        control.options
                    );
                    var controlView = this.children['child' + index] = new this.controlTypes[control.type](controlOptions);
                    this.childList.push(controlView);
                }
            }, this);

            this.nameSpace = this.uniqueNS();
            this.activate();
        },
        startListening: function() {
            var perAttrValidation = {};
            if(_.isArray(this.options.controls)){
                 _.each(this.options.controls, function(control, index) {
                    if(control.options && control.options.model){
                        perAttrValidation[control.options.modelAttribute] = true;
                        this.listenTo(control.options.model, 'attributeValidated:' + control.options.modelAttribute, function(isValid, key, error){
                            perAttrValidation[key] = isValid;
                            this.error(_.any(perAttrValidation, function(value) { return !value; }));
                        });
                    }
                 },this);
            }

            if(this.options.controlOptions && (this.options.controlOptions.model instanceof Backbone.Model)) {
                if(!_.isArray(this.options.controlOptions)) {
                    perAttrValidation[this.options.controlOptions.modelAttribute] = true;
                    this.listenTo(this.options.controlOptions.model, 'attributeValidated:' + this.options.controlOptions.modelAttribute, function(isValid, key, error){
                        perAttrValidation[key] = isValid;
                        this.error(_.any(perAttrValidation, function(value) { return !value; }));
                    });
                }
            }
        },
        events: {
            'click a.tooltip-link': function(e) {
                e.preventDefault();
            }
        },
        render: function() {
            if(!this.el.innerHTML) {
                // From accessibility aspect, control-viewxxxx is applied on Text control, Text Area control, and Synthetic Checkbox control
                // control-container-viewxxxx is applied on other controls like synthetic select control
                var labelForValue = this.children.child0 instanceof TextControl
                                    || this.children.child0 instanceof TextareaControl
                                    || this.children.child0 instanceof SyntheticCheckboxControl
                                    ? 'control-' : 'control-container-';
                var template = _.template(this.template, {
                    _: _,
                    label: this.options.label,
                    labelFor: (this.options.controlOptions && this.options.controlOptions.elementId) || labelForValue + this.children.child0.cid,
                    help: this.options.help,
                    controlClass: this.options.controlClass,
                    layout: this.options.controlsLayout,
                    helpClass: this.options.helpClass,
                    tooltip: this.options.tooltip,
                    nameSpace: this.nameSpace
                });
                this.$el.html(template);

                if (this.options.tooltip) {
                    var tooltip = this.options.tooltip;
                    this.$('.tooltip-link').tooltip({animation:false, title: this.options.tooltip, container: 'body'});
                    this.$('.tooltip-link').focus(function() {
                        var $tooltipLink = $(this);
                        $tooltipLink.attr('aria-label', tooltip);
                    });
                    this.$('.tooltip-link').blur(function() {
                        var $tooltipLink = $(this);
                        $tooltipLink.attr('aria-label', '');
                    });
                }

                _.each(this.childList, function(child, i) {
                    this.$('.controls').append(child.render().$el);
                    if (!i) {
                        child.$el.attr('id', "control-container-" + this.children.child0.cid);
                    }
                }, this);

                this.$el.addClass('control-group-' + this.options.size);
                _.each(this.options.additionalClassNames, function(className) {
                    this.$el.addClass(className);
                }.bind(this));
            }

            // TODO [JCS] How come this is coming from options and not from an internal variable set in error()?
            this.error(this.options.error);

            return this;
        },
        hide: function() {
            this.$el.hide();
        },
        show: function() {
            this.$el.show();
        },
        remove: function() {
            if(this.options.tooltip) {
                this.$('.tooltip-link').tooltip('destroy');
            }
            return Base.prototype.remove.apply(this, arguments);
        },
        enable: function() {
            this.$el.removeClass('disabled');
            this.$el.attr('aria-disabled', 'false');
            _(this.getAllControls()).invoke('enable');
        },
        disable: function() {
            this.$el.addClass('disabled');
            this.$el.attr('aria-disabled', 'true');
            _(this.getAllControls()).invoke('disable');
        },
        getModelAttributes: function() {
            var attrs = [];
            _.each(this.childList, function(child) {
                attrs.push(child.getModelAttribute());
            }, this);
            return attrs;
        },
        error: function(state, errorMsg) {
            state ? this.$el.addClass("error") : this.$el.removeClass("error");

            // Store the error message internally. For now, we aren't displaying it.
            this._errorMsg = errorMsg;
            return this;
        },
        getAllControls: function() {
            return _(this.children).filter(function(child) { return child instanceof Control; });
        },
        // NOTE: The help text is intentionally not HTML-escaped, it is up to the caller to
        // pre-process this input as need to avoid XSS attacks.
        setHelpText: function(helpText) {
            var $helpBlock = this.$('.help-block');
            if ($helpBlock.length === 0) {
                $helpBlock = $('<span></span>').addClass('help-block').appendTo(this.$el);
            }
            $helpBlock.html(helpText);
        },
        template: '\
                <label class="control-label" for="<%- labelFor %>" id="label-<%- nameSpace %>">\
                <%- label %><% if (tooltip) { %><a href="#" class="tooltip-link"><%- _("?").t() %></a><% } %>\
                </label>\
                <div aria-labelledby="label-<%- nameSpace %>" class="controls controls-<%- layout %> <%- controlClass %>"></div>\
                <% if (help) { %> <div class="help-block <%- helpClass %>"><%= help %></div><% } %>\
                \
        '
    });
});
