/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
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

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
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
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2016 Adobe Systems Incorporated
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
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2020 Adobe Systems Incorporated
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
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2020 Adobe Systems Incorporated
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
*  Copyright 2012 Adobe Systems Incorporated
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
*
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
 * suppliers and are protected by all applicable intellectual property laws,
 * including trade secret and or copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/

define("pdmplugins/sign-services-auth/js/ac-sign-services-auth",["plugins-common/ac-plugins"],function(i){console.log("ac-sign-services-auth");var e=i.AcSignServicesAuth;return e||(e=i.SignServicesAuth={}),e.PLUGIN_ID||(e.PLUGIN_ID="sign_services_auth"),e}),define("pdmplugins/sign-services-auth/js/ops/op-factory",["core/ac-core-init","pdmplugins/sign-services-auth/js/ac-sign-services-auth"],function(i,e){e.OpFactory=i.Op.extend({create:function(i,n){var t=e[i];return t?new t(n):void LOG(0,"AcSignServicesAuth.OpFactory.create: Unrecognized class: "+i)}})}),define("pdmplugins/sign-services-auth/js/templates/signin-required-template",[],function(){return'<div id="plugin-container" class="ui-theme theme-container custom-background"><div id="prelogin-page-container"></div><div id="signout-confirmation-dialog-container">'}),define("pdmplugins/sign-services-auth/js/templates/prelogin-page-template",[],function(){return'<div id="prelogin-page-content"><div id="pl-top-margin"></div><div id="sign-in-required"><%= SIGNIN_REQUIRED %></div><div id="pl-spacer-1"></div><div class="line"></div><div id="pl-spacer-2"></div><div class="prelogin-page-details"><%= PRELOGIN_DIALOG_BODY%></div><div id="pl-spacer-3"></div><div id="signin-page-prefrence"><input type="checkbox" class="signinPrefrence" name="keep-signed-in" id="checkbox_id" checked><label class="prelogin-page-details" for="checkbox_id"> <%= CHECKBOX_TEXT%></label> <br></div><div id="pl-spacer-4"></div><div id="prelogin-page-btn-group"><button id="cancel-btn" class="cancelButton"><%= CANCEL%></button><button id="next-btn" class="nextButton" autofocus><%= NEXT%></button></div></div>'}),define("pdmplugins/sign-services-auth/js/nls/ui-strings",{root:!0,"ar-ae":!0,"bg-bg":!0,"ca-es":!0,"cs-cz":!0,"da-dk":!0,"de-de":!0,"en-ae":!0,"en-gb":!0,"en-il":!0,"es-es":!0,"eu-es":!0,"fi-fi":!0,"fr-fr":!0,"fr-ma":!0,"he-il":!0,"hr-hr":!0,"hu-hu":!0,"it-it":!0,"ja-jp":!0,"ko-kr":!0,"nb-no":!0,"nl-nl":!0,"pl-pl":!0,"pt-br":!0,"ro-ro":!0,"ru-ru":!0,"sk-sk":!0,"sl-si":!0,"sl-sl":!0,"sv-se":!0,"tr-tr":!0,"uk-ua":!0,"zh-cn":!0,"zh-tw":!0}),define("pdmplugins/sign-services-auth/js/nls/root/ui-strings",{SIGNIN_REQUIRED:"Sign in required",PRELOGIN_DIALOG_BODY_DEFAULT:"Please sign in again. This helps keep your sign agreements secure.",PRELOGIN_DIALOG_BODY_DOCTAB:"Clicking Cancel will close all open sign agreements.",CHECKBOX_TEXT:"Keep me signed in for the next 14 days",CANCEL:"Cancel",NEXT:"Continue",SIGOUT_DIALOG_TITLE:"Sign out from Adobe Acrobat Reader",SIGOUT_DIALOG_DESCRIPTION_1:'Youâ€™re currently signed in with your Adobe ID <strong>"<%=emailId%>"</strong>. By clicking â€˜sign outâ€™ youâ€™ll sign out of application on this device. This app may ask to quit. App will not be uninstalled.',SIGOUT_DIALOG_DESCRIPTION_2:"This application and cloud assets related to your Adobe ID will be available when you sign in again.",SIGOUT_DIALOG_CANCEL_BTN:"Cancel",SIGOUT_DIALOG_SIGNOUT_BTN:"Sign out"}),define("pdmplugins/sign-services-auth/js/views/prelogin-view",["core/ac-core","core/utils/util","pdmplugins/sign-services-auth/js/ac-sign-services-auth","pdmplugins/sign-services-auth/js/templates/prelogin-page-template","i18n!pdmplugins/sign-services-auth/js/nls/ui-strings","core/views/plugin-content-view"],function(i,e,n,t,s){return n.PreloginView=i.View.extend({initialize:function(){i.View.prototype.initialize.call(this),this._template=_.template(t)},events:function(){return{"click #cancel-btn":"_onCancelBtnClick","click #next-btn":"_onNextBtnClick"}},render:function(){i.View.prototype.render.call(this),this.$el.show();var e=n.QueryParams.login_context,t=s.PRELOGIN_DIALOG_BODY_DEFAULT;return"2"==e&&(t=t+"<br>"+s.PRELOGIN_DIALOG_BODY_DOCTAB),0===this.$el.children().length&&(this.$el.html(this._template({SIGNIN_REQUIRED:s.SIGNIN_REQUIRED,PRELOGIN_DIALOG_BODY:t,CHECKBOX_TEXT:s.CHECKBOX_TEXT,CANCEL:s.CANCEL,NEXT:s.NEXT})),this._initWrappers()),this},_initWrappers:function(){this.$nextButton=this.$("#next-btn"),this.$cancelButton=this.$("#cancel-btn"),this.$checkbox=this.$(".signinPrefrence")},_addKeyEventListener:function(){this.options.appApi.keyApi.pushKeyHandler(this)},_onCancelBtnClick:function(){this.options.appApi.rnaApiObj.signServiceAuthAPI.invokeMethod({methodName:"cancelButton",methodArgs:{}})},_onNextBtnClick:function(){var i=this.$checkbox.is(":checked")?!0:!1;this.options.appApi.rnaApiObj.signServiceAuthAPI.invokeMethod({methodName:"nextButton",methodArgs:i})}}),n.PreloginView}),define("pdmplugins/sign-services-auth/js/templates/reader-logout-confirmation-dialog-template",[],function(){return'<div id="signout-confirmation-dialog"><div class="sigout-icon-div">	<div id = "reader-app-icon">   </div>	<div id = "reader-app-name"> Adobe Acrobat Reader   </div></div><div class="sigout-body-div"><div class="sigout-text-div">	<div id="signout-dialog-title">		<%= TITLE %>	</div>	<div id="signout-dialog-description-1">		<%= DESCRIPTION_1 %>	</div>	<div id="signout-dialog-description-2">		<%= DESCRIPTION_2 %>	</div></div><div class="sigout-button-div"><button id="signout-cancel-btn" tabIndex="2" aria-label="<%=CANCEL%>" ><%= CANCEL%></button><button id="signout-btn" autofocus tabIndex="1" aria-label="<%=SIGNOUT%>" ><%= SIGNOUT%></button></div></div></div>'}),define("pdmplugins/sign-services-auth/js/views/reader-logout-confirmation-dialog-view",["core/ac-core","core/utils/util","pdmplugins/sign-services-auth/js/ac-sign-services-auth","pdmplugins/sign-services-auth/js/templates/reader-logout-confirmation-dialog-template","i18n!pdmplugins/sign-services-auth/js/nls/ui-strings","core/views/plugin-content-view"],function(i,e,n,t,s){return n.SignoutView=i.View.extend({initialize:function(){i.View.prototype.initialize.call(this),this._template=_.template(t)},events:function(){return{"click #signout-cancel-btn":"_onCancelBtnClick","click #signout-btn":"_onSignoutBtnClick"}},render:function(){if(i.View.prototype.render.call(this),this.$el.show(),0===this.$el.children().length){var e=_.template(s.SIGOUT_DIALOG_DESCRIPTION_1,{emailId:this.options.appApi.rnaApiObj.signServiceAuthAPI._signServiceAuthAPI.get("emailId")});this.$el.html(this._template({TITLE:s.SIGOUT_DIALOG_TITLE,DESCRIPTION_1:e,DESCRIPTION_2:s.SIGOUT_DIALOG_DESCRIPTION_2,CANCEL:s.SIGOUT_DIALOG_CANCEL_BTN,SIGNOUT:s.SIGOUT_DIALOG_SIGNOUT_BTN})),this._initWrappers()}return this},_initWrappers:function(){},_addKeyEventListener:function(){this.options.appApi.keyApi.pushKeyHandler(this)},_onCancelBtnClick:function(){this.options.appApi.rnaApi.done(function(i){i.signServiceAuthAPI.invokeMethod({methodName:"cancelSignout"})})},_onSignoutBtnClick:function(){this.options.appApi.rnaApi.done(function(i){i.signServiceAuthAPI.invokeMethod({methodName:"signoutUser"})})}}),n.SignoutView}),define("pdmplugins/sign-services-auth/js/views/plugin-view",["core/ac-core","pdmplugins/sign-services-auth/js/ac-sign-services-auth","pdmplugins/sign-services-auth/js/templates/signin-required-template","pdmplugins/sign-services-auth/js/views/prelogin-view","pdmplugins/sign-services-auth/js/views/reader-logout-confirmation-dialog-view"],function(i,e,n){return e.PluginView=i.PluginContentView.extend({initialize:function(){i.PluginContentView.prototype.initialize.call(this)},render:function(){i.PluginContentView.prototype.render.call(this);var e=this.$el;0===e.children().length&&(e.html(_.template(n)),this._initWrappers()),this._initWrappers(),this._renderChildViews()},getAppApiVersion:function(){return e.APP_API_VERSION},setAppApi:function(n){i.PluginContentView.prototype.setAppApi.call(this,n),e.init(n)},selectPlugin:function(){this.options;this.options.appApi.displayApi.applyUIThemeStyles(this.$el).then(_.bind(function(){this.options.appApi.displayApi.showSpinner(!1),this.render()},this)),this.render()},getSiteCatalystName:function(){return"sign-services-auth"},_renderChildViews:function(){e.QueryParams=this.options.appApi.routerApi.parseQueryParams(window.location.href.slice(window.location.href.indexOf("?"))),"signout"===e.QueryParams.view?this.options.appApi.rnaApi.done(_.bind(function(){this.$preloginPage.hide(),this._renderChildView("_signoutDialog",e.SignoutView,this.$signOutPageContainer)},this)):(this.$signOutPageContainer.hide(),this._renderChildView("_preloginView",e.PreloginView,this.$preloginPage))},_initWrappers:function(){this.$preloginPage=this.$("#prelogin-page-container"),this.$signOutPageContainer=this.$("#signout-confirmation-dialog-container")}}),e.PluginView}),define("pdmplugins/sign-services-auth/js/models/ui/selector-ui-model",["core/ac-core","pdmplugins/sign-services-auth/js/ac-sign-services-auth","core/models/ui/ui-model"],function(i,e){e.SelectorUiModel=i.UiModel.extend({recognized:{selectors:{type:"array",optional:!1},selected_selector_id:{type:"number",optional:!1}},defaults:{selectors:[],selected_selector_id:-1}})}),define("pdmplugins/sign-services-auth/js/models/ui/ui-model-factory",["core/ac-core","pdmplugins/sign-services-auth/js/ac-sign-services-auth","core/models/ui/ui-model","pdmplugins/sign-services-auth/js/models/ui/selector-ui-model"],function(i,e){e.UiModelFactory=i.UiModel.extend({create:function(i,n,t){var s=e[i];return s?new s(n,t):void LOG(0,"AcSignServicesAuth.UiModelFactory.create: Unrecognized class: "+i)}})}),define("pdmplugins/sign-services-auth/js/sign-services-auth",["pdmplugins/sign-services-auth/js/ac-sign-services-auth","pdmplugins/sign-services-auth/js/ops/op-factory","pdmplugins/sign-services-auth/js/views/plugin-view","pdmplugins/sign-services-auth/js/models/ui/ui-model-factory"],function(i){_.extend(i,{init:function(){console.log("Init sign_services_auth"),i.opFactory=new i.OpFactory,i.uiModelFactory=new i.UiModelFactory}})}),define("pdmplugins/sign-services-auth/js/plugin",["pdmplugins/sign-services-auth/js/ac-sign-services-auth","pdmplugins/sign-services-auth/js/sign-services-auth"],function(i){console.log("hey"),i.init()});