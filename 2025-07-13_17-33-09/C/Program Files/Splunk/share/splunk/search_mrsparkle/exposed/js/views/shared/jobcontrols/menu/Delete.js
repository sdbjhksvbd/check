define(
    [
        'underscore',
        'module',
        'views/Base',
        'views/shared/jobcontrols/menu/DeleteModal'
    ],
    function(_, module, BaseView, DeleteModal) {
        return BaseView.extend({
            moduleId: module.id,
            className: 'delete',
            tagName: 'li',
            initialize: function() {
                BaseView.prototype.initialize.apply(this, arguments);
            },
            events: {
                'click a[class!="disabled"]': function (e) {
                    this.children.deleteModal = new DeleteModal({
                        model: this.model.searchJob,
                        onHiddenRemove: true,
                        appName: this.model.application.get('app')
                    });
                    document.body.appendChild(this.children.deleteModal.render().el);
                    this.children.deleteModal.show();

                    e.preventDefault();
                },
                'click a.disabled': function(e) {
                    e.preventDefault();
                }
            },
            render: function() {
                var canWrite = this.model.searchJob.entry.acl.canWrite();
                if (canWrite){
                    this.$el.html('<a href="#" aria-disabled="false">' + _("Delete Job").t() + '</a>');
                } else {
                    this.$el.html('<a href="#" aria-disabled="true" class="disabled">' + _("Delete Job").t() + '</a>');
                }
                return this;
            }
        });
    }
);
