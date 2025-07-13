import{a as n}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as s}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as o}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var i=e(o()),t=e(s());var a={visualizations:{viz_C4mm5934:{type:"splunk.markdown",options:{markdown:`## Overview
Post-process data sources, known as chain searches, perform additional processing on results from a base data source. You can use multiple chain search to generate different results from the same base search. You can also populate form inputs with a chain search. This helps reduce repetition in searches and can improve overall performance. 

When adding a new search via the front-end visual editor, you are given an option to make it a chain search. You then select what the base search is, and then enter your chain search. 

In the following example, the base search shown below is used for the chart and table, with each having a different chain search. Chain searches can also chain from existing chain searches. The single value visualization below chains from "chain 1" to create another chain search

### Datasource Definition for Base Search
\`\`\`
{
    "type": "ds.search",
    "options": {
        "query": "| inputlookup outages_example.csv\\n| top Tags limit=10",
        "queryParameters": {}
    },
    "name": "base"
}
\`\`\``}},viz_NGZfoTti:{type:"splunk.column",dataSources:{primary:"ds_chain1"},title:"Chain 1 Column Chart",description:"| where count >100"},viz_Jx4ViV7N:{type:"splunk.table",title:"Chain 2 Table",dataSources:{primary:"ds_chain2"},description:'| rename count as "Entries" percent as "% total"'},viz_5AxetBTA:{type:"splunk.markdown",options:{markdown:`### Chain 1 Source Definition
\`\`\`
{
    "type": "ds.chain",
    "options": {
        "extend": "ds_base",
        "query": "| where count > 100"
    },
    "name": "chain_1"
}
\`\`\``}},viz_w3nfQVDC:{type:"splunk.markdown",options:{markdown:`### Chain 2 Source Definition

\`\`\`
{
    "type": "ds.chain",
    "options": {
        "extend": "ds_base",
        "query": "| rename count as \\"Entries\\" percent as \\"% total\\""
    },
    "name": "chain_2"
}
\`\`\``}},viz_BQAHNdLu:{type:"splunk.singlevalue",dataSources:{primary:"ds_chain3"},title:"Chaining from Chain 1",description:"Max Count",options:{unit:"entries"}},viz_LTYilU5h:{type:"splunk.markdown",options:{markdown:`### Chain 3 Source Definition

\`\`\`
{
    "type": "ds.chain",
    "options": {
        "extend": "ds_chain1",
        "query": "| stats max(count) as \\"Max Count\\""
    },
    "name": "chain_3"
}
\`\`\``}}},dataSources:{ds_base:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| top Tags limit=10`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"base"},ds_chain1:{type:"ds.chain",options:{extend:"ds_base",query:"| where count > 100"},name:"chain_1"},ds_chain2:{type:"ds.chain",options:{extend:"ds_base",query:'| rename count as "Entries" percent as "% total"'},name:"chain_2"},ds_chain3:{type:"ds.chain",options:{extend:"ds_chain1",query:'| stats max(count) as "Max Count"'},name:"chain_3"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_C4mm5934",type:"block",position:{x:0,y:0,w:1440,h:457}},{item:"viz_NGZfoTti",type:"block",position:{x:0,y:457,w:403,h:282}},{item:"viz_5AxetBTA",type:"block",position:{x:0,y:739,w:403,h:239}},{item:"viz_Jx4ViV7N",type:"block",position:{x:403,y:457,w:398,h:282}},{item:"viz_w3nfQVDC",type:"block",position:{x:403,y:739,w:398,h:239}},{item:"viz_BQAHNdLu",type:"block",position:{x:801,y:457,w:399,h:282}},{item:"viz_LTYilU5h",type:"block",position:{x:801,y:739,w:399,h:239}}],globalInputs:[]},description:"Optimize your dashboard by using base and chain searches to remove repitition",title:"Base and Chain Searches"};(0,t.default)(i.default.createElement(n,{definition:a}),{pageTitle:"Base and Chain Search",hideFooter:!0,layout:"fixed"});
