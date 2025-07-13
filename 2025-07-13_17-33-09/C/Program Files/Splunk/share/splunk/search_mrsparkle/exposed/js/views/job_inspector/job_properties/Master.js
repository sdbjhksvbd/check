define(
    [
        'jquery',
        'underscore',
        'module',
        'views/Base',
        'views/job_inspector/job_properties/Row',
        'views/shared/delegates/Accordion',
        'uri/route',
        'splunk.i18n',
        'core-js/es6/set'
    ],
    function(
        $,
        _,
        module,
        Base,
        JobPropertyRow,
        Accordion,
        route,
        i18n,
        Set
    ){
        /**
         * @constructor
         * @memberOf views
         * @name SearchJobPropertiesView
         * @description
         * @extends {Base}
         */
        return Base.extend(/** @lends views.Base.prototype */{
            moduleId: module.id,
            className: "job-properties accordion",
            /**
             * @param {Object} options {
             *      model: {
             *          searchJob: <model.search.job>
             *          savedSearch: <model.services.saved.Search>
             *          application: <model.shared.application>
             *      }
             * }
             */
            initialize: function() {
                Base.prototype.initialize.apply(this, arguments);

                this.remoteSearchLogs = this.getRemoteLogs('remoteSearchLogs');
                this.remoteDFSLogs = this.getRemoteLogs('remoteDFSLogs');
                this.peerNameList = this.getRemotePeers(this.remoteSearchLogs);
                this.dfsPeerNameList = this.getRemotePeers(this.remoteDFSLogs);
            },

            /**
             * Private helper function to extract remote logs.
             * @returns {Array} remoteLogs - Array of remote log file names.
             */
            getRemoteLogs : function (key) {
                var remoteLogs = [];
                // Construct remoteLogs if search job model contains remoteSearchLogs.
                if ((this.model.searchJob.entry.content.get(key)) &&
                    (this.model.searchJob.entry.content.get(key).length > 0) &&
                    (_.isString(this.model.searchJob.entry.content.get(key)[0]))
                ) {
                    remoteLogs = this.model.searchJob.entry.content.get(key)[0].split('\n');
                }

                return remoteLogs;
            },

            /**
             * Private helper function to extract peers.
             * @returns {Array} peerNameList - Array of peer names.
             */
            getRemotePeers : function (logs) {
                var peerNameList = [];
                // Construct peerNameList if search job model contains remoteSearchLogs.
                if (logs.length > 0) {
                    var uniqueNames = new Set();
                    _.each(logs, function(filename) {
                        var peerName = filename.split("-").slice(1).join("-");
                        uniqueNames.add(peerName);
                    });
                    peerNameList = Array.from(uniqueNames);
                }

                return peerNameList;
            },

            /**
             * Private helper function to combine the given model and additional properties and sort them.
             * @returns {Array} sortedJobProps - Array of objects(job properties) sorted by key.
             */
            generateSortedJobProperties: function (model, additionalProps) {
                var sortedJobProps = [],
                    unsortedJobProps = _.extend({}, model.entry.content.attributes, {'eai:acl': model.entry.acl}, additionalProps);

                if (unsortedJobProps.hasOwnProperty('messages')) {
                    // Messages are already displayed in the job overview section. It can be removed from job properties.
                    delete unsortedJobProps.messages;
                }

                if (_.isEmpty(unsortedJobProps.custom)) {
                    // If custom is empty, don't display in on the Job Properties section.
                    delete unsortedJobProps.custom;
                }

                _.each(unsortedJobProps, function(value, prop) {
                    sortedJobProps.push({key : prop, value: value });
                });

                sortedJobProps = _.sortBy(sortedJobProps, 'key');

                return sortedJobProps;
            },

            /**
             * Private helper function for the view template to call the route function.
             * @param {String} page - search.log or search.log.#.
             * @param {String} options - query strings.
             * @return {String} url - url for the search log.
             */
            searchLogUrl : function(page, options) {
                return route.searchJobUrls(this.model.application.get('root'),
                    this.model.application.get('locale'),
                    this.model.searchJob.id,
                    page,
                    options);
            },

            render: function() {
                var additionalSearchJobProps,
                    hasSavedSearch = !this.model.savedSearch.isNew();

                this.$el.html(this.compiledTemplate({
                    i18n: i18n,
                    hasSavedSearch : hasSavedSearch,
                    searchJob: this.model.searchJob,
                    timelineLink: route.searchJobTimeline(this.model.application.get('root'),
                        this.model.application.get('locale'),
                        this.model.searchJob.id,
                        {data: {outputMode: 'xml'}}),
                    summaryLink: route.searchJobSummary(this.model.application.get('root'),
                        this.model.application.get('locale'),
                        this.model.searchJob.id,
                        {data: {outputMode: 'xml'}}),
                    searchLogLink: this.searchLogUrl.bind(this),
                    remoteSearchLogs: this.remoteSearchLogs ? this.remoteSearchLogs : [],
                    remoteDFSLogs: this.remoteDFSLogs ? this.remoteDFSLogs : []
                }));

                if (hasSavedSearch) {
                    //Construct additional props for the saved search props
                    var additionalSavedSearchProperties = {
                        'eai:attributes': this.model.savedSearch.entry.fields
                    },
                    $savedSearchTableBody = this.$(".saved-search-properties > .accordion-body > table > tbody");
                    //combine, sort and render saved search props
                    this.renderPropertyRows(this.generateSortedJobProperties(this.model.savedSearch, additionalSavedSearchProperties),
                        $savedSearchTableBody);
                }

                additionalSearchJobProps = { //Construct additional props for the search job properties.
                    createTime: this.model.searchJob.entry.attributes.published,
                    custom: this.model.searchJob.entry.content.custom.attributes,
                    modifiedTime: this.model.searchJob.entry.attributes.updated,
                    request: this.model.searchJob.entry.content.request.attributes,
                    runtime: this.model.searchJob.entry.content.runtime.attributes,
                    search: this.model.searchJob.getSearch()
                };

                //add peerNameList if present.
                if (this.peerNameList && this.peerNameList.length > 0) {
                    additionalSearchJobProps['peerNameList'] = this.peerNameList;
                }

                //add dfsPeerNameList if present.
                if (this.dfsPeerNameList && this.dfsPeerNameList.length > 0) {
                    additionalSearchJobProps['dfsPeerNameList'] = this.dfsPeerNameList;
                }

                //combine, sort and render search job props.
                var $searchPropertiesTableBody = this.$(".search-job-properties > .accordion-body > table > tbody");
                this.renderPropertyRows(this.generateSortedJobProperties(this.model.searchJob, additionalSearchJobProps),
                    $searchPropertiesTableBody);

                this.accordion = new Accordion({
                    el: this.el,
                    collapsible: true,
                    defaultGroup: ""
                });

                return this;
            },

            /**
             * Private function to render the row for the individual Job Properties.
             * @param {Array} props - Array of sorted Job Properties.
             * @param {jQuery element} $tableBody - jQuery element for the table body to which the rows get appended.
             */
            renderPropertyRows: function(props, $tableBody) {
                var fragment = document.createDocumentFragment();
                _.each(props, function(prop, index) {
                    var rowId = 'row' + index;
                    this.children[rowId] = new JobPropertyRow({
                        prop: prop
                    });
                    this.children[rowId].render().appendTo(fragment);
                }.bind(this));
                $tableBody.prepend(fragment);
            },

            template: '\
                <% if(hasSavedSearch) { %>\
                    <div class="saved-search-properties accordion-group">\
                        <div class="accordion-heading">\
                            <a class="accordion-toggle" href="#">\
                                <i class="icon-accordion-toggle"></i>\
                                <%- _("Saved search properties").t() %>\
                            </a>\
                        </div>\
                        <div class="accordion-body">\
                            <table>\
                                <tbody></tbody>\
                            </table>\
                        </div>\
                    </div>\
                <% } %>\
                <div class="search-job-properties accordion-group">\
                    <div class="accordion-heading">\
                        <a class="accordion-toggle" href="#">\
                            <i class="icon-accordion-toggle"></i>\
                            <%- _("Search job properties").t() %>\
                        </a>\
                    </div>\
                    <div class="accordion-body">\
                        <table>\
                            <tbody>\
                                <tr class="additional-links">\
                                    <td class="job-prop-name" tabindex="0"><%- _("Additional info").t() %></td>\
                                    <td class="job-prop-value">\
                                        <% if(searchJob.isTimelineAvailable()) { %>\
                                            <a href="<%- timelineLink %>"><%- _("timeline").t() %></a>\
                                        <% } %>\
                                        <% if(searchJob.isSummaryAvailable()) { %>\
                                            <a href="<%- summaryLink %>"><%- _("field summary").t() %></a>\
                                        <% } %>\
                                        <% _.each(searchJob.getAvailableSearchLogs(), function(link) { %>\
                                            <div>\
                                            <% if(link.indexOf("search.log") !== -1) { %>\
                                                <a class="search-log" href="<%- searchLogLink(link, {data: {outputMode:"raw"}}) %>">\
                                                    <%- link %>\
                                                </a>\
                                                <% if(remoteSearchLogs.length > 0) { %>\
                                                    <span>(</span>\
                                                        <% _.each(remoteSearchLogs, function(peerName) { %>\
                                                            <a class="peer-link" href="<%- searchLogLink(link, {data: {peer: peerName, outputMode:"raw"}}) %>">\
                                                                <%- peerName %>\
                                                            </a>\
                                                        <% }) %>\
                                                    <span>)</span>\
                                                <% } %>\
                                            <% } %>\
                                            <% if(link.indexOf("dfs.log") !== -1) { %>\
                                                <a class="dfs-log" href="<%- searchLogLink(link, {data: {outputMode:"raw"}}) %>">\
                                                    <%- link %>\
                                                </a>\
                                                <% if(remoteDFSLogs.length > 0) { %>\
                                                    <span>(</span>\
                                                        <% _.each(remoteDFSLogs, function(peerName) { %>\
                                                            <a class="peer-link" href="<%- searchLogLink(link, {data: {peer: peerName, outputMode:"raw"}}) %>">\
                                                                <%- peerName %>\
                                                            </a>\
                                                        <% }) %>\
                                                    <span>)</span>\
                                                <% } %>\
                                            <% } %>\
                                            </div>\
                                        <% }) %>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>\
                    </div>\
                </div>\
            '
        });
    }
);
