define(
    [
        'jquery',
        'underscore',
        'views/Base',
        'util/keyboard',
        'bootstrap.transition',
        'bootstrap.modal'
    ],
    function($,
            _,
            Base,
            keyboard
            ) {
        var CLASS_NAME = 'modal fade',
            CLASS_MODAL_WIDE = 'modal-wide',
            HEADER_CLASS = 'modal-header',
            NON_SCROLLING_BODY_CLASS = 'modal-body',
            BODY_SCROLLING_CLASS = 'modal-body-scrolling',
            BODY_SCROLLING_SELECTOR = '.' + BODY_SCROLLING_CLASS,
            BODY_CLASS = 'modal-body ' + BODY_SCROLLING_CLASS,
            FOOTER_CLASS = 'modal-footer',
            HEADER_SELECTOR = "." + HEADER_CLASS,
            HEADER_TITLE_SELECTOR = HEADER_SELECTOR + " > h1",
            BUTTON_CLOSE_CLASS = 'close',
            BUTTON_CLOSE_SELECTOR = '.' + BUTTON_CLOSE_CLASS,
            LOADING_CLASS = "modal-loading",
            LOADING_SELECTOR = "." + LOADING_CLASS,
            LOADING_HORIZONTAL = '<div class="'+ LOADING_CLASS + '"></div>',
            BODY_SELECTOR = ".modal-body",
            BODY_FORM_SELECTOR = BODY_SELECTOR + " > div.form",
            FORM_HORIZONTAL = '<div class="form form-horizontal"></div>',
            FORM_HORIZONTAL_COMPLEX = '<div class="form form-horizontal form-complex"></div>',
            FORM_HORIZONTAL_JUSTIFIED = '<div class="form form-horizontal form-justified"></div>',
            FOOTER_SELECTOR = "." + FOOTER_CLASS,
            BUTTON_CANCEL = '<a role="button" href="#" class="btn cancel btn-secondary modal-btn-cancel" data-dismiss="modal">' + _('Cancel').t() + '</a>',
            BUTTON_CANCEL_PRIMARY = '<a role="button" href="#" class="btn btn-primary cancel modal-btn-primary modal-btn-cancel" data-dismiss="modal">' + _('Cancel').t() + '</a>',
            BUTTON_CLOSE_SECONDARY = '<a role="button" href="#" class="btn btn-secondary cancel modal-btn-primary modal-btn-cancel" data-dismiss="modal">' + _('Close').t() + '</a>',
            BUTTON_CLOSE_X = '<button aria-label="' +_('Close').t() +'" type="button" class="' + BUTTON_CLOSE_CLASS + '" data-dismiss="modal">&times;</button>',
            BUTTON_CLOSE = '<a role="button" href="#" class="btn cancel modal-btn-cancel" data-dismiss="modal">' + _('Close').t() + '</a>',
            BUTTON_BACK = '<a role="button" href="#" class="btn back modal-btn-back">' + _('Back').t() + '</a>',
            BUTTON_SAVE = '<a role="button" href="#" class="btn btn-primary modal-btn-primary btn-save">' + _('Save').t() + '</a>',
            BUTTON_APPLY = '<a role="button" href="#" class="btn btn-primary modal-btn-primary pull-right">' + _('Apply').t() + '</a>',
            BUTTON_DONE = '<a role="button" href="#" class="btn btn-primary modal-btn-primary pull-right" data-dismiss="modal">' + _('Done').t() + '</a>',
            BUTTON_OK = '<a role="button" href="#" class="btn btn-primary modal-btn-primary pull-right" data-dismiss="modal">' + _('OK').t() + '</a>',
            BUTTON_MOVE = '<a role="button" href="#" class="btn btn-primary modal-btn-move modal-btn-primary">' + _('Move').t() + '</a>',
            BUTTON_DELETE = '<a role="button" href="#" class="btn btn-primary modal-btn-delete modal-btn-primary">' + _('Delete').t() + '</a>',
            BUTTON_DELETE_SECONDARY = '<a role="button" href="#" class="btn modal-btn-delete">' + _('Delete').t() + '</a>',
            BUTTON_NEXT = '<a role="button" href="#" class="btn btn-primary modal-btn-primary">' + _('Next').t() + '</a>',
            BUTTON_CONTINUE = '<a role="button" href="#" class="btn modal-btn-continue" data-dismiss="modal">' + _('Continue Editing').t() + '</a>',
            TEMPLATE = '\
                <div aria-label="' + _("Modal").t() + '">\
                    <div aria-label="' + _('Modal header').t() + '" class="' + HEADER_CLASS + '">\
                       ' + BUTTON_CLOSE_X + '\
                        <h1 class="modal-title">&nbsp;</h1>\
                    </div>\
                    <div aria-label="' + _("Modal body").t() + '" class="' +  BODY_CLASS + '">\
                    </div>\
                    <div aria-label="' + _("Modal footer").t() + '" class="' + FOOTER_CLASS + '">\
                    </div>\
                </div>\
            ';

        // non-exported constants
        var INPUT_SELECTOR = 'a:visible, .btn, input[type="text"], input[type="password"], textarea';

        return Base.extend({
                className: CLASS_NAME,
                attributes: {
                    style: 'display:none',
                    tabindex: -1,
                    role: 'dialog'
                },
                initialize: function() {
                    Base.prototype.initialize.apply(this, arguments);
                    var defaults = {
                        show: false,
                        keyboard: false,
                        backdrop: true
                    };
                    _.defaults(this.options, defaults);

                    this.keydownEventCode = null;
                    this.keydownEventTarget = null;
                    this.$el.modal(_.pick(this.options, ['backdrop', 'keyboard', 'show', 'remote']));
                    this.shown = false;

                    //when the hidden event is triggered the modal destroys itself
                    if (this.options.onHiddenRemove) {
                        this.on('hidden', this.remove, this);
                    }
                },

                focus: function() {
                    // check for any text inputs inside the dialog, focus the first visible one
                    var xButtons = this.$el.find('.' + BUTTON_CLOSE_CLASS);
                    if(xButtons.length > 0) {
                        xButtons[0].focus();
                    }
                },

                //if you extend this class and need your own events object then you need to declare it like:
                // $.extend({}, Modal.prototype.events, {
                events: {
                    'show': function(e) {
                        this.beforeFocussed = document.activeElement && document.activeElement.parentNode;
                        if (e.target !== e.currentTarget) return;
                        document.body.classList.add('body-modal-open');
                        this.trigger("show");
                    },
                    'shown': function(e) {
                        if (e.target !== e.currentTarget) return;
                        this.shown = true;
                        this.focus();
                        this.trigger("shown");
                    },
                    'hide': function(e) {
                        if (e.target !== e.currentTarget) return;
                        document.body.classList.remove('body-modal-open');
                        this.trigger("hide");
                    },
                    'hidden': function(e) {
                        if (e.target !== e.currentTarget) return;
                        this.shown = false;
                        if (this.beforeFocussed.focus) {
                            this.beforeFocussed.focus();
                        }
                        this.trigger("hidden");
                    },
                    'keydown': function(e) {
                        var keyCode = e.which;
                        this.keydownEventCode = e.which;
                        this.keydownEventTarget = e.target;

                        if (keyCode === keyboard.KEYS.TAB) {
                            keyboard.handleCircularTabbing(this.$el, e);
                        }
                        // SPL-204997: When a Synthetic Select's Popdown Dialog closes,
                        // the focus should land back onto the SyntheticSelect button
                        // When jquery sets the focus, after the Escape key's keydown event,
                        // Bootstrap hears an Escape keyup event. That event bubbles up and lands
                        // on this modal. To maintain the original Escape key functionality,
                        // we disable the Bootstrap keyboard listeners and instead control hiding here
                        if (!e.originalEvent.isPopdownShown && keyCode === keyboard.KEYS.ESCAPE) {
                            this.hide();
                        }
                    },
                    'keyup': function(e) {
                        var keyCode = e.which;
                        if (keyCode === keyboard.KEYS.ENTER && this.keydownEventCode === keyboard.KEYS.ENTER) {
                            var $target = $(e.target);

                            if(e.target !== this.keydownEventTarget && $(this.keydownEventTarget).is('input')  && $(this.keydownEventTarget).attr('type') === 'text')
                                $target = $(this.keydownEventTarget);

                            if ($target.is('input') && $target.attr('type') === 'text' && this.$el.find('.btn-primary:visible').length === 1) {
                                // if the currently focused element is any kind of text input,
                                // make sure to blur it so that any change listeners are notified
                                if ($target.is(INPUT_SELECTOR)) {
                                    $target.blur();
                                }
                                e.preventDefault();
                                this.keydownEventCode = null;
                                this.keydownEventTarget = null;
                                this.$el.find('.btn-primary:visible').click();
                            }
                        }
                    }
                },
                hide: function() {
                    this.$el.modal('hide');
                },
                show: function() {
                    this.$el.modal('show');
                },
                toggle: function() {
                    this.$el.modal('toggle');
                },
                remove: function() {
                    if (this.shown){
                        this.hide();
                    }
                    Base.prototype.remove.apply(this, arguments);
                }
            },
            {
                CLASS_NAME: CLASS_NAME,
                CLASS_MODAL_WIDE: CLASS_MODAL_WIDE,
                HEADER_CLASS: HEADER_CLASS,
                BODY_SCROLLING_CLASS: BODY_SCROLLING_CLASS,
                BODY_SCROLLING_SELECTOR: BODY_SCROLLING_SELECTOR,
                BODY_CLASS: BODY_CLASS,
                FOOTER_CLASS: FOOTER_CLASS,
                HEADER_SELECTOR: HEADER_SELECTOR,
                HEADER_TITLE_SELECTOR: HEADER_TITLE_SELECTOR,
                BUTTON_CLOSE_CLASS: BUTTON_CLOSE_CLASS,
                BUTTON_CLOSE_SELECTOR: BUTTON_CLOSE_SELECTOR,
                BODY_SELECTOR: BODY_SELECTOR,
                BODY_FORM_SELECTOR: BODY_FORM_SELECTOR,
                LOADING_CLASS: LOADING_CLASS,
                LOADING_SELECTOR: LOADING_SELECTOR,
                LOADING_HORIZONTAL: LOADING_HORIZONTAL,
                FOOTER_SELECTOR: FOOTER_SELECTOR,
                TEMPLATE: TEMPLATE,
                FORM_HORIZONTAL: FORM_HORIZONTAL,
                FORM_HORIZONTAL_COMPLEX: FORM_HORIZONTAL_COMPLEX,
                FORM_HORIZONTAL_JUSTIFIED: FORM_HORIZONTAL_JUSTIFIED,
                BUTTON_CANCEL: BUTTON_CANCEL,
                BUTTON_CANCEL_PRIMARY: BUTTON_CANCEL_PRIMARY,
                BUTTON_CLOSE_SECONDARY: BUTTON_CLOSE_SECONDARY,
                BUTTON_CLOSE: BUTTON_CLOSE,
                BUTTON_CLOSE_X: BUTTON_CLOSE_X,
                BUTTON_BACK: BUTTON_BACK,
                BUTTON_SAVE: BUTTON_SAVE,
                BUTTON_APPLY: BUTTON_APPLY,
                BUTTON_CONTINUE: BUTTON_CONTINUE,
                BUTTON_MOVE: BUTTON_MOVE,
                BUTTON_DELETE: BUTTON_DELETE,
                BUTTON_DELETE_SECONDARY: BUTTON_DELETE_SECONDARY,
                BUTTON_DONE: BUTTON_DONE,
                BUTTON_OK: BUTTON_OK,
                BUTTON_NEXT: BUTTON_NEXT
            }
        );
    }
);
