/**
 * Screen for the X-Splunk-Messages-Available bit flag.
 * If the bit flag is present, request the messenger update
 * itself from the appserver.
 */

$(function(){

    $(document).bind('ajaxComplete', function(event, xhr, opts) {
        // xhr is undefined for off-site ajax requests
        if (xhr !== undefined && xhr.readyState == 4 && xhr.getResponseHeader('X-Splunk-Messages-Available')) {
            Splunk.Messenger.System.getInstance().getServerMessages();
        }
    });

});
