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

define("pdmplugins/search-summary/js/ac-search-summary",["plugins-common/ac-plugins"],function(s){var e=s.SearchSummary;return e||(e=s.SearchSummary={}),e.PLUGIN_ID||(e.PLUGIN_ID="search_summary"),e}),define("pdmplugins/search-summary/js/nls/ui-strings",{root:!0,"xx-xx":!0,"ar-ae":!0,"ca-es":!0,"cs-cz":!0,"da-dk":!0,"de-de":!0,"en-ae":!0,"en-gb":!0,"en-il":!0,"es-es":!0,"eu-es":!0,"fi-fi":!0,"fr-fr":!0,"fr-ma":!0,"he-il":!0,"hr-hr":!0,"hu-hu":!0,"it-it":!0,"ja-jp":!0,"ko-kr":!0,"nb-no":!0,"nl-nl":!0,"pl-pl":!0,"pt-br":!0,"ro-ro":!0,"ru-ru":!0,"sk-sk":!0,"sl-si":!0,"sl-sl":!0,"sv-se":!0,"tr-tr":!0,"uk-ua":!0,"zh-cn":!0,"zh-tw":!0,"bg-bg":!0}),define("pdmplugins/search-summary/js/nls/root/ui-strings",{SEARCH_SUMMARY_LABEL:"All"}),define("pdmplugins/search-summary/js/views/selector-view",["core/ac-core-init","pdmplugins/search-summary/js/ac-search-summary","i18n!pdmplugins/search-summary/js/nls/ui-strings","core/views/plugin-selector-view"],function(s,e,r){return e.SelectorView=s.PluginSelectorView.extend({getSelectorLabel:function(){return r.SEARCH_SUMMARY_LABEL}}),e.SelectorView}),define("pdmplugins/search-summary/js/selector",["pdmplugins/search-summary/js/ac-search-summary","pdmplugins/search-summary/js/views/selector-view"],function(){});