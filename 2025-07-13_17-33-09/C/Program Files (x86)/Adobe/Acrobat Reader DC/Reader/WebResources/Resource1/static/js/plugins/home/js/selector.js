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

define("acplugins/ac-bh",[],function(){var e=Ac.Bh;return e||(e=Ac.Bh={}),e}),define("acplugins/home/js/ac-home",["plugins-common/ac-plugins"],function(e){var t=e.Home;return t||(e.Home=t={}),t}),define("acplugins/bh-plugin-selector-view",["core/ac-core","acplugins/ac-bh","core/views/plugin-selector-view"],function(e,t){return t.PluginSelectorView=e.PluginSelectorView.extend({getAppApiVersion:function(){return Ac.Plugins.groups.blue_heron.FRAMEWORK_VERSION}}),t.PluginSelectorView}),define("acplugins/home/js/views/selector-view",["core/ac-core","acplugins/ac-bh","acplugins/home/js/ac-home","i18n!core/nls/ui-strings","acplugins/bh-plugin-selector-view"],function(e,t,n,o){return n.SelectorView=t.PluginSelectorView.extend({setAppApi:function(e){var n,o=this.options,i=e.connectorsApi,r=e.routerApi;t.PluginSelectorView.prototype.setAppApi.call(this,e),o.noUrlUpdate||(r.route("documentcloud",this._onDocumentCloud).route("folder/:id",this._onFolderRoute).route("files/*filters(/)",this._onFilesRoute).route("file/:id",this._onFileRoute),n=i.getConnectorsUiHelpers(),_.each(n.order_for_left_rail,_.bind(function(e){r.route(e.name,this._onConnectorRoute)},this)),r.route("add_account_success/:id",this._onAddAccountSuccess))},getSelectorLabel:function(){return o.FILES},getSelectorIconClass:function(){return"home-toolbar-icon"},getSiteCatalystName:function(){return"Files"},_onDocumentCloud:function(){var e=this.options.appApi,t=e.connectorsApi.getConnector("root");t.length>0?this._gotoFolder(t[0].id):this._selectMyFilesPlugin()},_onFolderRoute:function(e){var t,n=this.options.appApi.routerApi.getQueryParams();t=n.view,this._getPluginId(e).then(_.bind(function(n){this._selectMyFilesPlugin({pluginId:n},{routeFolderId:e,routeViewType:t})},this))},_onFilesRoute:function(e){var t,n=this.options.appApi,o=this._getResolvedPromise(),i=n.connectorsApi.getConnectorPluginId("root");t=n.routerApi.getQueryParams().root,t&&(t=decodeURIComponent(t),o=this._getPluginId(t)),o.then(_.bind(function(t){return this._selectMyFilesPlugin({pluginId:t||i},{routeFilesFilters:e})},this))},_onFileRoute:function(e){this._getParentFolderId(e).then(_.bind(function(t){this._getPluginId(t).then(_.bind(function(t){this._selectMyFilesPlugin({pluginId:t,noHistoryEffect:!0,noSelectionEffect:!0},{routeFileId:e,noHistoryEffect:!0})},this))},this),_.bind(function(){this._gotoFolder()},this))},_onConnectorRoute:function(){var e=this.options.appApi,t=e.routerApi.getCurrentPath();t&&this._selectMyFilesPlugin({pluginId:t})},_onAddAccountSuccess:function(e){var t,n=this.options.appApi;e&&(t=n.connectorsApi.getConnector(e),t.length>0?this._onFolderRoute(t[0].id):this._selectMyFilesPlugin({pluginId:"add_account"}))},_getPluginId:function(e){var t,n,o=$.Deferred(),i=this.options.appApi,r=i.folderApi,s=i.connectorsApi,u=s.getConnectors();return e||(e=r.getRootFolderId()),this._getRootFolderId(e).then(function(e){n=_.filter(u,function(t){return t.id===e}),0===n.length&&(e=r.getRootFolderId()),t=s.getConnectorPluginId(s.getConnectorName(e),e,!1),o.resolve(t)}),o.promise()},_getRootFolderId:function(t){var n=this.options;return n.appApi.sessionApi.ensureSignedIn().then(_.bind(function(){return e.opFactory.create("GettingFolderPathOp",n).run(t).then(function(e){return $.Deferred().resolve(e.path[0].id,t).promise()},_.bind(function(){this._gotoFolder()},this))},this))},_getParentFolderId:function(t){var n=this.options;return n.appApi.sessionApi.ensureSignedIn().then(function(){e.opFactory.create("GettingAssetMetadataOp",n).run(t).then(function(e){return $.Deferred().resolve(e.parent_id).promise()})})},_gotoFolder:function(e){var t=this.options.appApi;e||(e=t.folderApi.getRootFolderId()),t.routerApi.navigate("folder/"+encodeURIComponent(e),{replace:!0,trigger:!0})},_selectMyFilesPlugin:function(e,t){function n(e){return _.extend({},o,e)}var o=this.options,i=o.appApi,r=i.pluginsApi;return r.selectPluginIfNotSelected(o.pluginId,n(e)).then(_.bind(function(){return e=e||{},r.getPluginUiModel(e.pluginId)||(e.pluginId=r.getDefaultPluginId("home_views")),r.selectPlugin(e.pluginId,n(t))},this))}}),n.SelectorView}),define("acplugins/home/js/selector",["acplugins/home/js/views/selector-view"],function(){return void 0});