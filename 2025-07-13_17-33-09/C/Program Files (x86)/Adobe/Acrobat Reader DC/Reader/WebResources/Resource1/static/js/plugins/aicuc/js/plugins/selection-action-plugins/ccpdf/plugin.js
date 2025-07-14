/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright [2020] Adobe
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

define("aictools/plugins/selection-action-plugins/ccpdf/ac-selection-action-ccpdf",["plugins-common/ac-plugins"],function(i){var e=i.SelectionActionCCPDF;return e||(e=i.SelectionActionCCPDF={}),e}),define("aictools/plugins/selection-action-plugins/ccpdf/views/plugin-view",["core/ac-core","aictools/plugins/selection-action-plugins/ccpdf/ac-selection-action-ccpdf","core/utils/util","core/views/plugin-content-view"],function(i,e,n){return e.PluginView=i.PluginContentView.extend({initialize:function(e){i.PluginContentView.prototype.initialize.call(this,e)},getSelectionCountByType:function(i){var e=0,n=0,t=0,o=0,c=0;return _.each(i,function(i){i.isFile()?(e+=1,i.isForm()?t+=1:i.isPDF()||(c+=1)):i.isFolder()&&(n+=1),i.isNative()||(o+=1)}),{numFiles:e,numFolders:n,numExternal:o,numForms:t,numNonPDFs:c}},selectPlugin:function(){var i=this.options.appApi.selectionApi.getSelectedItemModels(),e=[],t=[],o={};if(i){_.each(i,function(i){i.isFolder()||(_.isEmpty(i.id)?t.push(i._proxy):e.push(i.id))});var c=this.getSelectionCountByType(i),s=c.numFiles,l=c.numFolders,u=c.numNonPDFs;if(e.length>0)return this.options.appApi.rnaApi.done(_.bind(function(i){return n.isReader()?(o.selectedAssetIds=e,s>0&&(o.appName="ConvertPDFAppFull",_.isUndefined(u)||u!==s||!_.isUndefined(l)&&0!==l?!_.isUndefined(u)&&0!==u||!_.isUndefined(l)&&0!==l||(o.layoutName="ExportPDFLayout"):o.layoutName="CreatePDFLayout"),i.servicesApi({methodName:"launchServicesApp",methodArgs:o})):void 0},this));if(t.length>0)return this.options.appApi.rnaApi.done(_.bind(function(i){return n.isReader()?(o.selectedItemModels=t,s>0&&(o.appName="ConvertPDFAppFull",s>0&&!_.isUndefined(u)&&u===s&&(_.isUndefined(l)||0===l)?o.layoutName="CreatePDFLayout":s>0&&(_.isUndefined(u)||0===u)&&(_.isUndefined(l)||0===l)&&(o.layoutName="ExportPDFLayout")),i.servicesApi({methodName:"launchServicesApp",methodArgs:o})):void 0},this))}},deselectPlugin:function(){i.PluginContentView.prototype.deselectPlugin.call(this)},getSiteCatalystName:function(){return"SelectionActionCCPDF"},_initWrappers:function(){return void 0},_renderChildViews:function(){return void 0}}),e.PluginView}),define("aictools/plugins/selection-action-plugins/ccpdf/selection-action-ccpdf",["aictools/plugins/selection-action-plugins/ccpdf/ac-selection-action-ccpdf","aictools/plugins/selection-action-plugins/ccpdf/views/plugin-view"],function(i){_.extend(i,{init:function(){return void 0}})}),define("aictools/plugins/selection-action-plugins/ccpdf/plugin",["aictools/plugins/selection-action-plugins/ccpdf/ac-selection-action-ccpdf","aictools/plugins/selection-action-plugins/ccpdf/selection-action-ccpdf"],function(i){i.init()});