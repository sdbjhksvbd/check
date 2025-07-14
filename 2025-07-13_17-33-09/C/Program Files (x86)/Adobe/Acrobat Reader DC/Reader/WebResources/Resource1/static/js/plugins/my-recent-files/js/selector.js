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
*  Copyright 2014 Adobe Systems Incorporated
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

define("acplugins/my-files/js/ac-my-files",["plugins-common/ac-plugins"],function(e){var i=e.MyFiles;return i||(i=e.MyFiles={}),i}),define("acplugins/my-recent-files/js/ac-my-recent-files",["plugins-common/ac-plugins"],function(e){var i=e.MyRecentFiles;return i||(i=e.MyRecentFiles={}),i}),define("acplugins/my-recent-files/js/nls/ui-strings",{root:!0,"xx-xx":!0,"ar-ae":!0,"ca-es":!0,"cs-cz":!0,"da-dk":!0,"de-de":!0,"en-ae":!0,"en-gb":!0,"en-il":!0,"es-es":!0,"eu-es":!0,"fi-fi":!0,"fr-fr":!0,"fr-ma":!0,"he-il":!0,"hr-hr":!0,"hu-hu":!0,"it-it":!0,"ja-jp":!0,"ko-kr":!0,"nb-no":!0,"nl-nl":!0,"pl-pl":!0,"pt-br":!0,"ro-ro":!0,"ru-ru":!0,"sk-sk":!0,"sl-si":!0,"sl-sl":!0,"sv-se":!0,"tr-tr":!0,"uk-ua":!0,"zh-cn":!0,"zh-tw":!0,"bg-bg":!0}),define("acplugins/my-recent-files/js/nls/root/ui-strings",{SELECTOR_LABEL:"Recent",MY_RECENT_FILES:"My Recent Files",NO_RECENT_FILES:"No Recent Files",NO_SEARCH_RESULTS:"No Search Results.",TRY_DIFFERENT_SEARCH:"Please try a different search."}),define("acplugins/ac-bh",[],function(){var e=Ac.Bh;return e||(e=Ac.Bh={}),e}),define("acplugins/bh-plugin-selector-view",["core/ac-core","acplugins/ac-bh","core/views/plugin-selector-view"],function(e,i){return i.PluginSelectorView=e.PluginSelectorView.extend({getAppApiVersion:function(){return Ac.Plugins.groups.blue_heron.FRAMEWORK_VERSION}}),i.PluginSelectorView}),define("acplugins/my-files/js/views/selector-view",["acplugins/ac-bh","acplugins/my-files/js/ac-my-files","i18n!core/nls/ui-strings","core/utils/sc-analytics","acplugins/bh-plugin-selector-view"],function(e,i,n,t){return i.SelectorView=e.PluginSelectorView.extend({setAppApi:function(i){var n=this.options;i.selectionApi.isSelectingFiles()&&_.extend(n,{selectFilesScContext:!0}),e.PluginSelectorView.prototype.setAppApi.call(this,i)},getSelectorLabel:function(){return e.PluginSelectorView.prototype.getSelectorLabel.call(this)||this._getSelectorLabel()},getSiteCatalystName:function(){var e=this.options,i=e.appApi,n=e.pluginId;return i&&i.connectorsApi.isConnectorPlugin(n)?i.connectorsApi.getConnectorPluginScName(n):t.DOCUMENT_CLOUD},_getSelectorLabel:function(){return n.ACROBAT_DOT_COM_FILES_DC}}),i.SelectorView}),define("acplugins/my-recent-files/js/views/selector-view",["acplugins/my-files/js/ac-my-files","acplugins/my-recent-files/js/ac-my-recent-files","plugins-common/ac-plugins","i18n!acplugins/my-recent-files/js/nls/ui-strings","core/utils/sc-analytics","acplugins/my-files/js/views/selector-view"],function(e,i,n,t,s){return i.SelectorView=e.SelectorView.extend({setPluginOptions:function(i){var n=this.options;_.isUndefined(i)||(e.SelectorView.prototype.setPluginOptions.call(this,i),i.showRecent||n.appApi.pluginsApi.showPlugin(n.pluginId,!1))},getSelectorLabel:function(){return t.SELECTOR_LABEL},getSiteCatalystName:function(){return s.RECENT_FILES},setAppApi:function(i){e.SelectorView.prototype.setAppApi.call(this,i),this.options.appApi.routerApi.route("recent",this._onRecentRoute).route("recent/*filter",this._onRecentFilterRoute)},_onRecentRoute:function(){this._selectMyRecentFilesPlugin()},_onRecentFilterRoute:function(e){this._selectMyRecentFilesPlugin(void 0,{routeRecentFilters:e})},_selectMyRecentFilesPlugin:function(e,i){var t=this.options,s=t.appApi.pluginsApi;return s.selectPluginIfNotSelected(n.HOME,_.extend({},t,e)).then(function(){return s.selectPlugin(n.MY_RECENT_FILES,_.extend({},t,i))})}}),i.SelectorView}),define("acplugins/my-recent-files/js/selector",["acplugins/my-recent-files/js/views/selector-view"],function(){return void 0});