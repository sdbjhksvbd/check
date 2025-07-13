define(
[
    'jquery',
    'jquery.cookie',
    'models/SplunkDBase',
    'util/string_utils'
],
function(
    $,
    jqueryCookie,
    SplunkDBaseModel,
    stringutils
) {
    return SplunkDBaseModel.extend({
        allowableClientTimeSkew: 86400,
        initialize: function() {
            SplunkDBaseModel.prototype.initialize.apply(this, arguments);
        },
        isCookieEnabled: function() {
            return !!$.cookie('cval');
        },
        isCookieValid: function() {
            if (!this.isCookieEnabled()) {
                return false;
            }
            return this.entry.content.get('cval') == encodeURIComponent($.cookie('cval'));
        },
        isClientTimeSkewed: function() {
            var toffset = (new Date().getTime() / 1000) - this.entry.content.get('time');
            return Math.abs(toffset) > this.allowableClientTimeSkew;
        },
        isSessionExpired: function() {
            var location = window.location;
            if (location && location.search && location.search.indexOf("session_expired=1") != -1) {
                return true;
            }
            return false;
        },
        sync: function() {
            throw 'No REST service defined for HTTP session info, populated from login splunkd partial';
        }
    });
});
