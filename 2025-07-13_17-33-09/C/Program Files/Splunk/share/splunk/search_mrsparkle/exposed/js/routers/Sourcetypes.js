/**
 * This the router for the Sourcetypes manager page
 */

define(
    [
        'jquery',
        'underscore',
        'backbone',
        'routers/Base',
        'views/sourcetypes/PageController'
    ],
    function(
        $,
        _,
        Backbone,
        BaseRouter,
        PageController
        ) {
        return BaseRouter.extend({

            initialize: function(options) {
                BaseRouter.prototype.initialize.apply(this, arguments);
                this.enableAppBar = false;
                this.fetchAppLocals = true;
                this.fetchServerInfo = true;
                this.isSingleInstanceCloud = _.isObject(options) ? !!options.isSingleInstanceCloud : false;

                // The controller model is passed down to all subviews and serves as the event bus for messages between
                // the controller and views.
                this.model.controller = new Backbone.Model();
            },

            page: function(locale, app, page) {
                BaseRouter.prototype.page.apply(this, arguments);

                this.setPageTitle(_('Source Types').t());

                $.when(this.deferreds.pageViewRendered).done(_(function() {
                    $('.preload').replaceWith(this.pageView.el);

                    if (this.pageController) {
                        this.pageController.detach();
                    }
                    this.pageController = new PageController({
                        model: this.model,
                        collection: this.collection,
                        isSingleInstanceCloud: this.isSingleInstanceCloud
                    });
                    this.pageView.$('.main-section-body').append(this.pageController.render().el);
                }).bind(this));
            }
        });
    }
);
