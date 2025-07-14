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

define("acplugins/ac-bh",[],function(){var e=Ac.Bh;return e||(e=Ac.Bh={}),e}),define("acplugins/add-account/js/ac-add-account",["plugins-common/ac-plugins"],function(e){var n=e.AddAccount;return n||(n=e.AddAccount={}),n}),define("acplugins/bh-plugin-selector-view",["core/ac-core","acplugins/ac-bh","core/views/plugin-selector-view"],function(e,n){return n.PluginSelectorView=e.PluginSelectorView.extend({getAppApiVersion:function(){return Ac.Plugins.groups.blue_heron.FRAMEWORK_VERSION}}),n.PluginSelectorView}),define("acplugins/add-account/js/views/selector-view",["plugins-common/ac-plugins","acplugins/ac-bh","acplugins/add-account/js/ac-add-account","i18n!core/nls/ui-strings","acplugins/bh-plugin-selector-view"],function(e,n,i,c){return i.SelectorView=n.PluginSelectorView.extend({getSelectorLabel:function(){return c.ADD_ACCOUNT},setAppApi:function(i){var c=i.pluginsApi,t=this.options.pluginId;return n.PluginSelectorView.prototype.setAppApi.call(this,i),i.routerApi.route("add_account",function(){c.selectPluginIfNotSelected(e.HOME).then(function(){c.selectPlugin(t)})}),i.selectionApi.isRunningInFileSelection()&&i.rnaApi.done(function(e){e.isAddAccountVisibleInFileSelDlg().then(function(e){e||i.pluginsApi.showPlugin(t,!1)})}),this._getResolvedPromise()},getSiteCatalystName:function(){return"AddAccount"},isRemovable:function(){return!1}}),i.SelectorView}),define("acplugins/add-account/js/selector",["acplugins/add-account/js/views/selector-view"],function(){return void 0});