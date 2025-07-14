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

define("pdmplugins/app-center/js/ac-app-center",["plugins-common/ac-plugins"],function(e){var _=e.AppCenter;return _||(_=e.AppCenter={}),_.PLUGIN_ID||(_.PLUGIN_ID="app_center"),_}),define("pdmplugins/app-center/js/nls/ui-strings",{root:!0,"xx-xx":!0,"ar-ae":!0,"ca-es":!0,"cs-cz":!0,"da-dk":!0,"de-de":!0,"en-ae":!0,"en-gb":!0,"en-il":!0,"es-es":!0,"eu-es":!0,"fi-fi":!0,"fr-fr":!0,"fr-ma":!0,"he-il":!0,"hr-hr":!0,"hu-hu":!0,"it-it":!0,"ja-jp":!0,"ko-kr":!0,"nb-no":!0,"nl-nl":!0,"pl-pl":!0,"pt-br":!0,"ro-ro":!0,"ru-ru":!0,"sk-sk":!0,"sl-si":!0,"sl-sl":!0,"sv-se":!0,"tr-tr":!0,"uk-ua":!0,"zh-cn":!0,"zh-tw":!0,"bg-bg":!0}),define("pdmplugins/app-center/js/nls/root/ui-strings",{SELECTOR_LABEL:"app_center",APP_CENTER:"App Center",app_center_TITLE:"Do more with Adobe Document Cloud",app_center_CONTENT:"Work where you want - desktop, online, or mobile.",app_center_DESKTOP_APPS:"Desktop apps",app_center_ACROBAT_PRO_DC_HEADER:"Acrobat Pro",app_center_ACROBAT_PRO_DC_CONTENT:"Start a free trial of Acrobat Pro that includes tools to create, export, and edit PDFs.",app_center_WEB_APPS:"Web apps & services",app_center_DOCUMENT_CLOUD_HEADER:"Document Cloud",app_center_DOCUMENT_CLOUD_CONTENT_READER:"Use your favorite Acrobat Reader tools in any browser.",app_center_DOCUMENT_CLOUD_CONTENT_ACROBAT:"Use your favorite Acrobat tools in any browser.",app_center_MOBILE_APPS:"Mobile apps",app_center_ACROBAT_READER_HEADER:"Acrobat Reader",app_center_ACROBAT_READER_CONTENT_READER:"Comment on, sign, and share files right on your phone or tablet.",app_center_ACROBAT_READER_CONTENT_ACROBAT:"Create, export, fill, sign, and share files right on your phone or tablet.",app_center_ADOBE_SCAN_HEADER:"Adobe Scan",app_center_ADOBE_SCAN_CONTENT:"Scan anything - receipts, notes, documents, and more - to PDF.",app_center_FILL_SIGN_HEADER:"Fill & Sign",app_center_FILL_SIGN_CONTENT:"Easily fill in forms and sign them on the go.",app_center_TRY:"Try",app_center_LAUNCH:"Launch",app_center_DOWNLOAD:"Download",app_center_GET_APP:"Get App",app_center_card_ADOBE_SCAN:"Adobe Scan",app_center_card_ADOBE_SCAN_TITLE:"Get the free Adobe Scan app",app_center_card_ADOBE_SCAN_DESCRIPTION:"Turn your phone or tablet into a portable scanner to scan anything to PDF. Download now.",app_center_card_ADOBE_ACROBAT_READER:"Adobe Acrobat Reader",app_center_card_ADOBE_ACROBAT_READER_TITLE:"Get the free Adobe Acrobat Reader app",app_center_card_ADOBE_ACROBAT_READER_DESCRIPTION:"Use your favorite PDF and signing tools on your phone or tablet. Download now.",app_center_card_ADOBE_FILL_SIGN:"Adobe Fill & Sign",app_center_card_ADOBE_FILL_SIGN_TITLE:"Get the free Adobe Fill & Sign app",app_center_card_ADOBE_FILL_SIGN_DESCRIPTION:"Fill, sign, and send any form fast on your phone or tablet. Download now.",app_center_qr_code_card_ADOBE_SCAN:"Adobe Scan",app_center_qr_code_card_GET_ADOBE_SCAN_TITLE:"Get the free Adobe Scan app",app_center_qr_code_card_OPEN_ADOBE_SCAN_TITLE:"Open the Adobe Scan app",app_center_qr_code_card_GET_ADOBE_SCAN_DESCRIPTION:"Scan the QR code to turn documents, receipts, and more into PDFs using the Adobe Scan mobile app.",app_center_qr_code_card_OPEN_ADOBE_SCAN_DESCRIPTION:"Scan the QR code to turn documents, receipts, and more into PDFs using the Adobe Scan app.",app_center_qr_code_card_READER_ADOBE_SCAN_DESCRIPTION:"Scan the QR code to turn documents, receipts, and more into PDFs using the Adobe Scan mobile app.",app_center_qr_code_card_ADOBE_ACROBAT_READER:"Adobe Acrobat Reader",app_center_qr_code_card_GET_ADOBE_ACROBAT_READER_TITLE:"Get the free Acrobat Reader app",app_center_qr_code_card_OPEN_ADOBE_ACROBAT_READER_TITLE:"Open the Acrobat Reader app",app_center_qr_code_card_GET_ADOBE_ACROBAT_READER_DESCRIPTION:"Scan the QR code to view and edit PDFs using the Adobe Acrobat Reader mobile app.",app_center_qr_code_card_OPEN_ADOBE_ACROBAT_READER_DESCRIPTION:"Scan the QR code to view and work with PDFs using the Acrobat Reader mobile app.",app_center_qr_code_card_READER_ADOBE_ACROBAT_READER_DESCRIPTION:"Scan the QR code to view, fill, sign, and add comments to PDFs with the Adobe Acrobat Reader mobile app.",app_center_qr_code_card_OK_BUTTON:"OK"}),define("pdmplugins/app-center/js/views/selector-view",["core/ac-core-init","pdmplugins/app-center/js/ac-app-center","i18n!pdmplugins/app-center/js/nls/ui-strings","core/views/plugin-selector-view"],function(e,_,r){return _.SelectorView=e.PluginSelectorView.extend({getSelectorLabel:function(){return r.SELECTOR_LABEL}}),_.SelectorView}),define("acplugins/app-center/js/selector",["pdmplugins/app-center/js/ac-app-center","pdmplugins/app-center/js/views/selector-view"],function(){});