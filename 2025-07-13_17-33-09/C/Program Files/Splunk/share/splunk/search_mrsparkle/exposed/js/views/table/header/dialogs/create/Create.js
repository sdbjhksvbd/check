define(
    [
        'underscore',
        'module',
        'views/Base',
        'views/shared/FlashMessages',
        'views/shared/Modal',
        'views/shared/controls/ControlGroup',
        'views/shared/controls/TextControl',
        'views/shared/delegates/PairedTextControls',
        'util/datamodel/form_utils',
        'util/splunkd_utils',
        'splunk.util'
    ],
    function(
        _,
        module,
        Base,
        FlashMessage,
        Modal,
        ControlGroup,
        TextControl,
        PairedTextControls,
        dataModelFormUtils,
        splunkDUtils,
        splunkUtil
    ) {
        return Base.extend({
            moduleId: module.id,

            initialize: function() {
                Base.prototype.initialize.apply(this, arguments);

                this.children.flashMessage = new FlashMessage({ model: this.model.inmem });

               this.children.tableDisplayNameControl = new TextControl({
                    model: this.model.inmem.entry.content,
                    modelAttribute: 'displayName'
                });

                this.children.tablelDisplayNameGroup = new ControlGroup({
                    label: _('Table Title').t(),
                    controlType: 'Text',
                    controls: this.children.tableDisplayNameControl
                });

                this.children.tableNameControl = new TextControl({
                    model: this.model.inmem.entry.content,
                    modelAttribute: 'name'
                });

                this.children.tableNameGroup = new ControlGroup({
                    label: _('Table ID').t(),
                    controlType: 'Text',
                    controls: this.children.tableNameControl,
                    tooltip: _('The ID is used as the filename on disk. Cannot be changed later.').t(),
                    help: _('The table ID can only contain letters, numbers, dashes, and underscores. Do not start the table ID with a period.').t()
                });

                this.children.pairedControlsDelegate = new PairedTextControls({
                    sourceDelegate: this.children.tableDisplayNameControl,
                    destDelegate: this.children.tableNameControl,
                    transformFunction: dataModelFormUtils.normalizeForID
                });

                this.children.description = new ControlGroup({
                    label: _('Description').t(),
                    controlType: 'Textarea',
                    controlOptions: {
                        model: this.model.inmem.entry.content,
                        modelAttribute: 'dataset.description',
                        placeholder: _('optional').t()
                    }
                });
            },

            events: {
                "click .modal-btn-primary": function(e) {
                    this.submit();
                    e.preventDefault();
                }
            },

            render: function() {
                var header = _('Save As New Table').t();

                this.$el.html(Modal.TEMPLATE);

                this.$(Modal.HEADER_TITLE_SELECTOR).html(header);

                this.children.flashMessage.render().prependTo(this.$(Modal.BODY_SELECTOR));

                this.$(Modal.BODY_SELECTOR).append(Modal.FORM_HORIZONTAL);

                this.children.tablelDisplayNameGroup.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
                this.children.tableNameGroup.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));
                this.children.description.render().appendTo(this.$(Modal.BODY_FORM_SELECTOR));

                this.$(Modal.FOOTER_SELECTOR).append(Modal.BUTTON_CANCEL);
                this.$(Modal.FOOTER_SELECTOR).append(Modal.BUTTON_SAVE);

                return this;
            },

            submit: function() {
                this.model.inmem.save({}, {
                    data: this.model.application.getPermissions("private"),
                    success: function(model, response) {
                        this.model.inmem.trigger('createSuccess');
                        if (!this.model.inmem.created) {
                            splunkUtil.trackEvent({
                                type: 'tableUI.interact',
                                data: {
                                    action: 'initial_save_table',
                                    location: 'dataset page',
                                },
                            });
                        }
                    }.bind(this),
                    error: function(model, response) {
                        if (this.model.table.entry.get('name') === this.model.inmem.entry.get('name')) {
                            this.children.flashMessage.flashMsgHelper.addGeneralMessage('dup_name', {
                                type: splunkDUtils.ERROR,
                                html: _('Duplicate table name. Rename the table and save again.').t()
                            });
                        } else {
                            this.children.flashMessage.flashMsgHelper.removeGeneralMessage('dup_name');
                        }
                    }.bind(this)
                });
            }
        });
    }
);
