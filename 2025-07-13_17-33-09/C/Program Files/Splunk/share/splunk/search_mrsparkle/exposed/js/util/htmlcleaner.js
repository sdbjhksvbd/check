/* eslint-disable */
define([
    'underscore',
    'dompurify',
    '@xmldom/xmldom',
    'util/htmlcleaner_util',
    'style-to-object',
    'known-css-properties',
    'util/hash_utils',
    'util/console',
], function (_, DOMPurify, xmldom, CleanerUtil, StyleToObject, knownCss, hashUtils, console) {
    // CONTANTS
    const BAD_URL_SCHEMES = /(?:javascript|jscript|livescript|vbscript|data(?!:image\/)|about|mocha):/i;
    const URL_PATTERN = (/(http:|https:\/\/.)(www\.)?([-a-z0-9@:%_+.~#?&/=]*)/i);
    const URL_ATTRIBUTES = {
        link  : ['href'],
        applet: ['code', 'object'],
        iframe: ['src', 'srcdoc'],
        img   : ['src'],
        embed : ['src'],
        layer : ['src'],
        a     : ['href']
    };
    const ELEMENTS_WITH_INVALID_ATTRIBUTES = {
        select: ['href']
    };
    const DASHBOARD_ATTRIBUTE_MAP = {
        iframe: ['src', 'srcdoc'],
        frame : ['src'],
        a     : ['ping'],
        img   : ['src'],
        style : ['textContent'],
        script: ['src', 'textContent'],
        link: ['href'],
        audio : ['src'],
        video : ['src'],
        track : ['src'],
        embed : ['src'],
        object: ['data', 'archive'],
        applet: ['src'],
        base  : ['href', 'target'],
        form  : ['action'],
    };
    /** @type {(node: Node) => string} */
    const tag = (node) => (node.tagName && node.tagName.toLowerCase()) || '';

    // TODO: HOW TO REMOVE GLOBAL STATE?
    // MODULE STATE
    let gWrapEmbedTags = false;
    let gAllowInlineStyle = false;
    let gAllowedDomains = [];
    /**
     * Maps URLs to functions that clean its originating node or attribute
     * @type {Map<string, Array<() => void>>} */
    let gExternalUrls;
    /**
     * @typedef {object} StyleElementTelemetry
     * @property {'StyleElement'} type
     * @property {Array<{ selector: string, properties: string[] }>} rulesets
     * CSS property names in selector's block/ruleset (NO VALUES)
     *
     * @typedef {object} StyleAttributeTelemetry
     * @property {'StyleAttribute'} type
     * @property {string} element As in `<element style=...`
     * @property {string[]} properties CSS property names in style= (NO VALUES)
     *
     * @typedef {Array<StyleElementTelemetry | StyleAttributeTelemetry>} InlineStyles
     */

    /** @type {InlineStyles} */
    let gInlineStyles = [];
    let gDashboardTelemetry = false;
    let gDashboardTags = [];

    // Save state in the closure. Sorry JS GC.
    const gExternalUrlAdd = (url, removeFn) => gExternalUrls.set(url, (gExternalUrls.get(url) || []).concat(removeFn));

    /** @type {(url: string) => boolean} */
    function isBadUrl(url) {
        function cleanupUrl(_url) {
            var decodedURI = String(_url || '').trim();
            try {
                decodedURI = decodeURIComponent(decodedURI);
            } catch (err) {
                console.log(err);
                decodedURI = _.unescape(decodedURI);
            }
            return decodedURI.replace(/\s/gim, '');
        }
        return BAD_URL_SCHEMES.test(cleanupUrl(url));
    }

    /** @type {(val: string) => boolean} */
    function isBadNodeValue(val) {
        var convertedStr = (_.unescape(String(val || '').trim())).replace(/\s/gim, '');
        return BAD_URL_SCHEMES.test(convertedStr) || /<script>.+<\/script>/i.test(convertedStr);
    }

    /**
     * Checks whether selector is valid on the node's owner document.
     * @type {(node: Node, selector: string) => boolean}
     */
    function isValidSelector(node, selector) {
        try {
            if (node && node.ownerDocument && node.ownerDocument.querySelector(selector)) {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    }

    /** @type {(attrName: string, attrValue: string, node: Node) => boolean} */
    function isValidAttribute(attrName, attrValue, node) {
        attrName = attrName.toLowerCase();
        var tagName = tag(node);
        // Check for <geo json> elements
        if (attrName === 'json' && tagName === 'geo') {
            return true;
        }
        // Remove invalid data attributes
        if (attrName === 'data-main') {
            return false;
        }
        if (attrName === 'data-target') {
            return isValidSelector(node, attrValue);
        }
        if (attrName === 'data-dismiss' && attrValue === 'alert') {
            // data-target or href can contain XSS
            return isValidSelector(node, node.getAttribute('data-target') || node.getAttribute('href'));
        }
        if (
            Object.prototype.hasOwnProperty.call(ELEMENTS_WITH_INVALID_ATTRIBUTES, tagName) &&
            ELEMENTS_WITH_INVALID_ATTRIBUTES[tagName].includes(attrName)
        ) {
            return false;
        }
        // Remove event listener
        if (attrName.startsWith('on')) {
            return false;
        }
        if (isBadNodeValue(attrValue) && tagName !== 'iframe') {
            return false;
        }
        if (
            Object.prototype.hasOwnProperty.call(URL_ATTRIBUTES, tagName) &&
            URL_ATTRIBUTES[tagName].includes(attrName) &&
            isBadUrl(attrValue)
        ) {
            return false;
        }
        if (attrName.match(/^\w+-\w+$/)) {
            return true;
        }
        // XXX: Kind of a weird default to allow everything...
        return true;
    }

    DOMPurify.addHook('beforeSanitizeElements', function (node, data) {
        var tagName = tag(node);

        // Case: Collect URLs. This is in "beforeSanitizeElements" because we
        // want to report on external URLs for their raw input
        if (gDashboardTelemetry && tagName && Object.prototype.hasOwnProperty.call(DASHBOARD_ATTRIBUTE_MAP, tagName)) {
            for (var attr of DASHBOARD_ATTRIBUTE_MAP[tagName]) {
                for (var url of (node.getAttribute(attr) || '').split(',')) {
                    url = url.trim();
                    if (!url.startsWith(window.location.origin) &&
                        URL_PATTERN.test(url)
                    ) {
                        gExternalUrlAdd(url, () => {
                            // It's possible the "upon" callback or DOMPurify
                            // internals removed this attribute/node by the time
                            // this is called.
                            if (!node) return;
                            // Replaced <embed> with <iframe srcdoc=<embed> ...>
                            if (tag(node) === 'embed') {
                                node.ownerDocument.querySelectorAll('iframe').forEach(function (iframe) {
                                    iframe.setAttribute(
                                        'srcdoc',
                                        (iframe.getAttribute('srcdoc') || '').replace(url, '')
                                    );
                                });
                                return;
                            }
                            // The usual case for non-replaced elements:
                            var urlsNow = (node.getAttribute(attr) || '').split(',');
                            var i = urlsNow.indexOf(url);
                            if (i > -1) {
                                urlsNow.splice(i, 1);
                                try {
                                    node.insertAdjacentHTML(
                                        'beforebegin',
                                        `<!-- REMOVED EXTERNAL URL: ${attr}="${url}" -->`
                                    );
                                } catch (e) {
                                    // It's ok, only a warning banner.
                                }
                                node.setAttribute(attr, urlsNow.join(','));
                            }
                        });
                    }
                }
            }
        }
        if (gDashboardTelemetry && tagName === 'style') {
            var cssText = node.textContent;
            // I don't need exec capture groups so String.match() is easiest
            var urls = cssText.matchAll(/url\(['"]?(.+?)['"]?\)/g);
            for (var [_, url] of urls) {
                gExternalUrlAdd(url, () => {
                    // It's possible the "upon" callback or DOMPurify internals
                    // removed this attribute/node by the time this is called.
                    // It's also likely another closure has modified textContent
                    // so don't reference the hook's `cssText`
                    var cssTextLatest = node && node.textContent;
                    if (cssTextLatest) {
                        node.textContent = cssTextLatest.replaceAll(
                            `url(${url})`,
                            `url()/* REMOVED EXTERNAL URL: ${url} */`
                        );
                    }
                });
            }
        }
    });

    // The "after" hook only runs if the element is safe (not removed by the
    // sanitization of DOMPurify)
    DOMPurify.addHook('afterSanitizeElements', function (node, data) {
        var tagName = tag(node);

        // Case: Wrap embeds in an iframe for safety. This is in the "after"
        // hook because otherwise the style= and <iframe> would get caught in
        // the other "before" and "upon" hooks which could undo our work here.
        if (gWrapEmbedTags && tagName === 'embed') {
            if (!gAllowInlineStyle) {
                node.removeAttribute('style');
            }
            // TODO(hamesg): Time to write a JSX reviver?
            // <iframe sandbox="allow-scripts" srcdoc="${node.outerHTML}" ${style} class="embed-wrapper"></iframe>`;
            var iframe = document.createElement('iframe');
            iframe.className = 'embed-wrapper';
            if (gAllowInlineStyle) {
                iframe.style =
                    'background-color: transparent; border: 0px none transparent; padding: 0px; overflow: hidden; width: 100%; height: 100%;';
            }
            iframe.srcdoc = node.outerHTML;
            iframe.sandbox = 'allow-scripts';
            // DOMPurify uses `NodeIterator` to walk the DOM. Trying to replace
            // the node using `node.outerHTML` or `node.parentNode.replaceChild`
            // both queue the element as the next iteration, causing it to pass
            // through `beforeSanitizeElements` again... To avoid this, do a
            // little `insertBefore` dance:
            node.parentNode.insertBefore(iframe, node);
            node.remove();
            return;
        }

        // Case: Element made it through sanitization
        if (gDashboardTelemetry && tagName /* Don't collect DocumentFragment */) {
            gDashboardTags.push(tagName);
        }

        // Case: Telemetry about inline <style> content usage
        if (gDashboardTelemetry && tagName === 'style') {
            var cssText = node.textContent;
            // Naming based on https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax
            var rulesets = [];
            // Parses: `p.hey > a {\n  width: 10%;\n}`
            // Into: ['p.hey > a', '\n  width: 10%;\n'] i.e preserves whitespace
            var cssBlockRegex = /([^{]+)\s*{([^}]+)}/gm;
            var match;
            while ((match = cssBlockRegex.exec(cssText))) {
                var [_fullContent, _matchSelector, matchBlock] = match;
                rulesets.push({
                    properties: Object.keys(StyleToObject(matchBlock)),
                });
            }
            gInlineStyles.push({
                type: 'StyleElement',
                rulesets,
            });
            return;
        }

        // Case: iFrame sandboxing fix (here not in uponSanitizeAttribute)
        // Note that fragments (like #text) don't have this method
        const hasSandbox = node.hasAttribute && node.hasAttribute('sandbox');
        if (tagName === 'iframe' && !hasSandbox) {
            var srcMaybe = node.getAttribute('src');
            if (!srcMaybe || !CleanerUtil.isAllowedDomain(gAllowedDomains, srcMaybe)) {
                node.setAttribute('sandbox', 'allow-scripts');
            }
        }
        if (hasSandbox) {
            var sandbox = node.getAttribute('sandbox');
            // Remove all instances of 'allow-same-origin' in attribute string.
            // DO NOT USE SIMPLE REGEX /allow-same-origin/g !!!
            // Our hacker friends will use "allow-sameallow-same-origin-origin"
            // because they're sneaky and creative. Inspirational <3
            node.setAttribute('sandbox',
                sandbox.toLowerCase().replace(/(?:^|[\s]+)(allow-same-origin)(?:[\s+]|$)/g, ''));
        }
    });

    DOMPurify.addHook('uponSanitizeAttribute', function(node, data) {
        // Case: Fast path to drop invalids
        if (isValidAttribute(data.attrName, data.attrValue, node)) {
            // DOMPurify uses ALLOWED_ATTR and ADD_ATTR to set allowed
            // attributes. We use ADD_ATTR to *add* to their default list rather
            // than overwrite. However, we actually want to override their list
            // on the fly to support custom attributes: <div custom-attr="...">
            // https://github.com/cure53/DOMPurify/issues/184
            // https://github.com/cure53/DOMPurify/commit/5c95fcac3a55ec555e561dbeda70b1f5b2bae4a7
            if (!data.allowedAttributes[data.attrName]) {
                data.allowedAttributes[data.attrName] = true;
            }
        } else {
            // Tell DOMPurify to leave this as removed (it has just removed it
            // before invoking this hook)
            data.keepAttr = false;
            return;
        }
        // Case: Telemetry
        if (gDashboardTelemetry && data.attrName === 'style') {
            // This is comfortable handling <style style="..."> too
            gInlineStyles.push({
                type: 'StyleAttribute',
                element: tag(node),
                properties: Object.keys(StyleToObject(data.attrValue)).filter(function(prop) {
                    return knownCss.all.includes(prop);
                }),
            });
        }
    });

    /**
     * @param htmlText {string}
     * @param options {object}
     * @param options.allowInlineStyles {boolean}
     * @param options.allowIframes {boolean}
     * @param options.allowEmbeds {boolean}
     * @param options.wrapEmbedTags {boolean}
     * @param options.allowedDomains {array}
     * @param options.dashboardTelemetry {boolean}
     * @param options.returnDom {boolean}
     * @returns {null | {
     *     cleanHtmlOrDom: string | Node,
     *     inlineStyles: InlineStyles,
     *     xmlTags: string[],
     *     externalUrlDomRefs: Map<string, () => void>,
     * }}
     */
    function dompurifyHtml(htmlText, options = {}) {
        if (!htmlText) {
            return null;
        }
        var DOMParser = xmldom.DOMParser;
        // Custom DOMParser options because we want to error out on warnings as well as errors
        var errorHandler = function(e) { throw e; };
        var parserOptions = {
            locator: {},
            errorHandler: {
                warning: errorHandler,
                error: errorHandler,
                fatalError: errorHandler,
            },
        };
        var validHtml;
        try {
            // This block of code expands certain self closing tags to explicitly contain both the
            // opening and closing tag. This is due to how modern browsers handle empty XML tags if
            // the tag is empty the browser will automatically change the tag to the self closing
            // tag. This will expand all self closing tags. This needs to be done as XHTML not HTML.
            var rawXML = '<tmp>' + htmlText + '</tmp>';
            // Check if it's valid XML, err out if it isn't XML
            new DOMParser(parserOptions).parseFromString(rawXML, 'text/xml');

            rawXML = rawXML.slice(5, rawXML.length - 6);
            var split = rawXML.split('/>');

            var newXml = '';
            for (var i = 0; i < split.length - 1; i++) {
                var edsplit = split[i].split('<');
                var nodeName = edsplit[edsplit.length - 1].split(' ')[0];
                newXml += split[i] + '></' + nodeName + '>';
            }
            validHtml = newXml + split[split.length - 1];
        } catch (e) {
            // could not parse as XML, treating as HTML
            validHtml = htmlText;
        }
        // Defined according to web.conf defaults
        if (options.allowIframes === undefined) {
            options.allowIframes = true;
        }
        if (options.allowInlineStyles === undefined) {
            options.allowInlineStyles = true;
        }
        // web.conf default value for allowEmbeds is false
        // If not explicitly defined, set to true to maintain backwards compatibility
        if (options.allowEmbeds === undefined) {
            options.allowEmbeds = true;
        }
        if (options.allowedDomains === undefined) {
            options.allowedDomains = [];
        }
        // SET GLOBAL STATE.
        // Used for telemetry. Needs to be reset to prevent sending duplicate data
        gDashboardTags = [];
        gInlineStyles = [];
        gAllowInlineStyle = options.allowInlineStyles;
        gWrapEmbedTags = options.wrapEmbedTags && options.allowIframes;
        gAllowedDomains = CleanerUtil.bucketDomainsByType(options.allowedDomains);
        gDashboardTelemetry = options.dashboardTelemetry;
        gExternalUrls = new Map();

        var cleanHtmlOrDom;
        try {
            cleanHtmlOrDom = DOMPurify.sanitize(validHtml, {
                SAFE_FOR_JQUERY: true,
                ALLOW_DATA_ATTR: true,
                FORCE_BODY: true,
                // These tags and attrs are currently being used, we need to allow them
                ADD_TAGS: [
                    'iframe',
                    'embed',
                    'h7',
                    'h8',
                    'h9',
                    'splunk-search-dropdown',
                    'splunk-control-group',
                    'splunk-select',
                    'splunk-radio-input',
                    'splunk-text-area',
                    'splunk-text-input',
                    'splunk-color-picker',
                    'splunk-color',
                ],
                ADD_ATTR: [
                    'i18ntag',
                    'i18nattr',
                    'json',
                    'section-label',
                    // Needed for iframes
                    'sandbox',
                    'docsrc',
                    // <button>
                    'formaction',
                ],
                FORBID_TAGS: [
                    'script',
                    'base',
                    'link',
                    'meta',
                    'head',
                    '*[type="text/javascript"]',
                    (!options.allowEmbeds) && 'embed',
                    (!options.allowIframes || !options.allowEmbeds) && 'iframe',
                ].filter(Boolean),
                FORBID_ATTR: [
                    'allowscriptaccess',
                    (!options.allowInlineStyles) && 'style',
                ].filter(Boolean),
                RETURN_DOM: options.returnDom || false,
            });
            if (gDashboardTelemetry && window._splunk_metrics_events) {
                // Check for duplicate telemetry via hashing
                var hash = hashUtils.hashString(JSON.stringify(gInlineStyles));
                if (!window.__splunk_sent_css_telemetry__[hash]) {
                    window._splunk_metrics_events.push({
                        type: 'htmlcleaner.dashboard',
                        data: {
                            // Tests expect uppercase
                            sanitizedTags: gDashboardTags.map(x => x.toUpperCase()),
                            inlineStyles: gInlineStyles
                        },
                    });
                    window.__splunk_sent_css_telemetry__[hash] = true;
                }
            }
        } catch (err) {
            // TODO: XXX: I can't believe we silently fail here... can't change
            // the API contract since this code is 13 years old but damn isn't
            // this dangerous?
            console.error('HtmlCleaner exception while parsing. Dangerously ' +
                'returning unsafe HTML to keep the show on the road.', err);
            cleanHtmlOrDom = htmlText;
        }

        // Simplify the API for the caller - they only need to call one function
        var externalUrlsReduced = new Map();
        gExternalUrls.forEach((cleanFns, url) => {
            externalUrlsReduced.set(url, () => cleanFns.forEach(fn => fn()));
        });
        gExternalUrls.clear(); // Sure why not.

        // As of Jun 2022 these exports aren't used but GC should be OK with
        // handing them off to callers who might want them.
        return {
            cleanHtmlOrDom: cleanHtmlOrDom,
            externalUrlDomRefs: externalUrlsReduced,
            xmlTags: gDashboardTags,
            inlineStyles: gInlineStyles,
        };
    }

    return {
        /** Backwards compat wrapper. Consider using `cleanWithRefs` */
        clean(...args) {
            var cleaned = dompurifyHtml(...args);
            if (!cleaned) return null;
            return cleaned.cleanHtmlOrDom;
        },
        cleanWithRefs: dompurifyHtml,
        isBadUrl,
        isBadNodeValue,
    };
});
