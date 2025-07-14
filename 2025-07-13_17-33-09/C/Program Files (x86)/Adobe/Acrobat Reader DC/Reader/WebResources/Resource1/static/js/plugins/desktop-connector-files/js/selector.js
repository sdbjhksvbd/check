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

define("pdmplugins/desktop-connector-files/js/ac-desktop-connector-files",["plugins-common/ac-plugins"],function(e){var n=e.DesktopConnectorFiles;return n||(n=e.DesktopConnectorFiles={}),n.PLUGIN_ID||(n.PLUGIN_ID="desktop_connector_files"),n}),define("pdmplugins/desktop-connector-files/js/nls/ui-strings",{root:!0,"xx-xx":!0,"ar-ae":!0,"ca-es":!0,"cs-cz":!0,"da-dk":!0,"de-de":!0,"en-ae":!0,"en-gb":!0,"en-il":!0,"es-es":!0,"eu-es":!0,"fi-fi":!0,"fr-fr":!0,"fr-ma":!0,"he-il":!0,"hr-hr":!0,"hu-hu":!0,"it-it":!0,"ja-jp":!0,"ko-kr":!0,"nb-no":!0,"nl-nl":!0,"pl-pl":!0,"pt-br":!0,"ro-ro":!0,"ru-ru":!0,"sk-sk":!0,"sl-si":!0,"sl-sl":!0,"sv-se":!0,"tr-tr":!0,"uk-ua":!0,"zh-cn":!0,"zh-tw":!0}),define("pdmplugins/desktop-connector-files/js/nls/root/ui-strings",{SELECTOR_LABEL:"<%= connectorLabel %>  Files",GENERIC_ERROR_TITLE:"Error",GENERIC_ERROR_MSG:"An error occurred while fetching your files.",CONNECTOR_FOOTER_ANCHOR_TEXT:"Go to <%= connectorDisplayName %> Website",ACCOUNT_REMOVED_MESSAGE:"Acrobat cannot access your <%= connectorDisplayName %> account",ACCESS_REMOVED_ACTION:"Sign in to your <%= connectorDisplayName %> account to access your files.",ACCESS_REMOVED_CTA:"Sign In",CONNECTOR_NOTIFICATION_HEADING:"<%= connectorDisplayName %> Files",FETCHING_TRANSCRIPTS:"Getting your transcripts..."}),define("pdmplugins/desktop-connector-files/js/views/selector-view",["core/ac-core","pdmplugins/desktop-connector-files/js/ac-desktop-connector-files","i18n!pdmplugins/desktop-connector-files/js/nls/ui-strings","core/utils/sc-analytics","core/views/plugin-selector-view"],function(e,n,o,s){return n.SelectorView=e.PluginSelectorView.extend({getSelectorLabel:function(){var n=_.template(o.SELECTOR_LABEL)({connectorLabel:this._label});return e.PluginSelectorView.prototype.getSelectorLabel.call(this)||n},getSiteCatalystName:function(){var e=this.options,n=e.appApi,o=e.pluginId;return n&&n.connectorsApi.isConnectorPlugin(o)?n.connectorsApi.getConnectorPluginScName(o):s.DESKTOP_CONNECTOR}}),n.SelectorView}),define("pdmplugins/desktop-connector-files/js/selector",["pdmplugins/desktop-connector-files/js/ac-desktop-connector-files","pdmplugins/desktop-connector-files/js/views/selector-view"],function(){return void 0});