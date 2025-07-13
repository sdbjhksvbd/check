/**
 * Message twice it's a long way to the bay!
 */
Splunk.Module.Message = $.klass(Splunk.Module, {
    EXCLUDE_LEVELS: [],
    /**
     * Define regex used to convert a mediawiki-style link token to a proper <a href> tag.  The basic pattern is:
     * [<external_link> <label>]
     * [[<internal_link>|<label>]]
     *
     * The target window can be specified by prefixing a (!):
     * [!<external_link> <label>]
     * [[!<internal_link>|<label>]]
     *
     * Example:
     * [http://www.google.com Google Search]
     * [[/manager/settings|Edit server settings]]
     *
     * TODO: If this ever needs more wiki syntax, we'll have to move to a proper tokenizer; this is just quick and dirty.
     */
    EXTERNAL_LINK_REX: /\[(\!?)(\w+\:\/\/[^\s]+)\s+([^\]]+)\]/g,
    INTERNAL_LINK_REX: /\[\[(\!?)([^\|]+)\|([^\]]+)\]\]/g,
    TARGET_BLANK_TOKEN_REX: /#~#!#~#/g,
    TARGET_SAME_TOKEN_REX: /\s*#~##~#/g,
    SERVER_DELETE_RESOURCE: Splunk.util.make_url("/api/messages/delete"),
    /**
     * Constructor
     */
    initialize: function($super, container){
        $super(container);
        this.logger = Splunk.Logger.getLogger("message.js");
        this.displayedMessages = [];
        this.allMessages = [];

        // For the main header message bar, Display as many as 3 messages, and show option for viewing all messages
        if (this._params['filter'] == "*") {
            this.maxQueueSize = 20;
            this.defaultDisplaySize = 3;
        } else {
            //Default behavior for all other message bars is to only show the number of messages given by maxSize.  No "show all" button.
            this.maxSize = parseInt(this._params['maxSize'], 10);
            this.defaultDisplaySize = this.maxSize;
            this.maxQueueSize = this.maxSize;
        }

        this.selectedDisplaySize = this.defaultDisplaySize;
        this.clearOnJobDispatch = Splunk.util.normalizeBoolean(this._params['clearOnJobDispatch']);
        this.defaults = this._params['default'] || [];
        this.filter = this._params['filter'];
        this.displaySystemMessages = Splunk.util.normalizeBoolean(this._params['displaySystemMessages']);
        this.levels = {};

        /*jsl:ignore*/
        // this switch block triggers the 'default not at end' warning
        switch ( (""+this._params['level']).toLowerCase()) {
            case '*':
                this.levels = null;

            break;
            default:
            case 'debug':
                this.levels['debug'] = 1;
            case 'info':
                this.levels['info'] = 1;
            case 'warn':
                this.levels['warn'] = 1;
            case 'error':
                this.levels['error'] = 1;
            case 'fatal':
                this.levels['fatal'] = 1;
        }
        /*jsl:end*/

        this.list = $(".MessageList", this.container);
        var self = this;

        // Handler for removing messages
        $("a.remove", this.container).on('click',  function() {
            var message_id = $(this).attr("data-id");
            if ($(this).hasClass("splunkd")){
               $.ajax({
                  type: "POST",
                  url: self.SERVER_DELETE_RESOURCE,
                  dataType: "text",
                  data: "message_id="+message_id,
                  error: function () {self.onMessageDeleted(message_id);  },
                  success: function () { self.onMessageDeleted(message_id); }
               });
            } else {
                self.onMessageDeleted(message_id);
            }
            return false;
        });

        //Handler for viewing all hidden messages
        $("a.showall", this.container).on('click', function() {
            self.onShowAll();
        });

        //Handler for hiding messages
        $("a.hide", this.container).on('click', function() {
            self.onHide();
        });


        this.messenger = Splunk.Messenger.System.getInstance();
        this.messenger.receive(this.filter, this.unshift.bind(this), undefined, true);//Listen to all including control messages

        this.sendDefaults();//Send default configured messages to the UI.
        if(this.clearOnJobDispatch){
            $(document).bind('jobDispatched', this.onJobDispatched.bind(this));
        }
        $(document).trigger("messageLoad", this.container);
    },
    /**
     * Show an alert if the delete post request fails
     *
     */
     onServerMessagesError: function(data){
         alert("Could not delete message: ");
     },
    /**
     * Clear all message list elements from the DOM.
     *
     * @param {Array} arguments[0] Optional array of levels to exclude from clear process.
     */
    clear: function(){
        var levels = arguments[0] || [];
        var allMessages = [];
        this.logger.warn("Clearing messages with the exclusion of levels", levels);
        for(var i=0; i<this.allMessages.length; i++){
            var message = this.allMessages[i];
            if($.inArray(message.level, levels)!=-1){
                allMessages.push(message);
            }
        }
        this.allMessages = allMessages;
        this.displayedMessages = this.allMessages.slice(0, this.selectedDisplaySize);
        this.getHTMLTransform();
        $(document).trigger("messageClear", this.container);
    },
    /**
     * Simple handler for control messages.
     *
     * @param {Object} message Standard messenger message object ({level:String, content:String, className:String, date:String}).
     */
    handleControlMessage: function(message) {
        switch(message.content) {
            case 'CLEAR':
                this.clear();
                break;
            default:
                break;
        }
    },
    /**
     * Triggered when a module receives a new job dispatched.
     *
     * @param {Object} event A jquery event.
     */
    onJobDispatched: function(event, context){
        this.clear(this.EXCLUDE_LEVELS);
    },
    /**
     * Generate the HTML content for display.
     *
     * @type String
     * @return An HTML formatted string of all messages.
     */
    getHTMLTransform: function(){
        var html = [];
        var that = this;
        require(['util/htmlcleaner'], function(Htmlcleaner){
            for(var i = 0; i < that.displayedMessages.length; i++) {
                var message = that.displayedMessages[i];

                html.push('<li class="message">');
                html.push('<div style="float:left;display:inline-flex">');
                if (message.level == 'error') {
                    html.push('<svg style="fill:#dc4e41;padding-right:16px" focusable="false" height="24px" width="24px" viewBox="0 0 1375 1500" aria-hidden="false" preserveAspectRatio="xMidYMid" xmlns="http://www.w3.org/2000/svg" class="inline_SVG_d13579264976c537_847fc6 main_SVG_d13579264976c537_847fc6"><title>Error</title><path d="M187.5 61.5h1000c103.553 0 187.5 83.947 187.5 187.5v1000c0 103.553-83.947 187.5-187.5 187.5h-1000C83.947 1436.5 0 1352.553 0 1249V249C0 145.447 83.947 61.5 187.5 61.5zm400.79 413.083l32.145 257.167c4.908 39.264 34.086 74.685 69.815 91.187 36.612-16.018 64.87-50.826 69.914-91.187l32.146-257.167C799.18 419.623 759.582 374 703.7 374h-26.8c-55.908 0-95.555 45.033-88.61 100.583zm101.293 644.209c63.283 0 114.584-51.301 114.584-114.584 0-63.282-51.301-114.583-114.584-114.583-63.282 0-114.583 51.3-114.583 114.583s51.3 114.584 114.583 114.584z"></path></svg>');
                }
                html.push('<span style="padding-top:3px">');
                html.push(Htmlcleaner.clean(that.getWikiTranform(message.content)));
                html.push('</span>');
                html.push('</div>');

                // Only removable splunkd messages will have a non-numeric message id.
                var myClass = '';
                if (isNaN(message.id)) {
                    myClass = 'splunkd';
                    html.push('<div style="float:right"><a href="#" data-id="'+Splunk.util.escapeHtml(message.id)+'" class="remove '+myClass+'">x</a></div>');
                }

                var dataId = Splunk.util.escapeHtml(message.id || "");

                html.push('<div style="clear:both"/>');
                html.push('</li>');
            }

            // show link to view all hidden messages
            var numhiddenmessages = that.allMessages.length-that.selectedDisplaySize;
            if (numhiddenmessages > 0){
                var content = "" + numhiddenmessages + _(" messages not shown.");
                html.push('<li class="info">');
                html.push(this.getWikiTranform(content));
                html.push('<a href="#" class="showall">' +  _(" Show all ") + '</a>');
                html.push('</li>');
            }

            // If user is viewing all messages, show a link to hide the messages
            if (that.selectedDisplaySize == that.maxQueueSize && that.allMessages.length > that.defaultDisplaySize) {
            html.push('<li class="info"> <a href="#" class="hide">' + _("Hide messages") + '</a> </li>');
            }

            // Explicitly set the html here because this function runs asynchronously and may display nothing if the 
            // Htmlcleaner module has not loaded yet
            that.list.html(html.join(''));
        });
    },
    /**
     * Transform a string against wiki formatting rules.
     *
     * @param {String} str The string to format.
     *
     * @type String
     * @return A HTML formatted string.
     */
    getWikiTranform: function(str){
        var text = Splunk.util.escapeHtml(str);
        // we tokenize the conditional '!' prefix and replace it after
        text = text.replace(this.EXTERNAL_LINK_REX, '<a href="$2" #~#$1#~#>$3</a>');
        text = text.replace(this.INTERNAL_LINK_REX, this._generateInternalLink);
        text = text.replace(this.TARGET_BLANK_TOKEN_REX, 'target="_blank" rel="noopener noreferrer"');
        text = text.replace(this.TARGET_SAME_TOKEN_REX, '');
        return text;
     },

     _generateInternalLink: function(str, blank_token, url, text) {
        url = Splunk.util.make_url(url);
        return '<a href="'+url+'"#~#'+blank_token+'#~#>'+text+'</a>';
     },

    /**
     * Send default configured messages to the UI.
     */
    sendDefaults: function(){
        for(var i=0; i<this.defaults.length; i++){
            var level = this.defaults[i].level || null;
            var content = this.defaults[i].content || null;
            var className = this.defaults[i].className || null;
            if(level && content && className){
                this.messenger.send(level, className, content);
            }else{
                this.logger.error("Invalid default settings for entry with level:", level, "content:", content, "className:", className);
            }
        }
    },
    /**
     * Removes the message with the given message_id from the message list
     */
     onMessageDeleted: function(message_id){
         for(var j=0; j<this.allMessages.length; j++){
             var id  = this.allMessages[j].id;
             if(message_id==id){
                 this.allMessages.splice(j, 1);
                 j--;
             }
         }


         this.displayedMessages = this.allMessages.slice(0, this.selectedDisplaySize);
         this.getHTMLTransform();
         $(document).trigger("messageUnshift", this.container);
    },
    /**
     * Shows all messages
     */
    onShowAll: function(){
         this.selectedDisplaySize = this.maxQueueSize;
         this.displayedMessages = this.allMessages.slice(0, this.selectedDisplaySize);
         this.getHTMLTransform();
         $(document).trigger("messageUnshift", this.container);
    },
    /**
     * Shows all messages
     */
    onHide: function(){
         this.selectedDisplaySize = this.defaultDisplaySize;
         this.displayedMessages = this.allMessages.slice(0, this.selectedDisplaySize);
         this.getHTMLTransform();
         $(document).trigger("messageUnshift", this.container);
    },
    /**
     * Adds one or more messages to the beginning of an ordered list and
     * returns the new length (behaves like the Array unshift method).
     *
     * @param {Arguments} arguments.length>0 Optional message objects to be added to the display ({level:String, content:String, className:String, date:String}).
     *
     * @type Number
     * @return The new length of messages.
     */
    unshift: function(){
        var previousMessages = [].concat(this.allMessages);
        for(var i=arguments.length-1; i>-1; i--){
            var message = arguments[i];
            if(message.control){
                this.handleControlMessage(message);
                continue;
            }
            if(this.levels && !(message.level.toLowerCase() in this.levels)) {
                continue;
            }
            if(!this.displaySystemMessages && message.id && message.id.indexOf("/services/messages") !== -1) {
                continue;
            }

            for(var j=0; j<this.allMessages.length; j++){
                var content = this.allMessages[j].content;
                var level = this.allMessages[j].level;
                if(message.content==content && message.level==level){
                    this.allMessages.splice(j, 1);
                    j--;
                }
            }
            this.allMessages = [{level: message.level, content: message.content, id: message.id}].concat(this.allMessages);
        }

        this.allMessages.splice(this.maxQueueSize, this.allMessages.length-this.maxQueueSize);
        this.displayedMessages = this.allMessages.slice(0, this.selectedDisplaySize);

        if(!Splunk.util.objectSimilarity(previousMessages, this.displayedMessages)){
            this.getHTMLTransform();
            $(document).trigger("messageUnshift", this.container);
        }
        return $("li", this.list).length;
    }
});
