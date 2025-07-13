import{a as e}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as o}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as a}from"../chunks/chunk-NP732JJA.js";import{i}from"../chunks/chunk-FOXWPXSG.js";var t=i(a()),s=i(o());var n={visualizations:{viz_NkdSFCWV:{type:"splunk.markdown",options:{markdown:`### Overview
Charts such as bar, column, area, line and more have certain display properties that can be adjusted to precisely represent your data correctly. These include axes, legend, and labelling options. 

Each of the following examples showcase numerous options in one chart.
`}},viz_FeaFm49k:{type:"splunk.column",options:{xAxisLabelRotation:-45,dataValuesDisplay:"all",xAxisTitleText:"Splunk User",yAxisTitleText:"Total Events Logged"},dataSources:{primary:"ds_search1"},title:"Column Chart",description:"X and Y Axis Titles, Show Data Values, X Axis Label Rotation"},viz_nXvOMvFp:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`
| inputlookup firewall_example.csv
| stats count by host
\`\`\`

### Options Definition 
\`\`\`
{
    "type": "splunk.column",
    "options": {
        "xAxisLabelRotation": -45,
        "dataValuesDisplay": "all",
        "xAxisTitleText": "Splunk User",
        "yAxisTitleText": "Total Events Logged"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}},viz_M3neZGtb:{type:"splunk.line",options:{yAxisTitleVisibility:"hide",legendDisplay:"off",showXMajorGridLines:!0,xAxisMaxLabelParts:1,xAxisTitleVisibility:"hide",dataValuesDisplay:"minmax"},dataSources:{primary:"ds_search2"},title:"Line Chart",description:"Hidden Axis Titles, Minmax Values, Gridlines, Label Parts, Hidden Legend"},viz_KWWPes23:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime
\`\`\`

### Options Definition 
\`\`\`
{
    "type": "splunk.line",
    "options": {
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "showXMajorGridLines": true,
        "xAxisMaxLabelParts": 1,
        "xAxisTitleVisibility": "hide",
        "dataValuesDisplay": "minmax"
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "context": {}
}
\`\`\``}},viz_QcC5ni3l:{type:"splunk.line",dataSources:{primary:"ds_search3"},options:{legendDisplay:"top",legendTruncation:"ellipsisMiddle"},title:"Line Chart",description:"Legend Placement Top, Truncation ellipsisMiddle"},viz_aXAdzXaF:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host
| rename host8 as "superduperlonghostnamenumber1", host18 as "superduperlonghostnamenumber2"
\`\`\`

### Options Definition 
\`\`\`
{
    "type": "splunk.line",
    "dataSources": {
        "primary": "ds_search3"
    },
    "options": {
        "legendDisplay": "top",
        "legendTruncation": "ellipsisMiddle"
    },
    "title": "Line Chart",
    "description": "Legend Placement Top, Truncation ellipsisMiddle",
    "context": {}
}
\`\`\``}},viz_XbhX17IC:{type:"splunk.area",dataSources:{primary:"ds_search4"},options:{yAxisAbbreviation:"off",dataValuesDisplay:"minmax"},title:"Area Chart",description:"Y Axis Abbreviations Off, Min Max"},viz_y3gQv0hh:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host
\`\`\`

### Options Definition 
\`\`\`
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search4"
    },
    "options": {
        "yAxisAbbreviation": "off",
        "dataValuesDisplay": "minmax"
    },
    "context": {}
}
\`\`\``}},viz_rRvvHNCf:{type:"splunk.bar",dataSources:{primary:"ds_search1"},options:{xAxisTitleText:"User",yAxisTitleText:"Count",xAxisLineVisibility:"show",xAxisMajorTickSize:10,showYMajorGridLines:!1},title:"Bar Chart",description:"X Axis Tick Size, Major Gridlines off, Line Visibility"},viz_YV1UGVpM:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`
| inputlookup firewall_example.csv
| stats count by host
\`\`\`

### Options Definition 
\`\`\`
{
    "type": "splunk.bar",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "xAxisTitleText": "User",
        "yAxisTitleText": "Count",
        "xAxisLineVisibility": "show",
        "xAxisMajorTickSize": 10,
        "showYMajorGridLines": false
    },
    "title": "Bar Chart",
    "description": "X Axis Tick Size, Major Gridlines off, Line Visibility",
    "context": {}
}
\`\`\``}},viz_TwvMncp0:{type:"splunk.line",options:{xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",legendDisplay:"off",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide"},dataSources:{primary:"ds_search4"},title:"Hide Everything",description:"No Labels, Tick Marks, Legends, Axis Titles, or Gridlines"},viz_hQxRVAff:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host
\`\`\`

### Options Definition 
\`\`\`
{
    "type": "splunk.line",
    "options": {
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "showYMajorGridLines": false,
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide"
    },
    "dataSources": {
        "primary": "ds_search3"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats count by host`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_2"},ds_search3:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host| rename host8 as "superduperlonghostnamenumber1", host18 as "superduperlonghostnamenumber2"`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_3"},ds_search4:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_4"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_NkdSFCWV",type:"block",position:{x:0,y:0,w:1440,h:115}},{item:"viz_FeaFm49k",type:"block",position:{x:0,y:115,w:600,h:438}},{item:"viz_M3neZGtb",type:"block",position:{x:0,y:553,w:600,h:479}},{item:"viz_QcC5ni3l",type:"block",position:{x:0,y:1032,w:600,h:475}},{item:"viz_XbhX17IC",type:"block",position:{x:0,y:1507,w:600,h:420}},{item:"viz_rRvvHNCf",type:"block",position:{x:0,y:1927,w:600,h:497}},{item:"viz_TwvMncp0",type:"block",position:{x:0,y:2424,w:600,h:491}},{item:"viz_nXvOMvFp",type:"block",position:{x:600,y:115,w:600,h:438}},{item:"viz_KWWPes23",type:"block",position:{x:600,y:553,w:600,h:479}},{item:"viz_aXAdzXaF",type:"block",position:{x:600,y:1032,w:600,h:475}},{item:"viz_y3gQv0hh",type:"block",position:{x:600,y:1507,w:600,h:420}},{item:"viz_YV1UGVpM",type:"block",position:{x:600,y:1927,w:600,h:497}},{item:"viz_hQxRVAff",type:"block",position:{x:600,y:2424,w:600,h:491}}],globalInputs:[]},description:"Adjust how chart properties such as axes and legends frame your data",title:"Display Axes, Labels and Legends"};(0,s.default)(t.default.createElement(e,{definition:n}),{pageTitle:"Display Axes, Labels, Legends",hideFooter:!0,layout:"fixed"});
