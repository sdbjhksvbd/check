define([
    'underscore',
    'module',
    'views/Base',
    'views/shared/Modal',
    'views/shared/controls/ControlGroup',
    'views/shared/FlashMessages',
    'util/splunkd_utils'
    ],
    function(
        _,
        module,
        Base,
        Modal,
        ControlGroup,
        FlashMessagesV2,
        splunkd_utils
    ) {
    return Base.extend({
        moduleId: module.id,
        /**
        * @param {Object} options {
        *    model: {
        *        application: <models.Application>,
        *        inmem: <models.Report>,
        *        acl: <models.ACLReadOnly>
        *    }
        * }
        */
        initialize: function(options) {
            Base.prototype.initialize.apply(this, arguments);
            this.model.inmem.unset('id');

            this.model.inmem.set({
                clonePermissions: false
            });

            this.model.inmem.entry.content.set({
                name: this.model.inmem.entry.get('name') + _(' Clone').t()
            });

            this.canShowAppSelector = this.model.user &&
                _.isFunction(this.model.user.canUseApps) &&
                this.model.user.canUseApps();

            this.children.flashMessage = new FlashMessagesV2({ model: this.model.inmem });

            this.children.titleField = new ControlGroup({
                controlType: 'Text',
                controlOptions: {
                    modelAttribute: 'name',
                    model: this.model.inmem.entry.content
                },
                label: _('New Title').t()
            });

            this.children.descriptionField = new ControlGroup({
                controlType: 'Textarea',
                controlOptions: {
                    modelAttribute: 'description',
                    model: this.model.inmem.entry.content,
                    placeholder: _('optional').t()
                },
                label: _('New Description').t()
            });

            // App selector
            if (this.canShowAppSelector) {
                this.children.selectApp = new ControlGroup({
                    label: _("App").t(),
                    controlType: 'SyntheticSelect',
                    controlOptions: {
                        modelAttribute: "app",
                        model: this.model.inmem.entry.acl,
                        toggleClassName: 'btn',
                        items: [],
                        popdownOptions: {
                            detachDialog: true
                        }
                    }
                });
                this.setAppItems();
            }

            this.children.clonePermissionsControl = new ControlGroup({
                controlType: 'SyntheticRadio',
                controlOptions: {
                    modelAttribute: 'clonePermissions',
                    model: this.model.inmem,
                    items: [
                        {
                            label: _('Private').t(),
                            value: false
                        },
                        {
                            label: _('Clone').t(),
                            value: true
                        }
                    ],
                    save: false,
                    toggleClassName: 'btn',
                    labelPosition: 'outside',
                    elastic: true
                },
                label: _('Permissions').t()
            });
        },
        events: {
            'click .btn-primary': function(e) {
                var clonePermissions = this.model.inmem.get('clonePermissions'),
                    data = {app: this.canShowAppSelector ? this.model.inmem.entry.acl.get('app') : this.model.application.get("app")};
                    data.owner = (clonePermissions && this.model.acl.get('sharing') !== splunkd_utils.USER) ?
                        splunkd_utils.NOBODY : this.model.application.get("owner");
                this.model.inmem.save({}, {
                    data: data,
                    success: function(model, response) {
                        if (clonePermissions) {
                            var data = this.model.acl.toDataPayload();
                            data.owner = this.model.application.get('owner');
                            this.model.inmem.acl.save({}, {
                                data: data,
                                success: function(model, response){
                                    this.model.inmem.trigger('createSuccess');
                                }.bind(this)
                            });
                        } else {
                            this.model.inmem.trigger('createSuccess');
                        }
                    }.bind(this)
                });
                e.preventDefault();
            }
        },
        setAppItems: function(){
            var items = this.buildAppItems(),
                selectedValue = this.model.inmem.entry.acl.get('app');
            if (selectedValue === 'system') {
                if (!_.where(items, {value:'search'}).length) {
                    selectedValue = items[0].value;
                } else {
                    selectedValue = 'search';
                }
            }
            if (this.children.selectApp.childList) {
                this.children.selectApp.childList[0].setItems(items);
                this.children.selectApp.childList[0].setValue(selectedValue);
            }
        },
        buildAppItems: function(){
            var items = [];
            this.collection.appLocals.each(function(app){
                if (app.entry.acl.get("can_write")) {
                    items.push({
                        value: app.entry.get('name'),
                        label: app.getLabel()
                    });
                }
            });
            return _.sortBy(items, function(item){
                return (item.label||'').toLowerCase();
            });
        },
        render : function() {
            this.$el.html(Modal.TEMPLATE);

            this.$(Modal.HEADER_TITLE_SELECTOR).html(_("Clone Alert").t());

            this.children.flashMessage.render().prependTo(this.$(Modal.BODY_SELECTOR));

            this.$(Modal.BODY_SELECTOR).append(Modal.FORM_HORIZONTAL_JUSTIFIED);

            this.children.titleField.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
            this.children.descriptionField.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));

            if (this.children.selectApp) {
                this.children.selectApp.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
            }

            var sharing = this.model.acl.get('sharing');
            if ((sharing===splunkd_utils.APP && this.model.defaultReport.entry.acl.get("can_share_app")) ||
                (sharing===splunkd_utils.GLOBAL && this.model.defaultReport.entry.acl.get("can_share_global"))) {
                this.children.clonePermissionsControl.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
            }

            this.$(Modal.FOOTER_SELECTOR).append(Modal.BUTTON_CANCEL);
            this.$(Modal.FOOTER_SELECTOR).append('<a href="#" class="btn btn-primary">' + _("Clone Alert").t() + '</a>');

            return this;
        }
    });
});
