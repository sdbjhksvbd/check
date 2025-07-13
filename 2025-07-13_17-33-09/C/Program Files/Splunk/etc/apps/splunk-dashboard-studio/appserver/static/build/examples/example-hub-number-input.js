import{a as n}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as i}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as r}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var o=e(r()),a=e(i());var t={visualizations:{viz_RBdQ2qQ5:{type:"splunk.markdown",options:{markdown:`## Overview
A number input allows users to select a single number from a dropdown. When configuring from the UI, users enter a mininum, a maximum, a step and a default value. Numbers can be used to change how many values are returned in a search or change the number of rows shown in a table

### Source  for Number Input
\`\`\`
{
    "type": "input.number",
    "options": {
        "defaultValue": 10,
        "token": "number",
        "min": 0,
        "max": 10,
        "step": 1
    },
    "title": "Number Input Title"
}
\`\`\``}},viz_gMr0oNmO:{type:"splunk.table",title:"Return $num$ Values",dataSources:{primary:"ds_search1"},description:""},viz_U1bGC44o:{type:"splunk.markdown",options:{markdown:`### SPL 
\`\`\`
| inputlookup outages_example.csv
| stats count by "Event Description"
| head $number$
\`\`\`
### Source For Single Value
\`\`\`
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {},
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| stats count by "Event Description"
| head $num$`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_uPWAplUK:{options:{defaultValue:5,token:"num",min:0,max:10,step:1},title:"Number Input Title",type:"input.number"}},layout:{type:"grid",options:{},structure:[{item:"viz_RBdQ2qQ5",type:"block",position:{x:0,y:0,w:1440,h:385}},{item:"viz_gMr0oNmO",type:"block",position:{x:0,y:385,w:600,h:375}},{item:"viz_U1bGC44o",type:"block",position:{x:600,y:385,w:600,h:375}}],globalInputs:["input_uPWAplUK"]},description:"Set tokens by selecting a number from a dropdown",title:"Number Input"};(0,a.default)(o.default.createElement(n,{definition:t}),{pageTitle:"Number Input",hideFooter:!0,layout:"fixed"});
