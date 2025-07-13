define(
    [
        'underscore',
        'jquery',
        'module',
        'collections/Base',
        'models/services/search/jobs/ResultJsonRows',
        'models/search/Job',
        'models/Base',
        'views/Base',
        'views/shared/vizcontrols/Master',
        'views/shared/ReportVisualizer',
        'views/shared/results_table/LazyResultsTable',
        'views/shared/results_table/renderers/AbbreviatedGeoJsonCellRenderer',
        'views/search/results/shared/NoStatistics',
        'views/search/results/shared/JobDispatchStateMessage',
        'util/drilldown',
        'helpers/Printer',
        'helpers/search/DataSource',
        'uri/route'
    ],
    function(
        _,
        $,
        module,
        BaseCollection,
        ResultJsonRows,
        Job,
        BaseModel,
        Base,
        VizEditor,
        ReportVisualizer,
        LazyResultsTable,
        AbbreviatedGeoJsonCellRenderer,
        NoStatistics,
        JobDispatchState,
        drilldownUtil,
        Printer,
        DataSource,
        route
    ) {

        var MAX_TABLE_ROWS = 50;

        return Base.extend({
            moduleId: module.id,
            className: 'tab-pane',
            initialize: function() {
                Base.prototype.initialize.apply(this, arguments);

                this.children.noStatistics = new NoStatistics({
                    model: {
                        report: this.model.report,
                        appLocal: this.model.appLocal,
                        application: this.model.application,
                        user: this.model.user,
                        summary: this.model.summary
                    }
                });

                this.children.jobDispatchState = new JobDispatchState({
                    model: {
                        searchJob: this.model.searchJob,
                        application: this.model.application
                    },
                    mode: this.model.searchJob.entry.content.get('isPreviewEnabled') ? 'results_preview' : 'results'
                });

                this.children.vizEditor = new VizEditor({
                    model: {
                        report: this.model.report,
                        application: this.model.application,
                        user: this.model.user
                    },
                    vizTypes: ['visualizations'],
                    bindToChangeOfSearch: false,
                    showTrellis: true
                });

                this.children.reportVisualizer = new ReportVisualizer({
                    model: {
                        config: this.model.report.entry.content,
                        application: this.model.application
                    },
                    allowResize: true,
                    generalTypeOverride: ReportVisualizer.GENERAL_TYPES.VISUALIZATIONS
                });
                //TODO: remove when all the views don't activate on init
                this.children.reportVisualizer.deactivate({ deep: true });

                this.tableDataSource = new DataSource('primary');

                // For performance reasons, don't render full GeoJSON strings in this results table (SPL-99314).
                var customCellRenderersCollection = new BaseCollection(
                    [{ renderer: new AbbreviatedGeoJsonCellRenderer() }]
                );
                this.children.resultsTable = new LazyResultsTable({
                    model: {
                        config: new BaseModel()
                    },
                    collection: {
                        customCellRenderers: customCellRenderersCollection
                    },
                    dataSources: [this.tableDataSource],
                    disable: true,
                    sortableFields: false
                });

                //TODO: remove when all the views don't activate on init
                this.children.resultsTable.deactivate({deep: true});

                this.$vizControls = $('<div class="visualization-controls"></div>');
                this.$noStatsContainer = $('<div class="viz-nostats-container"></div>');
            },
            startListening: function() {
                this.listenTo(this.model.searchJob.entry.content, 'change:dispatchState change:resultCount change:resultPreviewCount', _.debounce(function() {
                    if (this.active) {
                        this.visibility();
                    }
                }, 0));
                this.listenTo(this.model.report.entry.content, 'change:display.visualizations.type', function() {
                    if (this.active) {
                        this.visibility();
                    }
                });
                this.listenTo(this.children.reportVisualizer, 'drilldown', this.handleDrilldown);
                this.listenTo(this.children.reportVisualizer, 'dataSourcesChange', function() {
                    this.unbindDataSources();
                    this.bindDataSources();
                });
                this.bindDataSources();
            },
            activate: function(options) {
                var clonedOptions = _.extend({}, (options || {}));
                delete clonedOptions.deep;
                this.ensureDeactivated({deep: true});

                Base.prototype.activate.call(this, clonedOptions);
                this.visibility();
                return this;
            },
            deactivate: function(options) {
                if (!this.active) {
                    return Base.prototype.deactivate.apply(this, arguments);
                }
                this.unbindDataSources();

                Base.prototype.deactivate.apply(this, arguments);
                return this;
            },
            visibility: function() {
                var resultCount = this.model.searchJob.entry.content.get('isPreviewEnabled') ? this.model.searchJob.entry.content.get('resultPreviewCount') : this.model.searchJob.entry.content.get('resultCount');

                if (!this.model.searchJob.isReportSearch()) {
                    this.$vizControls.hide();
                    this.children.vizEditor.deactivate({deep: true});
                    this.children.jobDispatchState.deactivate({deep: true}).$el.hide();
                    this.children.noStatistics.activate({deep: true}).$el.show();
                    this.children.reportVisualizer.deactivate({deep: true}).$el.hide();
                    this.children.resultsTable.deactivate({deep: true}).$el.hide();
                    return;
                }
                this.$vizControls.show();
                this.children.vizEditor.activate({deep: true});
                if (resultCount === 0) {
                    this.children.noStatistics.deactivate({deep: true}).$el.hide();
                    this.children.jobDispatchState.activate({deep: true}).$el.show();
                    this.children.reportVisualizer.deactivate({deep: true}).$el.hide();
                    this.unbindDataSources();
                    this.children.resultsTable.deactivate({deep: true}).$el.hide();
                } else {
                    this.children.jobDispatchState.deactivate({deep: true}).$el.hide();
                    this.children.noStatistics.deactivate({deep: true}).$el.hide();
                    this.children.reportVisualizer.load().activate({deep: true}).$el.show();
                    this.bindDataSources();
                    // show before activate/render to make sure sparklines work
                    this.children.resultsTable.$el.show();
                    // safe to pass the skipUpdate flag here because new data will be fetched (if needed)
                    // by the call to bindDataSources above
                    this.children.resultsTable.load().activate({deep: true, skipUpdate: true});
                }
            },
            handleDrilldown: function(clickInfo, options) {
                var reportContent = this.model.report.entry.content,
                    applicationModel = this.model.application,
                    fieldMetadata = this.model.searchJob.entry.content.get('fieldMetadataResults'),
                    query = {
                        search: reportContent.get('search'),
                        earliest: reportContent.get('dispatch.earliest_time'),
                        latest: reportContent.get('dispatch.latest_time')
                    };

                var drilldownPromise = drilldownUtil.applyDrilldownIntention(
                            clickInfo, query, fieldMetadata, applicationModel, options);
                if (drilldownUtil.shouldDrilldownInNewTab(clickInfo, options)) {
                    route.redirectTo(
                        drilldownPromise.then(function(drilldownInfo) {
                            return route.search(
                                applicationModel.get('root'),
                                applicationModel.get('locale'),
                                applicationModel.get('app'),
                                { data: drilldownInfo }
                            );
                        }),
                        true
                    );
                } else {
                    drilldownPromise.done(_(function(drilldownInfo) {
                        var attrs = {
                            search: drilldownInfo.q,
                            'dispatch.earliest_time': drilldownInfo.earliest,
                            'dispatch.latest_time': drilldownInfo.latest
                        };
                        // in the case where there is no events search (i.e. | inputcsv), make sure we drill down to the statistics table
                        if (!this.model.searchJob.entry.content.get('eventSearch')) {
                            attrs['display.page.search.tab'] = 'statistics';
                        }
                        reportContent.set(attrs);
                    }).bind(this));
                }
            },
            bindDataSources: function() {
                if (this.dataSourcesBound) {
                    return;
                }
                this.dataSourcesBound = true;
                this.primaryDataSource = this.children.reportVisualizer.getPrimaryDataSource();
                if (!this.primaryDataSource) {
                    return;
                }
                // connect to search job
                this.primaryDataSource.connectToSearchJob(this.model.searchJob);
                // setup listener on primaryDataSource
                this.listenTo(this.primaryDataSource, 'searchResultsChange', function(ds) {
                    this.syncActiveVizData(ds.searchResults);
                });
                this.syncActiveVizData(this.primaryDataSource.searchResults);
            },
            unbindDataSources: function() {
                this.dataSourcesBound = false;
                if (this.primaryDataSource) {
                    this.primaryDataSource.disconnect();
                    this.stopListening(this.primaryDataSource);
                    this.primaryDataSource = null;
                }
            },
            // This method makes sure that the results table always shows the same data as the visualization
            // above it (with an upper limit on the number of rows).
            syncActiveVizData: function(vizData) {
                var rows = [];
                if (vizData.has('rows')) {
                    rows = vizData.get('rows');
                } else if (vizData.has('columns')) {
                    // Transpose the column-major data into row-major for the table.
                    rows = _.zip.apply(_, vizData.get('columns'));
                } else {
                    // Map the raw results into row-major format for the table.
                    rows = _.map(vizData.get('results'), _.values);
                }
                this.tableDataSource.setSearchResults({
                    fields: $.extend(true, [], vizData.get('fields')),
                    rows: $.extend(true, [], rows.slice(0, MAX_TABLE_ROWS))
                });
            },
            render: function() {
                this.$noStatsContainer.prependTo(this.el);
                this.children.noStatistics.render().appendTo(this.$noStatsContainer);

                this.$vizControls.insertAfter(this.$noStatsContainer);
                this.children.vizEditor.render().appendTo(this.$vizControls);
                this.children.jobDispatchState.render().appendTo(this.el);
                this.children.reportVisualizer.render().appendTo(this.el);
                this.children.resultsTable.render().appendTo(this.el);
                return this;
            }
        });
    }
);
