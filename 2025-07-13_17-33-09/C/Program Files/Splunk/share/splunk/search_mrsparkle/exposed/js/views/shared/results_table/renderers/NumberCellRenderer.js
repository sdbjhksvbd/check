define(function(require, exports, module) {

    var _ = require("underscore");
    var ResultsTableRow = require("../ResultsTableRow");
    var BaseCellRenderer = require("./BaseCellRenderer");
    var Color = require("jg/graphics/Color");
    var css = require('./NumberCellRenderer.pcssm');

    return BaseCellRenderer.extend({

        canRender: function(cellData) {
            return (cellData.columnType === "number");
        },

        setup: function($td, cellData) {
            $td.addClass("numeric");
        },

        teardown: function($td, cellData) {
            $td.removeClass("numeric color-formatted");
        },

        render: function($td, cellData) {
            cellData = _.extend({
                floatValue: parseFloat(cellData.value),
                heatValue: (cellData.dataOverlay === "heatmap") ?
                    (cellData.heatRange === 0 ? 0 : (Math.min(Math.max(Math.ceil(((cellData.value - cellData.heatOffset) / cellData.heatRange) * 1000) / 1000, 0), 1))) :
                    null,
                MV_SUBCELL_CLASSNAME: ResultsTableRow.MV_SUBCELL_CLASSNAME,
                MV_INDEX_ATTR: ResultsTableRow.MV_INDEX_ATTR
            }, cellData);

            var backgroundColor = null;
            if (cellData.dataOverlay === "heatmap" && !_.isNaN(cellData.heatValue)) {
                backgroundColor = Color.interpolate(
                    Color.fromString(css.tableOverlayHeatmapFromColor),
                    Color.fromString(css.tableOverlayHeatmapToColor),
                    cellData.heatValue
                );
            } else if (cellData.dataOverlay === "highlow") {
                if (cellData.floatValue === cellData.extremes.min) {
                    backgroundColor = Color.fromString(css.tableOverlayHighLowMinColor);
                } else if (cellData.floatValue === cellData.extremes.max) {
                    backgroundColor = Color.fromString(css.tableOverlayHighLowMaxColor);
                }
            }

            var foregroundColor = null;
            if (backgroundColor) {
                foregroundColor = Color.fromString("#000000");
                $td.addClass("color-formatted");
            } else {
                $td.removeClass("color-formatted");
            }

            $td.css({
                "color": foregroundColor ? foregroundColor.toString("hex") : "",
                "background-color": backgroundColor ? backgroundColor.toString("hex") : ""
            });

            $td.html(_.template(this.template, cellData));
        },

        template: '<% if (_.isArray(value)) { %><% _(value).each(function(subValue, i) { %><div class="<%- MV_SUBCELL_CLASSNAME %>" <%- MV_INDEX_ATTR %>="<%- i %>"><%- subValue %></div><% }) %><% } else { %><%- value %><% } %>'
    });

});
