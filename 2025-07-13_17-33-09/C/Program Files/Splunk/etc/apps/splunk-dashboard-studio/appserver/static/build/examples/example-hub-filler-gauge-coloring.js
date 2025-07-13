import{a as e}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as i}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as r}from"../chunks/chunk-NP732JJA.js";import{i as o}from"../chunks/chunk-FOXWPXSG.js";var t=o(r()),a=o(i());var n={visualizations:{viz_OPQATCGl:{type:"splunk.fillergauge",dataSources:{primary:"ds_search1"},options:{gaugeColor:"> value | rangeValue(gaugeColorEditorConfig)"},title:"Filler Gauge",description:"Conditional coloring",context:{gaugeColorEditorConfig:[{value:"#252214",to:9},{value:"#253223",from:9,to:29},{value:"#244333",from:29,to:60},{value:"#245442",from:60,to:70},{value:"#246451",from:70,to:80},{value:"#237561",from:80,to:90},{value:"#238570",from:90}]},showProgressBar:!1,showLastUpdated:!1},viz_omCpZ2ww:{type:"splunk.markdown",options:{markdown:`## Overview
A Filler gauges shows value ranges and colors with a Filler that moves to indicate the current value. This page shows available coloring options for filler gauges.

The following examples use this makeresults query
### SPL
\`\`\`
| makeresults
| eval count= random()%100
| fields count
\`\`\``}},viz_02J4knli:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.fillergauge",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "gaugeColor": "> value | rangeValue(gaugeColorEditorConfig)"
    },
    "context": {
        "gaugeColorEditorConfig": [
            {
                "value": "#252214",
                "to": 9
            },
            {
                "value": "#253223",
                "from": 9,
                "to": 29
            },
            {
                "value": "#244333",
                "from": 29,
                "to": 60
            },
            {
                "value": "#245442",
                "from": 60,
                "to": 70
            },
            {
                "value": "#246451",
                "from": 70,
                "to": 80
            },
            {
                "value": "#237561",
                "from": 80,
                "to": 90
            },
            {
                "value": "#238570",
                "from": 90
            }
        ]
    }
}
\`\`\``}},viz_8DHPZzts:{type:"splunk.fillergauge",options:{orientation:"horizontal",backgroundColor:"#5a4575"},dataSources:{primary:"ds_search1"},title:"Filler Gauge",description:"Horizontal, Background Purple",showProgressBar:!1,showLastUpdated:!1},viz_wTp98CwR:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.fillergauge",
    "options": {
        "orientation": "horizontal",
        "backgroundColor": "#5a4575"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults
| eval count=random()%100
| fields count`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_omCpZ2ww",type:"block",position:{x:0,y:0,w:1440,h:268}},{item:"viz_OPQATCGl",type:"block",position:{x:0,y:268,w:300,h:462}},{item:"viz_02J4knli",type:"block",position:{x:300,y:268,w:300,h:462}},{item:"viz_8DHPZzts",type:"block",position:{x:600,y:268,w:294,h:462}},{item:"viz_wTp98CwR",type:"block",position:{x:894,y:268,w:306,h:462}}],globalInputs:[]},description:"Adjust Coloring for Filler Gauges",title:"Filler Gauge Coloring"};(0,a.default)(t.default.createElement(e,{definition:n}),{pageTitle:"Filler Gauge Coloring",hideFooter:!0,layout:"fixed"});
