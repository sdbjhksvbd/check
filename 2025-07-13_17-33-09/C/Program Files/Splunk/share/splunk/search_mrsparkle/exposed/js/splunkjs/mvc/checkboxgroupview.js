define(function(require, exports, module) {
    var _ = require('underscore');
    var BaseMultiChoiceView = require("./basemultichoiceview");
    var CheckboxGroup = require('./components/CheckboxGroup');

    var asArray = function(obj) {
        if (obj === undefined) {
            return [];
        }
        return _.isArray(obj) ? obj : [obj];
    };

    /**
     * @constructor
     * @memberOf splunkjs.mvc
     * @name CheckboxGroupView
     * @description The **CheckboxGroup** view displays a group of checkboxes,
     * allowing you to populate a set of checkboxes with a search. You can also
     * use this view like a standard HTML checkbox group.
     * @extends splunkjs.mvc.BaseMultiChoiceView
     *
     * @param {Object} options
     * @param {String} options.id - The unique ID for this control.
     * @param {Object[]} [options.choices=[ ]] - A static array of objects of choices for the checkbox
     * group. If bound to a `managerid`, the static choices specified here are
     * prepended to the dynamic choices from the search.</br>
     * For example:
     *
     *     var mychoices = [
     *         {label:"text1", value: "value1"},
     *         {label:"text2", value: "value2"},
     *         {label:"text3", value: "value3"}
     *     ];
     *
     * @param {String[]} [options.default] - The value of the choices that are selected by
     * default. Multiple default choices can only be set in JavaScript as an array.
     * @param {Boolean} [options.disabled=false] - Indicates whether to disable the view.
     * @param {String} [options.initialValue] - The initial value of the input.
     * If **default** is specified, it overrides this value.
     * @param {String} [options.labelField] - The text or search field to use as the labels
     * for the checkboxes in this group. If **labelField** is not defined, the
     * **valueField** is used as the label.
     * @param {String} [options.managerid=null] - The ID of the search manager to bind this control to.
     * @param {Object} [options.settings] - The properties of the view.
     * @param {String} [options.value] - A comma-separated list of values that are currently selected.
     * @param {String} [options.valueField] - The value, or search field to provide the
     * value, for the checkboxes in this group.
     *
     * @example
     * require([
     *     "splunkjs/mvc",
     *     "splunkjs/mvc/checkboxgroupview",
     *     "splunkjs/mvc/simplexml/ready!"
     * ], function(mvc, CheckboxGroupView) {
     *
     *     // Instantiate components
     *     new CheckboxGroupView({
     *         id: "example-checkboxgroup",
     *         default: "One, Three",
     *         el: $("#mycheckboxgroupview")
     *     }).render();
     *
     *     // Define choices
     *     var choices = [
     *         {label: "One", value: "One"},
     *         {label:" Two", value: "Two"},
     *         {label:" Three", value: "Three"}];
     *
     *     // Assign choices to the checkbox group
     *     splunkjs.mvc.Components.get("example-checkboxgroup").settings.set("choices", choices);
     * });
     */
    var CheckboxGroupView = BaseMultiChoiceView.extend(/** @lends splunkjs.mvc.CheckboxGroupView.prototype */{
        moduleId: module.id,

        className: "splunk-checkboxgroup splunk-choice-input",

        options: {
            valueField: '',
            labelField: '',
            'default': undefined,
            choices: [],
            value: undefined,
            disabled: false
        },

        getReactComponent: function() {
            return CheckboxGroup;
        }
    });

    return CheckboxGroupView;
});
