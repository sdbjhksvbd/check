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

define("aictools/plugins/selection-action-plugins/epdf/ac-selection-action-epdf",["plugins-common/ac-plugins"],function(e){var i=e.SelectionActionEPDF;return i||(i=e.SelectionActionEPDF={}),i}),define("aictools/plugins/selection-action-plugins/epdf/views/plugin-view",["core/ac-core","aictools/plugins/selection-action-plugins/epdf/ac-selection-action-epdf","core/utils/util","core/views/plugin-content-view"],function(e,i,n){return i.PluginView=e.PluginContentView.extend({initialize:function(i){e.PluginContentView.prototype.initialize.call(this,i)},selectPlugin:function(){var e,i,t,o=this.options.appApi.selectionApi.getSelectedItemModels(),s=[],p=[],c={},l=this.options.appApi.pluginsApi,a=[];if(o){if(_.each(o,function(e){e.isFolder()||(_.isEmpty(e.id)||e.isRecentFileItem?p.push(e._proxy):s.push(e.id))}),i=l.getSelectedPluginId("home_views"),t=l.getPluginUiModel(i),t&&t.id===i&&(e=t.get("plugin_api"),e&&(a=l.callPluginApiMethod(e,"getFolderAncestorIds"))),s.length>0)return this.options.appApi.rnaApi.done(_.bind(function(e){return n.isAcrobat()?e.rnaServicesAPI.isExportPDFCEF()?(c.selectedAssetIds=s,c.appName="ExportPDFApp",e.servicesApi({methodName:"launchServicesApp",methodArgs:c})):(c.selectedAssetId=s[0],c.appName="ExportPDFApp",c.ancestorIds=a,e.invokeMethod({methodName:"launchNativeConversionApp",methodArgs:c})):(c.selectedAssetIds=s,c.appName="EPDFAppFull",e.servicesApi({methodName:"launchServicesApp",methodArgs:c}))},this));if(p.length>0)return this.options.appApi.rnaApi.done(_.bind(function(e){return n.isAcrobat()?e.rnaServicesAPI.isExportPDFCEF()?(c.selectedItemModels=p,c.appName="ExportPDFApp",e.servicesApi({methodName:"launchServicesApp",methodArgs:c})):(c.selectedItemModel=p[0],c.appName="ExportPDFApp",c.ancestorIds=a,e.invokeMethod({methodName:"launchNativeConversionApp",methodArgs:c})):(c.selectedItemModels=p,c.appName="EPDFAppFull",e.servicesApi({methodName:"launchServicesApp",methodArgs:c}))},this))}},deselectPlugin:function(){e.PluginContentView.prototype.deselectPlugin.call(this)},getSiteCatalystName:function(){return"SelectionActionEPDF"},_initWrappers:function(){return void 0},_renderChildViews:function(){return void 0}}),i.PluginView}),define("aictools/plugins/selection-action-plugins/epdf/selection-action-epdf",["aictools/plugins/selection-action-plugins/epdf/ac-selection-action-epdf","aictools/plugins/selection-action-plugins/epdf/views/plugin-view"],function(e){_.extend(e,{init:function(){return void 0}})}),define("aictools/plugins/selection-action-plugins/epdf/plugin",["aictools/plugins/selection-action-plugins/epdf/ac-selection-action-epdf","aictools/plugins/selection-action-plugins/epdf/selection-action-epdf"],function(e){e.init()});