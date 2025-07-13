import{a as t}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as r}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as i}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var n=e(i()),o=e(r());var a={visualizations:{viz_XhKERoP3:{type:"splunk.markdown",options:{markdown:`## Overview
Ad Hoc datasources are SPL searches you are prompted to create when adding new datasources through the visual editor. You can add your query, edit the name, ID, and adjust the timerange used for the datasource. This example covers basic ad hoc searches, with one visualization having the extra option which controls the refresh. 

Both of these examples are not searching against an index. If you are running a search against an index, you have the additional option to control the time range, whether that is the global time range configured for the dashboard or a static time range configured for that specific data source. The time range parameters can be configured with this following example code:

### Source for Different Time Ranges
\`\`\`
{
    "type": "ds.search",
    "options": {
        "query": "<SPL Query>",
        "refresh": "10s",
        "queryParameters": {
            "earliest": "-15m",
            "latest": "now"
        }
    },
    "name": "<search name>"
}
\`\`\``}},viz_4Yv2URkp:{type:"splunk.bar",title:"Simple Ad Hoc Data Example",dataSources:{primary:"ds_search1"},showProgressBar:!1,showLastUpdated:!1},viz_RaLJxsMa:{type:"splunk.line",title:"Line Chart Using Static Time Search",dataSources:{primary:"ds_search2"}},viz_gg2855Ju:{type:"splunk.markdown",options:{markdown:`### Data Source Definition
\`\`\`
{
    "type": "ds.search",
    "options": {
        "query": "| inputlookup firewall_example.csv\\n| stats count by host"
    },
    "name": "Search_1"
}
\`\`\`
`}},viz_MOovk2sf:{type:"splunk.markdown",options:{markdown:`### Data Source Definition
\`\`\`
{
    "type": "ds.search",
    "options": {
        "query": "| makeresults count=15\\n| streamstats count\\n| eval _time=_time-(count*86400)\\n| eval value=random()%100\\n| fields _time value",
        "refresh": "10s",
        "queryParameters": {}
    },
    "name": "Search 2"
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats count by host`},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| makeresults count=15
| streamstats count
| eval _time=_time-(count*86400)
| eval value=random()%100
| fields _time value`,refresh:"10s",queryParameters:{earliest:"-15m",latest:"now"}},name:"Search 2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_global_trp:{type:"input.timerange",options:{token:"global_time",defaultValue:"-15m,now"},title:"Default Time Range"}},layout:{type:"grid",options:{},structure:[{item:"viz_XhKERoP3",type:"block",position:{x:0,y:0,w:1440,h:447}},{item:"viz_4Yv2URkp",type:"block",position:{x:0,y:447,w:600,h:333}},{item:"viz_RaLJxsMa",type:"block",position:{x:0,y:780,w:600,h:327}},{item:"viz_gg2855Ju",type:"block",position:{x:600,y:447,w:600,h:333}},{item:"viz_MOovk2sf",type:"block",position:{x:600,y:780,w:600,h:327}}]},description:"Power a visualization using an Ad-Hoc Search",title:"Ad Hoc Data Source"};(0,o.default)(n.default.createElement(t,{definition:a}),{pageTitle:"Ad Hoc Data Source",hideFooter:!0,layout:"fixed"});
