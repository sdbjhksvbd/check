define(
    [
        'jquery',
        'underscore',
        'module',
        'views/Base',
        'views/shared/vizcontrols/vizpicker/Master',
        'views/shared/vizcontrols/format/Master',
        'views/shared/vizcontrols/trellis/Master',
        'views/shared/viz/schemas/trellis',
        'models/services/search/IntentionsParser',
        'helpers/VisualizationRegistry',
        'bootstrap.tooltip',
        './Master.pcss'
    ],
    function(
        $,
        _,
        module,
        BaseView,
        VizPicker,
        Format,
        Trellis,
        trellisSchema,
        IntentionsParser,
        VisualizationRegistry,
        bootstrapTooltip,
        css
    ) {

        return BaseView.extend({

            moduleId: module.id,

            allowedVizTypes: ['events', 'statistics', 'visualizations'],

            _currentVizId: null,

            /**
             * @param {Object} options {
             *     model: {
             *         report: <models.search.Report>,
             *         application: <models.shared.Application>
             *         user: <models.shared.User>
             *     },
             *     vizTypes (required): [events &| statistics &| visualizations],
             *     saveOnApply: <Boolean> whether to save the report when any changes are submitted
             *     bindToChangeOfSearch: <Boolean> whether to bind to changes of the search string and update recommendations
             *     dashboard: <Boolean> is this a dashboard context TODO [sff] figure out a better name here,
             *     excludeAttributes: <Array> a list of report attribute names whose controls should not be rendered
             *     showTrellis: <Boolean> whether to show the trellis
             * }
             */
            initialize: function() {
                BaseView.prototype.initialize.apply(this, arguments);

                var defaults = {
                    bindToChangeOfSearch: true,
                    saveOnApply: false
                };
                this.options = $.extend(true, defaults, this.options);

                if(!_.isArray(this.options.vizTypes) || this.options.vizTypes.length === 0) {
                    throw new Error('Vizcontrols Master must be instantiated with at least one viz type');
                }
                _(this.options.vizTypes).each(function(type) {
                    if(!_(this.allowedVizTypes).contains(type)) {
                        throw new Error(type + ' is not an allowed viz type');
                    }
                }, this);

                this.model.intentionsParser = new IntentionsParser();

                this.children.vizPicker = new VizPicker({
                    model: {
                        report: this.model.report,
                        intentionsParser: this.model.intentionsParser,
                        application: this.model.application,
                        user: this.model.user
                    },
                    warningMsg: this.options.vizpicker ? this.options.vizpicker.warningMsg : null,
                    warningLearnMoreLink: this.options.vizpicker ? this.options.vizpicker.warningLearnMoreLink : null,
                    vizTypes: this.options.vizTypes,
                    saveOnApply: this.options.saveOnApply
                });
                this.children.vizPicker.$el.addClass('pull-left');

                this.children.vizFormat = new Format({
                    model: {
                        report: this.model.report,
                        application: this.model.application
                    },
                    warningMsg: this.options.format ? this.options.format.warningMsg : null,
                    warningLearnMoreLink: this.options.format ? this.options.format.warningLearnMoreLink : null,
                    excludeAttributes: this.options.excludeAttributes,
                    dashboard: this.options.dashboard,
                    saveOnApply: this.options.saveOnApply
                });
                this.children.vizFormat.$el.addClass('pull-left');

                if (this.options.showTrellis) {
                    this.children.vizTrellis = new Trellis({
                        model: {
                            report: this.model.report,
                            application: this.model.application
                        },
                        saveOnApply: this.options.saveOnApply
                    });
                    this.children.vizTrellis.$el.addClass('pull-left');
                }

                this.activate();
            },

            startListening: function() {
                if (this.options.dashboard) {
                    this.listenTo(this.model.report.entry.content, 'change:search change:id', this._updateVizTypeVisibility);
                }
                if (this.options.bindToChangeOfSearch) {
                    this.listenTo(this.model.report.entry.content, 'change:search', this.intentionsFetch); //simplexml
                }
                this.listenTo(this.children.vizPicker, 'itemsChange', this._updateVizTypeVisibility);
                this.listenTo(this.model.report.entry.content, 'change', _.debounce(function() {
                    this._updateVizFormatSchema();
                    this._updateVizTypeVisibility();
                    if (this.options.showTrellis) {
                        this._updateVizTrellis();
                    }
                }.bind(this), 0));
            },

            activate: function(options) {
                if (this.active) {
                    return BaseView.prototype.activate.apply(this, arguments);
                }
                if (this.model.report.entry.content.get('search')) {
                    this.intentionsFetch();
                }
                this._updateVizFormatSchema();
                return BaseView.prototype.activate.apply(this, arguments);
            },

            deactivate: function(options) {
                if (!this.active) {
                    return BaseView.prototype.deactivate.apply(this, arguments);
                }
                BaseView.prototype.deactivate.apply(this, arguments);
                this.model.intentionsParser.fetchAbort();
                this.model.intentionsParser.clear({ setDefaults: true });
                return this;
            },

            intentionsFetch: function() {
                this.model.intentionsParser.fetch({
                    data: {
                        q: this.model.report.entry.content.get('search'),
                        app: this.model.application.get('app'),
                        owner: this.model.application.get('owner'),
                        parse_only: true
                    }
                });
            },

            render: function() {
                this.children.vizPicker.detach();
                this.children.vizFormat.detach();
                this.$el.empty();
                this.children.vizPicker.render().appendTo(this.el);
                this.children.vizFormat.render().appendTo(this.el);
                this._updateVizTypeVisibility();
                this._updateVizFormatSchema();
                if (this.options.showTrellis) {
                    this.children.vizTrellis.render().appendTo(this.el);
                    this._updateVizTrellis();
                }
                return this;
            },

            _updateVizTypeVisibility: function() {
                // If there is only one option in the viz type selection menu, don't show it.
                if (this.children.vizPicker.getItemCount() < 2) {
                    this.children.vizPicker.$el.hide();
                    return;
                }
                var vizConfig = VisualizationRegistry.findVisualizationForConfig(this.model.report.entry.content.toJSON());
                // On a dashboard, visualizations that are not available for user selection can appear in a panel,
                // in which case the viz picker should be hidden.
                if (this.options.dashboard && !(vizConfig && vizConfig.isSelectable)) {
                    this.children.vizPicker.$el.hide();
                    return;
                }
                this.children.vizPicker.$el.show();
                if (this.model.report.isPivotReport() && !this.model.report.isNew()){
                    this.children.vizPicker.disable();
                    this.children.vizPicker.tooltip({
                        animation: false,
                        title: _('Edit visualization with the pivot tool').t(),
                        container: 'body'
                    });
                } else {
                    this.children.vizPicker.enable();
                    this.children.vizPicker.tooltip({
                        animation: false,
                        title: _('Select visualization').t(),
                        container: 'body',
                        template: '<div id="select_viz_tpl" role="tooltip" class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
                    });
                }
            },

            _updateVizFormatSchema: function() {
                var vizConfig = VisualizationRegistry.findVisualizationForConfig(this.model.report.entry.content.toJSON());

                // Don't show the drop-down activator if there is no schema to populate it with.
                if (!vizConfig) {
                    this.children.vizFormat.$el.hide();
                    this._currentVizId = null;
                    return;
                }
                if (!vizConfig.editorSchema && !vizConfig.formatterHtml) {
                    this.children.vizFormat.$el.hide();
                    this._currentVizId = vizConfig.id;
                    return;
                }
                if (vizConfig.id === this._currentVizId) {
                    return;
                }
                this._currentVizId = vizConfig.id;
                this.children.vizFormat.setFormatterDescription(
                    vizConfig.editorSchema ? this._changeDrilldownOptionSchema(vizConfig.editorSchema) :
                        vizConfig.formatterHtml
                );
                this.children.vizFormat.$el.show();
            },

            _updateVizTrellis: function() {
                var vizConfig = VisualizationRegistry.findVisualizationForConfig(this.model.report.entry.content.toJSON());

                // Don't show the drop-down activator if there is no schema to populate it with.
                if (!vizConfig) {
                    this.children.vizTrellis.$el.hide();
                    return;
                }

                this.children.vizTrellis.$el.show();

                if (vizConfig.isSplittable === false) {
                    this.children.vizTrellis.disable();
                    return;
                }

                this.children.vizTrellis.setFormatterDescription(trellisSchema);
                this.children.vizTrellis.enable();
            },

            _changeDrilldownOptionSchema: function(editorSchema) {
                // this function only applies to dashboards.
                if (!this.options.dashboard) {
                    return editorSchema;
                }

                function shouldAddNone(name) {
                    return name === 'display.statistics.drilldown' ||
                        name === 'display.events.list.drilldown' ||
                        name === 'display.events.raw.drilldown';
                }

                // SPL-136817: add "none" to table and eventviewer as short term solution.
                return _.map(editorSchema, function(schema) {
                    // deep clone
                    var clone = $.extend(true, {}, schema);

                    _.forEach(clone.formElements, function(formElement) {
                        if (!shouldAddNone(formElement.name)) {
                            return;
                        }

                        formElement.controlOptions.items.push({
                            label: _('None').t(),
                            value: 'none'
                        });
                    });

                    return clone;
                });
            }
        });
    }
);
