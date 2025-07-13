define(
    [
        'underscore',
        'jquery',
        'module',
        'collections/datasets/Datasets',
        'models/datasets/Table',
        'models/datasets/TableAST',
        'models/search/Job',
        'models/services/search/jobs/ResultJsonRows',
        'models/datasets/commands/InitialData',
        'models/shared/TimeRange',
        'views/Base',
        'views/table/initialdata/MethodPicker',
        'views/shared/searchbar/Master',
        'views/table/initialdata/Sidebar',
        'views/table/initialdata/jobstatus/Master',
        'views/shared/datasettable/Master',
        'views/shared/JobDispatchState',
        'views/table/initialdata/SearchFlashMessages',
        'views/shared/waitspinner/Master',
        'uri/route',
        'util/keyboard',
        'util/general_utils',
        './Master.pcss'
    ],
    function (
        _,
        $,
        module,
        DatasetsCollection,
        TableModel,
        TableASTModel,
        JobModel,
        ResultJsonRowsModel,
        InitialDataCommand,
        TimeRangeModel,
        BaseView,
        MethodPickerView,
        SearchbarView,
        SidebarView,
        JobStatusView,
        TableView,
        JobDispatchStateView,
        FlashMessages,
        WaitSpinnerView,
        route,
        keyboard_utils,
        generalUtils,
        css
    ) {
        return BaseView.extend({
            moduleId: module.id,
            className: 'initial-data',

            initialize: function () {
                BaseView.prototype.initialize.apply(this, arguments);
                this.model.searchJob = new JobModel({}, {
                    delay: JobModel.DEFAULT_POLLING_INTERVAL,
                    processKeepAlive: true,
                    keepAliveInterval: JobModel.DEFAULT_KEEP_ALIVE_INTERVAL
                });
                this.model.resultJsonRows = new ResultJsonRowsModel();
                this.model.timeRange = new TimeRangeModel({
                    earliest: '',
                    latest: 'now'
                });

                this.model.initialDataTable = new TableModel();
                this.model.initialDataTable.setFromSplunkD(this.model.table.toSplunkD());
                this.model.commandClone = this.model.initialDataTable.commands.first();

                this.model.basesearchTableAST = new TableASTModel();

                if (!this.deferreds) {
                    this.deferreds = {};
                }
                this.deferreds.timeRange = $.Deferred();

                this.children.methodPicker = new MethodPickerView({
                    model: {
                        command: this.model.commandClone,
                        state: this.model.state
                    }
                });

                this.createSidebar();

                this.children.table = new TableView({
                    model: {
                        ast: this.model.tableAST,
                        config: this.model.config,
                        dataset: this.model.initialDataTable,
                        resultJsonRows: this.model.resultJsonRows,
                        state: this.model.state
                    },
                    editingMode: false,
                    autoTypeColumns: true,
                    respectCommandIndex: true
                });

                this.children.jobStatus = new JobStatusView({
                    model: {
                        application: this.model.application,
                        basesearchTableAST: this.model.basesearchTableAST,
                        resultJsonRows: this.model.resultJsonRows,
                        state: this.model.state,
                        searchJob: this.model.searchJob,
                        table: this.model.initialDataTable,
                        user: this.model.user
                    }
                });

                this.children.searchbar = new SearchbarView({
                    model: {
                        application: this.model.application,
                        state: this.model.state,
                        user: this.model.user
                    },
                    collection: {
                        searchBNFs: this.collection.searchBNFs
                    },
                    showTimeRangePicker: false,
                    maxSearchBarLines: 5
                });

                this.children.searchFlashMessage = new FlashMessages({
                    model: {
                        command: this.model.commandClone
                    }
                });

                this.children.waitSpinner = new WaitSpinnerView({
                    color: 'green',
                    size: 'medium',
                    frameWidth: 19
                });
            },

            createSidebar: function () {
                this.children.sidebar = new SidebarView({
                    model: {
                        application: this.model.application,
                        appLocal: this.model.appLocal,
                        basesearchTableAST: this.model.basesearchTableAST,
                        command: this.model.commandClone,
                        resultJsonRows: this.model.resultJsonRows,
                        searchJob: this.model.searchJob,
                        serverInfo: this.model.serverInfo,
                        state: this.model.state,
                        table: this.model.initialDataTable,
                        tablePristine: this.model.table,
                        timeRange: this.model.timeRange,
                        user: this.model.user
                    },
                    collection: {
                        customAddedFieldPickerItems: this.collection.customAddedFieldPickerItems
                    },
                    deferreds: {
                        timeRange: this.deferreds.timeRange
                    }
                });
            },

            events: {
                'click .initial-data-cancel': function (e) {
                    if (this.model.table.commands.first().isComplete()) {
                        e.preventDefault();
                        this.model.commandClone.setFromCommandJSON(this.model.table.commands.first().toJSON());
                        this.model.state.set('initialDataState', InitialDataCommand.STATES.CANCELED);
                    } else {
                        this.setHref(this.getHref(this.options.isFromSearch));
                    }
                }
            },

            getHref: function (isFromSearch) {
                if (isFromSearch) {
                    var searchHref = route.search(
                        this.model.application.get('root'),
                        this.model.application.get('locale'),
                        this.model.application.get('app'),
                        {
                            data: {
                                q: this.model.basesearchTableAST.get('spl'),
                                earliest: this.model.timeRange.get('earliest'),
                                latest: this.model.timeRange.get('latest')
                            }
                        }
                    );
                    return searchHref;
                }
                var datasetsHref = route.datasets(
                    this.model.application.get('root'),
                    this.model.application.get('locale'),
                    this.model.application.get('app')
                );
                return datasetsHref;
            },
            setHref: function (href) {
                this.$('.initial-data-cancel').attr('href', href);
            },
            activate: function (options) {
                var clonedOptions = _.extend({}, (options || {}));
                delete clonedOptions.deep;

                if (this.active) {
                    return BaseView.prototype.activate.call(this, clonedOptions);
                }

                this.children.waitSpinner.stop();
                this.children.waitSpinner.$el.hide();

                if (!this.children.sidebar) {
                    this.createSidebar();
                    this.children.sidebar.render().prependTo(this.$('.initial-data-horizontal-flex-container'));
                }
                this.updateBaseSPL();
                this.manageStateOfChildren();

                return BaseView.prototype.activate.call(this, clonedOptions);
            },

            deactivate: function (options) {
                if (!this.active) {
                    return BaseView.prototype.deactivate.apply(this, arguments);
                }
                BaseView.prototype.deactivate.apply(this, arguments);

                this.children.sidebar && this.children.sidebar.remove();
                delete this.children.sidebar;

                this.children.table.$el.hide();
                this.children.jobStatus.$el.hide();
                this.children.searchbar.$el.hide();
                this.children.searchFlashMessage.$el.hide();

                this.children.waitSpinner.$el.show();
                !this.children.waitSpinner.active && this.children.waitSpinner.start();

                return this;
            },

            startListening: function (options) {
                this.listenTo(this.model.state, 'change:search', function (model, value, options) {
                    this.setBaseSPLFromSearchBar(value);
                });
                this.listenTo(this.model.commandClone, 'change:baseSPL', this.manageStateOfChildren);
                this.listenTo(this.model.commandClone, 'showEmptyField', this.showEmptyField);
                this.listenTo(this.model.commandClone, 'hideEmptyField', this.hideEmptyField);
                this.listenTo(this.model.initialDataTable, 'doneButtonClicked', this.handleDoneButtonClicked);
                this.listenTo(this.model.state, 'updateBaseSPL', this.updateBaseSPL);
                this.listenTo(this.model.resultJsonRows, 'change', function () {
                    // The table is also listening to resultJsonRows change events to render itself. But if the table
                    // is deactivated during that time, then just activating it won't do anything.
                    // Force a render in that case, to make up for that lost listener.
                    this.manageStateOfChildren({ forceTableRender: true });
                });
                this.listenTo(this.model.state, 'change:loading', this.handleLoadingChange);
            },

            updateBaseSPL: function () {
                var baseSPL = this.model.commandClone.generateBaseSearchSPL({ skipValidation: true });
                this.model.commandClone.set('baseSPL', baseSPL);
                this.setSearchSPL();
            },

            handleLoadingChange: function () {
                if (this.model.state.get('loading')) {
                    this.children.table.deactivate({ deep: true });
                } else {
                    this.children.table.activate({ deep: true });
                }
            },

            setSearchSPL: function (e) {
                this.children.searchbar.setText(this.model.commandClone.get('baseSPL'));
            },

            setBaseSPLFromSearchBar: function (search) {
                this.model.commandClone.set('baseSPL', search);
            },

            cleanSplunkDDataset: function (savedDataset) {
                var entry = savedDataset.entry[0];

                // Remove old names
                delete entry.name;
                // Remove old ID
                delete entry.id;
                // Remove alternate link
                delete entry.links.alternate;
            },

            handleDoneButtonClicked: function () {
                var updateDeferred,
                    inmemCommandJSON,
                    realTableFirstCommandJSON,
                    clonedDataset;

                this.model.commandClone.clearUnchosenAttributes();

                if ((this.model.commandClone.get('selectedMethod') === InitialDataCommand.METHODS.DATASET) &&
                    (this.model.state.get('datasetOperationType') === 'clone')) {
                    clonedDataset = this.model.commandClone.selectedDataset.toSplunkD();
                    this.cleanSplunkDDataset(clonedDataset);
                    this.model.table.setFromSplunkD(clonedDataset);
                } else {
                    updateDeferred = this.model.commandClone.updateSPL({
                        applicationModel: this.model.application
                    });

                    $.when(updateDeferred).always(function () {
                        inmemCommandJSON = generalUtils.stripUndefinedAttrs(this.model.commandClone.toJSON());
                        realTableFirstCommandJSON = generalUtils.stripUndefinedAttrs(this.model.table.commands.first().toJSON());

                        // If they're equal, then the user didn't make any changes, and thus no page route will fire during
                        // setFromCommandJSON. So we'll manually set the state model's attribute.
                        if (_.isEqual(inmemCommandJSON, realTableFirstCommandJSON)) {
                            this.model.state.unset('initialDataState');
                            // If they're not equal, the page route will fire, and the state model will be cleared for us.
                        } else {
                            // Using defaults of undefined for relevant keys here so they get included in the
                            // setFromCommandJSON. Otherwise, these keys could linger around after switching methods. This
                            // is preferable to calling clearUnchosenAttributes on the pristine, since that causes 2 sets.
                            this.model.table.commands.first().setFromCommandJSON(_.defaults(inmemCommandJSON, {
                                selectedDatasetName: undefined,
                                selectedDatasetType: undefined,
                                editorValues: [],
                                baseSPL: undefined
                            }), {
                                skipClone: true
                            });
                        }
                    }.bind(this));
                }
            },

            manageStateOfChildren: function (options) {
                options = options || {};

                if (this.children.jobDispatchState) {
                    this.children.jobDispatchState.deactivate({ deep: true }).remove();
                    delete this.children.jobDispatchState;
                }
                var method = this.model.commandClone.get('selectedMethod');

                if (method === InitialDataCommand.METHODS.SEARCH) {
                    // Method is search, so we always get a search bar and the flash messages view for it
                    this.children.searchbar.activate({ deep: true }).$el.css('display', 'flex');
                    this.children.searchbar.searchFieldFocus();
                    this.children.searchFlashMessage.activate({ deep: true });

                    if (this.model.commandClone.get('baseSPL')) {
                        // We only activate the sidebar if we have a baseSPL, otherwise it's hidden
                        this.children.sidebar.activate({ deep: true }).$el.css('display', 'flex');
                    } else {
                        this.children.sidebar.deactivate({ deep: true }).$el.hide();
                    }
                } else {
                    this.model.commandClone.set('selectedMethod', InitialDataCommand.METHODS.INDEXES_AND_SOURCETYPES);
                    method = this.model.commandClone.get('selectedMethod');
                    // Otherwise, you're either on indexes+sourcetypes or datasets. The sidebar is always active,
                    // and the searchbar related items are always deactivated.
                    this.children.sidebar.activate({ deep: true }).$el.css('display', 'flex');
                    this.children.searchbar.deactivate({ deep: true }).$el.hide();
                    this.children.searchFlashMessage.deactivate({ deep: true }).$el.hide();
                }

                // If the searchJob is new, that means that we either haven't handledSearchChange yet or we called
                // handleSearchChange and then didn't have a search to run.
                if (this.model.searchJob.isNew()) {
                    // Therefore, the job status and table shouldn't be here.
                    this.children.jobStatus.deactivate({ deep: true }).$el.hide();
                    this.children.table.deactivate({ deep: true }).$el.hide();

                    // We also want to show empty data messaging in place of the table to direct the user properly.
                    // We also want to show empty data messaging in place of the table to direct the user properly.
                    switch (method) {
                        case InitialDataCommand.METHODS.DATASET:
                            this.$('.empty-datasets').show();
                            this.$('.empty-indexes-and-sourcetypes').hide();
                            this.$('.empty-search').hide();
                            this.$('.empty-field > svg.dataset').show();
                            this.$('.empty-field > svg.indexes-sourcetypes').hide();
                            this.$('.empty-field > svg.search').hide();

                            if (this.model.state.get('datasetOperationType') === DatasetsCollection.OPERATION.CLONE) {
                                this.$('.dataset-selection-clone-text').show();
                                this.$('.dataset-clone-header').show();
                                this.$('.dataset-selection-extend-text').hide();
                                this.$('.dataset-extend-header').hide();
                                this.$('.dataset-method-selection-text').hide();
                                this.$('.dataset-extend-clone-header').hide();
                            } else if (this.model.state.get('datasetOperationType') === DatasetsCollection.OPERATION.EXTEND) {
                                this.$('.dataset-selection-clone-text').hide();
                                this.$('.dataset-clone-header').hide();
                                this.$('.dataset-selection-extend-text').show();
                                this.$('.dataset-extend-header').show();
                                this.$('.dataset-method-selection-text').hide();
                                this.$('.dataset-extend-clone-header').hide();
                            } else {
                                this.$('.dataset-selection-clone-text').hide();
                                this.$('.dataset-clone-header').hide();
                                this.$('.dataset-selection-extend-text').hide();
                                this.$('.dataset-extend-header').hide();
                                this.$('.dataset-method-selection-text').show();
                                this.$('.dataset-extend-clone-header').show();
                            }

                            break;
                        case InitialDataCommand.METHODS.INDEXES_AND_SOURCETYPES:
                            this.$('.empty-datasets').hide();
                            this.$('.empty-indexes-and-sourcetypes').show();
                            this.$('.empty-search').hide();
                            this.$('.empty-field > svg.dataset').hide();
                            this.$('.empty-field > svg.search').hide();
                            this.$('.empty-field > svg.indexes-sourcetypes').show();

                            break;
                        case InitialDataCommand.SEARCH:
                            this.$('.empty-datasets').hide();
                            this.$('.empty-indexes-and-sourcetypes').hide();
                            this.$('.empty-search').show();
                            this.$('.empty-field > svg.dataset').hide();
                            this.$('.empty-field > svg.search').show();
                            this.$('.empty-field > svg.indexes-sourcetypes').hide();
                            break;
                        default:
                            this.$('.empty-datasets').hide();
                            this.$('.empty-indexes-and-sourcetypes').hide();
                            this.$('.empty-search').hide();
                            this.$('.empty-field > svg').hide();
                    }
                } else {
                    // Otherwise, we should activate the job status and table
                    this.children.jobStatus.activate({ deep: true }).$el.css('display', '');

                    // See the comment in startListening for more context about this
                    if (options.forceTableRender) {
                        this.children.table.deactivate({ deep: true }).remove();
                        this.children.table.activate({ deep: true }).render().appendTo(this.$('.initial-data-results-container'));
                    } else {
                        this.children.table.activate({ deep: true }).$el.css('display', '');
                    }

                    // Need to get rid of all the empty data messaging now
                    this.$('.empty-indexes-and-sourcetypes').hide();
                    this.$('.empty-datasets').hide();
                    this.$('.empty-search').hide();

                    if (!this.model.resultJsonRows.hasRows()) {
                        this.children.jobDispatchState = new JobDispatchStateView({
                            model: {
                                application: this.model.application,
                                searchJob: this.model.searchJob
                            },
                            mode: this.model.basesearchTableAST.isTransforming() ? 'results' : ''
                        });

                        if (this.$('.initial-data-results-container').length) {
                            this.children.jobDispatchState.activate({ deep: true }).render().prependTo(this.$('.initial-data-results-container'));
                        }
                    }
                }
            },

            showEmptyField: function () {
                this.$('.empty-field').css('display', '');
                this.children.table.$el.hide();
                this.children.jobDispatchState && this.children.jobDispatchState.$el.hide();
            },

            hideEmptyField: function () {
                this.$('.empty-field').hide();
                if (!this.model.searchJob.isNew()) {
                    this.children.table.$el.css('display', '');
                }
                this.children.jobDispatchState && this.children.jobDispatchState.$el.css('display', '');
            },

            render: function () {
                if (!this.$el.html()) {
                    this.$el.html(this.compiledTemplate({
                        _: _
                    }));

                    this.children.waitSpinner.render().prependTo(this.$el).$el.hide();
                    this.children.searchbar.render().insertBefore(this.$('.initial-data-horizontal-flex-container'));
                    this.children.searchFlashMessage.render().appendTo(this.$('.search-bar-wrapper'));
                    this.children.sidebar.render().prependTo(this.$('.initial-data-horizontal-flex-container'));
                    this.children.jobStatus.render().appendTo(this.$('.initial-data-results-container'));
                    this.$('.initial-data-results-container').append(_.template(this.emptyIndexesAndSourcetypesTemplate));
                    this.$('.initial-data-results-container').append(_.template(this.emptyFieldTemplate));
                    this.$('.empty-field').hide();
                    this.$('.empty-field > svg').hide();
                    this.children.table.render().appendTo(this.$('.initial-data-results-container'));
                    if (this.children.jobDispatchState) {
                        this.children.jobDispatchState.activate({ deep: true }).render().prependTo(this.$('.initial-data-results-container'));
                    }
                }

                return this;
            },

            template: '\
                <div class="initial-data-vertical-flex-container">\
                    <div class="initial-data-horizontal-flex-container">\
                        <div class="initial-data-results-container">\
                    </div>\
                </div>\
                <a tabindex="0" class="btn initial-data-cancel">\
                    <%- _("Cancel").t() %>\
                </a>\
            ',

            emptyIndexesAndSourcetypesTemplate: '\
                <div class="empty-indexes-and-sourcetypes">\
                </div>\
            ',

            emptyFieldTemplate: '\
                <div class="empty-field">\
                    <h3> \
                        <%- _("You do not have any columns in this table.").t() %>\
                    </h3>\
                    <%- _("Start by selecting a field.").t() %>\
                </div>\
            '
        });
    }
);
