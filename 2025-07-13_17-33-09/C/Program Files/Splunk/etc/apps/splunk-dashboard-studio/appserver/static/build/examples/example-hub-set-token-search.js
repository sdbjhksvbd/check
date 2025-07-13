import{a as t}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as r}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as o}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var a=e(o()),n=e(r());var s={visualizations:{viz_XoAtwekf:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Search id: $my_search:job.sid$ - Top Result: $my_search:result.host$",description:"Returned $my_search:job.resultCount$ results",eventHandlers:[]},viz_kK99DS2i:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`
| inputlookup firewall_example.csv
| chart count by host
| sort - count
\`\`\`
### Source Definition
\`\`\`
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "$my search:job.sid$ -  Top Result: $my search:result.host$",
    "description": "Returned $my search:job.resultCount$ results"
    "eventHandlers": [],
    "options": {},
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview

Set tokens from search results or search job metadata to embed search-related information in other searches or visualizations. For example, you can set tokens using the result of a general qery to filter subsequent queries on your dashboard. 

## Syntax
To set a token using **search results** us the syntax:
\`$<search name>:result.<field>$\`

To set a token using **job metadata** us the syntax:
\`$<search name>:job.<metadata option>$\`
`}},viz_xSc6MKql:{type:"splunk.singlevalue",title:"Search id: $my_search:job.sid$",description:"",dataSources:{primary:"ds_search1"},eventHandlers:[{type:"drilldown.setToken",options:{tokens:[{token:"staticToken",value:'"User Has Clicked the Visualization"'}]}}]},viz_w3BDtfy2:{type:"splunk.markdown",options:{markdown:`## Search Metadata

### Search job status
Syntax: \`$search name:job.startTime$\`  
Example: $my_search:job.status$

### Initial time a search job starts
Syntax: \`$search name:job.startTime$\`  
Example: $my_search:job.startTime$

### Number of results returned
Syntax: \`$search name:job.resultCount$\`  
Example: $my_search:job.resultCount$


### Indicate whether the search has results 
Syntax: \`$search name:job.hasResults$\`  
Example: $my_search:job.hasResults$

`}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| chart count by host
| sort - count`,queryParameters:{earliest:"-60m@m",latest:"now"},enableSmartSources:!0},name:"my_search"},ds_qytaWndI_ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| chart count by host
| where host=NULL`,queryParameters:{earliest:"-60m@m",latest:"now"},enableSmartSources:!0},name:"other_search"}},defaults:{},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1200,h:231}},{item:"viz_XoAtwekf",type:"block",position:{x:0,y:231,w:600,h:413}},{item:"viz_xSc6MKql",type:"block",position:{x:0,y:644,w:600,h:415}},{item:"viz_kK99DS2i",type:"block",position:{x:600,y:231,w:600,h:413}},{item:"viz_w3BDtfy2",type:"block",position:{x:600,y:644,w:600,h:415}}],globalInputs:[]},description:"Set tokens based on search results and job metadata",title:"Set Token from Search"};(0,n.default)(a.default.createElement(t,{definition:s}),{pageTitle:"Set Token from Search",hideFooter:!0,layout:"fixed"});
