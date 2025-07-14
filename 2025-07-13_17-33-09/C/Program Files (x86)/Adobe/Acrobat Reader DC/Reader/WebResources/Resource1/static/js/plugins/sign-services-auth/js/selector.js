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

define("pdmplugins/sign-services-auth/js/ac-sign-services-auth",["plugins-common/ac-plugins"],function(e){console.log("ac-sign-services-auth");var i=e.AcSignServicesAuth;return i||(i=e.SignServicesAuth={}),i.PLUGIN_ID||(i.PLUGIN_ID="sign_services_auth"),i}),define("pdmplugins/sign-services-auth/js/views/selector-view",["core/ac-core","plugins-common/ac-plugins","pdmplugins/sign-services-auth/js/ac-sign-services-auth","core/views/plugin-selector-view"],function(e,i,s){return s.SelectorView=e.PluginSelectorView.extend({initialize:function(){console.log("selector-view.js:initialize"),e.PluginSelectorView.prototype.initialize.call(this),s.selector=this},getSelectorLabel:function(){return console.log("selector-view.js:getSelectorLabel"),"sign_services_auth"},setAppApi:function(i){console.log("selector-view.js:setAppApi"),e.PluginSelectorView.prototype.setAppApi.call(this,i),s.QueryParams=i.routerApi.parseQueryParams(window.location.href.slice(window.location.href.indexOf("?"))),i.routerApi.route("sign_services_auth?:params",this._onSignServicesAuthRoute)},_onSignServicesAuthRoute:function(){var e=this.options;e.appApi.pluginsApi.selectPlugin(e.pluginId)}}),s.SelectorView}),define("pdmplugins/sign-services-auth/js/selector",["pdmplugins/sign-services-auth/js/ac-sign-services-auth","pdmplugins/sign-services-auth/js/views/selector-view"],function(){return void console.log("se")});