define(
    [
        'jquery',
        'underscore',
        'contrib/text!views/shared/Paginator.html',
        'splunk.paginator',
        'module',
        'splunk.util',
        'views/Base'
    ],
    function(
        $,
        _,
        template,
        splunkPaginator,
        module,
        splunkUtil,
        BaseView
        ) {
        /**
         * @constructor
         * @memberOf views
         * @name Paginator
         * @extends {views.Base}
         * @description Paginate twice it's a long way to the bay!
         */
        return BaseView.extend( /** @lends views.Paginator.prototype */{
            className: 'pagination pull-right',
            template: template,
            moduleId: module.id,
            /**
             * @param {Object} options
             * @param {model.Base} options.model
             */
            initialize: function(options) {
                BaseView.prototype.initialize.call(this, options);
                this.activate();
            },
            _onLengthChange: function() {
                this.model.set('offset', 0);
            },
            startListening: function() {
                this.model.on('change:offset change:count change:length', this.debouncedRender, this);
                this.model.on('change:length', this._onLengthChange, this);
            },
            events: {
                'click li:not(.disabled) a': function(e) {
                    this.model.set('offset', parseInt($(e.currentTarget).closest('a').attr('data-offset'), 10));
                    e.preventDefault();
                }
            },
            render: function() {
                var length = this.model.get('length') || 0;

                var options = {
                        max_items_page: this.model.get('count') || 10,
                        max_pages: 10,
                        item_offset: this.model.get('offset') || 0
                    },
                    paginator = new splunkPaginator.Google(length || 0, options),
                    template = this.compiledTemplate({
                        paginator: paginator,
                        _: _,
                        sprintf: splunkUtil.sprintf
                    });
                this.$el.html(template);
                return this;
            }
        });
    }
);
