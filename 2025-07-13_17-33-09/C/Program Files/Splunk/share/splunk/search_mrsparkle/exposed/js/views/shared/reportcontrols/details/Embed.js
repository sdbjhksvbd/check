define(
    [
        'underscore',
        'module',
        'views/Base',
        'util/general_utils'
    ],
    function(_, module, Base, Util) {
        return Base.extend({
            moduleId: module.id,
            tagName: 'span',
            initialize: function() {
                Base.prototype.initialize.apply(this, arguments);
                this.activate();
            },
            activate: function(options) {
                if (this.active) {
                    return Base.prototype.activate.call(this, options);
                }
                Base.prototype.activate.call(this, options);
                if (this.el.innerHTML) {
                    this.render();
                }
                return this;
            },
            startListening: function() {
                this.listenTo(this.model.entry.content, 'change:embed.enabled', this.debouncedRender);
            },
            render: function() {
                var embed = Util.normalizeBoolean(this.model.entry.content.get("embed.enabled"));
                this.$el.html(this.compiledTemplate({
                    _: _,
                    embed: embed
                }));
                return this;
            },
            template: '\
                <% if (embed) { %>\
                    <%- _("Enabled.").t() %>\
                <% } else { %>\
                    <%- _("Disabled.").t() %>\
                <% } %>\
            '
        });
    }
);
