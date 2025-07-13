define(
    [
        'jquery',
        'underscore',
        'models/SplunkDBase',
        'util/splunkd_utils',
        'uri/route',
        'mixins/input_models'
    ],
    function (
        $,
        _,
        SplunkDBaseModel,
        splunkDUtils,
        route,
        inputMixin
    ) {
        var BaseInputModel = SplunkDBaseModel.extend({

            parse: function(response, options) {
                // make a defensive copy of response since we are going to modify it
                response = $.extend(true, {}, response);

                if (!response || !response.entry || response.entry.length === 0) {
                    return;
                }
                var newAttrs = {};

                for (var attr in response.entry[0].content) {
                    var val = response.entry[0].content[attr];
                    if (attr === 'host' && val === '$decideOnStartup') {
                        delete response.entry[0].content[attr];
                    } else if (val === null || val === '') {
                        // filter out fields with empty values
                        delete response.entry[0].content[attr];
                    } else {
                        newAttrs[this.FIELD_PREFIX + attr] = val;
                    }
                }
                this.set(newAttrs, {silent: true});

                return SplunkDBaseModel.prototype.parse.call(this, response, options);
            },

            /**
             * Check whether current input instance exists.
             * @param {string} customizedName   This argument would be used to construct validation url for checking existence of current input instance.
             *                                  If not passed or value is empty, it will use the value of ui.name to do validation.
             *                                  Child class can take advantage of this argument to construct a customized url to validate the existence.
             */
            checkInputExists: function(customizedName) {
                // Quickly lookup if a config with entered name already exists.
                // If it's new, there will be a 404 and then we can move forward. Otherwise we throw an error, as input already exists.\
                var name = customizedName || this.get('ui.name');
                if (_.isUndefined(name)) {
                     return;
                }
                var res = $.ajax({
                    type: 'GET',
                    async: false,
                    url: route.splunkdRaw(this.application.get('root'), this.application.get('locale')) + '/services/' + this.url + '/' + encodeURIComponent(name.replace(/\//g, '%2F'))
                });

                if (res.state() === 'resolved') {
                    return  _('Input with the same name already exists.').t();
                }
            },

            _onerror: function(collection, response, options) {
                // Remove 'In handler' prefix from server messages
                var messages = splunkDUtils.xhrErrorResponseParser(response, this.id);

                _.each(messages, function(msgObj) {
                    if (msgObj.message && msgObj.message.indexOf("In handler \'") > -1) {
                        msgObj.message = msgObj.message.substring( msgObj.message.indexOf("\': ")+3 );
                    }
                });

                this.trigger('serverValidated', false, this, messages);
            },

            sync: function(method, model, options) {
                // without this option the UI appends a suffix to array field names, i.e. 'logs' becomes 'logs[]'
                // which is not liked by input endpoints
                options = options || {};
                if (method === 'update' || method === 'create') {
                    options.traditional = true;
                }
                return SplunkDBaseModel.prototype.sync.call(this, method, model, options);
            },

            isArchive: function(path) {
                if (_.isUndefined(path)) {
                    return false;
                }
                var exts = ['tar', 'bz2', 'tar.gz', 'tgz', 'tbz', 'tbz2', 'zip', 'z'];
                return _.find(exts, function(ext) {
                    return new RegExp('\\.'+ext+'$').test(path.toLowerCase());
                });
            }
        });

        _.extend(BaseInputModel.prototype, inputMixin);
        return BaseInputModel;
    }
);
