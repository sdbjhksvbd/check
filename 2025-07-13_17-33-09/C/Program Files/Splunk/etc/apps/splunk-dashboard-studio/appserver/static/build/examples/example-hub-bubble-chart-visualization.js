import{a as t}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as r}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var i=e(r()),o=e(a());var n={visualizations:{viz_6nQA9HbF:{type:"splunk.markdown",options:{markdown:"## Overview\nBubble charts are useful for finding correlation between three or four dimensions of data. The first two dimensions are the coordinates of the chart, the third is the size of the bubble and the fourth is the color of the bubble. When comparing multiple categories, color can be an easy way to differentiate between bubbles on the chart.\n\nThe best way to generate a bubble chart is to have a search that returns multiple data series, which can be done with a `stats` command. Leverage the visualization DSL in the options to control your `x`, `y` and `category` fields for finer control which is an alternate to formatting your SPL. In the following examples we use a combination of SPL and DSL to format the fields correctly.\n"}},viz_dEmLSTLC:{type:"splunk.bubble",dataSources:{primary:"ds_search1"},title:"Bubble Chart",description:"Default Configuration"},viz_DWRcsfE2:{type:"splunk.markdown",options:{markdown:`### SPL Query
\`\`\`
| inputlookup examples.csv| fields nutrients*
| search "nutrients_protein (g)" != null| head 500
| table "nutrients_protein (g)" nutrients_calories "nutrients_carbohydrate (g)" nutrients_group
\`\`\`

### Source Definition 
\`\`\`
{
    "type": "splunk.bubble",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {},
}
\`\`\``}},viz_DsjRH59i:{type:"splunk.bubble",options:{category:"> primary | seriesByIndex(3)"},dataSources:{primary:"ds_search1"},title:"Bubble Chart",description:"Fields Specified"},viz_G2zjCGiT:{type:"splunk.markdown",options:{markdown:`### Source Definition 
\`\`\`
{
    "type": "splunk.bubble",
    "options": {
        "category": "> primary | seriesByIndex(3)"
    },
    "dataSources": {
        "primary": "ds_dczSkyIq"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:'| inputlookup examples.csv| fields nutrients*| search "nutrients_protein (g)" != null| head 500| table "nutrients_protein (g)" nutrients_calories "nutrients_carbohydrate (g)" nutrients_group',queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_6nQA9HbF",type:"block",position:{x:0,y:0,w:1440,h:217}},{item:"viz_dEmLSTLC",type:"block",position:{x:0,y:217,w:704,h:418}},{item:"viz_DsjRH59i",type:"block",position:{x:0,y:635,w:704,h:382}},{item:"viz_DWRcsfE2",type:"block",position:{x:704,y:217,w:496,h:418}},{item:"viz_G2zjCGiT",type:"block",position:{x:704,y:635,w:496,h:382}}],globalInputs:[]},description:"Use bubble charts to represent data in three dimensions",title:"Bubble Chart"};(0,o.default)(i.default.createElement(t,{definition:n}),{pageTitle:"Bubble Chart",hideFooter:!0,layout:"fixed"});
