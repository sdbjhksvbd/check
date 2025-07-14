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

define("aictools/plugins/selection-action-plugins/ccpdf/ac-selection-action-ccpdf",["plugins-common/ac-plugins"],function(e){var i=e.SelectionActionCCPDF;return i||(i=e.SelectionActionCCPDF={}),i}),define("aictools/plugins/selection-action-plugins/ccpdf/views/selector-view",["core/ac-core","aictools/plugins/selection-action-plugins/ccpdf/ac-selection-action-ccpdf","i18n!core/nls/ui-strings","core/utils/css-util","core/utils/util","core/views/plugin-selector-view"],function(e,i,t,n,o){var c=!1;return i.SelectorView=e.PluginSelectorView.extend({setAppApi:function(i){e.PluginSelectorView.prototype.setAppApi.call(this,i);var t=$.Deferred();return this._deferred=t,o.isReader()&&this.options.appApi.rnaApi.then(_.bind(function(e){c=e.rnaServicesAPI.isCombineConvertPDFAvailable(),t.resolve()},this),function(){t.reject()}),t.promise()},getSelectorLabel:function(e){return c?e===!0?t.AV2_COMBINECONVERT_PDF:t.COMBINECONVERT_PDF:void 0},getSelectorTooltip:function(e){return e===!0?t.AV2_COMBINECONVERT_PDF_TOOLTIP:t.COMBINECONVERT_PDF_TOOLTIP},getSiteCatalystName:function(){return"SelectionActionCCPDF"},getSelectorIconClass:function(){return"combineconvertpdf"},updateSelector:function(e){this._deferred.done(_.bind(function(){if(c){var i=e.selectionUiModel.getSingleSelectedItemModel(),t=e.selectionUiModel.getSelectionCountByType(),n=t.numFiles,s=t.numFolders,l=t.numNonPDFs;i&&i.isFile()?this.$item.show():o.isReader()&&(n>0&&(!_.isUndefined(l)&&l===n||0==l)&&(_.isUndefined(s)||0===s)?this.$item.show():this.$item&&this.$item.hide())}},this))}}),i.SelectorView}),define("aictools/plugins/selection-action-plugins/ccpdf/selector",["aictools/plugins/selection-action-plugins/ccpdf/views/selector-view"],function(){return void 0});