import{a as t}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as s}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as r}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var n=e(r()),i=e(s());var o={visualizations:{viz_RBdQ2qQ5:{type:"splunk.markdown",options:{markdown:`## Overview
A text input allows users to set tokens based on exact string entries in a text field. It is used best to match titles, descriptions, usernames, and other forms of unique text entries. In this example, the background color of the visualization depends on the hex value that is entered 

### Source  for Text Input
\`\`\`
{
    "type": "input.text",
    "options": {
        "defaultValue": "#9964F1",
        "token": "color"
    },
    "title": "Input hex color:"
}
\`\`\``}},viz_gMr0oNmO:{type:"splunk.singlevalue",title:"Background Color is $hex$",dataSources:{primary:"ds_search1"},description:"",options:{backgroundColor:"$hex$"}},viz_U1bGC44o:{type:"splunk.markdown",options:{markdown:`### SPL 
\`\`\`
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime
\`\`\`
### Source For Single Value
\`\`\`
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "backgroundColor": "$color$"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_ovnr6KpF:{type:"input.text",options:{defaultValue:"#9964F1",token:"hex"},title:"Input hex color:"}},layout:{type:"grid",options:{},structure:[{item:"viz_RBdQ2qQ5",type:"block",position:{x:0,y:0,w:1440,h:346}},{item:"viz_gMr0oNmO",type:"block",position:{x:0,y:346,w:600,h:385}},{item:"viz_U1bGC44o",type:"block",position:{x:600,y:346,w:600,h:385}}],globalInputs:["input_ovnr6KpF"]},description:"Set tokens based on text entries",title:"Text Input"};(0,i.default)(n.default.createElement(t,{definition:o}),{pageTitle:"Text",hideFooter:!0,layout:"fixed"});
