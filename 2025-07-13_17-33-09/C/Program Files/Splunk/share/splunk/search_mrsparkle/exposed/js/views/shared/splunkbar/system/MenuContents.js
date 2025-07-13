define([
    'jquery',
    'underscore',
    'backbone',
    'module',
    'splunk.util',
    'util/string_utils',
    'views/Base',
    'views/shared/delegates/Popdown',
    'views/shared/Button',
    './Section',
    './Modal',
    'uri/route',
    'contrib/text!./MenuContents.html',
    './MenuContents.pcssm',
    './remoteuimodal/ReactAdapter',
    './remoteuimodal/Utils'
],
function(
    $,
    _,
    Backbone,
    module,
    splunk_util,
    string_utils,
    BaseView,
    Popdown,
    ButtonView,
    Section,
    SettingsModal,
    route,
    systemMenuTemplate,
    css,
    RemoteUIModal,
    utils
){
    return BaseView.extend({
        moduleId: module.id,
        template: systemMenuTemplate,
        css: css,
        initialize: function() {
            var self = this;
            BaseView.prototype.initialize.apply(this, arguments);
            self.debouncedRender();
            this.collection.sections.on('ready', function(){
                self.debouncedRender();
            }, this);
            this.model.serverInfo.isCloud() && utils.callGetAllowExternalRemoteFlag()
            .then(function(response) {
                self.allowRemote = response;
                self.debouncedRender();
            })
            .catch(function() {
                self.allowRemote = false;
                self.debouncedRender();
            });
        },
        events: {
            'click [data-action=show-all]': 'showAllSections',
            'click [data-entry=remote_ui]': 'showRemoteUISettings',
            'keydown' : function(e) {
                var $activeElement = $(document.activeElement);
                var links = this.$el.find('a');
                for (var i = 0; i < links.length; i += 1){
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
            var root = this.model.application.get('root'),
                locale = this.model.application.get('locale'),
                app = this.model.application.get('app'),
                managementConsoleApp = this.collection.apps.findByEntryName('splunk_monitoring_console'),
                managementConsoleAvailable = (managementConsoleApp && !managementConsoleApp.entry.content.get("disabled")),
                canShowMore = this.collection.managers.canShowMore(),
                html = this.compiledTemplate({
                    userCanAddData:
                        this.model.user.canAddData() &&
                        this.collection.managers.findByEntryName('adddata'),
                    addDataURL: route.addData(root, locale, (app === 'launcher' ? undefined : app)),
                    userCanExploreData:
                        this.model.user.canExploreData() &&
                        this.collection.managers.findByEntryName('explore_data'),
                    exploreDataURL: route.exploreData(root, locale, app),
                    managementConsoleAvailable: managementConsoleAvailable,
                    managementConsoleURL: route.managementConsole(root, locale),
                    canShowMore: canShowMore,
                    css: css
                });
            var $html = $(html);
            var $body = $html.filter("[data-popdown-role=body]");

            if (canShowMore) {
                this.children.showMore = new ButtonView({label: _('Show All Settings').t(), action: 'show-all'});
                this.children.showMore.render().appendTo($html.filter('[data-popdown-role=footer]'));
            }

            this.addSections($body);

            this.$el.html($html);

            this.children.popdown = new Popdown({el:this.el, mode: 'dialog'});

            return this;
        },
        addSections: function($body){
            var self = this;
            var sectionCount = 0;
            this.collection.sections.each(function(section){
                var filteredSection = section.clone();
                if (!self.allowRemote && filteredSection.get('items')){
                    filteredSection.attributes.items = filteredSection.get("items").filter(
                        function(item) {
                            return !item.id.includes("remote_ui");
                        });
                }

                if (filteredSection.get('items') && filteredSection.get('items').length === 0) {
                    return;
                }

                var sectionView = self.children[filteredSection.get('id')] = new Section({
                    model: filteredSection
                });
                sectionCount++;
                self.sectionCount++;
                $body.append(sectionView.render().el);
            });
            this.$el.attr('data-menu-sections', sectionCount);
        },

        showRemoteUISettings: function(evt) {
            this.children.remoteUIModal = new RemoteUIModal({model: this.model});
            this.children.remoteUIModal.render();
        },

        showAllSections: function(evt) {
            this.children.dialog = new SettingsModal({
                collection: {
                    managers: this.collection.managers,
                    sections: this.collection.sections
                },
                model: {
                    application: this.model.application
                },
                onHiddenRemove: true
            });
            this.children.dialog.show();
        }
    });
});
