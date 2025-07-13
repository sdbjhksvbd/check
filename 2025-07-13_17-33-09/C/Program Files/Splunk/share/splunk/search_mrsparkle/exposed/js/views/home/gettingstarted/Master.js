define([
    'jquery',
    'underscore',
    'module',
    'splunk.util',
    'views/Base',
    'views/home/gettingstarted/User',
    'views/home/gettingstarted/Admin'
],
function (
    $,
    _,
    module,
    splunkutil,
    BaseView,
    UserView,
    AdminView
) {
    return BaseView.extend({
        moduleId: module.id,
        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);
            if (this.model.user.isAdmin()) {
                this.children.content = new AdminView({
                    model:{
                        application: this.model.application,
                        user: this.model.user
                    },
                    collection: {
                        managers: this.collection.managers,
                        tours: this.collection.tours
                    }
                });
            } else {
                this.children.content = new UserView({
                    model:{
                        application: this.model.application,
                        user: this.model.user
                    },
                    collection: {
                        tours: this.collection.tours
                    }
                });
            }
        },
        events: {
            'click .toggle': function(e) {
                var showGettingStarted = splunkutil.normalizeBoolean(this.model.uiPref.entry.content.get('display.page.home.showGettingStarted'));
                this._saveUIPref(!showGettingStarted);
                if (showGettingStarted) {
                    this.hide(true);
                    e.target.setAttribute('aria-expanded', false);
                } else {
                    this.show(true);
                    e.target.setAttribute('aria-expanded', true);
                }
                e.preventDefault();
            }
        },
        _saveUIPref: function(show) {
            this.model.uiPref.entry.content.set({
                'display.page.home.showGettingStarted': show
            });
            var data = {};
            if (this.model.uiPref.isNew()) {
                data = {
                    app: this.model.application.get('app'),
                    owner: this.model.application.get('owner')
                };
            }
            this.model.uiPref.save({}, {
                data: data
            });
        },
        visibility: function(animate) {
            var showGettingStarted = splunkutil.normalizeBoolean(this.model.uiPref.entry.content.get('display.page.home.showGettingStarted'));
            if (showGettingStarted) {
                this.show(animate);
            } else {
               this.hide(animate);
            }
        },
        show: function(animate) {
            var $header = this.$('.header');
            this.$('.label-open, h3').show();
            this.$('.label-closed').hide();
            if (animate) {
                $header.slideDown({
                    duration: 225
                });
            } else {
                $header.show();
            }
        },
        hide: function(animate) {
            var $header = this.$('.header');
            this.$('.label-closed').show();
            this.$('.label-open').hide();
            if (animate) {
                $header.slideUp({
                    duration: 225
                });
            } else {
                $header.hide();
            }
        },
        render: function() {
            this.el.innerHTML = this.compiledTemplate({
                _: _,
                exploreString: splunkutil.sprintf(_("Explore %s").t(), this.model.user.serverInfo.getProductName())
            });
            this.children.content.appendTo(this.$('.header')).render();
            this.visibility(false);
            return this;
        },
        template: '\
            <div class="header">\
                <h1><%= exploreString %></h1>\
            </div>\
            <a href="#" class="toggle" aria-expanded="true"><span class="label-closed"><%= exploreString %></span><span class="label-open"><%- _("Close").t() %></span></a>\
        '
    });
});
