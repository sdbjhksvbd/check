/**
 * @author claral
 * @date 3/30/16
 * Page controller for Sourcetype manager page.
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'module',
        'controllers/BaseManagerPageControllerFiltered',
        'collections/search/Reports',
        'collections/services/authentication/Users',
        'collections/services/authorization/Roles',
        'collections/services/configs/SearchBNFs',
        'collections/services/data/IndexesDistributed',
        'collections/shared/ModAlertActions',
        'models/classicurl',
        'models/savedsearches/SavedSearchesFetchData',
        'models/search/Report',
        'models/search/Alert',
        'models/search/Job',
        'models/services/AppLocal',
        './Filters',
        './GridRow',
        './NewButtons',
        'views/shared/alertcontrols/dialogs/edit/Master',
        'views/shared/alertcontrols/dialogs/saveas/Master',
        'views/shared/documentcontrols/dialogs/EditSearchDialog',
        'views/shared/reportcontrols/dialogs/createreport/Master',
        'views/savedsearches/PageController.pcss',
        'views/shared/pcss/basemanager.pcss',
        'splunk.util'
    ],
    function(
        $,
        _,
        Backbone,
        module,
        BaseController,
        ReportsCollection,
        UsersCollection,
        RolesCollection,
        SearchBNFsCollection,
        IndexesDistributedCollection,
        ModAlertActionsCollection,
        classicurl,
        EAIFilterFetchData,
        ReportModel,
        AlertModel,
        SearchJob,
        AppLocalModel,
        Filters,
        GridRow,
        NewButtons,
        AlertEditDialog,
        NewAlertDialog,
        ReportEditSearchDialog,
        NewReportDialog,
        css,
        cssShared,
        splunkUtils
    ) {

        return BaseController.extend({
            moduleId: module.id,

            canShowModal: true,

            initialize: function(options) {
                this.collection = this.collection || {};
                this.model = this.model || {};
                this.deferreds = this.deferreds || {};

                //MODELS
                this.model.controller = new Backbone.Model();

                this.model.metadata = new EAIFilterFetchData(this.getFetchData());
                this.saveToUrl(this.model.metadata); // Save potentially updated app value.

                // default report/alert, to be cloned when new report/alert button is clicked.
                this.deferreds.defaultReport = this.fetchDefaultReport();

                //COLLECTIONS
                this.deferreds.users = this.fetchUsersCollection();
                this.deferreds.alertActions = this.fetchAlertActionsCollection();
                this.deferreds.searchBNFs = this.fetchSearchBNFsCollection();
                this.deferreds.indexes = this.fetchIndexesCollection();

                this.collection.rolesCollection = new RolesCollection();
                this.deferreds.roles = this.collection.rolesCollection.fetch();

                // Fetching will happen when a user enters a search in the owner filter.
                this.collection.usersSearch = new UsersCollection();

                options.enableNavigationFromUrl = true;
                options.fragments = ['saved', 'searches'];
                options.entitiesPlural = _('Searches, Reports, and Alerts').t();
                options.entitySingular = _('Saved Search').t();
                options.header = {
                    pageTitle: _('Searches, Reports, and Alerts').t(),
                    pageDesc: _('Searches, reports, and alerts are saved searches created from pivot or the search page.').t(),
                    learnMoreLink: 'learnmore.saved.searches'
                };

                options.model = this.model;
                options.collection = this.collection;
                options.entitiesCollectionClass = ReportsCollection;
                options.entityModelClass = ReportModel;
                options.customViews = {
                    Filters: Filters,
                    GridRow: GridRow,
                    NewButtons: NewButtons
                };
                options.grid = {
                    showSharingColumn: false,
                    showStatusColumn: false,
                    showAllApps: true
                };

                this.listenTo(this.model.metadata, 'change', this.saveToUrl);
                this.listenTo(this.model.metadata, 'change', this.updateNamespace);
                this.listenTo(this.model.controller, "newReport", this.onNewReport);
                this.listenTo(this.model.controller, "newAlert", this.onNewAlert);

                BaseController.prototype.initialize.call(this, options);
            },

            canShowModalTrue: function () {
                this.canShowModal = true;
            },

            saveToUrl: function (model, options) {
                var params = {};
                params.app = model.get('appSearch');
                params.count = model.get('count');
                params.offset = model.get('offset');
                params.sortKey = model.get('sortKey');
                params.sortDirection = model.get('sortDirection');
                params.itemType = model.get('itemType');

                params.owner = model.get('ownerSearch');
                params.search = model.get('nameFilter');

                this.model.classicurl.save(params, {replaceState: true});
            },
            updateNamespace: function(model) {
                // SPL-186721: Set the metadata model's app and owner context to make a namespaced request
                model.set({
                    app: model.get('appSearch') || '-',
                    owner: model.get('ownerSearch') || '-'
                }, {silent: true});
            },

            /**
             * Override of method from superclass.
             * Default to using app and owner in url, else we use the current app and user context
             * to fetch data from the endpoint:
             * @returns the fetch data option object.
             */
            getFetchData: function () {
                var app = this.model.classicurl.get('app') || this.model.application.get('app');
                var owner = this.model.classicurl.get('owner') || this.model.user.entry.get('name');
                var defaults = {
                    sort_mode: 'natural',
                    sortKey: undefined,
                    sortDirection: undefined,
                    app: app,
                    appSearch: app,
                    owner: owner,
                    ownerSearch: owner,
                    itemType: '',
                    count: 10,
                    offset: 0,
                    listDefaultActionArgs: true,
                    show_all_embedded_tokens: '1'
                };

                var appSearchModel = this.collection.appLocalsUnfilteredAll.getValidatedApp(
                    this.model.classicurl.get('app'),
                    this.model.application.get('app')
                );
                var appSearch = appSearchModel && appSearchModel.entry.get('name');

                var classicurlData = {
                    sortKey: this.model.classicurl.get('sortKey'),
                    sortDirection: this.model.classicurl.get('sortDirection'),
                    count: this.model.classicurl.get('count'),
                    offset: this.model.classicurl.get('offset'),
                    appSearch: appSearch === '-' ? undefined : appSearch,
                    ownerSearch: owner === '-' ? undefined : owner,
                    nameFilter: this.model.classicurl.get('search'),
                    itemType: this.model.classicurl.get('itemType')
                };
                if (this.options.namespaceFilterCandidate) {
                    classicurlData['appSearch'] = this.options.namespaceFilterCandidate;
                }
                return $.extend(true, {}, defaults, classicurlData);
            },

            fetchDefaultReport: function() {
                this.defaultReport = new ReportModel();
                return this.defaultReport.fetch({
                    data: {
â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚app: this.model.application.get("app"),
â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚owner: this.model.application.get("owner")
â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚â€‚}
                });
            },

            fetchUsersCollection: function() {
                this.collection.users = new UsersCollection();
                return this.collection.users.fetch();
            },

            fetchAlertActionsCollection: function() {
                this.collection.alertActions = new ModAlertActionsCollection();

                return this.collection.alertActions.fetch({
                    data: {
                        app: this.model.application.get("app"),
                        owner: this.model.application.get("owner"),
                        search: 'disabled!=1'
                    },
                    addListInTriggeredAlerts: true
                });
            },

            fetchSearchBNFsCollection: function() {
                this.collection.searchBNFs = new SearchBNFsCollection();

                return this.collection.searchBNFs.fetch({
                    data: {
                        app: this.model.application.get("app"),
                        owner: this.model.application.get("owner"),
                        count: 0
                    },
                    parseSyntax: true
                });
            },

            fetchIndexesCollection: function() {
            	this.collection.indexes = new IndexesDistributedCollection();
				return this.collection.indexes.fetch();
			},

            onNewReport: function(entityModel) {
                if (this.canShowModal) {
                    this.model.report = new ReportModel({}, {splunkDPayload: this.defaultReport.toSplunkD()});
                    this.model.searchJob = new SearchJob();
                    this.children.saveAsDialog = new NewReportDialog({
                        model:  {
                            report: this.model.report,
                            application: this.model.application,
                            searchJob: this.model.searchJob,
                            user: this.model.user,
                            serverInfo: this.model.serverInfo
                        },
                        collection: {
                            searchBNFs: this.collection.searchBNFs,
                            appLocals: this.collection.appLocalsUnfilteredAll
                        },
                        chooseVisualizationType: false,
                        showSearchField: true,
                        showSuccessModal: false,
                        setDispatchUIArgs: false,
                        onHiddenRemove: true
                    });
                    this.children.saveAsDialog.render().appendTo($('body')).show();
                    this.listenTo(this.children.saveAsDialog, 'reportSaved', this.fetchEntitiesCollection);
                    this.listenTo(this.children.saveAsDialog, 'hidden', this.canShowModalTrue);
                    this.canShowModal = false;
                }
            },

            onNewAlert: function(entityModel) {
                if (this.canShowModal) {
                    this.model.alert = new AlertModel({}, {splunkDPayload: this.defaultReport.toSplunkD()});

                    this.children.alertDialog = new NewAlertDialog({
                        model:  {
                            report: this.model.alert,
                            reportPristine: this.model.alert,  // Is correct value for reportPristine?
                            application: this.model.application,
                            user: this.model.user,
                            serverInfo: this.model.serverInfo
                        },
                        collection: {
                            times: null,
                            searchBNFs: this.collection.searchBNFs,
                            appLocals: this.collection.appLocalsUnfilteredAll
                        },
                        showSearchField: true,
                        showSuccessModal: false,
                        setDispatchUIArgs: false,
                        onHiddenRemove: true
                    });
                    this.children.alertDialog.render().appendTo($('body')).show();
                    this.listenTo(this.children.alertDialog, 'alertSaved', this.fetchEntitiesCollection);
                    this.listenTo(this.children.alertDialog, 'hidden', this.canShowModalTrue);
                    this.canShowModal = false;
                }
            },

            entityDeleteConfirmation: function(entityToDelete) {
                return splunkUtils.sprintf(
                    _("Deleting a saved search will result in users no longer being able to use that search. Dashboards that used that search will no longer work.<br><br>Are you sure you want to delete saved search %s?").t(), '<em>' + _.escape(entityToDelete.entry.get('name')) + '</em>');
            },

            /**
             * Override default which is _new
             */
            navigateToNew: function(){
                this.navigate('_new', { data: {action: 'edit'}});
            },

            /**
             * Override of default onCreateEntity
             */
            onCreateEntity: function() {
                $.when(this.deferreds.entities).then(_(function() {
                    // Determine if the user is trying to create a new report or a new alert.
                    // Default to new report.
                    var searchType = this.model.classicurl.get('searchType');
                    if (searchType === 'alert') {
                        this.onNewAlert();
                    } else {
                        this.onNewReport();
                    }
                }).bind(this));
            },

            /**
             * Override of default shwoAddEditDialog from BaseManagerPageController.
             * Fetches selected model and renders a popup for editing selected or creating new entity.
             * Also casts the object to an alert if it is that type.
             * @param entityModel - if undefined, 'create new' mode is assumed
             * @param isClone - flag for clone action (default: false)
             */
            showAddEditDialog: function(entityModel, isClone) {
                if (this.canShowModal) {
                    if (!entityModel) {
                        this.onCreateEntity();
                    }
                    else if (entityModel.isAlert()) {
                        // Convert model to alert
                        entityModel = new AlertModel({}, {splunkDPayload: entityModel.toSplunkD()});
                        this.children.editAlertDialog = new AlertEditDialog({
                            model: {
                                alert: entityModel,
                                application: this.model.application,
                                user: this.model.user,
                                serverInfo: this.model.serverInfo,
                                controller: this.model.controller
                            },
                            collection: {
                                alertActions: this.collection.alertActions,
                                searchBNFs: this.collection.searchBNFs
                            },
                            onHiddenRemove: true,
                            showSearchField: true
                        });
                        this.children.editAlertDialog.render().appendTo($("body"));
                        this.children.editAlertDialog.show();
                        this.listenTo(this.children.editAlertDialog, 'hidden', this.canShowModalTrue);
                        this.canShowModal = false;
                    } else {
                        this.children.reportEditSearchDialog = new ReportEditSearchDialog({
                            model: {
                                report: entityModel,
                                application: this.model.application,
                                user: this.model.user
                            },
                            collection: {
                                searchBNFs: this.collection.searchBNFs
                            },
                            onHiddenRemove: true,
                            showSearchField: true
                        });
                        this.children.reportEditSearchDialog.render().appendTo($("body"));
                        this.children.reportEditSearchDialog.show();
                        this.listenTo(this.children.reportEditSearchDialog, 'hidden', this.canShowModalTrue);
                        this.canShowModal = false;
                    }
                }
            }
        });
    });
