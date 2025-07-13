define(
    [
     'jquery',
     'splunk.util',
     'models/SplunkDBase',
     'underscore',
     'util/xml'
    ],
    function($, splunkutil, SplunkDBaseModel, _, XML) {
        return SplunkDBaseModel.extend({
            url: "data/ui/views",
            initialize: function() {
                SplunkDBaseModel.prototype.initialize.apply(this, arguments);
            },
            isXML: function() {
                return this.entry.content.get('eai:type') === 'views';
            },
            isHTML: function() {
                return this.entry.content.get('eai:type') === 'html';
            },
            getViewType: function() {
                var typeLabel = 'n/a';
                if(this.isXML()) {
                    typeLabel = 'XML';
                } else if(this.isHTML()) {
                    typeLabel = 'HTML';
                }
                return typeLabel;
            },
            canSchedulePDF: function() {
                // We can PDF-schdedule a view if...
                return this.isSimpleXML() && // it's a simple xml dashboard
                    this.isRoot('dashboard'); // and not a form
            },
            getLabel: function() {
                return this.entry.content.get('label') || this.entry.get('name');
            },
            isRoot: function(nodeName) {
                if(!this.isXML()) {
                    return false;
                }
                var rootNodeName = this.entry.content.get('rootNode');
                if (!rootNodeName) {
                    // fall back to root node name from XML if we didn't receive it explicitly
                    var $xmlDoc = this.getReadOnly$XML();
                    var rootNode = XML.root($xmlDoc)[0];
                    if (rootNode) {
                        rootNodeName = rootNode.nodeName;
                    } else {
                        return false;
                    }
                }
                function lower(s){ return (s && s.toLowerCase()) || s; }
                return arguments.length > 1 ?
                        _.any(arguments, function(nodeName){ return lower(rootNodeName) === lower(nodeName); }) :
                        lower(rootNodeName) === lower(nodeName);
            },
            isAdvanced: function(visibility) {
                var $xmlDoc, $root, type, isVisible;
                if (!this.isRoot('view')) {
                    return false;
                }
                if (visibility) {
                    $xmlDoc = this.getReadOnly$XML();
                    $root = XML.root($xmlDoc);
                    type = $root.attr('type');
                    isVisible = $root.attr('isVisible');
                    if (type && type == 'html') {
                        return false;
                    }
                    if (isVisible && !splunkutil.normalizeBoolean(isVisible)){
                        return false;
                    }
                }
                return true;
            },
            getXMLContent: function() {
                return (this.isXML() && this.entry.content.get('eai:data')) || '<dashboard/>';
            },
            get$XML: function() {
                var data = this.getXMLContent();
                var xmlDoc;
                try {
                    xmlDoc = XML.parse(data);
                } catch (e) {
                    xmlDoc = XML.parse('<dashboard/>');
                }
                // SPL-68158 Prevent any kind of XSS when modifying XML using jQuery
                xmlDoc.find('script').remove();
                return xmlDoc;
            },
            getReadOnly$XML: function() {
                var data = this.getXMLContent();
                if (data !== this._readOnlyXML) {
                    this._readOnly$XML = this.get$XML();
                    this._readOnlyXML = data;
                }
                return this._readOnly$XML;
            },
            isDashboard: function() {
                return this.isRoot('dashboard');
            },
            isForm: function() {
                return this.isRoot('form');
            },
            isSimpleXML: function() {
                return this.isXML() && this.isRoot('dashboard', 'form');
            },
            isValidXML: function() {
                if (!this.isXML()) {
                    return false;
                }
                try {
                    XML.parse(this.entry.content.get('eai:data'));
                } catch (e) {
                    return false;
                }
                return true;
            },
            isUDFDashboard: function() {
                return this.isRoot('dashboard') && this.entry.content.get('version') == 2;
            }
        });
    }
);
