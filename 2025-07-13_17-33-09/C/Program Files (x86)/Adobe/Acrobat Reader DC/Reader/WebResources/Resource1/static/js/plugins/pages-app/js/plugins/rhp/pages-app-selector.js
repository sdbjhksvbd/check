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

define("acplugins/pages-app/js/ac-pages-app",["plugins-common/ac-plugins"],function(e){var p=e.PagesApp;return p||(p=e.PagesApp={}),p}),define("acplugins/pages-app/js/nls/ui-strings",{root:!0,"xx-xx":!0,"de-de":!0,"en-gb":!0,"es-es":!0,"fr-fr":!0,"it-it":!0,"ja-jp":!0,"da-dk":!0,"fi-fi":!0,"nb-no":!0,"nl-nl":!0,"pt-br":!0,"sv-se":!0,"zh-cn":!0,"zh-tw":!0,"ko-kr":!0,"cs-cz":!0,"hu-hu":!0,"pl-pl":!0,"ru-ru":!0,"uk-ua":!0,"tr-tr":!0,"sk-sk":!0,"sl-si":!0,"bg-bg":!0}),define("acplugins/pages-app/js/nls/root/ui-strings",{PAGES_APP:"Organize Pages",PAGES_APP_TOOL_VIEW_TITLE_RHP:"Delete, insert, extract and rotate pages.",PAGES_APP_ICON_TOOLTIP:"Learn more",PAGES_APP_START:"Try now",PAGES_APP_HEADING:"Adobe Acrobat Pro",PAGES_APP_RHP_GO_URL:"http://www.adobe.com/go/organizerhprdr_12_0_0"}),define("acplugins/pages-app/js/views/selector-view",["core/ac-core","acplugins/pages-app/js/ac-pages-app","i18n!acplugins/pages-app/js/nls/ui-strings","core/views/plugin-selector-view"],function(e,p,a){return p.SelectorView=e.PluginSelectorView.extend({getSelectorLabel:function(){return a.PAGES_APP},getSelectorIconClass:function(){return"pagesapp-toolbar-icon"},getSiteCatalystName:function(){return"pagesapp"}}),p.SelectorView}),define("acplugins/pages-app/js/ops/plugin/starting-plugin-op",["core/ac-core","acplugins/pages-app/js/ac-pages-app","core/ops/op"],function(e,p){return p.StartingPluginOp=e.Op.extend({run:function(){return this._getResolvedPromise()}}),p.StartingPluginOp}),define("acplugins/pages-app/js/ops/full-preview-overlay/selecting-full-preview-overlay-op",["core/ac-core","acplugins/pages-app/js/ac-pages-app","core/ops/op"],function(e,p){return p.SelectingFullPreviewOverlayOp=e.Op.extend({run:function(){return e.opFactory.create("SelectingPluginOp",this.options).run("full_preview_overlay_example")}}),p.SelectingFullPreviewOverlayOp}),define("acplugins/pages-app/js/ops/op-factory",["core/ac-core","acplugins/pages-app/js/ac-pages-app","acplugins/pages-app/js/ops/plugin/starting-plugin-op","acplugins/pages-app/js/ops/full-preview-overlay/selecting-full-preview-overlay-op"],function(e,p){p.OpFactory=e.Op.extend({create:function(e,a){var s=p[e];return s?new s(a):void LOG(0,"AcPagesApp.OpFactory.create: Unrecognized class: "+e)}})}),define("acplugins/pages-app/js/pages-app",["acplugins/pages-app/js/ac-pages-app","acplugins/pages-app/js/ops/op-factory"],function(e){_.extend(e,{init:function(){e.opFactory=new e.OpFactory}})}),define("acplugins/pages-app/js/plugins/rhp/pages-app-selector",["acplugins/pages-app/js/ac-pages-app","acplugins/pages-app/js/views/selector-view","acplugins/pages-app/js/pages-app"],function(e){return e.SelectorView});