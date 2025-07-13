define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require('./mvc');
    var utils = require('./utils');
    var BaseManager = require('./basemanager');
    var SearchModels = require('./searchmodel');
    var SplunkResultsModel = require('./splunkresultsmodel');
    var Messages = require('./messages');
    var console = require('util/console');
    var common_algorithms = require('util/common_algorithms');
    var SplunkUtil = require('splunk.util');
    var TokenUtils = require('./tokenutils');
    var splunkDUtils = require('util/splunkd_utils');
    var dashboardUtils = require('util/dashboard_utils');

    function mergeSearch(base, sub) {
        if (!sub && !base) {
            return '';
        }
        if (!sub || !base) {
            return sub || base;
        }
        base = base.replace(/[\|\s]*$/g, '');
        sub = sub.replace(/^[\|\s]*/g, '');
        return [ base, sub ].join(' | ');
    }

    function getFullSearch(model) {
        if (model.parent) {
            return mergeSearch(getFullSearch(model.parent), model.get('search'));
        }
        return model.get('search');
    }

    function mockBaseJob(model) {
        if (model.parent) {
            return mockBaseJob(model.parent);
        }
        return model._sdkJobFromCoreJob(model._job);
    }

    var PostProcessResultsModel = SplunkResultsModel.extend({
        initialize: function() {
            // SPL-158814/SPL-227909: override defaultCondition so we always try to fetch postprocess
            // results if the postprocess search is resolved.
            // this is because we can't rely on our parent basesearch's results count to see whether
            // or not we should try to fetch, since the postprocess search can potentially add/remove
            // results. Since we've removed the | stats count probe search, we have no way of finding
            // out the postprocess results count without just getting the results- which should be cheap
            // now that we're executing postprocess searches outside the splunkd process.
            this.set("condition", function() {
                return this.get('manager').settings.isResolved();
            }.bind(this));
            SplunkResultsModel.prototype.initialize.apply(this, arguments);
        },

        _requestOptions: function() {
            var options = SplunkResultsModel.prototype._requestOptions.call(this);
            var manager = this.get('manager');

            var postProcessSearch = manager.settings.postProcessResolve();
            if (postProcessSearch) {
                options.search = mergeSearch(postProcessSearch, options.search);
                options.check_risky_command = manager.settings.get('check_risky_command');
            }
            return options;
        },

        _fetch: function() {
            // SPL-158814: we override _fetch so that, upon successfully fetching the results,
            // we also set the results count for the data attribute. This is necessary because
            // we removed the probe search, and consumers down the road need correct results
            // counts to execute properly.
            // In an ordinary results fetch, upon failing the search would presumably exit.
            // However, in the case of postprocessing searches, the base search is still fine
            // and keeps going, so the postsearch also keeps going. The results count when an error
            // occurs is 0, leading to a situation where the error message and the 'no results'
            // message alternate back and forth as each of them get rerendered.
            //
            this.fetch({
                autofetch: true,
                success: function(model, data, options) {
                    if (data !== undefined) {
                        var manager = this.get('manager');
                        manager.get("data").resultPreviewCount = data.post_process_count || 0;
                        manager.get("data").resultCount = data.post_process_count || 0;
                        manager._hasError = false;
                    }
                }.bind(this),
                error: function() {
                    var manager = this.get('manager');
                    manager._hasError = true;
                    _.partial(manager.trigger, "search:error");
                }.bind(this)
            });
        },
    });

    var PostProcessSearchSettingsModel = SearchModels.SearchQuery.extend({
        resolve: function(options) {
            options || (options = {});
            if (!this.isResolved() && options.tokens !== true) {
                return undefined;
            }

            var parentSearch;
            if (this._manager.parent) {
                parentSearch = this._manager.parent.settings.resolve(options);
            }
            if (parentSearch === undefined) {
                return undefined;
            }
            // Fetch the post-process search but force it to be unqualified - ie. we don't want a leading search command
            // since we're about to merge it with the base search
            var thisSearch = SearchModels.SearchQuery.prototype.resolve.call(this, _.defaults({ qualified: false }, options));

            if (this.get('replaceTabsInSearch')) {
                parentSearch = parentSearch.replace(/\t/g, ' ');
                thisSearch && (thisSearch = thisSearch.replace(/\t/g, ' '));
            }

            return mergeSearch(parentSearch, thisSearch);
        },

        postProcessResolve: function(options) {
            var thisSearch = SearchModels.SearchQuery.prototype.resolve.apply(this, arguments);

            if (thisSearch && this.get('replaceTabsInSearch')) {
                thisSearch = thisSearch.replace(/\t/g, ' ');
            }

            if (!options || options.mergeParentsSearch !== false) {
                var pm = this._manager.parent;
                if (pm instanceof PostProcessSearchManager) {
                    var ps = pm.settings;
                    var parentSearch = ps.postProcessResolve.apply(ps, arguments);
                    return mergeSearch(parentSearch, thisSearch);
                }
            }

            return thisSearch;
        },

        isResolved: function() {
            var resolvedSearch = SearchModels.SearchQuery.prototype.resolve.apply(this, arguments);
            var tokens = this.get('search', {tokens: true});
            var tokenDependencies = this.get('tokenDependencies', { tokens: true });

            return (resolvedSearch !== undefined || tokens === undefined) &&
                TokenUtils.tokenDependenciesMet(tokenDependencies, this._tokenRegistry);
        }
    });

    /**
     * @constructor
     * @memberOf splunkjs.mvc
     * @name PostProcessSearchManager
     * @description The **PostProcess** manager encapsulates a post-process
     * search job, which is based on a main reporting search.
     * @extends splunkjs.mvc.BaseManager
     *
     * @param {Object} options
     * @param {String} options.id - The unique ID for this control.
     * @param {String} options.managerid=null - The ID of the search manager to bind
     * this control to.
     * @param {Object[]} [options.settings] - The properties of the search manager.
     * @param {Object} options.settings - Search properties.
     * See the {@link http://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTsearch#POST_search.2Fjobs_method_detail| Search API POST Endpoint} for available options.
     * @param {Number} options.settings.auto_cancel - The number of seconds of inactivity after which to automatically cancel a job.
     *   0 means never auto-cancel.
     * @param {Number} options.settings.auto_finalize_ec - The number of events to process after which to auto-finalize the search.
     *   0 means no limit.
     * @param {Number} options.settings.auto_pause - The number of seconds of inactivity after which to automatically pause a job.
     *   0 means never auto-pause.
     * @param {String} options.settings.earliest_time - A time string that specifies the earliest time in the time range to search. The
     *   time string can be a UTC time (with fractional seconds), a relative time specifier (to now), or a formatted time string.
     *   For a real-time search, specift "rt".
     * @param {Boolean} options.settings.enable_lookups - A Boolean that indicates whether to apply lookups to events.
     * @param {String} options.settings.exec_mode - An enum value that indicates the search mode ("blocking", "oneshot", or "normal")
     * @param {Boolean} options.settings.force_bundle_replication - A Boolean that indicates whether this search should cause
     *   (and wait depending on the value of "sync_bundle_replication") bundle synchronization with all search peers.
     * @param {String} options.settings.id - A string that contains a search ID. If unspecified, a random ID is generated.
     * @param {String} options.settings.label - A custom name created for this search.
     * @param {String} options.settings.latest_time - A time string that specifies the latest time in the time range to search.
     *   The time string can be a UTC time (with fractional seconds), a relative time specifier (to now), or a formatted time string.
     *   For a real-time search, specify "rt".
     * @param {Number} options.settings.max_count - The number of events that can be accessible in any given status bucket.
     * @param {Number} options.settings.max_time - The number of seconds to run this search before finalizing. Specify 0 to never finalize.
     * @param {String} options.settings.namespace - A string that contains the application namespace in which to restrict searches.
     * @param {String} options.settings.now - A time string that sets the absolute time used for any relative time specifier in the search.
     * @param {Boolean} options.settings.preview - Indicates if preview is enabled for this search job.
     *   By default, preview is enabled for realtime searches and for searches where status_buckets > 0. Set to false to disable preview.
     * @param {Number} options.settings.reduce_freq - The number of seconds (frequency) to run the MapReduce reduce phase on accumulated map values.
     * @param {Boolean} options.settings.reload_macros - A Boolean that indicates whether to reload macro definitions from the macros.conf configuration file.
     * @param {String} options.settings.remote_server_list - A string that contains a comma-separated list of (possibly wildcarded) servers from which to pull raw events. This same server list is used in subsearches.
     * @param {String} options.settings.required_field_list - Deprecated. Use "rf" instead.
     * @param {String} options.settings.rf - A string that adds one or more required fields to the search.
     * @param {Boolean} options.settings.rt_blocking - A Boolean that indicates whether the indexer blocks if the queue for this search is full. For real-time searches.
     * @param {Boolean} options.settings.rt_indexfilter - A Boolean that indicates whether the indexer pre-filters events. For real-time searches.
     * @param {Number} options.settings.rt_maxblocksecs - The number of seconds indicating the maximum time to block. 0 means no limit. For real-time searches with "rt_blocking" set to "true".
     * @param {Number} options.settings.rt_queue_size - The number indicating the queue size (in events) that the indexer should use for this search. For real-time searches.
     * @param {String} options.settings.search - A string that contains the search query.
     * @param {String} options.settings.search_listener - A string that registers a search state listener with the search. Use the format: search_state;results_condition;http_method;uri;
     * @param {String} options.settings.search_mode - An enum value that indicates the search mode ("normal" or "realtime"). If set to "realtime", searches live data. A real-time search is also specified by setting "earliest_time" and "latest_time" properties to "rt", even if the search_mode is normal or is not set.
     * @param {Boolean} options.settings.spawn_process - A Boolean that indicates whether to run the search in a separate spawned process. Searches against indexes must run in a separate process.
     * @param {Number} options.settings.status_buckets - The maximum number of status buckets to generate. 0 means to not generate timeline information.
     * @param {Boolean} options.settings.sync_bundle_replication - A Boolean that indicates whether this search should wait for bundle replication to complete.
     * @param {String} options.settings.time_format - A string that specifies the format to use to convert a formatted time string from {start,end}_time into UTC seconds.
     * @param {Number} options.settings.timeout - The number of seconds to keep this search after processing has stopped.
     *
     * @example
     * require([
     *     "splunkjs/mvc/searchmanager",
     *     "splunkjs/mvc/postprocessmanager",
     *     "splunkjs/mvc/simplexml/ready!"
     * ], function(SearchManager, PostProcessManager) {
     *
     *     // Create managers
     *     new SearchManager({
     *         id: "main-search",
     *         preview: true,
     *         cache: true,
     *         search: "index=_internal sourcetype=* | head 1000 | stats count by sourcetype"
     *     });
     *
     *     new PostProcessManager({
     *         id: "postproc1",
     *         managerid: "main-search",
     *         search: "search sourcetype=splunkd_access OR sourcetype=splunkd"
     *     });
     *
     *     new PostProcessManager({
     *         id: "postproc2",
     *         managerid: "main-search",
     *         search: "search sourcetype=splunk_web_access OR sourcetype=splunk_web_service"
     *     });
     *
     * });
     */
    var PostProcessSearchManager = BaseManager.extend(/** @lends splunkjs.mvc.PostProcessSearchManager.prototype */{
        moduleId: module.id,

        defaults: {
            managerid: null,
            replaceTabsInSearch: false,
            search: ''
        },

        constructor: function(attributes, options) {
            attributes = attributes || {};
            options = options || {};

            // This has to be in the constructor, otherwise
            // we will call Model.set before we have created this sub-model.
            // Note that the Backbone.Model constructor will call 'set',
            // which in turn will call our 'set' override, which will forward
            // the search query to the query model.
            // We also make sure to deal with the legacy 'postProcess' attribute.
            attributes.search = attributes.postProcess || attributes.search;
            this.settings = new PostProcessSearchSettingsModel({}, _.extend({}, options, {
                _tokenRegistry: options.registry || mvc.Components
            }));
            this.settings._manager = this;

            // Permit deprecated access via the 'query' field
            this.query = this.settings;

            return BaseManager.prototype.constructor.apply(this, arguments);
        },

        initialize: function(attrs, options) {
            attrs = attrs || {};
            options = options || {};

            // Initialize the data attribute to the empty object, so that we
            // never look at our parent's data attribute.
            this.set("data", {});

            this.settings.on('change', this._handleSettingsChange, this);
            this.settings.on('change:status_buckets', this._applyStatusBucketsToParent, this);

            // Whenever the query changes, we can start our search.
            this.settings.on('change:search', this.startSearch, this);

            this.settings.on('change:check_risky_command', function() {
                this.containsRiskyCommand = false;
            }, this);

            this.on('all', function(evt) {
                if (evt.indexOf("search:") === 0) {
                    this._lastSearchEvent = [ evt, Array.prototype.slice.call(arguments, 1) ];
                }
            }, this);

            // Listen to our parent manager being created
            var managerid = attrs.managerid || attrs.manager;
            this.registry.bind('change:' + managerid, this.onManagerChange, this);
            if (this.registry.has(managerid)) {
                this.onManagerChange(this.registry, this.registry.get(managerid));
            }
        },

        /**
         * Validate whether the current post-process and its parent/newParent form circular reference.
         * @param {Object} [newParent] if provided, validate against the newParent; otherwise validate against current parent.
         * @returns {string|null} return null if valid; otherwise return an error message.
         * @private
         */
        _validateParent: function(newParent) {
            var oldParent;
            if (newParent) {
                // temporarily connect this node to its parent to validate if there would be a circle.
                oldParent = this.parent;
                this.parent = newParent;
            }

            if (common_algorithms.findCycleInLinkedList(this, 'parent', 'id')) {
                if (oldParent) {
                    // revert back to old parent
                    this.parent = oldParent;
                }
                return SplunkUtil.sprintf(_("Circular post-process detected: manager id %s, parent id %s").t(), this.id, newParent.id);
            }

            return null;
        },

        /**
         * Sets the property to the specified value for the current component.
         * @param {String} property The property to set
         * @param {Any} value The new value for the property
         */
        set: function(key, value, options) {
            // This is reduced logic from what exists in SearchManager, as we
            // only allow for a query model, we don't allow for a custom one,
            // etc. We do need to be able to forward the 'set' calls though,
            // so it is necessary.
            var attrs;

            // Normalize the key-value into an object
            if ((_.isObject(key) && !_.isArray(key)) || key === null) {
                attrs = key;
                options = value;
            } else {
                attrs = {};
                attrs[key] = value;
            }

            // Forward all attributes to settings model
            this.settings.set(attrs, options);

            // Continue propagating attributes to self for backward compatibility
            BaseManager.prototype.set.call(this, attrs, options);
        },

        _handleSettingsChange: function() {
            var managerPropertiesChanged = _.omit(
                this.settings.changed,
                SearchModels.SearchSettingsModel.ALLOWED_ATTRIBUTES);

            // Continue propagating non-job attributes to self for backward compatibility
            BaseManager.prototype.set.call(this, managerPropertiesChanged);
        },

        _applyStatusBucketsToParent: function() {
            var statusBuckets = this.settings.get('status_buckets');
            if (statusBuckets && this.parent && !this.parent.settings.get('status_buckets')) {
                this.parent.settings.set('status_buckets', statusBuckets);
            }
        },

        getJobResponse: function() {
            return this.parent && this.parent.getJobResponse();
        },

        hasJob: function() {
            return this.parent ? this.parent.hasJob() : false;
        },

        getSid: function() {
            return this.parent && this.parent.getSid();
        },

        /**
         * Creates the search job.
         */
        startSearch: function() {

            // TODO: we might need to pass down options to the base manager

            var response = this.getJobResponse();
            if (response) {
                var jobData = response.entry[0];
                // We have to trigger a full cycle of start/progress/done if
                // appropriate.

                // @deprecated
                // Remove mockSdkJob when removing job instance from the searchmanager.
                // Check that parent has a job. If this is a post process of a post process, the parent will not have
                // a job and it would be incorrect and non-trivial to provide a job.
                var mockSdkJob = this.parent._job && this.parent._sdkJobFromCoreJob(this.parent._job);
                this._onSearchStart(jobData, mockSdkJob);
                this._onSearchTick("search:progress", jobData, mockSdkJob);

                if (jobData.content.isDone) {
                    this._onSearchTick("search:done", jobData, mockSdkJob);
                }
            }
        },

        isRefresh: function() {
            return this.parent.isRefresh();
        },

        onManagerChange: function(x, ctx) {
            if (this.parent) {
                this.parent.off(null, null, this);
                delete this.job;
            }

            if (!ctx) {
                return;
            }

            var message = this._validateParent(ctx);
            if (message) {
                this.trigger('search:error', message);
                this.parent = null;
                return;
            }
            else {
                this.parent = ctx;
            }

            this._applyStatusBucketsToParent();

            //We'll need to get final results count for postprocess at the end
            this._countData = this.data("preview", {
                autofetch: false,
            });

            // We use the parent's search, so that any search paramater changes
            // get propagated to it.
            this.search = this.parent.search;

            // We set up handlers for the various search events
            ctx.on('search:start',      this._onSearchStart,                                    this);
            ctx.on('search:progress',   _.partial(this._onSearchTick,   "search:progress"),     this);
            ctx.on('search:done',       _.partial(this._onSearchTick,   "search:done"),         this);
            ctx.on('search:cancelled',  _.partial(this.trigger,         "search:cancelled"),    this);
            ctx.on('search:fail',       _.partial(this.trigger,         "search:fail"),         this);
            ctx.on('search:error',      _.partial(this.trigger,         "search:error"),        this);

            ctx.replayLastSearchEvent(this);
        },

        /**
         * Returns the value of property for the current component.
         * @returns {Any}
         */
        get: function(/* args */) {
            // Try to get property from own settings, then from parent.
            var setting = this.settings.get.apply(this.settings, arguments);
            if (setting === undefined && this.parent) {
                setting = this.parent.get.apply(this.parent, arguments);
            }
            return setting;
        },

        _onSearchStart: function(jobData, mockSdkJob) {

            // @deprecated
            // Remove job and mockSdkJob when removing job instance from the searchmanager.
            Object.defineProperty(this, 'job', {
                get: function() {
                    console.warn('PostProcessManager#job has been deprecated and will be removed in a future release.');
                    return mockSdkJob;
                }.bind(this),
                configurable: true
            });
            if (this.settings.isResolved()) {
                this.trigger("search:start", jobData, mockSdkJob);
            }
            else {
                var tokenDependencies = this.settings.get('tokenDependencies', { tokens: true });
                if (!TokenUtils.tokenDependenciesMet(tokenDependencies, this.registry)) {
                    this.trigger("search:error", Messages.resolve("unresolved-tokens").message);
                } else {
                    this.trigger("search:error", Messages.resolve('unresolved-search').message);
                }
            }
        },

        _onSearchTick: function(eventName, properties, mockSdkJob) {
            // If we don't have a query (e.g. it is not set, or it is not resolved),
            // then do nothing.
            if (!this.settings.isResolved()) {
                return;
            }

            // We have to create a clone of properties and content, as we are
            // going to be modifying them.
            properties = _.clone(properties || {});
            var content = properties.content = _.clone(properties.content || {});

            var that = this;
            var trigger = function() {
                // SPL-158814: We've removed the | stats count probe search. We reset data to
                // properties.content, but keep the existing resultPreviewCount and resultCount
                // since that gets set when the postprocess GET request completes.
                // Edge case: if you pass in an empty/blank string as your postprocess search,
                // we're just getting the base search results so post_process_count doesn't get set.
                // So keep using the original content.resultPreviewCount/content.resultCount.
                if (that.get("data").resultCount !== 0 ||
                    that.settings.postProcessResolve()) {
                    content.resultPreviewCount = that.get("data").resultPreviewCount || 0;
                    content.resultCount = that.get("data").resultCount || 0;
                }

                if (!that._hasError || eventName === "search:done") {
                    that.trigger(eventName, properties, mockSdkJob);
                }
                if (eventName === "search:done" || eventName === "search:progress") {
                    // Backbone does a deep equality check on sets, and since
                    // properties is an object, and the object contents may have
                    // not changed (e.g. due to a cached job), Backbone might not
                    // fire a "change" event. This ensures that a change
                    // event is fired every time by doing a silent unset followed
                    // by a set.
                    that.unset("data", {silent: true});
                    that.set("data", properties.content);
                }
            };
            if (content.isDone) {
                if (this.get('check_risky_command') &&
                    dashboardUtils.isHiddenSearch(this.get('parentElement')) &&
                    dashboardUtils.isHiddenSearchRiskyCommandDisabled()) {
                    this.set('check_risky_command', false);
                }

                // SPL-167608/SPL-166923: make sure we get the final result count when we register as done
                // because what we have when this event is triggered might not be up to date
                this._countData.fetch({
                    success: function(model, data, options) {
                        if (data !== undefined) {
                            that.get("data").resultPreviewCount = data.post_process_count || 0;
                            that.get("data").resultCount = data.post_process_count || 0;
                            that._hasError = false;
                        }
                        trigger();
                    }.bind(this),
                    error: function(env, err) {
                        that._hasError = true;
                        var mockJob = mockBaseJob(this);

                        // If the search job contains risky command error, trigger the error with search job.
                        if (splunkDUtils.messagesContainsOneOfTypes(err.data.messages, [splunkDUtils.RISKY_COMMAND])) {
                            that.containsRiskyCommand = true;
                            if (mockJob) {
                                mockJob._sdkJob.setError(err);
                                that.fullSearch = getFullSearch(this);
                                if (dashboardUtils.isHiddenSearch(that.get('parentElement'))) {
                                    if (dashboardUtils.isHiddenSearchRiskyCommandDisabled()) {
                                        that.settings.set("check_risky_command", false);
                                    } else {
                                        that.showRiskyWarningDialog(mockJob._sdkJob, 'PostProcessSearch');
                                    }
                                } else {
                                    that.trigger("search:error", _("Action required: Click the icon in the top right corner to review the query before running.").t(), err, mockJob._sdkJob);
                                }
                            }
                        } else {
                            that.containsRiskyCommand = false;
                            if (mockJob) {
                                mockJob._sdkJob.setError(err);
                                that.trigger(
                                    'search:error',
                                    _('Could not create search.').t(),
                                    err,
                                    mockJob._sdkJob
                                );
                            }
                        }
                    }.bind(this)
                });
            } else {
                trigger();
            }
        },

        /**
         * Returns a {@link splunkjs.mvc.SplunkResultsModel|SplunkResultsModel} object for this manager's
         * job with the specified `source`.
         * @param {String} [source] - Valid values for `source` are:</br>
         * (`events | results_preview | results | summary`)
         * @param {Object[]} [args] - Attributes passed to the
         * {@link splunkjs.mvc.SplunkResultsModel|SplunkResultsModel}. Valid attributes are "count" and "offset", for example:</br>`{ count: 25, offset: 10 }`.
         * @returns {splunkjs.mvc.SplunkResultsModel}
         */
        data: function(source, args) {
            if (!source) {
                throw new Error("Cannot get a results model without specifying the source.");
            }

            args = _.defaults({ manager: this, source: source }, args);
            return new PostProcessResultsModel(args);
        },

        replayLastSearchEvent: function(listener) {
            // We want to look at our own search events (as they have our modified
            // counts), and not our parent's search events.
            var replayed = false;
            if (this._lastSearchEvent) {
                var lastSearchEvent = this._lastSearchEvent;
                var evtName = lastSearchEvent[0];
                var listenerObj = _(this._events[evtName]).find(function(attachedListener) {
                    return attachedListener.ctx === listener;
                });
                if (listenerObj) {
                    var args = lastSearchEvent[1];
                    replayed = true;
                    listenerObj.callback.apply(listener, args);
                }
            }
            return replayed;
        }
    });

    return PostProcessSearchManager;
});
