define([
    "models/services/cluster/master/Status",
    "collections/SplunkDsBase"
],
function(Model, SplunkDsBaseCollection) {
    return SplunkDsBaseCollection.extend({
        url: "cluster/master/indexes/",
        model: Model,
        initialize: function() {
            SplunkDsBaseCollection.prototype.initialize.apply(this, arguments);
        }
    });
});