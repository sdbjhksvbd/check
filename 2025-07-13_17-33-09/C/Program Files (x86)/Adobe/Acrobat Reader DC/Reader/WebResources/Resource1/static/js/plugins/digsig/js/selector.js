/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
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

define("digsig/js/ac-digsig",["plugins-common/ac-plugins"],function(i){var e=i.DigSig;return e||(i.DigSig=e={}),e.Reader||(e.Reader={}),e.APP_API_VERSION="dev",e}),define("digsig/js/views/selector-view",["core/ac-core","digsig/js/ac-digsig","core/views/plugin-selector-view"],function(i,e){return e.SelectorView=i.PluginSelectorView.extend({getAppApiVersion:function(){return e.APP_API_VERSION},setAppApi:function(t){i.PluginSelectorView.prototype.setAppApi.call(this,t),e.QueryParams=t.routerApi.parseQueryParams(window.location.href.slice(window.location.href.indexOf("?"))),t.routerApi.route("digsig?:params",this._onDigSigRoute)},getSelectorLabel:function(){return"DigSig"},getSelectorIconClass:function(){return"digsig-icon"},getSiteCatalystName:function(){return"DigSig"},_onDigSigRoute:function(){var i=this.options;i.appApi.pluginsApi.selectPlugin(i.pluginId)}}),e.SelectorView}),define("digsig/js/selector",["digsig/js/views/selector-view"],function(){return void 0});