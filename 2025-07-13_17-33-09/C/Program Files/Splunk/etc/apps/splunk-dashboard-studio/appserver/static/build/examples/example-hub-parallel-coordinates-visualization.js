import{a as n}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as s}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as a}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var i=e(a()),o=e(s());var t={dataSources:{ds_parallel:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:'| inputlookup examples.csv| fields nutrients*| search "nutrients_protein (g)" != null| stats count by nutrients_group nutrients_calories "nutrients_protein (g)" "nutrients_water (g)" | fields - count'},name:"Search_1"}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_oiBQgD6v",type:"block",position:{x:0,y:0,w:1440,h:321}},{item:"viz_lvFt7DS6",type:"block",position:{x:0,y:321,w:723,h:426}},{item:"viz_878tCgMf",type:"block",position:{x:0,y:747,w:723,h:391}},{item:"viz_OsVncfnW",type:"block",position:{x:0,y:1138,w:723,h:383}},{item:"viz_bHf2plmY",type:"block",position:{x:723,y:321,w:477,h:426}},{item:"viz_wUeFsjNM",type:"block",position:{x:723,y:747,w:477,h:391}},{item:"viz_PL28GOPg",type:"block",position:{x:723,y:1138,w:477,h:383}}],globalInputs:[]},title:"Parallel Coordinates",description:"Visualize Correlations in multi-dimensional datasets",visualizations:{viz_lvFt7DS6:{type:"splunk.parallelcoordinates",dataSources:{primary:"ds_parallel"},title:"Parallel Coordinates",showProgressBar:!1,showLastUpdated:!1,description:"Default configuration"},viz_bHf2plmY:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`
{
    "type": "splunk.parallelcoordinates",
    "dataSources": {
        "primary": "ds_parallel"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_oiBQgD6v:{type:"splunk.markdown",options:{markdown:`## Overview

Parallel coordinates are used to depict relationships in multi-dimensional datasets. This visualization is ideal for comparing many variables together and seeing the relationships between them. Each variable is given its own axis and corresponding scale. Lines then map item values for each variable. The ordering of axes can help discover patterns or correlations across variables.

The order of the columns returned would be the order of the axes shown in the chart. The direction of the lines indicate the correlation between the axes for that particular data point. The following examples use this query:

### SPL Query
\`\`\`
| inputlookup examples.csv
| fields nutrients*
| search "nutrients_protein (g)" != null
| stats count by nutrients_group nutrients_calories "nutrients_protein (g)" "nutrients_water (g)" 
| fields - count
\`\`\` `}},viz_878tCgMf:{type:"splunk.parallelcoordinates",dataSources:{primary:"ds_parallel"},title:"Parallel Coordinates",showProgressBar:!1,showLastUpdated:!1,options:{lineColor:"#FFC0CB",lineOpacity:.3},description:"Line Color and Opacity"},viz_wUeFsjNM:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`
{
    "type": "splunk.parallelcoordinates",
    "dataSources": {
        "primary": "ds_parallel"
    },
    "options": {
        "lineColor": "#FFC0CB",
        "lineOpacity": 0.3
    },
    "context": {}
}
\`\`\``}},viz_OsVncfnW:{type:"splunk.parallelcoordinates",dataSources:{primary:"ds_parallel"},title:"Parallel Coordinates",showProgressBar:!1,showLastUpdated:!1,options:{showNullAxis:!1},description:"Null Axis Hidden"},viz_PL28GOPg:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`
{
    "type": "splunk.parallelcoordinates",
    "dataSources": {
        "primary": "ds_parallel"
    },
    "options": {
        "showNullAxis": false
    },
    "context": {}
}
\`\`\``}}}};(0,o.default)(i.default.createElement(n,{definition:t}),{pageTitle:"Parallel Coordinates",hideFooter:!0,layout:"fixed"});
