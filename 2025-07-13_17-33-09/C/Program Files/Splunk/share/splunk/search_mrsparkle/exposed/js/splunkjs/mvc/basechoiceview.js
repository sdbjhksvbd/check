define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var console = require('util/console');
    var BaseInputView = require("./baseinputview");
    var Messages = require("./messages");
    var React = require('react');
    var ChoiceViewMessage = require('./components/ChoiceViewMessage');
    var PostProcessSearchManager = require('./postprocessmanager');
    var splunkDUtils = require('util/splunkd_utils');
    var reactRender = require('util/react_render');
    var RiskyCommandDialog = require('views/shared/dialogs/RiskyCommand');
    var Modal = require('views/shared/Modal');
    var PopdownView = require('views/shared/delegates/Popdown');
    var splunkUtils = require('splunk.util');

    /**
     * @constructor
     * @memberOf splunkjs.mvc
     * @name BaseChoiceView
     * @private
     * @description The **BaseChoiceView** base class is a
     * private abstract base class for form input views that
     * present static and dynamic choices.
     *
     * This class presents choices, which consist of a value
     * and an optional label to display.  If the label is not
     * provided, the value will be displayed.
     * This class is not designed to be instantiated directly.
     *
     * @extends splunkjs.mvc.BaseInputView
     *
     * @param {Object} choices - An array of choices.
     * @param {Object} options
     * @param {*} options.valueField - Field to use for the option value (and
     * optionally, the option label).
     * @param {String} options.labelField - Field to use for option label,
     * defaults to **valueField** if not provided.
     */
    var BaseChoiceView = BaseInputView.extend(/** @lends splunkjs.mvc.BaseChoiceView.prototype */{
        options: {
            choices: [],
            /**
             * If true then choice view defaults its value to the first
             * available choice.
             *
             * This setting does not apply to BaseMultiChoiceView subclasses.
             */
            selectFirstChoice: false
        },

        initialize: function() {
            this._baseChoiceViewInitialized = false;

            // Create elements for the control and message
            this._$ctrl = $("<div/>");
            this._$msg = $("<div/>").addClass("splunk-choice-input-message");
            this.$el.html('').append(this._$ctrl, this._$msg);

            this.options = _.extend({}, BaseInputView.prototype.options, this.options);
            BaseInputView.prototype.initialize.apply(this, arguments);

            this.manager = null;
            this.resultsModel = null;

            this.settings.enablePush("selectedLabel");
            this.listenTo(this.settings, 'change:value', this.updateSelectedLabel);
            this.listenTo(this.settings, 'change:choices', function () {
                // make sure not accidentally pass argument to _updateDisplayedChoice
                this._firstChoiceSelected = false;
                this._updateDisplayedChoices();
            });

            this._baseChoiceViewInitialized = true;

            // TODO: refactor the 'selectFirstChoice' logic
            // My understanding of this._hasUserInput is, it is a flag intended to be used as part of
            // the 'selectFirstChoice' logic, which is really hard to keep track. We should find a simpler
            // way to implement 'selectFirstChoice'.
            this._hasUserInput = false;
            this._firstChoiceSelected = false;

            // a flag that check whether this input has initial value, selectFirstChoice will be skipped if it's true
            this._hasInitialValue = !_.isUndefined(this.settings.get('value')) || !_.isUndefined(this.settings.get('default'));

            this._updateDisplayedChoices();
            this.updateSelectedLabel();
            this._initializeErrorPopdown();
        },

        getReactRoot: function() {
            // Override the default getReactRoot
            // Point the control at the DOM we allocated for it.
            return this._$ctrl[0];
        },

        onUserInput: function() {
            this._hasUserInput = true;
        },

        updateSelectedLabel: function() {
            // If this method will try to set selectedLabel when push is not
            // enabled yet (see initialize method) - this will clear all bindings.
            // Property _baseChoiceViewInitialized helps us to synchronize initialization.
            if (this._baseChoiceViewInitialized) {
                var choice = this._findDisplayedChoice(this.val());
                if (choice) {
                    this.settings.set('selectedLabel', choice.label);
                } else {
                    this.settings.unset('selectedLabel');
                }
            }
        },

        _handleSelectFirstChoice: function() {
            if (!this._hasUserInput && !this._isMultiChoiceView && this.settings.get('selectFirstChoice') && !this._hasInitialValue && !this._firstChoiceSelected) {
                var currentVal = this.val();
                var firstValue = _(this._displayedChoices).chain().pluck('value').first().value();
                if (firstValue !== undefined && currentVal != firstValue) {
                    this._firstChoiceSelected = true;
                    this.settings.set('value', firstValue);
                }
            }
        },

        _onDataChanged: function() {
            this._firstChoiceSelected = false;
            BaseInputView.prototype._onDataChanged.apply(this, arguments);
        },

        _onSearchStart: function() {
            this._hasUserInput = false;
            BaseInputView.prototype._onSearchStart.apply(this, arguments);
        },

        displayMessage: function(messageName) {
            var info = messageName;
            if (_.isString(messageName)) {
                info = Messages.resolve(messageName);
            }

            // For the choice views, we have very limited space to render
            // messages, and so we render them to a specific message container
            // created in _updateView. We also replace the original message with
            // one that is more appropriate for the choice view.
            var message = "";
            var toolTipMessage = "";
            var actionRequired = false;
            var onClick;
            var parentRiskyError;
            switch (messageName) {
                case "no-events":
                case "no-results":
                case "no-stats": {
                    message = _("Search produced no results.").t();
                    toolTipMessage = "";

                    // We need to update the view with the empty search results,
                    // otherwise we may end up displaying stale data.
                    this._updateView(this._viz, []);
                    break;
                }
                case "waiting":
                case "waiting-queued":
                case "waiting-preparing": {
                    this.clearMessageOnUpdate = true;
                    message = _("Populating...").t();
                    toolTipMessage = "";
                    break;
                }
                case "duplicate": {
                    message = _("Duplicate values causing conflict").t();
                    break;
                }
                default: {
                    var err = info.err;
                    if (err && splunkDUtils.messagesContainsOneOfTypes(err.data.messages, [splunkDUtils.RISKY_COMMAND])) {
                        if (this.model) {
                            if (info.job !== this.lastSearchJob) {
                                this.lastSearchJob = info.job;
                                // if search job is not the same, re-render the dialog
                                if (this.riskyWarningDialog) {
                                    this.riskyWarningDialog.remove();
                                    this.riskyWarningDialog = null;
                                }
                            }
                            parentRiskyError = splunkDUtils.getParentRiskyError(this.manager.parent);
                            if (parentRiskyError) {
                                message = _('Paused: Dependent on successful preceding search.').t();
                            } else if (!this.lastSearchJob) {
                                message = _('Delayed: Dependent on successful preceding search.').t();
                            } else {
                                message = _('Found potentially risky commands.').t();
                                toolTipMessage = _('Click the icon on the left to review the query before running').t();
                                actionRequired = true;
                                if (!this.lastSearchJob.error && this.lastSearchJob.setError) {
                                    this.lastSearchJob.setError(err);
                                }
                            }
                        }
                    }
                    else if (info.level === "error") {
                        message = _("Could not create search.").t();
                        toolTipMessage = info.message || "";
                    }
                    else {
                        message = "";
                        toolTipMessage = "";
                    }

                    // We need to update the view with the empty search results,
                    // otherwise we may end up displaying stale data.
                    this._updateView(this._viz, []);
                    break;
                }
            }

            this._renderMessage({
                message: message,
                toolTipMessage: toolTipMessage,
                actionRequired: actionRequired,
                onClick: onClick
            });
        },

        _renderMessage: function(props) {
            reactRender(
                React.createElement(ChoiceViewMessage, props),
                this._$msg[0]
            );
        },

        _initializeErrorPopdown: function() {
            this._$error = $("<div/>").addClass("modal risky-command-dialog");
            this.$el.append(this._$error);
            var options = {
                el: this.$el,
                mode: 'dialog',
                detachDialog: true,
                toggle: 'button[data-test="clickable"]',
                dialog: '> .risky-command-dialog'
            };
            this.popdown = new PopdownView(options);

            this.listenTo(this.popdown, "show", function() {
                this._showRiskyWarningDialog();
            }.bind(this));
            this.listenTo(this.popdown, "hide", function() {
                if (this.riskyWarningDialog && this.riskyWarningDialog.shown) {
                    this._hideRiskyWarningDialog();
                }
            }.bind(this));
        },

        _renderRiskyWarningDialog: function() {
            var options = {
                model: {
                    searchJob: this.lastSearchJob,
                    application: this.model.application,
                },
                hideInvestigateBtn: true,
                actionableText: _("Do you want to run the search string?").t(),
                backdrop: false,
                search: this.manager.settings.get('search'),
                showSearchQuery: true,
                el: this.popdown.delegate().$el,
            };

            if (this.manager instanceof PostProcessSearchManager) {
                options.search = this.manager.fullSearch;
            }

            var riskyWarningDialog = new RiskyCommandDialog(options);
            this.listenTo(riskyWarningDialog, "runSearch", function() {
                if (this.manager) {
                    splunkUtils.trackEvent({
                        type: 'dashboard.telemetry',
                        data: {
                            pageAction: 'riskyWarningDialog.runSearch'
                        }
                    });
                    this.manager.settings.set("check_risky_command", false);
                    if (this.manager.parent) {
                        this.manager.parent.startSearch({refresh: true});
                    } else {
                        this.manager.startSearch({refresh: true});
                    }
                }
                this.riskyWarningDialog.remove();
                this.popdown.hide();
            }.bind(this));
            this.listenTo(riskyWarningDialog, "cancel", function() {
                splunkUtils.trackEvent({
                    type: 'dashboard.telemetry',
                    data: {
                        pageAction: 'riskyWarningDialog.cancel'
                    }
                });
                this.popdown.hide();
            }.bind(this));
            riskyWarningDialog.render();
            riskyWarningDialog.$(Modal.HEADER_TITLE_SELECTOR).children().last().html( _('This search has a potential security risk').t());
            return riskyWarningDialog;
        },

        _showRiskyWarningDialog: function() {
            if (!this.riskyWarningDialog) {
                this.riskyWarningDialog = this._renderRiskyWarningDialog();
            }
            this.riskyWarningDialog.show();
            splunkUtils.trackEvent({
                type: 'dashboard.telemetry',
                data: {
                    pageAction: 'riskyWarningDialog.open'
                }
            });
        },

        _hideRiskyWarningDialog: function() {
            if (this.riskyWarningDialog) {
                this.riskyWarningDialog.hide();
            }
        },

        _updateDisplayedChoices: function(data) {
            // Given a new set of dynamic data, transforms all sources
            // of choices into a value/label pair suitable for DOM
            // rendering.  Merges static and dynamic data into a
            // single array.
            // TODO: we may want to implement a generic method that can merge choices from multiple sources
            // into one. For example, static choices + dymanic choices + custom input values form the filter.
            data = data || this._data;
            var valueField = this.settings.get("valueField") || 'value';
            var labelField = this.settings.get("labelField") || valueField;

            var dataChoices = _.map((data || []), function(row) {
                return {
                    // note: if label does not exist, value will be used as label. This is to align
                    // with the behavior in versions <= 7.0 (minty). SPL-152554
                    label: row[labelField] || row[valueField],
                    value: row[valueField]
                };
            }).filter(function(choice) {
                // there's a scenario that the search returns some results while the view doesn't set
                // correct 'valueField' or 'labelField', so the _.map function generates
                // [{ label: undefined, value: undefined }].
                // This is an invalid option which caused DVPL-3292 and some unit tests were force to
                // pass when the DOM renders 3 choices while only 2 choices are provided.
                return choice.label != null && choice.value != null;
            });

            var choices = Array.prototype.slice.call(this.settings.get('choices') || []);

            choices = choices.concat(dataChoices);

            // De-duplicate values list, as HTML controls don't handle
            // them well.
            var originalChoicesLength = choices.length;
            choices = _.uniq(choices, false, function(i) { return i.value; });
            if (originalChoicesLength != choices.length) {
                this.displayMessage('duplicate');
                console.log("Choice control received search result with duplicate values. Recommend dedupe of data source.");
            }
            this._displayedChoices = choices;

            // make sure call _handleSelectFirstChoice and updateSelectedLabel here, because any changes to _displayedChoices can affect them.
            this._handleSelectFirstChoice();
            this.updateSelectedLabel();
        },

        _getSelectedData: function() {
            return _.extend(
                BaseInputView.prototype._getSelectedData.call(this),
                this._selectedDataForValue(this.val())
            );
        },

        _selectedDataForValue: function(value){
            var valueField = this.settings.get('valueField') || 'value';
            var selected = _(this._data || []).find(function(d) { return d[valueField] === value; });
            if (selected) {
                var result = {};
                _(selected).each(function(val, key){ result['row.' + key] = val; });
                selected = result;
            }
            return selected;
        },

        _updateView: function(viz, data) {
            if (!this._viz) {
                this._createView(this._displayedChoices);
                if (!this._viz) {
                    return;
                }
            }

            // clear message if message is '...populating'
            if (this.clearMessageOnUpdate) {
                this._renderMessage();
            }

            this._updateDisplayedChoices(data);
            this.updateView(this._viz, this._displayedChoices);
        },

        // override BaseInputView because BaseChoiceView has choices.
        updateView: function(viz, data) {
            // Save data to a temporary place so that getState() can access it.
            // We should figure out better way to handle it.
            this._choicesData = data;
            // have to manually re-render
            this.renderReactComponent();
        },

        getState: function() {
            var baseState = BaseInputView.prototype.getState.apply(this, arguments);

            return _.extend({}, baseState, {
                choices: this._choicesData,
                disabled: !this._displayedChoices || this._displayedChoices.length === 0 || this.settings.get('disabled'),
                onChange: function(value) {
                    this.onUserInput();
                    this.val(value);
                }.bind(this)
            });
        },

        _findDisplayedChoice: function(value) {
            return _.find(
                this._displayedChoices,
                function(ch) { return ch.value === value; });
        },

        // WARNING: if this method is used to set value, it will be treated as an user input, thus it
        // affects the 'selectFirstChoice' option.
        val: function() {
            if (arguments.length > 0 && !this._isMultiChoiceView) {
                this._hasUserInput = true;
            }

            return BaseInputView.prototype.val.apply(this, arguments);
        },

        /**
         * @returns displayedChoices
         * Retrieves an array of the selected choices and their values in the following format:
         *
         * @example
         *  [
         *      {value: 'val1', label: 'Value 1'},
         *      {value: 'val2', label: 'Value 2'},
         *      ...
         *  ]
         */
        getDisplayedChoices: function() {
            return this._displayedChoices || [];
        },

        // This logic applies what Dashboards expects in order for an input to have a "value" - it is not a generally
        // applicable construct, and should only be used by the Dashboard helpers
        // Note this function overrides the function in baseinputview.js, make sure they are aligned.
        _hasValueForDashboards: function() {
            var value = this.settings.get("value");
            var defaultValue = this.settings.get("default");
            var valueIsDefined = value !== undefined && value !== null && value.length > 0;
            return valueIsDefined || defaultValue === undefined || value === defaultValue;
        }
    });

    return BaseChoiceView;
});
