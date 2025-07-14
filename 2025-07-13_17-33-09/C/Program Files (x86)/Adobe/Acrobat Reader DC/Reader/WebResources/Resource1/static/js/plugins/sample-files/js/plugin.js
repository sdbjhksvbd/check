/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2017 Adobe Systems Incorporated
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

/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2017 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2017 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by all applicable intellectual property
 * laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/

define("pdmplugins/sample-files/js/ac-sample-files",["plugins-common/ac-plugins"],function(e){var i=e.SampleFiles;return i||(i=e.SampleFiles={}),i.PLUGIN_ID||(i.PLUGIN_ID="sample_files"),i}),define("pdmplugins/sample-files/js/ops/op-factory",["core/ac-core-init","pdmplugins/sample-files/js/ac-sample-files"],function(e,i){i.OpFactory=e.Op.extend({create:function(e,l){var s=i[e];return s?new s(l):void LOG(0,"AcSampleFiles.OpFactory.create: Unrecognized class: "+e)}})}),define("pdmplugins/sample-files/js/templates/sample-file-template",[],function(){return'<div class = "sampleFile theme-list-item" aria-label="<%= name %>" tabIndex="0"><div class="fileImg file-icon-pdf collection-item-thumb"></div><div class="fileName theme-list-item-text"><%= name %></div></div>'}),define("pdmplugins/sample-files/js/views/sample-file-view",["core/ac-core-init","pdmplugins/sample-files/js/ac-sample-files","pdmplugins/sample-files/js/templates/sample-file-template","core/utils/view-util","core/utils/focus-util","core/utils/truncate","core/utils/css-util","core/views/plugin-content-view"],function(e,i,l){return i.FileView=e.View.extend({tagName:"div",initialize:function(){e.View.prototype.initialize.call(this),this._template=_.template(l)},render:function(){return 0===this.$el.children().length&&this.$el.html(this._template({name:this._getName()})),this},_getName:function(){return this.model.get("name")}}),i.FileView}),define("pdmplugins/sample-files/js/nls/ui-strings",{root:!0,"xx-xx":!0,"ar-ae":!0,"ca-es":!0,"cs-cz":!0,"da-dk":!0,"de-de":!0,"en-ae":!0,"en-gb":!0,"en-il":!0,"es-es":!0,"eu-es":!0,"fi-fi":!0,"fr-fr":!0,"fr-ma":!0,"he-il":!0,"hr-hr":!0,"hu-hu":!0,"it-it":!0,"ja-jp":!0,"ko-kr":!0,"nb-no":!0,"nl-nl":!0,"pl-pl":!0,"pt-br":!0,"ro-ro":!0,"ru-ru":!0,"sk-sk":!0,"sl-si":!0,"sl-sl":!0,"sv-se":!0,"tr-tr":!0,"uk-ua":!0,"zh-cn":!0,"zh-tw":!0,"bg-bg":!0}),define("pdmplugins/sample-files/js/nls/root/ui-strings",{SELECTOR_LABEL:"SAMPLE_FILES",HEADING_SAMPLE_FILES:"Sample PDFs with the new Dynamic view experience"}),define("pdmplugins/sample-files/js/views/sample-files-view",["core/ac-core-init","backbone","pdmplugins/sample-files/js/ac-sample-files","pdmplugins/sample-files/js/views/sample-file-view","i18n!pdmplugins/sample-files/js/nls/ui-strings"],function(e,i,l){return l.FilesView=e.View.extend({tagName:"div",render:function(){return this.collection.each(this.addFile,this),this},addFile:function(e){var i=new l.FileView({model:e});this.$el.append(i.render().el)}}),l.FilesView}),define("pdmplugins/sample-files/js/templates/sample-files-template",[],function(){return'<div class="sampleFilesHeading theme-text"><%= heading %></div>'}),define("pdmplugins/sample-files/js/models/file-model",["pdmplugins/sample-files/js/ac-sample-files","core/ac-core-init"],function(e,i){return e.FileModel=i.Model.extend({defaults:{name:"Sample File"},fetch:function(){return $.Deferred().resolve().promise()},save:function(){return $.Deferred().resolve().promise()},destroy:function(){return $.Deferred().resolve().promise()}}),e.FileModel}),define("pdmplugins/sample-files/js/collection/file-collection",["pdmplugins/sample-files/js/ac-sample-files","core/ac-core-init","i18n!pdmplugins/sample-files/js/nls/ui-strings"],function(e,i){return e.FileCollection=i.Collection.extend({model:e.FileModel}),e.FileCollection}),define("pdmplugins/sample-files/js/views/plugin-view",["core/ac-core-init","pdmplugins/sample-files/js/ac-sample-files","pdmplugins/sample-files/js/views/sample-files-view","pdmplugins/sample-files/js/templates/sample-files-template","core/utils/view-util","i18n!pdmplugins/sample-files/js/nls/ui-strings","pdmplugins/sample-files/js/models/file-model","pdmplugins/sample-files/js/collection/file-collection","core/utils/focus-util","core/utils/sc-analytics","core/views/plugin-content-view"],function(e,i,l,s,n,t,p,a,o){return i.PluginView=e.PluginContentView.extend({events:{"click .sampleFile":"_onFileClick","keydown .sampleFile":"_onKeyDown"},initialize:function(){e.PluginContentView.prototype.initialize.call(this),this._template=_.template(s)},teardown:function(){this.$el.empty()},render:function(){if(e.PluginContentView.prototype.render.call(this),!(this.$el.children().length>0)){0===this.$el.children().length&&this.$el.html(this._template({heading:t.HEADING_SAMPLE_FILES}));for(var l=["Adobe Acrobat Pro DC.pdf","Adobe Cloud Services.pdf","Adobe Sign White Paper.pdf","Bus Schedule.pdf","Complex Machine.pdf"],s=[],n=0;n<l.length;n++){var p=new i.FileModel({name:l[n]});s.push(p)}var a=new i.FileCollection(s),o=new i.FilesView({collection:a});this.$el.append(o.render().el)}},selectPlugin:function(){{var e=this.options;e.appApi}this.options.appApi.displayApi.applyUIThemeStyles(this.$el).then(_.bind(function(){this.render(),this.options.appApi.displayApi.showSpinner(!1)},this))},_startPlugin:function(){var e=this._getResolvedPromise();return e},_openFile:function(e){console.log(e),this.options.appApi.rnaApi.done(_.bind(function(i){i.fileApi({methodName:"sampleFiles",methodArgs:[e]})}))},_onKeyDown:function(e){13===e.which?this._onFileClick(e):32===e.which?this._onFileClick(e):o.nextElem(e)},_onFileClick:function(e){var i=$(e.currentTarget),l=i.find(".fileName").text();this._openFile(l)}}),i.PluginView}),define("pdmplugins/sample-files/js/sample-files",["pdmplugins/sample-files/js/ac-sample-files","pdmplugins/sample-files/js/ops/op-factory","pdmplugins/sample-files/js/views/plugin-view"],function(e){_.extend(e,{init:function(){e.opFactory=new e.OpFactory}})}),define("pdmplugins/sample-files/js/plugin",["core/ac-core-init","files/ac-files-init","pdmplugins/sample-files/js/ac-sample-files","pdmplugins/sample-files/js/sample-files"],function(e,i,l){l.init()});