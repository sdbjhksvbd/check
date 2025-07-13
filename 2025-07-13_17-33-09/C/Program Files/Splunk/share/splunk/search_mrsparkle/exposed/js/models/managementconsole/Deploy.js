/**
 * Fetch deploy status
 */
define(
    [
        'jquery',
        'underscore',
        'backbone',
        'models/managementconsole/DmcBase'
    ],
    function(
        $,
        _,
        Backbone,
        DmcBaseModel
    ) {

        return DmcBaseModel.extend({
            url: '/services/dmc/deploy',

            deploy: function() {
                return this.save({}, { url: this.url() });
            }
        });
    }
);
