import{a as t}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as r}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as i}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var n=e(i()),a=e(r());var o={visualizations:{viz_3NUrAfkt:{type:"splunk.markdown",options:{markdown:`## Overview

Tables can help you compare and aggregate field values. Use a table to visualize patterns for one or more metrics across a dataset. Tables are also very useful for debugging a dashboard. If you feel a visualization isn't displaying data the way you expect, create a table with the same search to see exactly what data is being returned. 

The following examples cover basic table configurations. Most of the options are available through the visual editor for the visualization.  `}},viz_gezCclRK:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Table",description:"Default Configuration"},viz_Zy9SbUug:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Table",description:"Alternate Row Coloring off, fixed header, row numbers",options:{tableFormat:{rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByTheme)"},showRowNumbers:!0}},viz_RVNSVBHv:{type:"splunk.markdown",options:{markdown:`### SPL For Table
\`\`\`
| inputlookup outages_example.csv
| search "Number of Customers Affected"!="Unknown"
| fields "Date Event Began", "Event Description", "Geographic Areas", "Number of Customers Affected"
| head 100
\`\`\`
### Source Definition
\`\`\`
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_Hb2gqYLi:{type:"splunk.markdown",options:{markdown:`### SPL for Column Width
\`\`\`
| inputlookup outages_example.csv
| fields "Event Description" "Geographic Areas" "Respondent" "Tags"
\`\`\`

### Source Definition
\`\`\`
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search2"
    }
   "options": {
        "columnFormat": {
            "Event Description": {
                "width": 120,
                "textOverflow": "ellipsis"
            },
            "Geographic Areas": {
                "width": 120,
                "textOverflow": "break-word"
            },
            "Respondent": {
                "width": 120,
                "textOverflow": "anywhere"
            }
        }
    },
    "context": {}
}
\`\`\``}},viz_n67ApED4:{type:"splunk.markdown",options:{markdown:`
### Source Definition
\`\`\`
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "tableFormat": {
            "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByTheme)"
        },
        "showRowNumbers": true
    },
    "context": {}
}
\`\`\``}},viz_FiYpf6Mn:{type:"splunk.table",dataSources:{primary:"ds_search2"},title:"Specified Column Width",description:"Text overflow options: ellipsis, break-word, anywhere",options:{columnFormat:{"Event Description":{width:120,textOverflow:"ellipsis"},"Geographic Areas":{width:120,textOverflow:"break-word"},Respondent:{width:120,textOverflow:"anywhere"}}}}},dataSources:{ds_search1:{type:"ds.search",options:{query:'| inputlookup outages_example.csv| search "Number of Customers Affected"!="Unknown"| fields "Date Event Began", "Event Description", "Geographic Areas", "Number of Customers Affected"| head 100',queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| fields "Event Description" "Geographic Areas" "Respondent" "Tags"`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_3NUrAfkt",type:"block",position:{x:0,y:0,w:1440,h:179}},{item:"viz_gezCclRK",type:"block",position:{x:0,y:179,w:618,h:408}},{item:"viz_Zy9SbUug",type:"block",position:{x:0,y:587,w:618,h:419}},{item:"viz_FiYpf6Mn",type:"block",position:{x:0,y:1006,w:618,h:460}},{item:"viz_RVNSVBHv",type:"block",position:{x:618,y:179,w:582,h:408}},{item:"viz_n67ApED4",type:"block",position:{x:618,y:587,w:582,h:419}},{item:"viz_Hb2gqYLi",type:"block",position:{x:618,y:1006,w:582,h:460}}],globalInputs:[]},description:"Use Tables to display field and row data from datasources",title:"Table"};(0,a.default)(n.default.createElement(t,{definition:o}),{pageTitle:"Table",hideFooter:!0,layout:"fixed"});
