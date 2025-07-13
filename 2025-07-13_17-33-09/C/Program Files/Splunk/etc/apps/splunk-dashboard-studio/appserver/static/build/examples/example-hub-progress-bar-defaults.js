import{a}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as r}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as s}from"../chunks/chunk-NP732JJA.js";import{i as t}from"../chunks/chunk-FOXWPXSG.js";var i=t(s()),o=t(r());var e={visualizations:{viz_pcZVNjLm:{type:"splunk.markdown",options:{markdown:`## Overview
Using defaults saves you time by applying a certain configuration or option in one place. One visualization option that is useful when set as a default is the **progress bar**. Normally, Dashboard Studio visualizations always come with the \`"showProgressBar": false\` option already shown (Example's Hub visualizations have these removed from the displayed source). 

The progress bar allows some visibility into the status of your search. Which can be useful for large searches and can indicate whether or not your dashboard has the latest information or is still retrieving it from Splunk. 

All available visualization defaults can be set globally, per visualization type, and locally within each visualization definition. The local configuration takes highest priority, then type option, then the global option. 

To the right is a GIF of a visualization that has the progress bar enabled. 

### Default Definition
\`\`\`
"defaults": {
		"visualizations": {
			"global": {
				"showProgressBar": false
			},
			"splunk.area": {
				"showProgressBar": true
			}
		}
	}
\`\`\``}},viz_0QN67Fwe:{type:"splunk.image",showProgressBar:!1,showLastUpdated:!1,options:{src:"/static/app/splunk-dashboard-studio/images/examples-hub/progress_bar.gif"}}},dataSources:{},defaults:{visualizations:{global:{showProgressBar:!1},"splunk.area":{showProgressBar:!0}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_pcZVNjLm",type:"block",position:{x:0,y:0,w:634,h:726}},{item:"viz_0QN67Fwe",type:"block",position:{x:634,y:0,w:566,h:726}}],globalInputs:[]},description:"Progress bars can be revealed per visualization instance, for every visualization of a certain type, or at a default global level",title:"Progress Bar Defaults"};(0,o.default)(i.default.createElement(a,{definition:e}),{pageTitle:"Progress Bar Defaults",hideFooter:!0,layout:"fixed"});
