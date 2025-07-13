define([
    'module',
    'underscore',
    'jquery',
    'backbone',
    'views/dashboard/Base',
    'util/moment',
    'util/moment/compactFromNow'
], function(module,
            _,
            $,
            Backbone,
            BaseDashboardView,
            moment) {

    var REFRESH_INTERVAL = 1000;

    var GlobalRefresher = {
        callbacks: {},
        timer: null,
        registerCallback: function(name, callback, context) {
            if (this.callbacks[name]) {
                delete this.callbacks[name];
            }
            this.callbacks[name] = _.bind(callback, context);
            this._startTimer();
        },
        removeCallback: function(name) {
            delete this.callbacks[name];
            if (_.isEmpty(this.callbacks)) {
                this._stopTimer();
            }
        },
        _startTimer: function() {
            if (!this.timer) {
                this.timer = setInterval(function() {
                    _.each(this.callbacks, function(func) {
                        func();
                    });
                }.bind(this), REFRESH_INTERVAL);
            }
        },
        _stopTimer: function() {
            if (this.timer) {
                clearInterval(this.timer);
                delete this.timer;
            }
        }
    };

    return BaseDashboardView.extend({
        moduleId: module.id,
        className: 'splunk-timeindicator',
        viewOptions: {
            register: false
        },
        initialize: function(options) {
            BaseDashboardView.prototype.initialize.apply(this, arguments);
            this.bindToComponentSetting('managerid', this.onManagerChange, this);
            this.listenTo(this.settings, 'change', this._setupRefreshTimer);
            this._timerId = _.uniqueId('timer_');
            this._initializeRefreshModel();
        },
        _initializeRefreshModel: function() {
            this.refreshTimeModel = new Backbone.Model({
                text: ""
            });
            this.listenTo(this.refreshTimeModel, 'change', this._renderText);
        },
        onManagerChange: function(managers) {
            this.manager && this.stopListening(this.manager);
            var primaryManager = _.find(managers, function (manager) {
                return manager.getType() === 'primary';
            });
            if (primaryManager) {
                this.manager = primaryManager;
                this.listenTo(this.manager, "search:start", this._clear);
                this.listenTo(this.manager, "search:progress", this._updateSearchState);
                this.listenTo(this.manager, "search:done", this._updateSearchState);
                this.listenTo(this.manager, "search:fail", this._clear);
                this.listenTo(this.manager, "search:cancelled", this._clear);
                this.manager.replayLastSearchEvent(this);
            }
        },
        _updateSearchState: function(properties) {
            var content = (properties || {}).content || {};
            if (content.dispatchState === 'FAILED') {
                this._clear();
            } else if (content.dispatchState === 'PARSING' || content.dispatchState === 'QUEUED') {
                this._clear();
            } else if (content.dispatchState === 'RUNNING') {
                if (content.isRealTimeSearch) {
                    this.refreshTimeModel.set('text', _("Real-time").t());
                } else {
                    this._clear();
                }
            } else if (content.dispatchState === 'DONE') {
                this._clear();
                this._refreshTime = moment(this.manager.get('published'));
                this._setupRefreshTimer();
            }
        },
        _setupRefreshTimer: function() {
            if (this._refreshTime && this.settings.get('refresh.time.visible') !== false) {
                GlobalRefresher.registerCallback(this._timerId, this._updateRefreshTime, this);
            }
        },
        _clearRefreshTimer: function() {
            GlobalRefresher.removeCallback(this._timerId);
        },
        _updateRefreshTime: function() {
            if (this._refreshTime) {
                this.refreshTimeModel.set({
                    text: this._refreshTime.compactFromNow()
                });
            }
        },
        _clear: function() {
            //stop timer
            this._clearRefreshTimer();
            this.refreshTimeModel.set('text', '');
        },
        render: function() {
            $('<span class="time-freshness"></span>').appendTo(this.$el);
            this._renderText();
            return this;
        },
        _renderText: function() {
            this.$el.children('.time-freshness').text(this.refreshTimeModel.get('text'));
        },
        remove: function() {
            this._clearRefreshTimer();
            BaseDashboardView.prototype.remove.apply(this, arguments);
        }
    });
});
