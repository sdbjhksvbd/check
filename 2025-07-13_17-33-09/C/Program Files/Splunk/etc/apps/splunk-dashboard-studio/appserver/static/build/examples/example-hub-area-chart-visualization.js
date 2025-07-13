import{a as t}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as r}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as n}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var a=e(n()),o=e(r());var i={visualizations:{viz_3NUrAfkt:{type:"splunk.markdown",options:{markdown:"## Overview\n\nAn area chart is used to show the development of quantitative values over a period of time. It can also be used to show the development of multiple data series summed. \n\nAn area chart can be used for single or multiple series data. Using the `timechart` command in your query makes it so that the first column in a statistics table will be `_time`, which would map to the x-axis of the area chart. The following columns would be y-axis values, each column being a different color on the chart. \n\n`| timechart count by <category_of_interest>`"}},viz_gezCclRK:{type:"splunk.area",dataSources:{primary:"ds_search1"},title:"Area Chart",description:"Single Series"},viz_Zy9SbUug:{type:"splunk.area",dataSources:{primary:"ds_search2"},title:"Area Chart",description:"Multiple Series"},viz_04NOvPv8:{type:"splunk.area",dataSources:{primary:"ds_search2"},options:{stackMode:"stacked"},title:"Area Chart",description:"Multiple Series - Stacked"},viz_IT7zpNRd:{type:"splunk.area",dataSources:{primary:"ds_search2"},options:{stackMode:"stacked100"},title:"Area Chart",description:"Multiple Series - Stacked Mode 100%"},viz_RVNSVBHv:{type:"splunk.markdown",options:{markdown:`### SPL For Single Series
\`\`\`
| inputlookup firewall_example.csv
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime
\`\`\`
### Source Definition
\`\`\`
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_Hb2gqYLi:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {
        "stackMode": "stacked"
    },
    "context": {}
}
\`\`\``}},viz_n67ApED4:{type:"splunk.markdown",options:{markdown:`### SPL For Multiple Series
\`\`\`
| inputlookup firewall_example.csv
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime by host limit=3
\`\`\`
### Source Definition
\`\`\`
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {},
    "context": {},
}
\`\`\``}},viz_udik1cuo:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {
        "stackMode": "stacked100"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime by host limit=3`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_3NUrAfkt",type:"block",position:{x:0,y:0,w:1440,h:198}},{item:"viz_gezCclRK",type:"block",position:{x:0,y:198,w:618,h:368}},{item:"viz_Zy9SbUug",type:"block",position:{x:0,y:566,w:618,h:359}},{item:"viz_04NOvPv8",type:"block",position:{x:0,y:925,w:618,h:307}},{item:"viz_IT7zpNRd",type:"block",position:{x:0,y:1232,w:618,h:324}},{item:"viz_RVNSVBHv",type:"block",position:{x:618,y:198,w:582,h:368}},{item:"viz_n67ApED4",type:"block",position:{x:618,y:566,w:582,h:359}},{item:"viz_Hb2gqYLi",type:"block",position:{x:618,y:925,w:582,h:307}},{item:"viz_udik1cuo",type:"block",position:{x:618,y:1232,w:582,h:324}}],globalInputs:[]},description:"Use Area Charts to represent data over time",title:"Area Chart"};(0,o.default)(a.default.createElement(t,{definition:i}),{pageTitle:"Area Chart",hideFooter:!0,layout:"fixed"});
