(function($) {
	var swaJSCheckInterval = setInterval(function() {
	    if (!window._splunk_metrics_events || Array.isArray(window._splunk_metrics_events)) {
	        return;
	    }
	    clearInterval(swaJSCheckInterval);
	    var data = {
	        type: "unsupportedcomponent.load",
	        data: {
	            file: 'contrib/jquery.treeview.edit',
	        }
	    };
	    window._splunk_metrics_events.push(data);
	}, 500);
	var CLASSES = $.treeview.classes;
	var proxied = $.fn.treeview;
	$.fn.treeview = function(settings) {
		settings = $.extend({}, settings);
		if (settings.add) {
			return this.trigger("add", [settings.add]);
		}
		if (settings.remove) {
			return this.trigger("remove", [settings.remove]);
		}
		return proxied.apply(this, arguments).bind("add", function(event, branches) {
			$(branches).prev()
				.removeClass(CLASSES.last)
				.removeClass(CLASSES.lastCollapsable)
				.removeClass(CLASSES.lastExpandable)
			.children(".hitarea")
				.removeClass(CLASSES.lastCollapsableHitarea)
				.removeClass(CLASSES.lastExpandableHitarea);
			$(branches)
                .find("li")
                .andSelf()
                .prepareBranches(settings)
                .applyClasses(settings,
                              $(this).data("toggler"));
		}).bind("remove", function(event, branches) {
			var prev = $(branches).prev();
			var parent = $(branches).parent();
			$(branches).remove();
			prev.filter(":last-child").addClass(CLASSES.last)
				.filter("." + CLASSES.expandable).replaceClass(CLASSES.last, CLASSES.lastExpandable).end()
				.children(".hitarea").replaceClass(CLASSES.expandableHitarea, CLASSES.lastExpandableHitarea).end()
				.filter("." + CLASSES.collapsable).replaceClass(CLASSES.last, CLASSES.lastCollapsable).end()
				.children(".hitarea").replaceClass(CLASSES.collapsableHitarea, CLASSES.lastCollapsableHitarea);
			if (parent.children().size()==0 && parent[0] != this) {
				parent.parent().removeClass(CLASSES.collapsable).removeClass(CLASSES.expandable)
				parent.siblings(".hitarea").andSelf().remove();
			}
		});
	};

})(jQuery);
