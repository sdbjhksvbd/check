/*! $FileVersion=1.1.386 */ var config_manager_fileVersion = "1.1.386"; 
function CreateEventConfig(){var a={getEvents:function(){var b=JSONManager.getSingleton("events");return b.data},getProfileNames:function(b){try{return this.getEvents()[b].profileNames}catch(c){return null}},getAttributeRules:function(b){try{return this.getEvents()[b].attributeRules}catch(c){return null}},getPriority:function(c){try{var b=this.getEvents()[c].priority;return b.toLowerCase()}catch(d){return""}},getDataSetNames:function(b){try{return this.getEvents()[b].datasets}catch(c){return[]}},_setEvent:function(d,b){try{return this.getEvents()[d]=b}catch(c){return[]}},getThrottleRule:function(b){try{return this.getEvents()[b].throttleRule}catch(c){logWarning("getThrottleRule: failed, cannot find throttle rule attached to "+b);return null}},_events:null};return a}ModuleManager.registerFactory("config_manager",CreateEventConfig);
//F69DAFDED6F2C1146637DBD7AA004282A95595DE8494B084EC5A3818AAEFA445DF3D7E14C20951EB346107992ADC17DB73661D2DF30AABDE3788CA95CC47D274++