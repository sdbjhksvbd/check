define([
            'underscore',
            './shared_elements'
        ],
        function(
            _,
            SharedChartElements,
            SharedElements
        ) {

    return ([
        {
            id: 'xaxis',
            title: _('X-Axis').t(),
            formElements: [
                SharedChartElements.X_AXIS_TITLE,
                SharedChartElements.X_AXIS_LABEL_ROTATION,
                SharedChartElements.X_AXIS_LABEL_ELISION,
                SharedChartElements.X_AXIS_SCALE,
                SharedChartElements.X_AXIS_INTERVAL,
                SharedChartElements.X_AXIS_MIN,
                SharedChartElements.X_AXIS_MAX,
                SharedChartElements.X_AXIS_ABBREVIATION

            ]
        },
        {
            id: 'yaxis',
            title: _('Y-Axis').t(),
            formElements: [
                SharedChartElements.Y_AXIS_TITLE,
                SharedChartElements.Y_AXIS_SCALE,
                SharedChartElements.Y_AXIS_INTERVAL,
                SharedChartElements.Y_AXIS_MIN,
                SharedChartElements.Y_AXIS_MAX,
                SharedChartElements.Y_AXIS_ABBREVIATION
            ]
        },
        {
            id: 'legend',
            title: _('Legend').t(),
            formElements: [
                SharedChartElements.LEGEND_PLACEMENT,
                SharedChartElements.LEGEND_TRUNCATION
            ]
        }
    ]);

});
