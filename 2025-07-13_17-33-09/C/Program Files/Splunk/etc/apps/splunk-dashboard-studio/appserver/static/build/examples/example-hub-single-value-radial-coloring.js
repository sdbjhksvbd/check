import{a}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as l}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as t}from"../chunks/chunk-NP732JJA.js";import{i as n}from"../chunks/chunk-FOXWPXSG.js";var o=n(t()),r=n(l());var e={visualizations:{viz_kK99DS2i:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalueradial",
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {
        "fillRangeValueContext": [
            {
                "from": 100,
                "value": "#cb3b43"
            },
            {
                "from": 70,
                "to": 100,
                "value": "#ff7152"
            },
            {
                "from": 50,
                "to": 70,
                "value": "#fc9850"
            },
            {
                "from": 30,
                "to": 50,
                "value": "#f4df7a"
            },
            {
                "from": 10,
                "to": 30,
                "value": "#4beba8"
            },
            {
                "to": 10,
                "value": "#5fbcff"
            }
        ],
        "backgroundColorEditorConfig": [
            {
                "value": "#D41F1F",
                "to": 100
            },
            {
                "value": "#D94E17",
                "from": 100,
                "to": 200
            },
            {
                "value": "#CBA700",
                "from": 200,
                "to": 300
            },
            {
                "value": "#669922",
                "from": 300,
                "to": 400
            },
            {
                "value": "#118832",
                "from": 400
            }
        ]
    },
    "showProgressBar": false,
    "showLastUpdated": false,
    "options": {
        "majorValue": "> primary | seriesByIndex(0) | lastPoint()",
        "trendValue": "> primary | seriesByIndex(0) | delta(-2)",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)"
    },
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview

A single value is used for showing a metric or KPI and its related context. Single value visualizations display results and context for searches returning a discrete number. A single value can be a count or other aggregation of specific events. 

Any query returning aggregate data using the \`stats\` command is suitable for a Single Value. You can also use a \`timechart\` command to generate a sparkline and then use the visualization DSL to control the major and delta values.

This page covers the coloring options of a Single Value Radial visualization, which is similar to a regular single value however it shows context with a radial gauge and delta value indicator rather than a sparkline. 


### SPL for Single Value Radial
\`\`\`
| makeresults
| eval count = random() % 1000
| append
[| makeresults | eval count = random() % 1000]
| fields count
\`\`\``}},viz_2m8dKv9L:{type:"splunk.singlevalueradial",dataSources:{primary:"ds_search1"},context:{fillRangeValueContext:[{from:100,value:"#cb3b43"},{from:70,to:100,value:"#ff7152"},{from:50,to:70,value:"#fc9850"},{from:30,to:50,value:"#f4df7a"},{from:10,to:30,value:"#4beba8"},{to:10,value:"#5fbcff"}],backgroundColorEditorConfig:[{value:"#D41F1F",to:100},{value:"#D94E17",from:100,to:200},{value:"#CBA700",from:200,to:300},{value:"#669922",from:300,to:400},{value:"#118832",from:400}]},showProgressBar:!1,showLastUpdated:!1,options:{majorValue:"> primary | seriesByIndex(0) | lastPoint()",trendValue:"> primary | seriesByIndex(0) | delta(-2)",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)"},title:"Dynamic Background"},viz_wHENNaGN:{type:"splunk.singlevalueradial",options:{majorColor:"> majorValue | rangeValue(majorColorEditorConfig)",trendColor:"> trendValue | rangeValue(trendColorEditorConfig)"},dataSources:{primary:"ds_search1"},context:{majorColorEditorConfig:[{value:"#D41F1F",to:100},{value:"#D94E17",from:100,to:200},{value:"#CBA700",from:200,to:300},{value:"#669922",from:300,to:400},{value:"#118832",from:400}],trendColorEditorConfig:[{to:0,value:"#9E2520"},{from:0,value:"#1C6B2D"}]},title:"Dynamic Major Value and Trend"},viz_Ewb9FDj6:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalueradial",
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {
        "fillRangeValueContext": [
            {
                "from": 100,
                "value": "#cb3b43"
            },
            {
                "from": 70,
                "to": 100,
                "value": "#ff7152"
            },
            {
                "from": 50,
                "to": 70,
                "value": "#fc9850"
            },
            {
                "from": 30,
                "to": 50,
                "value": "#f4df7a"
            },
            {
                "from": 10,
                "to": 30,
                "value": "#4beba8"
            },
            {
                "to": 10,
                "value": "#5fbcff"
            }
        ],
        "backgroundColorEditorConfig": [
            {
                "value": "#D41F1F",
                "to": 100
            },
            {
                "value": "#D94E17",
                "from": 100,
                "to": 200
            },
            {
                "value": "#CBA700",
                "from": 200,
                "to": 300
            },
            {
                "value": "#669922",
                "from": 300,
                "to": 400
            },
            {
                "value": "#118832",
                "from": 400
            }
        ]
    },
    "showProgressBar": false,
    "showLastUpdated": false,
    "options": {
        "majorValue": "> primary | seriesByIndex(0) | lastPoint()",
        "trendValue": "> primary | seriesByIndex(0) | delta(-2)",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)"
    },
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults
| eval count = random() % 1000
| append
[| makeresults| eval count = random() % 1000]
| fields count`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1440,h:418}},{item:"viz_2m8dKv9L",type:"block",position:{x:0,y:418,w:603,h:380}},{item:"viz_wHENNaGN",type:"block",position:{x:0,y:798,w:603,h:400}},{item:"viz_kK99DS2i",type:"block",position:{x:603,y:418,w:597,h:380}},{item:"viz_Ewb9FDj6",type:"block",position:{x:603,y:798,w:597,h:400}}],globalInputs:[]},description:"Dynamically color various parts of the Single Value Radial visualization based on your data",title:"Single Value Radial Coloring"};(0,r.default)(o.default.createElement(a,{definition:e}),{pageTitle:"Single Value Radial Coloring",hideFooter:!0,layout:"fixed"});
