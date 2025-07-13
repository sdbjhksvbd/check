/**
 * Utility class that used in dashboard rendering
 */
define([
    'jquery',
    'underscore',
    'splunk.config',
    'util/general_utils',
    'util/console'
], function($, _, SplunkConfig, GeneralUtils, console) {
    var DOMAIN_PREFIX = 'dashboards_trusted_domain.';
    return {
        /**
         * Get app and source out of a string
         * Example Usage:
         * 'myapp:file','defaultApp'  -> {app:'myapp',src:'file'}
         * 'file','defaultApp'  -> {app:'defaultApp',src:'file'}
         * 'myapp:folder/file.js'  -> {app:'myapp',src:'folder/file.js'}
         * 'myapp:file:others'  -> {app:'myapp',src:'file:others'}
         */
        getAppAndSource: function(path, defaultApp) {
            var ret = {
                app: defaultApp
            };
            if (_.isString(path)) {
                var parts = path.split(':');
                if (parts.length === 1) {
                    ret.src = parts[0];
                }
                else if (parts.length === 2) {
                    ret.app = parts[0];
                    ret.src = parts.slice(1).join(':');
                }
            }
            return ret;
        },

        /**
         * Determine whether inline stylesheets are allowed for inline HTML elements in dashboards. This is determined
         * by examining the splunk.config ($C) from the server
         * @returns {Boolean} true if inline stylesheets are allowed, otherwise false
         */
        allowInlineStyles: function() {
            return GeneralUtils.normalizeBoolean(SplunkConfig['DASHBOARD_HTML_ALLOW_INLINE_STYLES'], {"default": true});
        },
        /**
         * Determine whether iframes are allowed for HTML elements in dashboards. This is determined
         * by examining the splunk.config ($C) from the server
         * @returns {Boolean} true if iframes are allowed, otherwise false
         */
        allowIframes: function() {
            return GeneralUtils.normalizeBoolean(SplunkConfig['DASHBOARD_HTML_ALLOW_IFRAMES'], {"default": true});
        },
        /**
         * Determine whether embeddable content is allowed for HTML elements in dashboards. This is determined
         * by examining the splunk.config ($C) from the server
         * @returns {Boolean} true if iframes are allowed, otherwise false
         */
        allowEmbeds: function() {
            return GeneralUtils.normalizeBoolean(SplunkConfig['DASHBOARD_HTML_ALLOW_EMBEDDABLE_CONTENT'], {"default": false});
        },
        /**
         * Determine whether embed tags should be sandboxed in dashboards. This is determined
         * by examining the splunk.config ($C) from the server
         * @returns {Boolean} true if embed tags should be sandboxed, otherwise false
         */
        allowWrapEmbed: function() {
            return GeneralUtils.normalizeBoolean(SplunkConfig['DASHBOARD_HTML_WRAP_EMBED'], {"default": true});
        },
        /**
         * Determine whether embed tags should be sandboxed in dashboards. This is determined
         * by examining the splunk.config ($C) from the server
         * @returns {Boolean} true if embed tags should be sandboxed, otherwise false
         */
        allowedDomains: function() {
            if (!SplunkConfig['DASHBOARD_HTML_ALLOWED_DOMAINS']) {
                return [];
            }
            var domains = SplunkConfig['DASHBOARD_HTML_ALLOWED_DOMAINS'].split(',');
            return domains.map(function(domain) { return domain.trim(); });
        },
        updateSearchMessage: function(model, searchId, level, message, options) {
            options = options || {};
            var messages = model.get(searchId);
            if (!messages || options.reset) {
                messages = {
                    errors: [],
                    warnings: []
                };
            }
            switch (level) {
                case 'warning':
                    messages.warnings.push(message);
                    messages.warnings = _.uniq(messages.warnings);
                    break;
                default:
                    messages.errors.push(message);
                    messages.errors = _.uniq(messages.errors);
                    break;
            }
            model.set(searchId, messages);
        },
        getPrimarySearchManager: function(managerIds, registry) {
            if (_.isArray(managerIds)) {
                // find primary search manager
                return _.chain(managerIds).map(function(id) {
                    return registry.get(id);
                }).find(function(manager) {
                    return manager && manager.getType() === 'primary';
                }).value();
            } else if (_.isString(managerIds)) {
                return registry.get(managerIds);
            }
        },

        /**
         * HTML element content will be localized if it contains i18ntag attribute.
         * HTML elementâ€™s attribute value will be localized if it is listed in i18nattr attribute.
         * Example:-
         * <sometag i18ntag="">Blablabla</sometag> would cause "Blablabla" to be extracted in messages.pot file when using splunk extract i18n command
         * <sometag title="Foobar" render="True" i18nattr="title, render" /> would cause "Foobar" and "True" to be extracted.
         * @returns {String} HTML string after localization
         */
        localizeHtmlContent: function(inputHtml) {
            var html = $('<div></div>')
                        .html(inputHtml)
                        .find("[i18ntag], [i18nattr]")
                            .each(function() {
                                var $el = $(this);
                                if (!_.isUndefined($el.attr("i18ntag"))) {
                                    $el.text(_($el.text()).t());
                                }
                                var i18nattr = $el.attr("i18nattr");
                                if (i18nattr) {
                                    $.each(i18nattr.split(","), function(key, value) {
                                        if(value) {
                                            value = value.trim();
                                            if  ($el.prop(value)) {
                                                $el.prop(value, _($el.prop(value)).t());
                                            }
                                        }
                                    });
                                }
                            })
                        .end()
                        .html();
            return html;
        },
        getDefaultSimpleXMLVersion: function() {
            return '1.0';
        },
        /**
         * Returns whether parent component is dashboard or form or if any of the ancestors is hidden
         * @param {parent} parent component of search
         * @returns {boolean}
         */
        isHiddenSearch: function(parent) {
            if (!parent) {
                return false;
            }
            if (parent.indexOf('dashboard') !== -1 ||
                parent.indexOf('form') !== -1 ||
                $('#' + parent).closest('.hidden').length) {
                return true;
            }
            return false;
        },

        isHiddenSearchRiskyCommandDisabled: function() {
            return parseInt($.fn.jquery) < 3;
        },
        /**
         * Checks externalUrls against a list of trusted domains and returns
         * the external urls that do no match any trusted domains
         * @param {string[]} externalUrls
         * @param {string[]} trustedDomains
         * @returns {string[]}
         */
        getInvalidUrls: function(externalUrls, trustedDomains) {
            // valid csp source examples: *, none, *.example.com, subdomain.example.com, http:, https:, https://*.example.com, example.com

            // * means eveything is allowed
            if (trustedDomains.indexOf('*') !== -1) {
                return [];
            }

            // none means nothing is allowed
            if (trustedDomains.indexOf('none') !== -1) {
                return externalUrls;
            }

            var urls = {};
            for (var url of externalUrls) {
                try {
                    urls[url] = new URL(url);
                } catch (e) {
                    console.warn(`Couldn't parse URL, skipping: "${url}"`);
                }
            };

            var patternMatch = (url, domainpart, caseNum) => {
                switch(caseNum) {
                    // starts with https: or http: and contains no *
                    case 1:
                        return !url.href.startsWith(domainpart);
                    // starts with https:// and contains *
                    case 2:
                        return !(url.hostname.endsWith(domainpart) && url.protocol === 'https:');
                    // start with http:// and contains *
                    case 3:
                        return !(url.hostname.endsWith(domainpart) && url.protocol === 'http:');
                    // start with *
                    case 4:
                        return !url.hostname.endsWith(domainpart);
                    // domain hostname with no *
                    case 5:
                        return !url.hostname.startsWith(domainpart);
                    default:
                        return !url.hostname.startsWith(domainpart);
                }
            };

            for (var i = 0; i < trustedDomains.length; i++) {
                var caseNum;
                var domainpart;
                var domain = trustedDomains[i];
                if ((domain.startsWith('https:') || domain.startsWith('http:')) && domain.indexOf('*') === -1) {
                    caseNum = 1;
                    domainpart = domain;
                } else if (domain.startsWith('https:')) {
                    var parts = domain.split('*');
                    // not a valid use of *
                    if (parts[0] !== 'https://') {
                        continue;
                    }
                    caseNum = 2;
                    domainpart = parts[1];
                } else if (domain.startsWith('http:')) {
                    var parts = domain.split('*');
                    // not a valid use of *
                    if (parts[0] !== 'http://') {
                        continue;
                    }
                    caseNum = 3;
                    domainpart = parts[1];
                } else if (domain.startsWith('*')) {
                    caseNum = 4;
                    domainpart = domain.substring(1);
                } else {
                    domainpart = domain;
                    caseNum = 5;
                }
                for (var url of Object.keys(urls)) {
                    // Pass the `new URL` value into patternMatch...
                    if (!patternMatch(urls[url], domainpart, caseNum)) {
                        delete urls[url];
                    }
                }
            }
            // ...but return the original URLs
            return Object.keys(urls);
        },

        /**
         * Extracts domains from dashboards_csp settings
         * @param {Object} settings
         * @returns {string[]}
         */
        extractTrustedDomains: function(settings) {
            var domains = [];
            for (var key in settings) {
                if (key.startsWith(DOMAIN_PREFIX) && settings[key]) {
                    domains.push(settings[key]);
                }
            }
            return domains;
        }
    };
});
