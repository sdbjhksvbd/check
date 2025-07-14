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

define("acplugins/editpdf/js/ac-editpdf",["plugins-common/ac-plugins"],function(e){var i=e.EditPDF;return i||(i=e.EditPDF={}),i}),define("acplugins/editpdf/js/nls/ui-strings",{root:!0,"xx-xx":!0,"de-de":!0,"en-gb":!0,"es-es":!0,"fr-fr":!0,"it-it":!0,"ja-jp":!0,"da-dk":!0,"fi-fi":!0,"nb-no":!0,"nl-nl":!0,"pt-br":!0,"sv-se":!0,"zh-cn":!0,"zh-tw":!0,"ko-kr":!0,"cs-cz":!0,"hu-hu":!0,"pl-pl":!0,"ru-ru":!0,"uk-ua":!0,"tr-tr":!0,"sk-sk":!0,"sl-si":!0,"bg-bg":!0}),define("acplugins/editpdf/js/nls/root/ui-strings",{EDIT_PDF:"Edit PDF Files",EDIT_PDF_TOOL_VIEW_TITLE:"Easily edit text and images in PDF documents with Acrobat Pro",EDIT_PDF_TOOL_VIEW_TITLE_RHP:"Easily edit text and images in PDF documents",EDIT_PDF_ICON_TOOLTIP:"Learn more",EDIT_PDF_START:"Learn more",EDIT_PDF_HEADING:"Adobe Acrobat Pro",EDIT_PDF_FULL_GO_URL:"http://www.adobe.com/go/editrdr_12_0_0",EDIT_PDF_RHP_GO_URL:"http://www.adobe.com/go/editrhprdr_12_0_0"}),define("acplugins/editpdf/js/views/selector-view",["core/ac-core","acplugins/editpdf/js/ac-editpdf","i18n!acplugins/editpdf/js/nls/ui-strings","core/views/plugin-selector-view"],function(e,i,t){return i.SelectorView=e.PluginSelectorView.extend({getSelectorLabel:function(){return t.EDIT_PDF},getSelectorIconClass:function(){return"editpdf-toolbar-icon"},getSiteCatalystName:function(){return"EDITPDF"}}),i.SelectorView}),define("acplugins/editpdf/js/ops/plugin/starting-plugin-op",["core/ac-core","acplugins/editpdf/js/ac-editpdf","core/ops/op"],function(e,i){return i.StartingPluginOp=e.Op.extend({run:function(){return this._getResolvedPromise()}}),i.StartingPluginOp}),define("acplugins/editpdf/js/ops/full-preview-overlay/selecting-full-preview-overlay-op",["core/ac-core","acplugins/editpdf/js/ac-editpdf","core/ops/op"],function(e,i){return i.SelectingFullPreviewOverlayOp=e.Op.extend({run:function(){return e.opFactory.create("SelectingPluginOp",this.options).run("full_preview_overlay_example")}}),i.SelectingFullPreviewOverlayOp}),define("acplugins/editpdf/js/ops/op-factory",["core/ac-core","acplugins/editpdf/js/ac-editpdf","acplugins/editpdf/js/ops/plugin/starting-plugin-op","acplugins/editpdf/js/ops/full-preview-overlay/selecting-full-preview-overlay-op"],function(e,i){i.OpFactory=e.Op.extend({create:function(e,t){var n=i[e];return n?new n(t):void LOG(0,"AcEditPDF.OpFactory.create: Unrecognized class: "+e)}})}),define("acplugins/editpdf/js/editpdf",["acplugins/editpdf/js/ac-editpdf","acplugins/editpdf/js/ops/op-factory"],function(e){_.extend(e,{init:function(){e.opFactory=new e.OpFactory}})}),define("acplugins/editpdf/js/plugins/rhp/editpdf-selector",["acplugins/editpdf/js/ac-editpdf","acplugins/editpdf/js/views/selector-view","acplugins/editpdf/js/editpdf"],function(e){return e.SelectorView});