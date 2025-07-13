import{a}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as i}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as r}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var o=e(r()),t=e(i());var n={visualizations:{viz_OPQATCGl:{type:"splunk.markergauge",dataSources:{primary:"ds_search1"},title:"Marker Gauge",description:"Default Confguration",options:{},context:{},showProgressBar:!1,showLastUpdated:!1},viz_omCpZ2ww:{type:"splunk.markdown",options:{markdown:`## Overview
A marker gauge shows value ranges and colors with a marker that moves to indicate a single value from a data source. It is best used to show a KPI or to indicate progression or service health. 

The following examples use the following \`makeresults\` query
### SPL
\`\`\`
| makeresults
| eval count= random()%100
| fields count
\`\`\``}},viz_02J4knli:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.markergauge",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_8DHPZzts:{type:"splunk.markergauge",options:{orientation:"horizontal",labelDisplay:"off",backgroundColor:"transparent"},dataSources:{primary:"ds_search1"},title:"Marker Gauge",description:"Horizontal, Background Transparent, No Labels",showProgressBar:!1,showLastUpdated:!1},viz_wTp98CwR:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.markergauge",
    "options": {
        "orientation": "horizontal",
        "labelDisplay": "off",
        "backgroundColor": "transparent"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}},viz_89VZhpcS:{type:"splunk.markergauge",dataSources:{primary:"ds_search1"},title:"Marker Gauge",description:"Percentages for Value and Range",options:{labelDisplay:"percentage",valueDisplay:"percentage"},showProgressBar:!1,showLastUpdated:!1},viz_fUNTuXpK:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.markergauge",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "labelDisplay": "percentage",
        "valueDisplay": "percentage"
    },
    "context": {}
}
\`\`\``}},viz_SvRSI63X:{type:"splunk.markergauge",title:"Marker Gauge",description:"Major Tick Marks in Units of 25",dataSources:{primary:"ds_search1"},showProgressBar:!1,showLastUpdated:!1,options:{majorTickInterval:25}},viz_4lxUHIyp:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.markergauge",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "majorTickInterval": 25
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults
| eval count= random()%100
| fields count`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_omCpZ2ww",type:"block",position:{x:0,y:0,w:1440,h:268}},{item:"viz_OPQATCGl",type:"block",position:{x:0,y:268,w:300,h:311}},{item:"viz_89VZhpcS",type:"block",position:{x:0,y:579,w:300,h:332}},{item:"viz_02J4knli",type:"block",position:{x:300,y:268,w:300,h:311}},{item:"viz_fUNTuXpK",type:"block",position:{x:300,y:579,w:300,h:332}},{item:"viz_8DHPZzts",type:"block",position:{x:600,y:268,w:294,h:311}},{item:"viz_SvRSI63X",type:"block",position:{x:600,y:579,w:294,h:332}},{item:"viz_wTp98CwR",type:"block",position:{x:894,y:268,w:306,h:311}},{item:"viz_4lxUHIyp",type:"block",position:{x:894,y:579,w:306,h:332}}],globalInputs:[]},description:"Visualize a single numeric value and represent values in relation to a limit with a marker gauge",title:"Marker Gauge"};(0,t.default)(o.default.createElement(a,{definition:n}),{pageTitle:"Marker Gauge",hideFooter:!0,layout:"fixed"});
