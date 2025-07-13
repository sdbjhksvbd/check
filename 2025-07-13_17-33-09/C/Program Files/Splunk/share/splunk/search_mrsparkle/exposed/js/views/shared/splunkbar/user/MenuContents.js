define([
    'jquery',
    'underscore',
    'module',
    'views/Base',
    'views/shared/preferences/Master',
    'contrib/text!./MenuContents.html',
    './MenuContents.pcssm',
    'uri/route',
    'splunk.util'
],
function(
    $,
    _,
    module,
    BaseView,
    PreferencesDialogView,
    template,
    css,
    route,
    splunk_util
){
    return BaseView.extend({
        moduleId: module.id,
        template: template,
        tagName: 'ul',
        css: css,
        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);
            this.model.user.on('change', this.render, this);
            this.model.webConf.on('change reset', this.render, this);
            if (this.model.user.entry.get('name')) {
                this.render();
            }
        },
        events: {
            "click .link-preferences" : function(e) {
                e.preventDefault();
                this.children.preferencesDialog = new PreferencesDialogView({
                    model: {
                        user: this.model.user,
                        application: this.model.application,
                        serverInfo: this.model.serverInfo
                    },
                    collection: {
                        appsVisible: this.collection.appsVisible
                    },
                    showAppSelection: !this.model.serverInfo.isLite()
                });
                this.children.preferencesDialog.render().appendTo($("body"));
                this.trigger('close');
            },
            "keydown" : function(e) {
                var $activeElement = $(document.activeElement);
                var links = this.$el.find('a');
                for (var i = 0; i < links.length; i += 1) {
                    if ($activeElement[0] === links[i]) {
                        if (e.keyCode === 40) {
                            // Case if [down arrow]
                            links.eq((i + 1) % links.length).focus();
                        } else if (e.keyCode === 38) {
                            // Case if [up arrow]
                            links.eq(((i - 1) + links.length) % links.length).focus();
                        } else if (e.keyCode === 9) {
                            // Case if [tab] and first or last element
                            if ((i === links.length - 1 && !e.shiftKey) ||
                                (i === 0 && e.shiftKey)) {
                                this.trigger('close');
                            }
                        }
                        return;
                    }
                }
            }
        },
        render: function() {
            var rootUrl = this.model.application.get('root'),
                locale = this.model.application.get('locale'),
                isLite = this.model.serverInfo.isLite(),
                userName =  this.model.user.entry.get('name'),
                accountLink = route.manager(
                    rootUrl,
                    locale,
                    this.model.application.get('app'),
                    [
                        'authentication',
                        'changepassword'
                    ]
                ),
				
                accountLinkLite = route.manager(
                    rootUrl,
                    locale,
                    this.model.application.get('app'),
                    [
                        'authentication',
                        'users'
                    ]
                ),
                logoutLink = this.model.config.get('SSO_CREATED_SESSION') ? null : route.logout(rootUrl, locale),
                showUserMenuProfile = this.model.serverInfo.isCloud() &&
                    splunk_util.normalizeBoolean(this.model.webConf.entry.content.get('showUserMenuProfile')),
                html = this.compiledTemplate({
                    userName: userName,
                    accountLink: (isLite) ? accountLinkLite : accountLink,
                    logoutLink: logoutLink,
                    showUserMenuProfile: showUserMenuProfile,
                    productMenuUriPrefix: this.model.webConf.entry.content.get('productMenuUriPrefix') || '',
                    isCloud: this.model.serverInfo.isCloud(),
                    isLite: isLite,
                    css: css,
                    showUserSettings: this.model.user.entry.content.get("type") === "Splunk",
                });

            this.$el.html(html);
            return this;
        }
    });
});
