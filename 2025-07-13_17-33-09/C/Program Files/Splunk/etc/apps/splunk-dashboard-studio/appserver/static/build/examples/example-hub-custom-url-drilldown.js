import{a as t}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as l}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as s}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var o=e(s()),i=e(l());var n={visualizations:{viz_n4X3Gy80:{type:"splunk.markdown",options:{markdown:`## Overview
Drilldowns can be used to direct users to another URL by interacting with a visualization on the dashboard. The configuration can be done through the UI editor and can force a new tab to open when the drilldown is triggered. 

In this example, we also showcase how one can use a dropdown to select a URL and have the drilldown be different depending on the URL being selected. `}},viz_dq5gn4D8:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},eventHandlers:[{type:"drilldown.customUrl",options:{url:"https://docs.splunk.com/Documentation/SplunkCloud/latest/DashStudio/IntroFrame",newTab:!0}}],title:"Link To Dashboard Docs"},viz_dZTClhP1:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},eventHandlers:[{type:"drilldown.customUrl",options:{url:"$web$",newTab:!0}}],title:"Link to Website in Dropdown"},viz_tQCsZrf1:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "options": {},
    "dataSources": {
        "primary": "ds_search1"
    },
    "eventHandlers": [
        {
            "type": "drilldown.customUrl",
            "options": {
                "url": "https://docs.splunk.com/Documentation/SplunkCloud/latest/DashStudio/IntroFrame",
                "newTab": true
            }
        }
    ],
    "context": {}
}
\`\`\`
`}},viz_63iFyFet:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "options": {},
    "dataSources": {
        "primary": "ds_search1"
    },
    "eventHandlers": [
        {
            "type": "drilldown.customUrl",
            "options": {
                "url": "$website$",
                "newTab": true
            }
        }
    ],
    "context": {}
}
\`\`\`
`}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults 
| eval SV= "Click Here"`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_g8i6DHFR:{options:{items:[{label:"Splunk Dev",value:"https://dev.splunk.com/"},{label:"Splunk Products",value:"https://www.splunk.com/en_us/software.html"},{label:"Splunk Docs",value:"https://docs.splunk.com"}],defaultValue:"https://dev.splunk.com/",token:"web"},title:"Select Website",type:"input.dropdown"}},layout:{type:"grid",options:{},structure:[{item:"viz_n4X3Gy80",type:"block",position:{x:0,y:0,w:1440,h:151}},{item:"viz_dq5gn4D8",type:"block",position:{x:0,y:151,w:600,h:118}},{item:"viz_tQCsZrf1",type:"block",position:{x:0,y:269,w:600,h:389}},{item:"viz_dZTClhP1",type:"block",position:{x:600,y:151,w:600,h:118}},{item:"viz_63iFyFet",type:"block",position:{x:600,y:269,w:600,h:389}}],globalInputs:["input_g8i6DHFR"]},description:"Direct users to external URLs by interacting with the dashboard",title:"Drilldown to Custom URL"};(0,i.default)(o.default.createElement(t,{definition:n}),{pageTitle:"Drilldown to Custom URL",hideFooter:!0,layout:"fixed"});
