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

define("acplugins/combinepdf/js/ac-combinepdf",["plugins-common/ac-plugins"],function(e){var n=e.CombinePDF;return n||(n=e.CombinePDF={}),n}),define("acplugins/combinepdf/js/nls/ui-strings",{root:!0,"xx-xx":!0,"de-de":!0,"en-gb":!0,"es-es":!0,"fr-fr":!0,"it-it":!0,"ja-jp":!0,"da-dk":!0,"fi-fi":!0,"nb-no":!0,"nl-nl":!0,"pt-br":!0,"sv-se":!0,"zh-cn":!0,"zh-tw":!0,"ko-kr":!0,"cs-cz":!0,"hu-hu":!0,"pl-pl":!0,"ru-ru":!0,"uk-ua":!0,"tr-tr":!0,"sk-sk":!0,"sl-si":!0,"bg-bg":!0}),define("acplugins/combinepdf/js/nls/root/ui-strings",{COMBINE_PDF:"Combine PDF Files",COMBINE_PDF_TOOL_VIEW_TITLE_RHP:"Combine two or more files into a single PDF",COMBINE_PDF_ICON_TOOLTIP:"Learn more",COMBINE_PDF_START:"Learn more",COMBINE_PDF_HEADING:"Adobe Acrobat Pro",COMBINE_PDF_RHP_GO_URL:"http://www.adobe.com/go/combinerhprdr_12_0_11"}),define("acplugins/combinepdf/js/views/selector-view",["core/ac-core","acplugins/combinepdf/js/ac-combinepdf","i18n!acplugins/combinepdf/js/nls/ui-strings","core/views/plugin-selector-view"],function(e,n,i){return n.SelectorView=e.PluginSelectorView.extend({getSelectorLabel:function(){return i.COMBINE_PDF},getSelectorIconClass:function(){return"combinepdf-toolbar-icon"},getSiteCatalystName:function(){return"combinepdf"}}),n.SelectorView}),define("acplugins/combinepdf/js/ops/plugin/starting-plugin-op",["core/ac-core","acplugins/combinepdf/js/ac-combinepdf","core/ops/op"],function(e,n){return n.StartingPluginOp=e.Op.extend({run:function(){return this._getResolvedPromise()}}),n.StartingPluginOp}),define("acplugins/combinepdf/js/ops/full-preview-overlay/selecting-full-preview-overlay-op",["core/ac-core","acplugins/combinepdf/js/ac-combinepdf","core/ops/op"],function(e,n){return n.SelectingFullPreviewOverlayOp=e.Op.extend({run:function(){return e.opFactory.create("SelectingPluginOp",this.options).run("full_preview_overlay_example")}}),n.SelectingFullPreviewOverlayOp}),define("acplugins/combinepdf/js/ops/op-factory",["core/ac-core","acplugins/combinepdf/js/ac-combinepdf","acplugins/combinepdf/js/ops/plugin/starting-plugin-op","acplugins/combinepdf/js/ops/full-preview-overlay/selecting-full-preview-overlay-op"],function(e,n){n.OpFactory=e.Op.extend({create:function(e,i){var o=n[e];return o?new o(i):void LOG(0,"AcCombinePDF.OpFactory.create: Unrecognized class: "+e)}})}),define("acplugins/combinepdf/js/combinepdf",["acplugins/combinepdf/js/ac-combinepdf","acplugins/combinepdf/js/ops/op-factory"],function(e){_.extend(e,{init:function(){e.opFactory=new e.OpFactory}})}),define("acplugins/combinepdf/js/plugins/rhp/combinepdf-selector",["acplugins/combinepdf/js/ac-combinepdf","acplugins/combinepdf/js/views/selector-view","acplugins/combinepdf/js/combinepdf"],function(e){return e.SelectorView});