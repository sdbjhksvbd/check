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

define("pdmplugins/my-computer/js/ac-my-computer",["plugins-common/ac-plugins"],function(e){var r=e.MyComputer;return r||(r=e.MyComputer={}),r.PLUGIN_ID||(r.PLUGIN_ID="my_computer"),r}),define("pdmplugins/my-computer/js/nls/ui-strings",{root:!0,"xx-xx":!0,"ar-ae":!0,"ca-es":!0,"cs-cz":!0,"da-dk":!0,"de-de":!0,"en-ae":!0,"en-gb":!0,"en-il":!0,"es-es":!0,"eu-es":!0,"fi-fi":!0,"fr-fr":!0,"fr-ma":!0,"he-il":!0,"hr-hr":!0,"hu-hu":!0,"it-it":!0,"ja-jp":!0,"ko-kr":!0,"nb-no":!0,"nl-nl":!0,"pl-pl":!0,"pt-br":!0,"ro-ro":!0,"ru-ru":!0,"sk-sk":!0,"sl-si":!0,"sl-sl":!0,"sv-se":!0,"tr-tr":!0,"uk-ua":!0,"zh-cn":!0,"zh-tw":!0,"bg-bg":!0}),define("pdmplugins/my-computer/js/nls/root/ui-strings",{MY_COMPUTER:"Your computer",SELECT_FILES:"Choose Files from My Computer",NO_RECENT_FOLDERS_SELECT:"Click 'Browse' to open a file from your computer.",HEADING_RECENT_LOCATIONS:"Recent Locations",HEADING_SELECT_FROM_RECENT_FOLDER:"Select from Recent Folder...",HEADING_SELECT_FOLDER:"Save in Recent Folder...",BROWSE_BUTTON:"Browse",BROWSE_DIALOG_BUTTON:"Browse...",CHOOSE_A_DIFFERENT_FOLDER_BUTTON:"Choose a Different Folder...",BROWSE_FOLDER_TEXT:"Select a different folder",NO_RECENT_FOLDERS_SAVE_AS:"No Recent Folders",NO_FOLDERS_MYCOMPUTER_PROMPT:"There aren't any files here yet.",NO_FOLDERS_MYCOMPUTER_SUBPROMPT:"When you open files from your computer, youâ€™ll see their folders here."}),define("pdmplugins/my-computer/js/views/selector-view",["core/ac-core-init","pdmplugins/my-computer/js/ac-my-computer","i18n!pdmplugins/my-computer/js/nls/ui-strings","core/views/plugin-selector-view"],function(e,r,o){return r.SelectorView=e.PluginSelectorView.extend({getSelectorLabel:function(){return o.MY_COMPUTER}}),r.SelectorView}),define("pdmplugins/my-computer/js/selector",["pdmplugins/my-computer/js/ac-my-computer","pdmplugins/my-computer/js/views/selector-view"],function(){});