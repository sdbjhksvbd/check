define(function(require, exports, module) {
    var _ = require('underscore');
    var $ = require('jquery');
    var BaseSplunkView = require('./basesplunkview');
    var console = require('util/console');
    var normalizeBoolean = require('util/general_utils').normalizeBoolean;
    var SharedTimesCollection = require('collections/shared/Times');
    var TokenUtils = require('./tokenutils');
    var sharedModels = require('./sharedmodels');
    var React = require('react');
    var ReactDOM = require('react-dom');
    var reactRender = require('util/react_render');
    var route = require('uri/route');
    var timeRangeUtils = require('@splunk/time-range-utils/time');
    var TimeRangePickerDropdown = require('./components/TimeRangePickerDropdown').default;

    // DOC: The 'timepicker' field is private.

    /**
     * @constructor
     * @memberOf splunkjs.mvc
     * @name TimeRangeView
     * @description The **TimeRange** view displays a time range picker, which
     * is a list of preset time ranges. This view is modified by its search manager.
     *
     * &nbsp;&nbsp;&nbsp;&nbsp;**Note**  To allow the **TimeRange** view to
     * modify its search manager, you must use tokens or set up a change handler.
     *
     * @extends splunkjs.mvc.BaseSplunkView
     *
     * @param {Object} options
     * @param {String} options.id - The unique ID for this control.
     * @param {String} [options.default] - The default value.
     * @param {Object} [options.dialogOptions] - A dictionary of Boolean options that
     * allow you to customize the panels in the time range picker. Possible
     * options are:</br>
     * - <tt>showPresets</tt>: Indicates whether to show the **Presets** panel.</br>
     * - <tt>showPresetsRealTime</tt>: Indicates whether to show the **Real-time**
     * section of the **Presets** panel.</br>
     * - <tt>showPresetsRealTimeOnly</tt>: Indicates whether to show only the
     * **Real-time** section of the **Presets** panel.</br>
     * - <tt>showPresetsRelative</tt>: Indicates whether to show the **Relative**
     * section of the **Presets** panel.</br>
     * - <tt>showPresetsAllTime</tt>: Indicates whether to show the **Other**
     * section of the **Presets** panel.</br>
     * - <tt>showCustom</tt>: Indicates whether to show the panels other than
     * **Presets**.</br>
     * - <tt>showCustomRealTime</tt>: Indicates whether to show the **Real-time**
     * panel.</br>
     * - <tt>showCustomRelative</tt>: Indicates whether to show the **Relative**
     * panel.</br>
     * - <tt>showCustomDate</tt>: Indicates whether to show the **Date Range**
     * panel.</br>
     * - <tt>showCustomDateTime</tt>: Indicates whether to show the **Date & Time
     * Range** panel.</br>
     * - <tt>showCustomAdvanced</tt>: Indicates whether to show the **Advanced**
     * panel.</br>
     * - <tt>enableCustomAdvancedRealTime</tt>: Indicates whether to allow the
     * **Advanced** panel inputs to accept real-time values.
     * @param {String} [options.earliest_time] - The earliest time in the range.
     * @param {String} [options.latest_time] - The latest time in the range.
     * @param {String} [options.managerid=null] - The ID of the search manager to bind
     * this control to.
     * @param {String} [options.preset="alltime"] - The default time range for the view.
     * When set, the time range picker starts with the selected time range.
     * Possible values are:</br>
     * - "1 hour window"</br>
     * - "1 minute window"</br>
     * - "30 minute window"</br>
     * - "30 second window"</br>
     * - "5 minute window"</br>
     * - "All time"</br>
     * - "All time (real-time)"</br>
     * - "Business week to date"</br>
     * - "Last 15 minutes"</br>
     * - "Last 24 hours"</br>
     * - "Last 30 days"</br>
     * - "Last 4 hours"</br>
     * - "Last 60 minutes"</br>
     * - "Last 7 days"</br>
     * - "Month to date"</br>
     * - "Other"</br>
     * - "Previous business week"</br>
     * - "Previous month"</br>
     * - "Previous week"</br>
     * - "Previous year"</br>
     * - "Real-time"</br>
     * - "Today"</br>
     * - "Week to date"</br>
     * - "Year to date"</br>
     * - "Yesterday"
     * @param {Object} [options.presets] - A dictionary containing custom preset values
     * for the **Presets** panel. If not specified, the default preset values
     * are used. The format for this dictionary is:</br>`[{label: text,
     * earliest_time: val1, latest_time: val2}]`
     * @param {Object} [options.settings] - The properties of the view.
     * @param {String} [options.value] - An object containing the time range picker's
     * **earliest_time** and **latest_time** values.
     *
     * @example
     * require([
     *     "splunkjs/mvc/searchmanager",
     *     "splunkjs/mvc/timerangeview",
     *     "splunkjs/mvc/simplexml/ready!"
     * ], function(SearchManager, TimeRangeView) {
     *
     *     // Create a search manager
     *     var mysearch = new SearchManager({
     *         id: "example-search",
     *         preview: true,
     *         search: "index=_internal | head 50",
     *         status_buckets: 300,
     *         required_field_list: "*"
     *     });
     *
     *     // Instantiate a view using the default time range picker
     *     var mytimerange = new TimeRangeView({
     *         id: "example-timerange",
     *         managerid: "example-search",
     *         preset: "Today",
     *         el: $("#mytimerangeview")
     *     }).render();
     *
     *     // Update the search manager when the time range changes
     *     mytimerange.on("change", function() {
     *         mysearch.settings.set(mytimerange.val());
     *     });
     *
     *     // Create a custom time range picker
     *
     *     // Show the Presets panel, hide the Real-time and Advanced panels
     *     var mypresetsettings = {
     *         showPresets: true,
     *         showCustomRealTime: false,
     *         showCustomAdvanced:false,
     *     };
     *
     *     // Define custom preset values
     *     var mypresetvalues = [
     *         {label: 'Last 13 minutes', earliest_time: '-13m', latest_time: 'now'},
     *         {label: 'Last 42 minutes', earliest_time: '-42m', latest_time: 'now'}
     *     ];
     *
     *     // Instantiate a view using the custom time range picker
     *     var mytimerange_custom = new TimeRangeView({
     *         id: "example-timerange_custom",
     *         managerid: "example-search",
     *         presets: mypresetvalues,
     *         dialogOptions: mypresetsettings,
     *         el: $("#mytimerangeview_custom")
     *     }).render();
     *
     *     // Update the search manager when the time range changes
     *     mytimerange_custom.on("change", function() {
     *         mysearch.settings.set(mytimerange_custom.val());
     *     });
     * });
     */
    var TimeRangeView = BaseSplunkView.extend(/** @lends splunkjs.mvc.TimeRangeView.prototype */{
        moduleId: module.id,

        className: 'splunk-timerange',

        options: {
            'default': undefined,
            managerid: null,
            earliest_time: undefined,
            latest_time: undefined,
            /**
             * Name of the preset (ex: "Last 24 hours") that specifies the
             * default value of this view. Overrides 'default' if
             * both are present.
             */
            preset: undefined,
            /**
             * List of preset definitions to display in this view.
             * If omitted, the standard presets will be used.
             * Initialization-only.
             *
             * A preset definition is a dictionary with structure similar to:
             * {label: 'Last 10 minutes', earliest_time: '-10m', latest_time: 'now'}.
             */
            presets: undefined,
            value: undefined,
            /**
             * Options to customize the dialog that appears when the
             * time range view is clicked. Initialization-only.
             *
             * See views/shared/timerangepicker/dialog/Master for the
             * specific options available.
             */
            dialogOptions: {},
            popdownOptions: {}
        },

        initialize: function() {
            var that = this;

            this.configure();
            this.settings.enablePush('value');
            this.settings.enablePush('earliest_time');
            this.settings.enablePush('latest_time');

            this._initializeValue();

            var presets = this.settings.get('presets');
            var dialogOptions = this.settings.get('dialogOptions');

            //Set timerangeview from presets/dialogOptions if they're defined else get the shared models.
            var timesCollection = _.isEmpty(presets) ? sharedModels.get('times') : SharedTimesCollection.createFromPresets(presets, dialogOptions);

            this.canRealTimeSearch = true;
            if(sharedModels.get('user').entry.content.get('capabilities')){
                this.canRealTimeSearch = _.contains(sharedModels.get('user').entry.content.get('capabilities'), 'rtsearch');
            }

            if(!this.canRealTimeSearch){
                timesCollection.models = timesCollection.filter(function (s) {
                    return  (s.entry.content.get('latest_time') !== 'rt');
                });
            }

            // When dialog options are defined regardless of presets.
            if (!_.isEmpty(dialogOptions)) {
                timesCollection.setSettings(dialogOptions);
            }

            this._timesCollection = timesCollection;

            // We cannot create the timepicker until these internal models
            // have been fetched, and so we wait on them being done.
            this._pickerDfd = $.when(timesCollection.dfd);

            // Whenever the times collection changes and/or the preset changes,
            // we update the timepicker
            this._timesCollection.on('change reset', this._onTimePresetUpdate, this);
            this.settings.on('change:preset', this._onTimePresetUpdate, this);

            // Update the default if it changes
            this.settings.on('change:default', this._onDefaultChange, this);

            // this should be the central place to broadcast 'change' event to outside world
            this.settings.on('change:value', this._onTimeRangeChange, this);

            this.bindToComponentSetting('managerid', this._onManagerChange, this);

            // Initialize value to preset (asynchronously) if no other
            // initial value was determined
            if (this.settings.get('value') === undefined) {
                that._onTimePresetUpdate();
            }

            this._onReady(_.bind(this.trigger, this, 'ready'));
        },

        _onReady: function(cb) {
            // If the time input is configured to use a preset (such as "Last 24 hours") we wait unit the presets are
            // fetched before signaling readiness. Otherwise we return a pre-resolved promise.
            var dfd = $.Deferred().resolve();
            if (this.settings.get('preset') && !this.settings.get('value')) {
                this._presetDfd = $.Deferred();
                dfd = this._presetDfd.promise();
            }
            if (cb) {
                dfd.always(cb);
            }
            return dfd;
        },

        _initializeValue: function() {
            var that = this;

            // Reconcile initial {value, earliest_time, latest_time}
            var initialValue = this.settings.get('value');
            if (initialValue != undefined) {
                this.settings.set({
                    'earliest_time': initialValue['earliest_time'],
                    'latest_time': initialValue['latest_time']
                });
            } else if (this.settings.get('earliest_time') !== undefined ||
                this.settings.get('latest_time') !== undefined)
            {
                this.settings.set('value', {
                    'earliest_time': this.settings.get('earliest_time'),
                    'latest_time': this.settings.get('latest_time')
                });
            } else {
                // NOTE: This should be a no-op, but I'm just being explicit
                this.settings.set({
                    'value': undefined,
                    'earliest_time': undefined,
                    'latest_time': undefined
                });
            }

            // Keep {value, earliest_time, latest_time} in sync
            this.settings.on('change:value', function(model, value) {
                if (value) {
                    that.settings.set({
                        'earliest_time': value.earliest_time,
                        'latest_time': value.latest_time
                    });
                }
            });

            // These values can be pushed in two separate events when they
            // are bound to tokens. As such, we debounce so that we send
            // only a single upstream event.
            this.settings.on('change:earliest_time change:latest_time', _.debounce(function() {
                var newValue = _.clone(that.settings.get('value')) || {};
                newValue.earliest_time = that.settings.get('earliest_time');
                newValue.latest_time = that.settings.get('latest_time');
                that.settings.set('value', newValue);
            }), this);

            // If value is bound to $token$, automatically bind
            // {earliest_time, latest_time} to derived tokens as a
            // convenience unless they are already bound to a
            // non-literal template
            if (TokenUtils.isToken(this.settings.get('value', {tokens: true}))) {
                var token = TokenUtils.getTokens(
                    this.settings.get('value', {tokens: true}))[0];

                var settingIsLiteralOrUndefined = function(settingName) {
                    return (
                        that.settings.get(settingName, {tokens: true}) ===
                        that.settings.get(settingName, {tokens: false})
                    );
                };

                // NOTE: This will automatically propagate any preexisting
                //       literal values to the new tokens that are set here.
                if (settingIsLiteralOrUndefined('earliest_time')) {
                    this.settings.set(
                        'earliest_time',
                        '$' + token.namespace + ':' + token.name + '.earliest_time$',
                        {tokens: true});
                }
                if (settingIsLiteralOrUndefined('latest_time')) {
                    this.settings.set(
                        'latest_time',
                        '$' + token.namespace + ':' + token.name + '.latest_time$',
                        {tokens: true});
                }
            }

            // If value is still undefined, use a default if available
            if (this.settings.get('value') === undefined) {
                this.settings.set('value', this.settings.get('default'));
            }
        },

        _onDefaultChange: function() {
            // Initialize value with default, if provided
            var oldDefaultValue = this.settings.previous('default');
            var defaultValue = this.settings.get('default');
            var currentValue = this.settings.get('value');

            if (defaultValue !== undefined &&
                (_.isEqual(currentValue, oldDefaultValue) || currentValue === undefined))
            {
                this.settings.set('value', defaultValue);
            }
        },

        _onTimePresetUpdate: function() {
            var preset = this.settings.get('preset');
            if (!preset) {
                return;
            }

            this._presetInFlightCancelled = false;

            // We can only look at the times collection when it has finished
            // fetching
            var that = this;
            $.when(this._pickerDfd).done(function() {
                var timeModel = that._timesCollection.find(function(model) {
                    return model.entry.content.get('label') === preset;
                });

                if (timeModel) {
                    // Don't apply the preset if an intervening value change occurred
                    if (!that._presetInFlightCancelled) {
                        that.val({
                            earliest_time: timeModel.entry.content.get('earliest_time'),
                            latest_time: timeModel.entry.content.get('latest_time')
                        });
                    }
                } else {
                    console.warn('Could not find matching preset "' + preset + '" for time range view.');
                    that.val({
                        // All time
                        earliest_time: '0',
                        latest_time: ''
                    });
                }
                if (that._presetDfd) {
                    that._presetDfd.resolve();
                }
            });
        },

        _onManagerChange: function(managers, manager) {
            if (this.manager) {
                this.manager.off(null, null, this);
                this.manager = null;
            }

            this.manager = manager;
            if (manager && manager.search) {
                this.listenTo(
                    manager.search,
                    'change:earliest_time change:latest_time',
                    _.debounce(this._onManagerTimeRangeChange.bind(this))
                );

                this._onManagerTimeRangeChange();
            }
        },

        _onManagerTimeRangeChange: function() {
            // Get the current time range
            var timeRange = this.val();

            // The manager's time range, if it has one, overrides the timepicker's
            // current range.
            timeRange.earliest_time = this.manager.settings.get('earliest_time') || timeRange.earliest_time;
            timeRange.latest_time = this.manager.settings.get('latest_time') || timeRange.latest_time;

            // Set it back
            this.val(timeRange);
        },

        _onTimeRangeChange: function(model, value, options) {
            // Not sure why we need this condition, but it has been there for 4+ years, so be it.
            if (!options || (options && !options._self)) {
                this.trigger('change', this._getTimeRange(), this);
                // this is needed when developer set time range by calling val() or this.settings.set('value', ...)
                this.render();
            }
        },

        /**
         * Draws the view to the screen. Called only when you create the view manually.
         */
        render: function() {
            $.when(this._pickerDfd).done(function() {
                this.renderReactComponent();
            }.bind(this));

            return this;
        },

        renderReactComponent: function() {
            reactRender(
                React.createElement(this.getReactComponent(), this.getState()),
                this.getReactRoot()
            );
        },

        getReactComponent: function() {
            return TimeRangePickerDropdown;
        },

        getReactRoot: function() {
            return this.el;
        },

        getState: function() {
            // ideally we should use @splunk/time-range-utils/presets instead of using ModelHelper, because
            // @splunk/time-range-utils is designed for @splunk/react-time-range.

            var documentationURL = route.docHelp(
                sharedModels.get('app').get('root'),
                sharedModels.get('app').get('locale'),
                'learnmore.timerange.picker'
            );

            return {
                presets: this.getPresets(),
                menuSettings: this.getMenuSettings(),
                onChange: function(e, timeRange) {
                    this.val({
                        earliest_time: timeRange.earliest,
                        latest_time: timeRange.latest
                    });
                }.bind(this),
                earliest: this._getTimeRange().earliest_time,
                latest: this._getTimeRange().latest_time,
                documentationURL: documentationURL
            };
        },

        getMenuSettings: function () {
            return this._timesCollection.filter(function (model) {
                return model.entry.get('name') === 'settings';
            }).map(function (model) {
                return {
                    showAdvanced: normalizeBoolean(model.entry.content.get('show_advanced')),
                    showDate: normalizeBoolean(model.entry.content.get('show_date_range')),
                    showDateTime: normalizeBoolean(model.entry.content.get('show_datetime_range')),
                    showPresets: normalizeBoolean(model.entry.content.get('show_presets')),
                    showRealtime: this.canRealTimeSearch ? normalizeBoolean(model.entry.content.get('show_realtime')) : false,
                    showRelative: normalizeBoolean(model.entry.content.get('show_relative'))
                };
            }.bind(this))[0];
        },

        getPresets: function() {
            return this._timesCollection.filter(function(model) {
                return (model.entry.content.get('earliest_time') || model.entry.content.get('latest_time')) && !model.entry.content.get('disabled');
            }).map(function(model) {
                return {
                    label: _(model.entry.content.get('label')).t(),
                    earliest: model.entry.content.get('earliest_time') || '',
                    latest: model.entry.content.get('latest_time') || ''
                };
            });
        },

        /**
         * Gets the view's value if passed no parameters.
         * Sets the view's value if passed a single parameter.
         * @param {String} newValue - The value to set.
         * @returns {String}
         */
        val: function(newValue) {
            if (arguments.length === 0) {
                return this._getTimeRange();
            }
            newValue = newValue || { earliest_time: undefined, latest_time: undefined };

            this._setTimeRange(newValue);

            // If there is an asynchronous preset change
            // in progress, abort it.
            this._presetInFlightCancelled = true;

            return this._getTimeRange();
        },

        _getSelectedData: function() {
            var tr = this._getTimeRange() || {};
            return {
                earliest: tr.earliest_time,
                latest: tr.latest_time,
                label: this._getSelectedLabel()
            };
        },

        _getSelectedLabel: function() {
            var timeRange = this._getTimeRange();
            return timeRangeUtils.createRangeLabel(timeRange.earliest_time, timeRange.latest_time, this.getPresets());
        },

        _getSelectedValue: function() {
            var tr = this._getTimeRange() || {};
            tr = tr.earliest_time != null || tr.latest_time != null ?
                [tr.earliest_time || '', tr.latest_time || ''].join(':') : undefined;
            return tr;
        },

        // This logic applies what Dashboards expects in order for an input to have a 'value' - it is not a generally
        // applicable construct, and should only be used by the Dashboard helpers
        _hasValueForDashboards: function() {
            var value = this.settings.get('value');
            var defaultValue = this.settings.get('default');
            var valueIsDefined = value !== undefined && value !== null;
            return valueIsDefined || defaultValue === undefined || value === defaultValue;
        },

        _setTimeRange: function(value) {
            var hasEarliestOrLatest = Object.keys(value).find(function(key) {
                return key === 'earliest_time' || key === 'latest_time';
            });

            if (!hasEarliestOrLatest) {
                throw Error('invalid time range value: ' + JSON.stringify(value));
            }

            // Note we rely on the event listener to sync 'value', 'earliest_time', 'latest_time'.
            // The reason we don't directly set 'earliest_time' and 'latest_time' is:
            // 'value' could be token, in that case 'earliest_time' and 'latest_time' become something
            // like $token.earliest_time$ or $token.latest_time$, so I don't really know if it makes
            // sense to set 'earliest_time' and 'latest_time' here.
            this.settings.set('value', value);
        },

        _getTimeRange: function() {
            var timeRange = this.settings.get('value') || {};

            // This is to make sure _getTimeRange always returns an object with earliest_time and latest_time keys.
            // That's how this method was implemented before, and many other logic relies on this assumption.
            return {
                earliest_time: timeRange.earliest_time || '',
                latest_time: timeRange.latest_time || ''
            };
        },

        remove: function() {
            ReactDOM.unmountComponentAtNode(this.getReactRoot());
            BaseSplunkView.prototype.remove.apply(this, arguments);
        }
    });

    return TimeRangeView;
});
