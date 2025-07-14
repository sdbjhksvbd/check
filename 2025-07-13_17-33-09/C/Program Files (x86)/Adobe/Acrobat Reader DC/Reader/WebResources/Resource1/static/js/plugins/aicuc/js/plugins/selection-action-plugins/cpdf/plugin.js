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

define("aictools/plugins/selection-action-plugins/cpdf/ac-selection-action-cpdf",["plugins-common/ac-plugins"],function(e){var i=e.SelectionActionCPDF;return i||(i=e.SelectionActionCPDF={}),i}),define("aictools/plugins/selection-action-plugins/cpdf/views/plugin-view",["core/ac-core","aictools/plugins/selection-action-plugins/cpdf/ac-selection-action-cpdf","core/utils/util","core/views/plugin-content-view"],function(e,i,n){return i.PluginView=e.PluginContentView.extend({initialize:function(i){e.PluginContentView.prototype.initialize.call(this,i)},selectPlugin:function(){var e=this.options.appApi.selectionApi.getSelectedItemModels(),i=[],t=[],o={};if(e){if(_.each(e,function(e){e.isFolder()||(_.isEmpty(e.id)?t.push(e._proxy):i.push(e.id))}),i.length>0)return this.options.appApi.rnaApi.done(_.bind(function(e){return n.isAcrobat()?e.rnaServicesAPI.isCreatePDFCEF()?(o.selectedAssetIds=i,o.appName="CreatePDFApp",e.servicesApi({methodName:"launchServicesApp",methodArgs:o})):(o.selectedAssetId=i[0],o.appName="CreatePDFApp",e.invokeMethod({methodName:"launchNativeConversionApp",methodArgs:o})):(o.selectedAssetIds=i,o.appName="CPDFAppFull",e.servicesApi({methodName:"launchServicesApp",methodArgs:o}))},this));if(t.length>0)return this.options.appApi.rnaApi.done(_.bind(function(e){return n.isAcrobat()?e.rnaServicesAPI.isCreatePDFCEF()?(o.selectedItemModels=t,o.appName="CreatePDFApp",e.servicesApi({methodName:"launchServicesApp",methodArgs:o})):(o.selectedItemModel=t[0],o.appName="CreatePDFApp",e.invokeMethod({methodName:"launchNativeConversionApp",methodArgs:o})):(o.selectedItemModels=t,o.appName="CPDFAppFull",e.servicesApi({methodName:"launchServicesApp",methodArgs:o}))},this))}},getSiteCatalystName:function(){return"SelectionActionCPDF"},_initWrappers:function(){return void 0},_renderChildViews:function(){return void 0}}),i.PluginView}),define("aictools/plugins/selection-action-plugins/cpdf/selection-action-cpdf",["aictools/plugins/selection-action-plugins/cpdf/ac-selection-action-cpdf","aictools/plugins/selection-action-plugins/cpdf/views/plugin-view"],function(e){_.extend(e,{init:function(){return void 0}})}),define("aictools/plugins/selection-action-plugins/cpdf/plugin",["aictools/plugins/selection-action-plugins/cpdf/ac-selection-action-cpdf","aictools/plugins/selection-action-plugins/cpdf/selection-action-cpdf"],function(e){e.init()});