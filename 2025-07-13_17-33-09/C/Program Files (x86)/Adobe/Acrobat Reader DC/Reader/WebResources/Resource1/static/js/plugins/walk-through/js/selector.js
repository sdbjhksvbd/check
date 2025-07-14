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

define("acplugins/walk-through/js/ac-walk-through",["plugins-common/ac-plugins"],function(e){var r=e.WalkThrough;return r||(e.WalkThrough=r={}),r}),define("acplugins/walk-through/js/views/selector-view",["core/ac-core","acplugins/walk-through/js/ac-walk-through","core/views/plugin-selector-view"],function(e,r){return r.SelectorView=e.PluginSelectorView.extend({getAppApiVersion:function(){return r.APP_API_VERSION},setAppApi:function(i){e.PluginSelectorView.prototype.setAppApi.call(this,i),r.QueryParams=i.routerApi.parseQueryParams(window.location.href.slice(window.location.href.indexOf("?"))),i.routerApi.route("walk_through?:params",this._onWTRoute)},getSelectorLabel:function(){return"WalkThrough"},getSiteCatalystName:function(){return"WalkThrough"},_onWTRoute:function(e){var i=this.options;r.QueryParams=e,i.appApi.pluginsApi.selectPlugin(i.pluginId)}}),r.SelectorView}),define("acplugins/walk-through/js/selector",["acplugins/walk-through/js/views/selector-view"],function(){return void 0});