define(
    [
        'underscore',
        'module',
        'views/Base',
        'views/shared/jobcontrols/menu/sendbackgroundmodal/Master'
    ],
    function(_, module, Base, SendBackgroundModal) {
        return Base.extend({
            moduleId: module.id,
            className: 'send-background',
            tagName: 'li',
            initialize: function() {
                Base.prototype.initialize.apply(this, arguments);
                this.activate();
            },
            startListening: function() {
                this.listenTo(this.model.searchJob.entry.content, 'change', this.render);
            },
            events: {
                'click a[class!="disabled"]': function(e) {
                    this.children.sendBackgroundModal = new SendBackgroundModal({
                        model: {
                            searchJob: this.model.searchJob,
                            application: this.model.application,
                            appLocal: this.model.appLocal
                        },
                        onHiddenRemove: true,
                        externalJobLinkPage: this.options.externalJobLinkPage
                    });
                    document.body.appendChild(this.children.sendBackgroundModal.render().el);
                    this.children.sendBackgroundModal.show();

                    e.preventDefault();
                },
                'click a.disabled': function(e) {
                    e.preventDefault();
                }
            },
            render: function() {
                var canWrite = this.model.searchJob.entry.acl.canWrite(),
                    isBackground = this.model.searchJob.isBackground(),
                    isRealTime = this.model.searchJob.isRealtime();

                this.$el.html('<a href="#">Send Job to Background</a>');

                if (canWrite && this.model.searchJob.isRunning() && !isRealTime && !isBackground){
                    this.$el.html('<a href="#" aria-disabled="false">' + _("Send Job to Background").t() + '</a>');
                } else {
                    this.$el.html('<a href="#" aria-disabled="true" class="disabled">' + _("Send Job to Background").t() + '</a>');
                }

                return this;
            }
        });
    }
);
