define(
    [
        'module',
        'jquery',
        'underscore',
        'views/Base',
        'views/dashboard/editor/addcontent/preview/BasePreview',
        'views/dashboard/editor/addcontent/preview/content/InlineContent',
        'models/dashboard/DashboardElementReport',
        'models/search/Report',
        'models/shared/TimeRange',
        'models/Base',
        'splunkjs/mvc/tokenawaremodel',
        'controllers/dashboard/helpers/ModelHelper',
        'helpers/VisualizationRegistry',
        'controllers/dashboard/helpers/ReportModelHelper'
    ],
    function(module,
             $,
             _,
             BaseView,
             BasePreview,
             InlineContent,
             DashboardElementReport,
             ReportModel,
             TimeRangeModel,
             BaseModel,
             TokenAwareModel,
             ModelHelper,
             VisualizationRegistry,
             ReportModelHelper
    ) {

        var PanelTimeRangeModel = TimeRangeModel.extend({
            validation: _.extend({
                earliest_token: function(value, attr, computedState) {
                    if (computedState.useTimeFrom === 'tokens' && !value) {
                        return 'No value specified for earliest token.';
                    }
                },
                latest_token: function(value, attr, computedState) {
                    if (computedState.useTimeFrom === 'tokens' && !value) {
                        return 'No value specified for latest token.';
                    }
                }
            })
        });

        var ValidateModel = TokenAwareModel.extend({
            validation: {
                'search': function(value, attr, computedState) {
                    if (!this.get(attr, {tokens: true})) {
                        return _("Search string is required").t();
                    }
                }
            }
        });

        return BasePreview.extend({
            moduleId: module.id,
            className: 'panel_content_preview content-preview',
            initialize: function(options) {
                BasePreview.prototype.initialize.apply(this, arguments);
                this.model = _.extend({}, this.model);
                this.model.content = this._buildContentModel();
                this.model.timeRange = new PanelTimeRangeModel({
                    'earliest': this.model.userPrefGeneralDefault.entry.content.get('default_earliest_time'),
                    'latest': this.model.userPrefGeneralDefault.entry.content.get('default_latest_time')
                });
                this.model.timeRange.initialDfd = this.model.timeRange.save();
            },
            _buildContentModel: function() {
                // report model is the only object passed to controller.
                var settings = VisualizationRegistry.getReportSettingsForId(this.model.inline.get('value'));
                var content = new ValidateModel(settings, {
                    applyTokensByDefault: true,
                    retrieveTokensByDefault: true
                });
                return content;
            },
            _getPayload: function() {
                var report = new ReportModel();
                report.entry.content.set(this.model.content.toJSON(), {tokens: true});
                var type = DashboardElementReport.getVizType(report);

                // Note 0 is valid earliest time
                var reportContentEarliest = report.entry.content.get('earliest_time', {tokens: true});
                var earliest = reportContentEarliest != null ? reportContentEarliest : this.model.timeRange.get('earliest');

                // Note empty string is valid latest time
                var reportContentLatest = report.entry.content.get('latest_time', {tokens: true});
                var latest = reportContentLatest != null ? reportContentLatest : this.model.timeRange.get('latest');

                return {
                    type: 'new:element-inline',
                    payload: {
                        "type": "panel",
                        "settings": {},
                        "children": [
                            {
                                "type": type,
                                "settings": {},
                                "children": [
                                    {
                                        "type": "inline-search",
                                        "settings": {
                                            "query": report.entry.content.get('search', {tokens: true}),
                                            "earliest": earliest,
                                            "latest": latest
                                        },
                                        "children": []
                                    }
                                ],
                                "reportContent": _.extend(
                                    report.entry.content.toJSON({tokens: true}),
                                    ReportModelHelper.getDisabledDrilldownAttribute(_.defaults(
                                        report.entry.content.toJSON({tokens: true}),
                                        // SPL-133621: if this is an event panel, 'report.entry.content' does not
                                        // contain sub-type, so it is required to get sub-type from 'this.model.reportDefaults'.
                                        this.model.reportDefaults.entry.content.toJSON()
                                    ))
                                )
                            }
                        ]
                    }
                };
            },
            _isValid: function() {
                // trigger backbone validation
                return _.isUndefined(this.model.content.validate()) && _.isUndefined(this.model.timeRange.validate());
            },
            _getTitle: function() {
                return _('New ').t() + this.model.inline.get('label');
            },
            _getPreview: function() {
                return new InlineContent({
                    model: this.model,
                    collection: {
                        timeRanges: ModelHelper.getCachedModel('times', {
                            app: this.model.application.get('app'),
                            owner: this.model.application.get('owner'),
                            count: -1
                        }),
                        searchBNFs: ModelHelper.getCachedModel('parsedSearchBNFs', {
                            app: this.model.application.get('app'),
                            owner: this.model.application.get('owner'),
                            count: 0
                        })
                    }
                });
            }
        });
    });