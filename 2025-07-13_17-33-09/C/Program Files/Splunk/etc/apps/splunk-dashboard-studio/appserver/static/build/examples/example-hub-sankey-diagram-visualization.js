import{a as n}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as s}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as a}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var i=e(a()),o=e(s());var t={dataSources:{ds_sankey:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:"| inputlookup examples.csv| fields sankey*| search sankey_source!=null"},name:"Search_1"}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_oiBQgD6v",type:"block",position:{x:0,y:0,w:1440,h:312}},{item:"viz_lvFt7DS6",type:"block",position:{x:0,y:312,w:723,h:400}},{item:"viz_878tCgMf",type:"block",position:{x:0,y:712,w:723,h:400}},{item:"viz_OsVncfnW",type:"block",position:{x:0,y:1112,w:723,h:400}},{item:"viz_bHf2plmY",type:"block",position:{x:723,y:312,w:477,h:400}},{item:"viz_wUeFsjNM",type:"block",position:{x:723,y:712,w:477,h:400}},{item:"viz_PL28GOPg",type:"block",position:{x:723,y:1112,w:477,h:400}}],globalInputs:[]},title:"Sankey Diagram",description:"Sankey diagrams help represent flow of resources",visualizations:{viz_lvFt7DS6:{type:"splunk.sankey",dataSources:{primary:"ds_sankey"},title:"Default Configuration"},viz_bHf2plmY:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`
{
    "type": "splunk.sankey",
    "dataSources": {
        "primary": "ds_sankey"
    },
    "title": "Default Configuration",
    "options": {},
    "context": {}
}
\`\`\``}},viz_oiBQgD6v:{type:"splunk.markdown",options:{markdown:`## Overview

Sankey Diagrams are used to depict flows from a set of elements to another, by using nodes to represent the features and links to visualize their connections. Sankey's are effective at showing multi-stage workflows with a many-to-many mapping. Colors are used to separate elements and the width of the links measure proportion of magnitude. 

The data returned in your query must return a source field, a target field, and a value field which represents the width of the source nodes. You can also have another value field to represent color. This example uses the following query for the Sankey Diagram:

### SPL Query
\`\`\`
| inputlookup examples.csv
| fields sankey*
| search sankey_source!=null
\`\`\`
`}},viz_878tCgMf:{type:"splunk.sankey",dataSources:{primary:"ds_sankey"},title:"Link Value Field Specified",options:{linkValues:"> primary | seriesByName('sankey_value2')"}},viz_wUeFsjNM:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`
{
    "type": "splunk.sankey",
    "dataSources": {
        "primary": "ds_sankey"
    },
    "title": "Link Value Field Specified",
    "options": {
        "linkValues": "> primary | seriesByName('sankey_value2')"
    },
    "context": {}
}
\`\`\``}},viz_OsVncfnW:{type:"splunk.sankey",dataSources:{primary:"ds_sankey"},title:"Link Opacity",options:{linkOpacity:.8}},viz_PL28GOPg:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`
{
    "type": "splunk.sankey",
    "dataSources": {
        "primary": "ds_sankey"
    },
    "title": "Link Opacity",
    "options": {
        "linkOpacity": 0.8
    },
    "context": {}
}
\`\`\``}}}};(0,o.default)(i.default.createElement(n,{definition:t}),{pageTitle:"Sankey Diagram",hideFooter:!0,layout:"fixed"});
