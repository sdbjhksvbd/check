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

define("acplugins/task-handler/js/ac-task-handler",["plugins-common/ac-plugins"],function(e){var n=e.TaskHandler;return n||(e.TaskHandler=n={}),n.APP_API_VERSION="dev",n.PLUGIN_ID||(n.PLUGIN_ID="task_handler"),n}),define("acplugins/task-handler/js/nls/ui-strings",{root:!0,"xx-xx":!0,"de-de":!0,"en-gb":!0,"es-es":!0,"fr-fr":!0,"it-it":!0,"ja-jp":!0,"da-dk":!0,"fi-fi":!0,"nb-no":!0,"nl-nl":!0,"pt-br":!0,"sv-se":!0}),define("acplugins/task-handler/js/nls/root/ui-strings",{EXAMPLE:"Example"}),define("acplugins/task-handler/js/views/selector-view",["core/ac-core","acplugins/task-handler/js/ac-task-handler","i18n!acplugins/task-handler/js/nls/ui-strings","core/views/plugin-selector-view"],function(e,n,t){return n.SelectorView=e.PluginSelectorView.extend({getAppApiVersion:function(){return n.APP_API_VERSION},setAppApi:function(n){e.PluginSelectorView.prototype.setAppApi.call(this,n),n.routerApi.route("task_handler",this._onExampleRoute)},getSelectorLabel:function(){return t.EXAMPLE},getSelectorIconClass:function(){return"example-toolbar-icon"},getSiteCatalystName:function(){return"task_handler"},_onExampleRoute:function(){var e=this.options;e.appApi.pluginsApi.selectPlugin(e.pluginId)}}),n.SelectorView}),define("acplugins/task-handler/js/selector",["acplugins/task-handler/js/views/selector-view"],function(){return void 0});