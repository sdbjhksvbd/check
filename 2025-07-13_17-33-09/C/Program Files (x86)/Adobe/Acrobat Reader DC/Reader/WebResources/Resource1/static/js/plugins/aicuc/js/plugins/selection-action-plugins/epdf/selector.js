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

define("aictools/plugins/selection-action-plugins/epdf/ac-selection-action-epdf",["plugins-common/ac-plugins"],function(e){var i=e.SelectionActionEPDF;return i||(i=e.SelectionActionEPDF={}),i}),define("aictools/plugins/selection-action-plugins/epdf/views/selector-view",["core/ac-core","aictools/plugins/selection-action-plugins/epdf/ac-selection-action-epdf","i18n!core/nls/ui-strings","core/utils/css-util","core/utils/util","core/views/plugin-selector-view"],function(e,i,t,n,o){var s=!1,c=!1;return i.SelectorView=e.PluginSelectorView.extend({setAppApi:function(i){e.PluginSelectorView.prototype.setAppApi.call(this,i);var t=$.Deferred();return this._deferred=t,o.isAcrobat()?(s=!0,t.resolve()):this.options.appApi.rnaApi.then(_.bind(function(e){s=e.rnaServicesAPI.isExportPDFAvailable(),c=e.rnaServicesAPI.isExportPDFRenameExperimentEnabled(),t.resolve()},this),function(){t.reject()}),t.promise()},getSelectorLabel:function(e){return s?c?e===!0?t.AV2_COMBINECONVERT_PDF:t.COMBINECONVERT_PDF:e===!0?t.AV2_EXPORT_PDF:t.EXPORT_PDF:void 0},getSelectorTooltip:function(e){return e===!0?t.AV2_EXPORT_FILE_VIRGO_TOOLTIP:t.EXPORT_FILE_VIRGO_TOOLTIP},getSelectorIconClass:function(){return"exportpdf"},getSiteCatalystName:function(){return"SelectionActionEPDF"},updateSelector:function(e){this._deferred.done(_.bind(function(){if(s){var i=e.selectionUiModel.getSingleSelectedItemModel(),t=e.selectionUiModel.getSelectionCountByType(),n=t.numFiles,c=t.numFolders,l=t.numNonPDFs;i&&i.isFile()?_.isUndefined(l)||1>l?this.$item.show():this.$item.hide():o.isAcrobat()?this.$item&&this.$item.hide():n>0&&(_.isUndefined(l)||0===l)&&(_.isUndefined(c)||0===c)?this.$item.show():this.$item&&this.$item.hide()}},this))}}),i.SelectorView}),define("aictools/plugins/selection-action-plugins/epdf/selector",["aictools/plugins/selection-action-plugins/epdf/views/selector-view"],function(){return void 0});