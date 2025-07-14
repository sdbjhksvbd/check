/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2018 Adobe Systems Incorporated
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

define("pdmplugins/activity-badge/js/ac-activity-badge",["plugins-common/ac-plugins"],function(e){var i=e.ActivityBadge;return i||(i=e.ActivityBadge={}),i.PLUGIN_ID||(i.PLUGIN_ID="activity_badge"),i}),define("pdmplugins/activity-badge/js/views/selector-view",["core/ac-core-init","pdmplugins/activity-badge/js/ac-activity-badge","core/views/plugin-selector-view"],function(e,i){return i.SelectorView=e.PluginSelectorView.extend({getSelectorLabel:function(){return"Activity Badge"}}),i.SelectorView}),define("pdmplugins/activity-badge/js/selector",["pdmplugins/activity-badge/js/ac-activity-badge","pdmplugins/activity-badge/js/views/selector-view"],function(){});