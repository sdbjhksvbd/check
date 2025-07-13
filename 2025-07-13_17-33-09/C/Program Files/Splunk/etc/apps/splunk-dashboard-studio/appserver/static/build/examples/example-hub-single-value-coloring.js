import{a as e}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as i}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as r}from"../chunks/chunk-NP732JJA.js";import{i as n}from"../chunks/chunk-FOXWPXSG.js";var a=n(r()),t=n(i());var o={visualizations:{viz_crcN6mzo:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},title:"Single Value",description:"Trend Value Dynamic Coloring",options:{trendColor:"> trendValue | rangeValue(trendColorEditorConfig)"},context:{trendColorEditorConfig:[{value:"#9E2520",to:0},{value:"#1C6B2D",from:0}]}},viz_fKWCh9Ee:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "trendColor": "> trendValue | rangeValue(trendColorEditorConfig)"
    },
    "context": {
        "trendColorEditorConfig": [
            {
                "to": 0,
                "value": "#9E2520"
            },
            {
                "from": 0,
                "value": "#1C6B2D"
            }
        ]
    }
}
\`\`\``}},viz_aik8jLHV:{type:"splunk.singlevalue",options:{trendColor:"> trendValue | rangeValue(trendColorEditorConfig)",showSparklineAreaGraph:!0,sparklineStrokeColor:"> trendColor",sparklineHighlightSegments:1,sparklineHighlightDots:2,showSparklineTooltip:!0},dataSources:{primary:"ds_search1"},context:{trendColorConfig:[{from:0,value:"#55C169"},{to:0,value:"#F98C83"}],trendColorEditorConfig:[{value:"#F98C83",to:0},{value:"#55C169",from:0}]},title:"Single Value",description:"Dynamic Coloring for both Sparkline Segment and Trend"},viz_iRCGXrSr:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "options": {
        "trendColor": "> trendValue | rangeValue(trendColorEditorConfig)",
        "showSparklineAreaGraph": true,
        "sparklineStrokeColor": "> trendColor",
        "sparklineHighlightSegments": 1,
        "sparklineHighlightDots": 2,
        "showSparklineTooltip": true
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {
        "trendColorConfig": [
            {
                "from": 0,
                "value": "#55C169"
            },
            {
                "to": 0,
                "value": "#F98C83"
            }
        ],
        "trendColorEditorConfig": [
            {
                "value": "#F98C83",
                "to": 0
            },
            {
                "value": "#55C169",
                "from": 0
            }
        ]
    }
}
\`\`\``}},viz_XoAtwekf:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},title:"Single Value",description:"Major Value Dynamic Coloring",options:{majorColor:"> majorValue | rangeValue(majorColorEditorConfig)"},context:{majorColorEditorConfig:[{value:"#D41F1F",to:250},{value:"#D94E17",from:250,to:500},{value:"#CBA700",from:500,to:750},{value:"#669922",from:750,to:1e3},{value:"#118832",from:1e3}]}},viz_kK99DS2i:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "sparklineDisplay": "off",
        "trendDisplay": "off",
        "majorColor": "> majorValue | rangeValue(majorColorEditorConfig)"
    },
    "context": {
        "majorColorEditorConfig": [
            {
                "value": "#D41F1F",
                "to": 250
            },
            {
                "value": "#D94E17",
                "from": 250,
                "to": 500
            },
            {
                "value": "#CBA700",
                "from": 500,
                "to": 750
            },
            {
                "value": "#669922",
                "from": 750,
                "to": 1000
            },
            {
                "value": "#118832",
                "from": 1000
            }
        ]
    }
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview
A single value is used for showing a metric or KPI and it's related context. Single value visualizations display results and context for searches returning a discrete number. A single value can be a count or other aggregation of specific events.

Any query returning aggregate data using the \`stats\` command is suitable for a Single Value. You can also use a \`timechart\` command to generate a sparkline and then use the visualization DSL to control the major and delta values.

This page covers dynamic coloring with single values. Which can be applied to the trend, sparkline stroke, major values and background.

### SPL for Examples
\`\`\`
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime
\`\`\``}},viz_wX0vC6cg:{type:"splunk.singlevalue",options:{backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)"},dataSources:{primary:"ds_search1"},title:"Single Value",description:"Background Dynamic Coloring",context:{backgroundColorEditorConfig:[{value:"#D41F1F",to:250},{value:"#D94E17",from:250,to:500},{value:"#CBA700",from:500,to:750},{value:"#669922",from:750,to:1e3},{value:"#118832",from:1e3}]}},viz_okhyYj7j:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "options": {
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "Single Value",
    "description": "Major Value Dynamic Coloring",
    "context": {
        "backgroundColorEditorConfig": [
            {
                "value": "#5C33FF",
                "to": 250
            },
            {
                "value": "#207865",
                "from": 250,
                "to": 500
            },
            {
                "value": "#AD3F20",
                "from": 500,
                "to": 750
            },
            {
                "value": "#003E80",
                "from": 750,
                "to": 1000
            },
            {
                "value": "#78062A",
                "from": 1000
            }
        ]
    },
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}},viz_Hv2DOvC6:{type:"splunk.markdown",options:{markdown:`#### Match Value and Range Value

The above examples all changed the color of the associated property by measuring the value returned by our data on a range. Depending on where the data is in that range, the color changes. 

However, if you have discreet values, the Match Value formatter may be better for your data. The example below uses match value for the background of the visualization panel. `}},viz_1VsasxHf:{type:"splunk.singlevalue",options:{sparklineValues:"> primary | seriesByName('status')",backgroundColor:"> majorValue | matchValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)"},dataSources:{primary:"ds_search2"},context:{backgroundColorEditorConfig:[{value:"#5C33FF",match:"Info"},{value:"#AD3F20",match:"Warning"},{value:"#AD3F20",match:"Critical"}]},title:"Dynamic Background Coloring with Match Value"},viz_YBOy9bBK:{type:"splunk.markdown",options:{markdown:`### SPL Definition for Match Value
\`\`\`
| makeresults count=4
| streamstats count
| eval score = random()%3 +1
| eval status = case(score=1,"Info", score=2, "Warning", score=3, "Critical")
| table status
\`\`\`
### Source Definition
\`\`\`
{
    "type": "splunk.singlevalue",
    "options": {
        "sparklineValues": "> primary | seriesByName('annotation_category')",
        "backgroundColor": "> majorValue | matchValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)"
    },
    "dataSources": {
        "primary": "ds_search4"
    },
    "context": {
        "backgroundColorEditorConfig": [
            {
                "value": "#5C33FF",
                "match": "INFO"
            },
            {
                "value": "#AD3F20",
                "match": "WARN"
            },
            {
                "value": "#AD3F20",
                "match": "ERROR"
            }
        ]
    }
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| makeresults count=4
| streamstats count
| eval score = random()%3 +1
| eval status = case(score=1,"Info", score=2, "Warning", score=3, "Critical")
| table status`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1440,h:284}},{item:"viz_XoAtwekf",type:"block",position:{x:0,y:284,w:297,h:380}},{item:"viz_aik8jLHV",type:"block",position:{x:0,y:664,w:297,h:363}},{item:"viz_Hv2DOvC6",type:"block",position:{x:0,y:1027,w:1440,h:143}},{item:"viz_1VsasxHf",type:"block",position:{x:0,y:1170,w:590,h:483}},{item:"viz_kK99DS2i",type:"block",position:{x:297,y:284,w:303,h:380}},{item:"viz_iRCGXrSr",type:"block",position:{x:297,y:664,w:303,h:363}},{item:"viz_YBOy9bBK",type:"block",position:{x:590,y:1170,w:610,h:483}},{item:"viz_crcN6mzo",type:"block",position:{x:600,y:284,w:307,h:380}},{item:"viz_wX0vC6cg",type:"block",position:{x:600,y:664,w:307,h:363}},{item:"viz_fKWCh9Ee",type:"block",position:{x:907,y:284,w:293,h:380}},{item:"viz_okhyYj7j",type:"block",position:{x:907,y:664,w:293,h:363}}],globalInputs:[]},description:"Dynamically color various parts of the Single Value Radial visualization based on your data",title:"Single Value Coloring "};(0,t.default)(a.default.createElement(e,{definition:o}),{pageTitle:"Single Value Coloring",hideFooter:!0,layout:"fixed"});
