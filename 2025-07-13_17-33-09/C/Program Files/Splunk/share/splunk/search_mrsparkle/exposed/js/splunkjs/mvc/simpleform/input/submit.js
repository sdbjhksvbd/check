define(function(require) {
    var _ = require('underscore');
    var BaseSplunkView = require('../../basesplunkview');
    var Dashboard = require('../../simplexml/controller');
    var FormUtils = require('../formutils');

    var SubmitButton = BaseSplunkView.extend({
        className: 'splunk-submit-button form-submit',
        options: {
            text: _('Submit').t(),
            useIcon: false
        },
        events: {
            'click button': function(e) {
                e.preventDefault();
                if (!this.$('button').is('.disabled')) {
                    this.trigger('submit', this);
                }
            },
            'click .delete-input': function(e) {
                e.preventDefault();
                Dashboard.model.view.updateFormSettings({ submitButton: false }).done(_.bind(this.remove, this));
            }
        },
        initialize: function() {
            this.configure();
            this.listenTo(this.settings, 'change', this.render);
            this.listenTo(Dashboard.getStateModel(), 'change:edit', this.onEditModeChange);
            var settings = this.settings;
            settings.set('formReady', FormUtils.isFormReady());
            _.defer(function() {
                FormUtils.onFormReady().then(function() {
                    settings.set('formReady', true);
                });
            });
            this.listenTo(settings, 'change', this.render);
        },
        onEditModeChange: function(){
            this.$('.edit-dropdown').remove();
            if (Dashboard.isEditMode()) {
                var elem = document.createElement('div');
                elem.classList.add('edit-dropdown');
                elem.innerHTML = '<a href="#" class="delete-input" title="' + _('Delete submit button').t() + '">' +
                                    '<i class="icon-x"/>' + 
                                '</a>';
                var btn = document.querySelector('.btn-primary');
                btn.parentNode.insertBefore(elem, btn);
            }
        },
        render: function() {
            var button = this.$('button');
            if (!button.length) {
                var btn = document.createElement('button');
                btn.classList.add('btn', 'btn-primary');
                this.el.appendChild(btn);
            }
            if (this.settings.get('useIcon')) {
                button.html('<i class="icon-search"></i>');
            } else if (this.settings.has('text')) {
                button.text(this.settings.get('text'));
            } else {
                this.settings.set('text', button.text());
            }
            button[this.settings.get('formReady') ? 'removeClass' : 'addClass']('disabled');
            this.onEditModeChange();
            return this;
        }
    });

    return SubmitButton;
});
