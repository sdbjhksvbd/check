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

define("aictools/plugins/selection-action-plugins/cpdf/ac-selection-action-cpdf",["plugins-common/ac-plugins"],function(e){var i=e.SelectionActionCPDF;return i||(i=e.SelectionActionCPDF={}),i}),define("aictools/plugins/selection-action-plugins/cpdf/views/selector-view",["core/ac-core","aictools/plugins/selection-action-plugins/cpdf/ac-selection-action-cpdf","i18n!core/nls/ui-strings","core/utils/css-util","core/utils/util","core/views/plugin-selector-view"],function(e,i,t,n,o){var c=!1;return i.SelectorView=e.PluginSelectorView.extend({setAppApi:function(i){e.PluginSelectorView.prototype.setAppApi.call(this,i);var t=$.Deferred();return this._deferred=t,o.isAcrobat()?(c=!0,t.resolve()):this.options.appApi.rnaApi.then(_.bind(function(e){c=e.rnaServicesAPI.isCreatePDFAvailable(),t.resolve()},this),function(){t.reject()}),t.promise()},getSelectorLabel:function(e){return c?e===!0?t.AV2_CREATE_PDF:t.CREATE_PDF:void 0},getSelectorTooltip:function(e){return e===!0?t.AV2_CREATE_PDF_TOOLTIP:t.CREATE_PDF_TOOLTIP},getSiteCatalystName:function(){return"SelectionActionCPDF"},getSelectorIconClass:function(){return"createpdf"},updateSelector:function(e){this._deferred.done(_.bind(function(){if(c){var i=e.selectionUiModel.getSingleSelectedItemModel(),t=e.selectionUiModel.getSelectionCountByType(),n=t.numFiles,s=t.numFolders,l=t.numNonPDFs;i&&i.isFile()?_.isUndefined(l)||1>l?this.$item.hide():this.$item.show():o.isAcrobat()?this.$item&&this.$item.hide():n>0&&!_.isUndefined(l)&&l===n&&(_.isUndefined(s)||0===s)?this.$item.show():this.$item&&this.$item.hide()}},this))}}),i.SelectorView}),define("aictools/plugins/selection-action-plugins/cpdf/selector",["aictools/plugins/selection-action-plugins/cpdf/views/selector-view"],function(){return void 0});