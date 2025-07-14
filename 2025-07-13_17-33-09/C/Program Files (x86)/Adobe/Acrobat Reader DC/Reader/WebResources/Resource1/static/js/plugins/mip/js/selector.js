/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2021 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

define("pdmplugins/mip/js/ac-mip",["plugins-common/ac-plugins"],function(i){var e=i.Mip;return e||(e=i.Mip={}),e.PLUGIN_ID||(e.PLUGIN_ID="mip"),e}),define("pdmplugins/mip/js/views/selector-view",["core/ac-core","pdmplugins/mip/js/ac-mip","core/views/plugin-selector-view"],function(i,e){return e.SelectorView=i.PluginSelectorView.extend({initialize:function(){i.PluginSelectorView.prototype.initialize.call(this),e.selector=this},getSelectorLabel:function(){return"mip"},setAppApi:function(e){i.PluginSelectorView.prototype.setAppApi.call(this,e)}}),e.SelectorView}),define("pdmplugins/mip/js/selector",["pdmplugins/mip/js/ac-mip","pdmplugins/mip/js/views/selector-view"],function(){return void 0});