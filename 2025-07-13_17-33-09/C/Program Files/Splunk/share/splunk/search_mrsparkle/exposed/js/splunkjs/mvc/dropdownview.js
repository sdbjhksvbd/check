define(function(require, exports, module) {
    var _ = require('underscore');
    var BaseChoiceView = require("./basechoiceview");
    var SplunkUtil = require('splunk.util');
    var Dropdown = require('./components/Dropdown');

    // See http://ricostacruz.com/backbone-patterns/#mixins for
    // this mixin pattern.
    /**
     * @constructor
     * @memberOf splunkjs.mvc
     * @name DropdownView
     * @description The **Dropdown** view displays a dropdown list with a set of choices. The list can be bound to a search manager, but can also be used as a standard HTML dropdown list that emits change events.
     * @extends splunkjs.mvc.BaseChoiceView
     *
     * @param {Object} options
     * @param {String} options.id - The unique ID for this control.
     * @param {Boolean} [options.allowCustomValues=false] - Indicates whether to allow custom values to be entered.
     * @param {Object[]} [options.choices=[ ]] -  A static dictionary of options for the dropdown list. If bound to a `managerid`, the static choices specified here are prepended to the dynamic choices from the search.</br>
     * For example:
     *
     *     var mychoices = [
     *         {label:"text1", value: "value1"},
     *         {label:"text2", value: "value2"},
     *         {label:"text3", value: "value3"}
     *     ];
     *
     * @param {String} [options.default] - The default choice.
     * @param {Boolean} [options.disabled=false] - Indicates whether to disable the view.
     * @param {String} [options.initialValue] - The initial value of the input.
     * If **default** is specified, it overrides this value.
     * @param {String} [options.labelField] -  The UI label to display for each choice.
     * @param {String} [options.managerid=null] - The ID of the search manager to bind
     * this control to.
     * @param {Number} [options.minimumResultsForSearch=8] - The minimum number of results.
     * @param {Boolean} [options.selectFirstChoice=false] - Indicates whether to use the first available choice when the user has not made a selection. If the **default** property has been set, that value is used instead.
     * @param {Object} [options.settings] - The properties of the view.
     * @param {Boolean} [options.showClearButton=true] - Indicates whether to display that "x" next to choices, allowing a selection to be cleared.
     * @param {String} [options.value] - The value of the current choice.
     * @param {String} [options.valueField] -  The value or search field for each choice.
     * @param {Number} [options.width=200] - The width of the view, in pixels.
     * @param {String} [options.labelledBy] - The id of the component that labels the dropdown
     *
     * @example
     * require([
     *     "splunkjs/mvc/searchmanager",
     *     "splunkjs/mvc/dropdownview",
     *     "splunkjs/mvc/simplexml/ready!"
     * ], function(SearchManager, DropdownView) {
     *
     *     // Use this search to populate the dropdown with index values
     *     new SearchManager({
     *         id: "example-search",
     *         search: "| eventcount summarize=false index=* index=_* | dedup index | fields index"
     *     });
     *
     *     // Instantiate components
     *     new DropdownView({
     *         id: "example-dropdown",
     *         managerid: "example-search",
     *         default: "main",
     *         labelField: "index",
     *         valueField: "index",
     *         el: $("#mydropdownview")
     *     }).render();
     *
     * });
     */
    var DropdownView = BaseChoiceView.extend({/** @lends splunkjs.mvc.DropdownView.prototype */
        moduleId: module.id,
        className: "splunk-dropdown splunk-choice-input",

        getReactComponent: function() {
            return Dropdown;
        },

        resetValue: function() {
            // Reset to default or undefined. This method is primarily for the clear button.
            this.val(this.settings.get('default'));
        },

        getState: function() {
            var baseState = BaseChoiceView.prototype.getState.apply(this, arguments);

            return _.extend({}, baseState, {
                allowCustomValues: this.settings.get('allowCustomValues'),
                minimumResultsForSearch: this.settings.get('minimumResultsForSearch'),
                defaultValue: this.settings.get('default'),
                showClearButton: this.settings.get('showClearButton'),
                width: this.settings.get('width'),
                labelledBy: this.settings.get('labelledBy'),
                onReset: this.resetValue.bind(this)
            });
        }
    });

    return DropdownView;
});
