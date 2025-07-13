import{a as e}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as l}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as n}from"../chunks/chunk-NP732JJA.js";import{i as t}from"../chunks/chunk-FOXWPXSG.js";var i=t(n()),a=t(l());var o={visualizations:{viz_jvApjKMh:{type:"splunk.markdown",options:{markdown:`## Overview

You can add a submit button so the dashboard does not refresh until the user has selected all input choices. This can avoid unnecessary search executions when multiple inputs are being changed.

To have the dashboard load using the default input values, add the option \`submitOnDashboardLoad\`, which will automatically run searches on the first dashboard load. After the initial load, the user must select the submit button to refresh the dashboard's searches and visualizations.

This example has \`submitOnDashboardLoad\` enabled.




`}},viz_oFXFrMCf:{type:"splunk.markdown",options:{markdown:"## Selected Input values\n\nSelected Host :   `$host$`\n\nSelected Error Code:   `$code$`\n\nSelected Key Words:   `$key_word$`"}},viz_mrbejEbu:{type:"splunk.markdown",options:{markdown:`\`\`\`
"layout": {
		"type": "grid",
		"options": {
			"width": 1440,
			"height": 960,
			"submitButton": true,
			"submitOnDashboardLoad": true
		},
		"structure": [
...
\`\`\``}}},dataSources:{},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_YFw60F7i:{options:{items:[{label:"All",value:"*"},{label:"401",value:"401"},{label:"402",value:"402"},{label:"403",value:"403"}],defaultValue:["401"],token:"code"},title:"Select Error Code",type:"input.multiselect"},input_QUyDwraR:{options:{items:[{label:"All",value:"*"},{label:"Host 1",value:"Host_1"},{label:"Host 2",value:"Host 2"},{label:"Host 3",value:"Host 3"}],defaultValue:"*",token:"host"},title:"Select Host",type:"input.dropdown"},input_CV7lPA1r:{options:{defaultValue:"login",token:"key_word"},title:"Key Words",type:"input.text"}},layout:{type:"grid",options:{width:1440,height:960,submitButton:!0,submitOnDashboardLoad:!0},structure:[{item:"viz_jvApjKMh",type:"block",position:{x:0,y:0,w:1440,h:140}},{item:"viz_oFXFrMCf",type:"block",position:{x:0,y:140,w:741,h:225}},{item:"viz_mrbejEbu",type:"block",position:{x:741,y:140,w:699,h:225}}],globalInputs:["input_QUyDwraR","input_YFw60F7i","input_CV7lPA1r"]},description:"Submit all input selections at once",title:"Submit Button"};(0,a.default)(i.default.createElement(e,{definition:o}),{pageTitle:"Submit Button",hideFooter:!0,layout:"fixed"});
