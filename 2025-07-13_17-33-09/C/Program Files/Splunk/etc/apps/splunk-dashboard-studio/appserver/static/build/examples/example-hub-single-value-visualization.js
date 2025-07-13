import{a as n}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as o}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as s}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var a=e(s()),t=e(o());var i={visualizations:{viz_crcN6mzo:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},title:"Single Value",description:"Default Single Value"},viz_fKWCh9Ee:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {},
}
\`\`\``}},viz_aik8jLHV:{type:"splunk.singlevalue",options:{unit:"$",unitPosition:"before",trendDisplay:"percent",numberPrecision:2,underLabel:"Sample Label",backgroundColor:"transparent"},dataSources:{primary:"ds_search1"},title:"Single Value",description:"Unit, Precision, Custom Background Color Trend as %"},viz_iRCGXrSr:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "options": {
        "unit": "$",
        "unitPosition": "before",
        "trendDisplay": "percent",
        "numberPrecision": 2,
        "underLabel": "Sample Label",
        "backgroundColor": "#5a4575"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}},viz_XoAtwekf:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},title:"Single Value",description:"Trend and Sparkline Hidden",options:{sparklineDisplay:"off",trendDisplay:"off"}},viz_kK99DS2i:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "sparklineDisplay": "off",
        "trendDisplay": "off"
    },
    "context": {}
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview

A single value is used for showing a metric or KPI and it's related context. Single value visualizations display results and context for searches returning a discrete number. A single value can be a count or other aggregation of specific events.

Any query returning aggregate data using the stats command is suitable for a Single Value. You can also use a \`timechart\` command to generate a sparkline and then use the visualization DSL to control the major and delta values.

An example is also shown how one search can be used with multiple single values, using DSL to specify which field the single value shows.

### SPL for Single Values
\`\`\`
| inputlookup firewall_example.csv
| eval mytime=strftime(timestamp,"%Y-%m-%dT%H:%M")
| chart count over mytime
\`\`\``}},viz_p9dfZNev:{type:"splunk.table",dataSources:{primary:"ds_search2"},title:"Multiple Single Values Sharing a Search to Display Different Field Values",description:"Sample Search returning different fields"},viz_Vj2Yo7F9:{type:"splunk.markdown",options:{markdown:"### SPL for DSL Controlled Single Value Examples\n```\n| inputlookup firewall_example.csv\n| search host=host18| head 25\n```\n"}},viz_YiSuNX74:{type:"splunk.singlevalue",options:{majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('bytes_in')",numberPrecision:2},dataSources:{primary:"ds_search2"},title:'Single Value Showing "bytes_in"'},viz_h7f0QsOD:{type:"splunk.singlevalue",options:{majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('bytes_out')"},dataSources:{primary:"ds_search2"},title:'Single Value Showing "bytes_out"'},viz_U0uIxeXY:{type:"splunk.singlevalue",options:{majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('host')"},dataSources:{primary:"ds_search2"},title:'Single Value Showing "host"'},viz_WMGcGUty:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "options": {
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('bytes_in')",
        "numberPrecision": 2
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "context": {}
}
\`\`\``}},viz_U7wayoPl:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "options": {
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('host')"
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "context": {}
}
\`\`\``}},viz_tGLA2Gya:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "options": {
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('bytes_out')"
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host=host18| head 25`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1440,h:279}},{item:"viz_crcN6mzo",type:"block",position:{x:0,y:279,w:286,h:284}},{item:"viz_aik8jLHV",type:"block",position:{x:0,y:563,w:600,h:348}},{item:"viz_Vj2Yo7F9",type:"block",position:{x:0,y:911,w:1440,h:118}},{item:"viz_p9dfZNev",type:"block",position:{x:0,y:1029,w:1440,h:251}},{item:"viz_YiSuNX74",type:"block",position:{x:0,y:1280,w:395,h:200}},{item:"viz_WMGcGUty",type:"block",position:{x:0,y:1480,w:395,h:346}},{item:"viz_fKWCh9Ee",type:"block",position:{x:286,y:279,w:314,h:284}},{item:"viz_h7f0QsOD",type:"block",position:{x:395,y:1280,w:395,h:200}},{item:"viz_tGLA2Gya",type:"block",position:{x:395,y:1480,w:395,h:346}},{item:"viz_XoAtwekf",type:"block",position:{x:600,y:279,w:291,h:284}},{item:"viz_iRCGXrSr",type:"block",position:{x:600,y:563,w:600,h:348}},{item:"viz_U0uIxeXY",type:"block",position:{x:790,y:1280,w:410,h:200}},{item:"viz_U7wayoPl",type:"block",position:{x:790,y:1480,w:410,h:346}},{item:"viz_kK99DS2i",type:"block",position:{x:891,y:279,w:309,h:284}}],globalInputs:[]},description:"Represent a discrete metric with the option of also showing the latest trend value and change over time with a sparkline",title:"Basic Single Value"};(0,t.default)(a.default.createElement(n,{definition:i}),{pageTitle:"Single Value",hideFooter:!0,layout:"fixed"});
