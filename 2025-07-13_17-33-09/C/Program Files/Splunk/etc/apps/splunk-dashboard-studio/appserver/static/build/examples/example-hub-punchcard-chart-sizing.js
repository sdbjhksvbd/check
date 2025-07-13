import{a as e}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as o}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as s}from"../chunks/chunk-NP732JJA.js";import{i as n}from"../chunks/chunk-FOXWPXSG.js";var a=n(s()),t=n(o());var i={visualizations:{viz_ex9bx0og:{type:"splunk.markdown",options:{markdown:`## Overview

Punchcards can visualize cyclical trends in your data. Using a punchcard, you can see relative values for a metric where the dimensions intersect.

A punchcard can be used with any data using some sort of timestamp and a metric you want to track. You can also use a query that returns a second field indicating color to visually separate categories. This page covers sizing options for the Punchcard chart,  including dynamic sizing, and min/max radius setting. 


`}},viz_U1QozhCt:{type:"splunk.punchcard",dataSources:{primary:"ds_dsm8DjTJ"},title:"Punchcard Sizing",description:"Dynamic bubble sizing, max bubble size 125%, min bubble size 15%",showProgressBar:!1,showLastUpdated:!1,options:{showDynamicBubbleSize:!0,bubbleSizeMax:.75,bubbleSizeMin:.15}},viz_g1eVJOyU:{type:"splunk.markdown",options:{markdown:`### SPL Query
\`\`\`
| inputlookup examples.csv
| fields punch_hour punch_day punch_count punch_region
\`\`\`
### Source Definition
\`\`\`
{
    "type": "splunk.punchcard",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "showDynamicBubbleSize": true,
        "bubbleSizeMax": 0.75,
        "bubbleSizeMin": 0.15
    },
    "context": {}
}

\`\`\``}},viz_EdD4tUJI:{type:"splunk.punchcard",dataSources:{primary:"ds_dsm8DjTJ"},description:"Fixed bubble sizing, max bubble radius - 30px, min bubble radius - 5px",title:"Punchcard Sizing",showProgressBar:!1,showLastUpdated:!1,options:{bubbleRadiusMin:5,showDynamicBubbleSize:!1,bubbleRadiusMax:30}},viz_whIwQh9E:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.punchcard",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "bubbleRadiusMin": 5,
        "bubbleRadiusMax": 30,
        "showDynamicBubbleSize": false
    },
    "context": {}
}

\`\`\``}}},dataSources:{ds_dsm8DjTJ:{type:"ds.search",options:{query:`| inputlookup examples.csv
| fields punch_hour punch_day punch_count punch_region`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_ex9bx0og",type:"block",position:{x:0,y:0,w:1440,h:140}},{item:"viz_U1QozhCt",type:"block",position:{x:0,y:140,w:748,h:437}},{item:"viz_EdD4tUJI",type:"block",position:{x:0,y:577,w:748,h:418}},{item:"viz_g1eVJOyU",type:"block",position:{x:748,y:140,w:452,h:437}},{item:"viz_whIwQh9E",type:"block",position:{x:748,y:577,w:452,h:418}}],globalInputs:[]},description:"Adjust sizing for punchcard visualizations",title:"Punchcards Sizing"};(0,t.default)(a.default.createElement(e,{definition:i}),{pageTitle:"Punchcard Sizing",hideFooter:!0,layout:"fixed"});
