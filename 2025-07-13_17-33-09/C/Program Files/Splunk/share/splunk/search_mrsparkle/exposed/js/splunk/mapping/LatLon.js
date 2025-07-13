define(function(require, exports, module) {

    var Leaflet = require("leaflet");
    var Class = require("jg/Class");

    return Class(module.id, Object, function(LatLon, base) {

        // Public Static Methods

        LatLon.fromLeaflet = function(latLng) {
            return new LatLon(latLng.lat, latLng.lng);
        };

        // Public Properties

        this.lat = 0;
        this.lon = 0;

        // Constructor

        this.constructor = function(lat, lon) {
            this.lat = (lat != null) ? +lat : 0;
            this.lon = (lon != null) ? +lon : 0;
        };

        // Public Methods

        this.normalize = function(center) {
            var lat = +this.lat;
            if (lat < -90) {
                lat = -90;
            } else if (lat > 90) {
                lat = 90;
            }

            var centerLon = center ? center.lon : 0;
            var lon = (this.lon - centerLon) % 360;
            if (lon < -180) {
                lon += 360;
            } else if (lon > 180) {
                lon -= 360;
            }
            lon += centerLon;

            return new LatLon(lat, lon);
        };

        this.isFinite = function() {
            return (((this.lat - this.lat) === 0) &&
                    ((this.lon - this.lon) === 0));
        };

        this.equals = function(latLon) {
            return ((this.lat == latLon.lat) &&
                    (this.lon == latLon.lon));
        };

        this.clone = function() {
            return new LatLon(this.lat, this.lon);
        };

        this.toString = function() {
            return "(" + (+this.lat) + "," + (+this.lon) + ")";
        };

        this.toLeaflet = function() {
            // Leaflet.LatLng wraps the coordinates passed to the constructor
            // we must assign the values manually to avoid this

            var latLng = new Leaflet.LatLng(0, 0);
            latLng.lat = +this.lat;
            latLng.lng = +this.lon;
            return latLng;
        };

    });

});
