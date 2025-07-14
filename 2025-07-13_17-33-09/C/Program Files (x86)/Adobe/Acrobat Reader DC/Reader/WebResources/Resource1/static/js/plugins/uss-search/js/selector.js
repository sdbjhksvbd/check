/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property laws,
* including trade secret and or copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property laws,
* including trade secret and or copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

define("acplugins/ac-bh",[],function(){var e=Ac.Bh;return e||(e=Ac.Bh={}),e}),define("acplugins/uss-search/js/ac-uss-search",["plugins-common/ac-plugins"],function(e){var c=e.USSSearch;return c||(e.USSSearch=c={}),c.PLUGIN_ID||(c.PLUGIN_ID="uss_search"),c}),define("acplugins/bh-plugin-selector-view",["core/ac-core","acplugins/ac-bh","core/views/plugin-selector-view"],function(e,c){return c.PluginSelectorView=e.PluginSelectorView.extend({getAppApiVersion:function(){return Ac.Plugins.groups.blue_heron.FRAMEWORK_VERSION}}),c.PluginSelectorView}),define("acplugins/uss-search/js/views/selector-view",["core/ac-core","acplugins/ac-bh","acplugins/uss-search/js/ac-uss-search","i18n!core/nls/ui-strings","acplugins/bh-plugin-selector-view"],function(e,c,n,s){return n.SelectorView=c.PluginSelectorView.extend({getSelectorLabel:function(){return s.SEARCH},getSelectorIconClass:function(){return"core-search-icon"},getSiteCatalystName:function(){return"USSSearch"}}),n.SelectorView}),define("acplugins/uss-search/js/selector",["acplugins/uss-search/js/views/selector-view"],function(){return void 0});