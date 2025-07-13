define(
    [
        'underscore',
        'views/Base',
        'module',
        'models/services/authentication/User',
        'models/services/search/TimeParser',
        'views/shared/controls/ControlGroup',
        'views/shared/ScheduleSentence',
        'views/shared/searchbarinput/Master',
        'views/shared/timerangepicker/dialog/advanced/timeinput/Master',
        'views/shared/controls/SyntheticSelectControl',
        'views/shared/controls/TextControl',
        'util/splunkd_utils',
        'uri/route',
        'splunk.util',
        './Settings.pcss'
    ],
    function(
        _,
        BaseView,
        module,
        UserModel,
        TimeParserModel,
        ControlGroup,
        ScheduleSentenceView,
        SearchInputView,
        TimeInputView,
        SyntheticSelectControl,
        TextControl,
        splunkd_utils,
        route,
        splunkUtil,
        css
    ) {
    return BaseView.extend({
        moduleId: module.id,
        /**
         * @param {Object} options {
         *     model: {
         *         alert: <models.search.Alert>,
         *         user: <models.services.admin.User>,
         *         application: <models.Application>,
         *         serverInfo: <models.services.server.ServerInfo>
         *     },
         *     collection: {
         *         times: <collections/services/data/ui/Times>
         *         searchBNFs: <collections/services/configs/SearchBNFs> (Optional) Only needed if the showSearchField is true
         *     },
         *     mode: <String> 'edit' | 'create'. Default 'create'
         *     showSearch: <Boolean> Whether to show the search field. Default false.
         *     showSearchField: <Boolean> Whether to show an editable search field. Default false.
         *     showAppSelector: <Boolean> Whether to show an app selector.
         * }
         */
        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);
            var defaults = {
                mode: 'create',
                showSearch: false,
                showSearchField: false,
                showAppSelector: false
            };

            _.defaults(this.options, defaults);

            if (this.options.showSearch) {
                this.children.search = new ControlGroup({
                    controlType: 'Textarea',
                    controlOptions: {
                        defaultValue: this.model.alert.entry.content.get('search'),
                        enabled: false,
                        additionalClassNames: 'uneditable-search'
                    },
                    label: _('Search').t()
                });
            }

            if (this.options.mode === 'create') {
                this.children.name = new ControlGroup({
                    controlType: 'Text',
                    controlOptions: {
                        modelAttribute: 'name',
                        model: this.model.alert.entry.content,
                        placeholder: _('Title').t()
                    },
                    label: _('Title').t()
                });

                var permissionLabel = (this.model.user.canUseApps()) ? _('Shared in App').t() : _('Shared').t();
                this.children.permission = new ControlGroup({
                    controlType: 'SyntheticRadio',
                    controlOptions: {
                        modelAttribute: 'ui.permissions',
                        model: this.model.alert.entry.content,
                        items: [
                            { label: _('Private').t(), value: splunkd_utils.USER },
                            { label: permissionLabel, value: splunkd_utils.APP }
                        ]
                    },
                    label: _('Permissions').t()
                });
            } else {
                this.children.name = new ControlGroup({
                    controlType: 'Label',
                    controlOptions: {
                        modelAttribute: 'name',
                        model: this.model.alert.entry
                    },
                    label: _('Alert').t()
                });
            }

            this.children.descriptionField = new ControlGroup({
                controlType: 'Textarea',
                controlOptions: {
                    modelAttribute: 'description',
                    model: this.model.alert.entry.content,
                    placeholder: _('Optional').t()
                },
                label: _('Description').t()
            });

            if (this.options.showSearchField) {
                this.children.searchField = new SearchInputView({
                    model: {
                        user: this.model.user,
                        content: this.model.alert.entry.content,
                        application: this.model.application
                    },
                    collection: {
                        searchBNFs: this.collection.searchBNFs
                    },
                    searchAttribute: 'search',
                    searchAssistant: (this.model.user.getSearchAssistant() === UserModel.SEARCH_ASSISTANT.FULL) ? UserModel.SEARCH_ASSISTANT.COMPACT : undefined
                });
            }

            // App selector
            if (this.options.showAppSelector){
                if (this.options.mode === 'create') {
                    this.children.selectApp = new ControlGroup({
                        label: _("App").t(),
                        controlType: 'SyntheticSelect',
                        controlOptions: {
                            modelAttribute: "app",
                            model: this.model.alert.entry.acl,
                            toggleClassName: 'btn',
                            items: [],
                            popdownOptions: {
                                detachDialog: true
                            }
                        }
                    });
                    this.setAppItems();
                }
            }

            if (this.model.user.canRTSearch()) {
                this.children.type = new ControlGroup({
                    controlType: 'SyntheticRadio',
                    controlOptions: {
                        modelAttribute: 'ui.type',
                        model: this.model.alert.entry.content,
                        items: [
                            {
                                label: _('Scheduled').t(),
                                value: 'scheduled'
                            },
                            {
                                label: _('Real-time').t(),
                                value: 'realtime'
                            }
                        ]
                    },
                    label: _('Alert type').t()
                });
            } else {
                this.children.type = new ControlGroup({
                    controlType: 'Label',
                    controlOptions: {
                        defaultValue: _('Scheduled').t()
                    },
                    label: _('Alert type').t()
                });
            }

            this.children.scheduleSentenceView = new ScheduleSentenceView({
                model: {
                    cron: this.model.alert.cron,
                    application: this.model.application
                },
                popdownOptions: {
                    attachDialogTo: '.modal:visible',
                    scrollContainer: '.modal:visible .modal-body:visible'
                }
            });

            this.model.alert.workingTimeRange.on('applied', function() {
                this.setLabel();
            }, this);

            this.children.alertExpires = new ControlGroup({
                label:_('Expires').t(),
                controlClass: 'controls-split input-append',
                controls: [
                    new TextControl({
                        ariaLabel: _('Alert Expiry Time').t(),
                        modelAttribute: 'ui.expiretime',
                        model: this.model.alert.entry.content,
                        placeholder: this.setAlertExpiresTime(this.model.alert.entry.content.get('alert.expires')),
                        useSyntheticPlaceholder: true
                    }),
                    new SyntheticSelectControl({
                        ariaLabel: _('Alert Expiry Unit').t(),
                        modelAttribute: 'ui.expiretimeunit',
                        model: this.model.alert.entry.content,
                        prompt: this.setAlertExpiresTimeUnit(this.model.alert.entry.content.get('alert.expires')),
                        items: [
                            { label: _('second(s)').t(), value: 's' },
                            { label: _('minute(s)').t(), value: 'm' },
                            { label: _('hour(s)').t(), value: 'h' },
                            { label: _('day(s)').t(), value: 'd' }
                        ],
                        toggleClassName: 'btn',
                        labelPosition: 'outside',
                        popdownOptions: {
                            attachDialogTo: '.modal:visible',
                            scrollContainer: '.modal:visible .modal-body:visible'
                        }
                    })

                ]
            });

            this.listenTo(this.model.alert.entry.content, 'change:ui.type', this.toggleScheduleSentence);
        },

        setAlertExpiresTimeUnit: function(choice){
            if(typeof choice !== 'undefined'){
                var time = choice.match(/s|m|h|d/);
                if(time && time[0]){
                    switch(time[0]){
                        case 's': return _('second(s)').t();
                        case 'd': return _('day(s)').t();
                        case 'h': return _('hour(s)').t();
                        case 'm': return _('minute(s)').t();
                    }
                }
            }
            return _('hour(s)').t();
        },

        setAlertExpiresTime: function(expires){
            if(typeof expires !== 'undefined') {
                if (expires.match(/^\d*/)) {
                    return Number(expires.match(/\d*/)[0]);
                }
            }
            return 24;
        },

        setAppItems: function(){
            var items = this.buildAppItems(),
                selectedValue = this.model.alert.entry.acl.get('app');
            if (!_.where(items, {value:selectedValue}).length) {
                if (!_.where(items, {value:'search'}).length) {
                    selectedValue = items[0].value;
                } else {
                    selectedValue = 'search';
                }
            }
            this.children.selectApp.childList[0].setItems(items);
            this.children.selectApp.childList[0].setValue(selectedValue);
        },
        buildAppItems: function(){
            var items = [];
            var filteredApps = this.collection.appLocals.listOnlyWriteableAndNonInternalApps();
            _.each(filteredApps, function(app) {
                items.push({
                    value: app.entry.get('name'),
                    label: app.getLabel() // Do not translate app names.
                });
            });
            return _.sortBy(items, function(item){
                return (item.label||'').toLowerCase();
            });
        },
        toggleScheduleSentence: function() {
            if (this.model.alert.entry.content.get('ui.type') === 'scheduled') {
                this.children.scheduleSentenceView.$el.show();
            } else {
                this.children.scheduleSentenceView.$el.hide();
            }
        },
        setLabel: function() {
            var timeLabel = this.model.alert.workingTimeRange.generateLabel(this.collection.times);
            this.$('a.timerange-control').attr('aria-label', _('Time Range').t() + ':' + timeLabel);
            this.$("span.time-label").text(timeLabel);
        },
        render: function() {
            this.$el.html(this.compiledTemplate({
                _: _
            }));
            if (this.options.showSearch) {
                this.children.search.render().appendTo(this.$el);
            }
            this.children.name.render().appendTo(this.$el);
            this.children.descriptionField.render().appendTo(this.$el);

            if (this.options.showSearchField) {
                this.$el.append('<div class="search-input"></div>');
                this.$('div.search-input').append('<div class="search-label">' + _('Search').t() + '</div>');
                this.children.searchField.render().appendTo(this.$('div.search-input'));
            }

            if (this.children.selectApp) {
                this.children.selectApp.render().appendTo(this.$el);
            }

            if (this.options.mode === 'create') {
                var isLite = this.model.serverInfo && this.model.serverInfo.isLite();
                if (this.model.alert.entry.acl.get("can_share_app") && !isLite) {
                    this.children.permission.render().appendTo(this.$el);
                }
            }
            this.children.type.render().appendTo(this.$el);
            this.children.scheduleSentenceView.render().appendTo(this.$el);
            this.children.alertExpires.render().appendTo(this.$el);
            var $customTime = this.children.scheduleSentenceView.$el.find('.custom_time');

            $customTime.prepend('<div class="control-group timerange" style="display: block;"><label class="control-label">' + _('Time Range').t() + '</label></div>');
            this.$('div.timerange').append('<div class="controls controls-fill"><a href="#" class="btn timerange-control" style="width: 100%;"><span class="time-label"></span><span class="icon-triangle-right-small"></span></a></div>');

            this.setLabel();
            this.toggleScheduleSentence();
            return this;
        },
        template: '\
            <p class="control-heading"><%- _("Settings").t() %></p>\
        '
    });
});
