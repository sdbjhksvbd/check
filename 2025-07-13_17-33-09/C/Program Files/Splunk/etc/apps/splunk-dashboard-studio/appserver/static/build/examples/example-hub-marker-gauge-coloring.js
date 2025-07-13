import{a as e}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as s}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as t}from"../chunks/chunk-NP732JJA.js";import{i as o}from"../chunks/chunk-FOXWPXSG.js";var n=o(t()),r=o(s());var a={visualizations:{viz_omCpZ2ww:{type:"splunk.markdown",options:{markdown:`## Overview
A marker gauge shows value ranges and colors with a marker that moves to indicate one single value from a datasource. It is best used to track KPI's as part of a larger goal or to indicate progression or health. This page shows available coloring options for marker gauges.

The following examples use the following \`makeresults\` query
### SPL
\`\`\`
| makeresults
| eval count=random()%100
| fields count
\`\`\``}},viz_8DHPZzts:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"#5a4575",gaugeRanges:[{from:100,value:"#53a051",to:110},{from:80,value:"#f1813f",to:100},{from:70,value:"#dc4e41",to:80},{from:60,value:"#f8be34",to:70},{from:50,to:60,value:"#CBA700"},{from:20,value:"#0877a6",to:50},{from:0,to:20,value:"#118832"}]},dataSources:{primary:"ds_search1"},title:"Marker Gauge",description:"Horizontal, Background Purple, additional Range",showProgressBar:!1,showLastUpdated:!1},viz_wTp98CwR:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.markergauge",
    "options": {
        "orientation": "horizontal",
        "backgroundColor": "#5a4575",
        "gaugeRanges": [
            {
                "from": 100,
                "value": "#53a051",
                "to": 110
            },
            {
                "from": 80,
                "value": "#f1813f",
                "to": 100
            },
            {
                "from": 70,
                "value": "#dc4e41",
                "to": 80
            },
            {
                "from": 60,
                "value": "#f8be34",
                "to": 70
            },
            {
                "from": 50,
                "to": 60,
                "value": "#CBA700"
            },
            {
                "from": 20,
                "value": "#0877a6",
                "to": 50
            },
            {
                "from": 0,
                "to": 20,
                "value": "#118832"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults
| eval count= random()%100
| fields count`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_omCpZ2ww",type:"block",position:{x:0,y:0,w:1440,h:268}},{item:"viz_8DHPZzts",type:"block",position:{x:0,y:268,w:440,h:498}},{item:"viz_wTp98CwR",type:"block",position:{x:440,y:268,w:760,h:498}}],globalInputs:[]},description:"Adjust Coloring for Marker Gauges",title:"Marker Gauge Coloring"};(0,r.default)(n.default.createElement(e,{definition:a}),{pageTitle:"Marker Gauge Coloring",hideFooter:!0,layout:"fixed"});
