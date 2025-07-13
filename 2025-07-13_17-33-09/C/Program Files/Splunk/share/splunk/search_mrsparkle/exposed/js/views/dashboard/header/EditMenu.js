define(
    [
        'module',
        'jquery',
        'underscore',
        '../Base',
        'views/shared/PopTart',
        'util/pdf_utils',
        './ExportMenu',
        './EditMenu.pcssm'
    ],
    function (module,
        $,
        _,
        BaseDashboardView,
        PopTartView,
        PDFUtils,
        ExportMenu,
        css) {

        var defaults = {
            button: true,
            showOpenActions: true,
            deleteRedirect: false
        };

        var OtherMenu = PopTartView.extend({
            className: 'dropdown-menu other-menu',
            initialize: function () {
                PopTartView.prototype.initialize.apply(this, arguments);
                _.defaults(this.options, defaults);
                this._menuModel = {
                    allowEditPermission: this.model.view.entry.acl.get('can_change_perms') && this.model.view.entry.acl.canWrite(),
                    allowClone: !this.model.view.isHTML() || this.model.user.canEditViewHtml(),
                    allowMakeHome: !this.model.serverInfo.isLite() && this.model.view.isSimpleXML() && !(this.model.userPref.entry.content.get('display.page.home.dashboardId') === this.model.view.get('id')),
                    allowDelete: this.model.view.entry.acl.canWrite() && this.model.view.entry.acl.get('removable'),
                    convertToV2DisplayName: _("Clone in Dashboard Studio").t()
                };
            },
            events: {
                'click a.edit-perms': function (e) {
                    e.preventDefault();
                    this._triggerControllerEvent('action:edit-permission');
                },
                'click a.clone': function (e) {
                    e.preventDefault();
                    this._triggerControllerEvent('action:clone');
                },
                'click a.make-home': function (e) {
                    e.preventDefault();
                    this._triggerControllerEvent('action:make-home');
                },
                'click a.delete': function (e) {
                    e.preventDefault();
                    this._triggerControllerEvent('action:delete');
                },
                'click a.convert-to-v2': function (e) {
                    e.preventDefault();
                    this._triggerControllerEvent('action:open-in-v2');
                },
            },
            _triggerControllerEvent: function () {
                this.model.controller.trigger.apply(this.model.controller, arguments);
                this.hide();
            },
            render: function () {
                this.$el.html(PopTartView.prototype.template_menu);
                this.$el.append(this.compiledTemplate(this._menuModel));
                return this;
            },
            isEmpty: function () {
                return !_.some(_.values(this._menuModel));
            },
            template: '\
                    <ul class="first-group">\
                        <% if (allowClone) { %>\
                        <li><a href="#" class="clone"><%- _("Clone").t() %></a></li>\
                        <% } %>\
                        <li><a href="#" class="convert-to-v2"><%- convertToV2DisplayName %>\
                            <p class="new-label ' + css.newLabel + '"><%- _("NEW").t() %></p>\
                            </a>\
                            </li>\
                    </ul>\
                    <ul class="second-group">\
                        <% if(allowEditPermission) { %>\
                        <li><a href="#" class="edit-perms"><%- _("Edit Permissions").t() %></a></li>\
                        <% } %>\
                        <% if (allowMakeHome) { %>\
                        <li><a href="#" class="make-home"><%- _("Set as Home Dashboard").t() %></a></li>\
                        <% } %>\
                    </ul>\
                    <ul class="third-group ' + css.thirdGroup + '">\
                        <% if(allowDelete) { %>\
                        <li><a href="#" class="delete"><%- _("Delete").t() %></a></li>\
                        <% } %>\
                    </ul>\
            '
        });

        return BaseDashboardView.extend({
            moduleId: module.id,
            viewOptions: {
                register: false
            },
            className: 'dashboard-menu pull-right',
            initialize: function () {
                BaseDashboardView.prototype.initialize.apply(this, arguments);
            },
            events: {
                'click a.edit-btn': function (e) {
                    e.preventDefault();
                    this.model.controller.trigger('mode:edit');
                },
                'click a.edit-other': function (e) {
                    e.preventDefault();
                    this.children.otherMenu = new OtherMenu({
                        model: this.model,
                        collection: this.collection,
                    });
                    this.children.otherMenu.once('hide', this.children.otherMenu.remove);
                    $('body').append(this.children.otherMenu.render().$el);
                    var $btn = $(e.currentTarget);
                    $btn.addClass('active');
                    this.children.otherMenu.show($btn);
                    this.children.otherMenu.once('hide', function () {
                        $btn.removeClass('active');
                    });

                }
            },
            render: function () {
                var menuModel = {
                    canWrite: this.model.view.entry.acl.canWrite()
                };
                this.$el.html(this.compiledTemplate(menuModel));

                if (this.model.page == null || !this.model.page.get('hideExport')) {
                    if (this.children.exportMenu) {
                        this.children.exportMenu.remove();
                        this.children.exportMenu = null;
                    }
                    this.children.exportMenu = new ExportMenu({
                        model: this.model,
                        collection: {
                            apps: this.collection.appLocalsUnfilteredAll
                        }
                    });
                    this.children.exportMenu.render().$el.appendTo(this.$('.dashboard-export-container'));
                }
                return this;
            },

            template: '\
            <span class="dashboard-view-controls">\
                <% if(canWrite) { %>\
                    <a class="btn edit-btn" href="#"><%- _("Edit").t() %></a>\
                <% } %>\
                <div class="dashboard-export-container ' + css.exportButtonContainer + '"></div>\
                <a aria-label="<%- _("more").t() %>" class="btn edit-other" href="#">...</a>\
            </span>\
        '
        });
    }
);
