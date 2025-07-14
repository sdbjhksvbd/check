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

define("acplugins/my-files/js/ac-my-files",["plugins-common/ac-plugins"],function(e){var i=e.MyFiles;return i||(i=e.MyFiles={}),i}),define("acplugins/ac-bh",[],function(){var e=Ac.Bh;return e||(e=Ac.Bh={}),e}),define("acplugins/bh-plugin-selector-view",["core/ac-core","acplugins/ac-bh","core/views/plugin-selector-view"],function(e,i){return i.PluginSelectorView=e.PluginSelectorView.extend({getAppApiVersion:function(){return Ac.Plugins.groups.blue_heron.FRAMEWORK_VERSION}}),i.PluginSelectorView}),define("acplugins/my-files/js/views/selector-view",["acplugins/ac-bh","acplugins/my-files/js/ac-my-files","i18n!core/nls/ui-strings","core/utils/sc-analytics","acplugins/bh-plugin-selector-view"],function(e,i,n,t){return i.SelectorView=e.PluginSelectorView.extend({setAppApi:function(i){var n=this.options;i.selectionApi.isSelectingFiles()&&_.extend(n,{selectFilesScContext:!0}),e.PluginSelectorView.prototype.setAppApi.call(this,i)},getSelectorLabel:function(){return e.PluginSelectorView.prototype.getSelectorLabel.call(this)||this._getSelectorLabel()},getSiteCatalystName:function(){var e=this.options,i=e.appApi,n=e.pluginId;return i&&i.connectorsApi.isConnectorPlugin(n)?i.connectorsApi.getConnectorPluginScName(n):t.DOCUMENT_CLOUD},_getSelectorLabel:function(){return n.ACROBAT_DOT_COM_FILES_DC}}),i.SelectorView}),define("acplugins/my-files/js/selector",["acplugins/my-files/js/ac-my-files","acplugins/my-files/js/views/selector-view"],function(){return void 0});