define(
    [
        'jquery',
        'underscore',
        'module',
        'views/shared/Modal',
        'views/shared/FlashMessages',
        'views/shared/controls/ControlGroup',
        'views/shared/jobcontrols/menu/WorkloadInput',
        'models/search/Job',
        'uri/route',
        'util/splunkd_utils',
        'util/time',
        'splunk.util'
     ],
     function($, _, module, Modal, FlashMessages, ControlGroup, WorkloadInput, SearchJobModel, route, splunkd_utils, time_utils, splunkUtils){
        return Modal.extend({
            /**
             * @param {Object} options {
                   collection: {
                        workloadManagementStatus: <collections.services.admin.workload_management> (Optional.)
                   }
                   model: {
                        searchJob: this.model.searchJob,
                        application: this.model.application,
                        report: <models.Report> (Optional.),
                        user: this.model.user
                    },
                    page: where to link to (optional, default is this.modal.application.get('page'))
             *  }
             */
            moduleId: module.id,
            initialize: function() {
                Modal.prototype.initialize.apply(this, arguments);

                this.deferreds = this.deferreds || {};

                this.model.inmem = this.model.searchJob.clone();
                this.children.flashMessages = new FlashMessages({ model: this.model.inmem });
                this.fetchOnHidden = true;

                if (!_.isEmpty(this.collection) && !_.isEmpty(this.collection.workloadManagementStatus)) {
                    this.children.workloadInput = new WorkloadInput({
                        workloadPoolAttribute: 'workload_pool',
                        isRunning: this.model.inmem.isRunning(),
                        includeEmptyOption: !this.model.inmem.isRunning(),
                        model: {
                            inmem: this.model.inmem,
                            user: this.model.user,
                            workloadPool: this.model.inmem.entry.content
                        },
                        collection: {
                            workloadManagementStatus: this.collection.workloadManagementStatus
                        }
                    });
                }

                var currApp = this.model.application.get("app"),
                    currOwner = this.model.application.get("owner"),
                    perms = this.model.inmem.entry.acl.permsToObj(),
                    read = perms.read,
                    jobRouteMethod = route[this.options.externalJobLinkPage] || route.search;

                this.everyoneRead = (_.indexOf(read, "*") != -1);
                this.model.inmem.set("everyoneRead", this.everyoneRead);

                this.defaultTTL = parseInt(this.model.searchJob.entry.content.get("defaultTTL"), 10);
                this.defaultSaveTTL = parseInt(this.model.searchJob.entry.content.get("defaultSaveTTL"), 10);

                var data = {
                    sid: this.model.searchJob.id
                };

                if (this.model.application.get('page') === 'report' && this.model.report && !this.model.report.isNew()) {
                    data.s = this.model.report.id;
                }
                this.linkToJob = jobRouteMethod (
                    this.model.application.get('root'),
                    this.model.application.get('locale'),
                    this.model.application.get("app"),
                    {
                        data: data,
                        absolute: true
                    }
                );

                //owner
                this.children.owner = new ControlGroup({
                    label: _("Owner").t(),
                    controlType:'Label',
                    controlOptions: {
                        model: this.model.inmem.entry.acl,
                        modelAttribute: 'owner'
                    }
                });

                //app
                if (this.model.user && this.model.user.canUseApps()) {
                    this.children.app = new ControlGroup({
                        label: _("App").t(),
                        controlType:'Label',
                        controlOptions: {
                            model: this.model.inmem.entry.acl,
                            modelAttribute: 'app'
                        }
                    });
                }

                //permissions toggle
                this.children.permissions = new ControlGroup({
                    label: _("Read Permissions").t(),
                    controlType:'SyntheticRadio',
                    controlOptions: {
                        additionalClassNames: "btn-group-2",
                        items: [
                            { value: false, label: _('Private').t() },
                            { value: true, label: _('Everyone').t() }
                        ],
                        model: this.model.inmem,
                        modelAttribute: 'everyoneRead'
                    }
                });

                //lifetime toggle
                this.children.lifetime = new ControlGroup({
                    label: _("Lifetime").t(),
                    controlType:'SyntheticRadio',
                    tooltip: _("Lifetime defines how long the job is accessible, after the job is run. If the job is not accessed in the specified time period, the job is removed.").t(),
                    controlOptions: {
                        additionalClassNames: "btn-group-2",
                        items: [
                            { value: false, label: time_utils.getRelativeStringFromSeconds(this.defaultTTL, true) },
                            { value: true, label: time_utils.getRelativeStringFromSeconds(this.defaultSaveTTL, true) }
                        ],
                        model: this.model.inmem.entry.content,
                        modelAttribute: 'isSaved'
                    }
                });

                //link to job
                this.children.link = new ControlGroup({
                    label: _("Link To Job").t(),
                    controlType:'Text',
                    help: _('Copy or bookmark the link by right-clicking the icon, or drag the icon into your bookmarks bar.').t(),
                    controlOptions: {
                        additionalClassNames: 'job-link',
                        defaultValue: this.linkToJob,
                        append: '<a class="add-on bookmark" href="' + this.linkToJob + '"><i class="icon-bookmark"></i><span class="hide-text">' + _("Splunk Search Job link. Copy or bookmark the link by right-clicking the icon, or drag the icon into your bookmarks bar.").t() + '</span></a>'
                    }
                });

                this.on("hidden", function() {
                    if (this.fetchOnHidden) {
                        this.model.searchJob.fetch();
                    }
                }, this);
            },
            events: Object.assign({}, Modal.prototype.events, {
                'click .btn-primary': function(e) {
                    e.preventDefault();

                    //TODO: SPL-75065, SPL-75098 because the job endpoint cannot handle parallel requests
                    //we must send all of our changes serially. Sending these requests serially will
                    //make the process slower in systems with slow response times. When SplunkD is fixed
                    //go back to parallel requests.

                    var everyoneRead = this.model.inmem.get('everyoneRead'),
                        isRealTime = this.model.inmem.entry.content.get("isRealTimeSearch"),
                        workloadPool = this.model.inmem.entry.content.get("workload_pool"),
                        aclDeferred = $.Deferred(),
                        saveJobDeferred = $.Deferred(),
                        saveWorkloadDeferred = $.Deferred();

                    if (this.everyoneRead !== everyoneRead) {
                        var options = {
                            success: function(model, response) {
                                aclDeferred.resolve();
                            },
                            error: function(model, response) {
                                if (response.status == splunkd_utils.NOT_FOUND) {
                                    aclDeferred.reject();
                                } else {
                                    aclDeferred.resolve();
                                }
                            }
                        };

                        if (everyoneRead) {
                            this.model.inmem.makeWorldReadable(options);
                        } else {
                            this.model.inmem.undoWorldReadable(options);
                        }
                    } else {
                        aclDeferred.resolve();
                    }

                    $.when(aclDeferred).done(function(){
                        var saveJoboptions = {
                            success: function(model, response) {
                                saveJobDeferred.resolve();
                            },
                            error: function(model, response) {
                                if (response.status == splunkd_utils.NOT_FOUND) {
                                    saveJobDeferred.reject();
                                } else {
                                    saveJobDeferred.resolve();
                                }
                            }
                        };

                        var saveWorkloadOptions = {
                            success: function(model, response) {
                                saveWorkloadDeferred.resolve();
                            },
                            error: function(model, response) {
                                if (response.status == splunkd_utils.NOT_FOUND) {
                                    saveWorkloadDeferred.reject();
                                } else {
                                    saveWorkloadDeferred.resolve();
                                }
                            }
                        };

                        if (!this.model.inmem.entry.content.get('isSaved')) {
                            this.model.inmem.unsaveJob(
                               Object.assign({}, saveJoboptions, {
                                   data: {
                                       auto_cancel: SearchJobModel.DEFAULT_AUTO_CANCEL
                                   }
                               })
                            );
                        } else {
                            if (isRealTime) {
                                this.model.inmem.saveJob(
                                    Object.assign({}, saveJoboptions, {
                                        data: {
                                            auto_cancel: SearchJobModel.DEFAULT_AUTO_CANCEL
                                        }
                                    })
                                );
                            } else {
                                //if the job is not realtime then we use the job endpoint's inherent clear of auto_pause and auto_cancel
                                this.model.inmem.saveJob(saveJoboptions);
                            }
                        }

                        if (_.isUndefined(workloadPool) || _.isEmpty(workloadPool)) {
                            saveWorkloadDeferred.resolve();
                        } else {
                            this.model.inmem.saveWorkloadPool(
                                Object.assign({}, saveWorkloadOptions, {
                                    data: {
                                        workload_pool: workloadPool
                                    }
                                })
                            );
                        }

                    }.bind(this));

                    $.when(saveJobDeferred, saveWorkloadDeferred).done(function () {
                        this.hide();
                        splunkUtils.trackPageInteraction(
                            this.model.application.get('app'),
                            'Click Job Settings and Save'
                        );
                    }.bind(this));

                    $.when(saveJobDeferred, saveWorkloadDeferred, aclDeferred).fail(function () {
                        this.fetchOnHidden = false;
                        this.hide();
                        this.model.searchJob.trigger('jobControls:notFound', { title: _('Job Settings').t() });
                    }.bind(this));
                },
                'click a.bookmark': function(e) {
                    e.preventDefault();
                },
                'click .btn-secondary': function (e) {
                    e.preventDefault();
                    splunkUtils.trackPageInteraction(this.model.application.get('app'), 'Click Job Settings and Cancel');
                }
            }),
            render: function() {
                this.$el.html(Modal.TEMPLATE);

                this.$(Modal.HEADER_TITLE_SELECTOR).html(_("Job Settings").t());

                this.children.flashMessages.render().prependTo(this.$(Modal.BODY_SELECTOR));

                this.$(Modal.BODY_SELECTOR).append(Modal.FORM_HORIZONTAL);

                this.children.owner.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
                if (this.children.app) {
                    this.children.app.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
                }
                this.children.permissions.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
                this.children.lifetime.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
                this.children.link.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
                if (!_.isEmpty(this.collection) && !_.isEmpty(this.collection.workloadManagementStatus)) {
                    this.children.workloadInput.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
                }
                this.$(Modal.FOOTER_SELECTOR).append(Modal.BUTTON_CANCEL);
                this.$(Modal.FOOTER_SELECTOR).append(Modal.BUTTON_SAVE);

                return this;
            }
        });
    }
);
