define(
    [
        'jquery',
        'underscore',
        'module',
        'views/Base',
        'views/shared/jobstatus/buttons/ShareDialog',
        'util/splunkd_utils',
        'splunk.util',
        'bootstrap.tooltip'
    ],
    function($, _, module, Base, ShareDialog, splunkd_utils, splunkUtils) {
        return Base.extend({
            moduleId: module.id,
            className: 'share btn-pill btn-square disabled',
            tagName: 'a',
            attributes: {
                "href": "#",
                "role": "button"
            },
            initialize: function() {
                Base.prototype.initialize.apply(this, arguments);
                this.$el.html('<i class="icon-share" aria-hidden="true"></i><span class="hide-text" aria-hidden="true">' + _("Share").t() + '</span>');
                this.$el.tooltip({animation:false, title:_('Share').t(), container: this.$el});
                this.activate();
            },
            startListening: function() {
                this.listenTo(this.model.searchJob.entry.acl, "change", this.render);
                this.listenTo(this.model.searchJob.entry.content, "change:ttl", this.render);
            },
            activate: function(options) {
                if (this.active) {
                    return Base.prototype.activate.apply(this, arguments);
                }
                this.defaultSaveTTL = parseInt(this.model.searchJob.entry.content.get("defaultSaveTTL"), 10);

                return Base.prototype.activate.apply(this, arguments);
            },
            events: {
                'click': function(e) {
                    var $target = $(e.currentTarget);
                    e.preventDefault();

                    if ($target.hasClass("disabled")) {
                        return;
                    }

                    var $shareDeferred = $.Deferred();
                    this.model.searchJob.share({
                        success: function(model, response) {
                            $shareDeferred.resolve();
                            splunkUtils.trackPageInteraction(this.model.application.get('app'), 'Click Share Job Link');
                        }.bind(this),
                        error: function(model, response) {
                            if (response.status == splunkd_utils.NOT_FOUND) {
                                this.model.searchJob.trigger('jobStatus:notFound', { title: _('Share Job').t() });
                                $shareDeferred.reject();
                            } else {
                                $shareDeferred.resolve();
                            }
                        }.bind(this)
                    });

                    $.when($shareDeferred).done(function() {
                        this.children.shareDialog = new ShareDialog({
                            model: {
                                searchJob: this.model.searchJob,
                                application: this.model.application,
                                report: this.model.report,
                                user: this.model.user
                            },
                            onHiddenRemove: true,
                            externalJobLinkPage: this.options.externalJobLinkPage
                        });
                        document.body.appendChild(this.children.shareDialog.render().el);
                        this.children.shareDialog.show();
                    }.bind(this));
                }
            },
            render: function() {
                var canWrite = this.model.searchJob.entry.acl.canWrite();

                if (canWrite) {
                    this.$el.removeClass("disabled");
                } else {
                    this.$el.addClass("disabled");
                }
                return this;
            }
        });
    }
);
