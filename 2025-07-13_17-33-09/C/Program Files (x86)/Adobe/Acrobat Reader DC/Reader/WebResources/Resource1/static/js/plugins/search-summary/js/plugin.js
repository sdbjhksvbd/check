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

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2018 Adobe Systems Incorporated
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

define("pdmplugins/search-summary/js/ac-search-summary",["plugins-common/ac-plugins"],function(s){var e=s.SearchSummary;return e||(e=s.SearchSummary={}),e.PLUGIN_ID||(e.PLUGIN_ID="search_summary"),e}),define("pdmplugins/search-summary/js/views/plugin-view",["core/ac-core-init","pdmplugins/search-summary/js/ac-search-summary","core/views/plugin-content-view"],function(s,e){return e.PluginView=s.PluginContentView.extend({}),e.PluginView}),define("pdmplugins/search-summary/js/search-summary",["pdmplugins/search-summary/js/ac-search-summary","pdmplugins/search-summary/js/views/plugin-view"],function(s){_.extend(s,{init:function(){}})}),define("pdmplugins/search-summary/js/plugin",["core/ac-core-init","pdmplugins/search-summary/js/ac-search-summary","pdmplugins/search-summary/js/search-summary"],function(s,e){e.init()});