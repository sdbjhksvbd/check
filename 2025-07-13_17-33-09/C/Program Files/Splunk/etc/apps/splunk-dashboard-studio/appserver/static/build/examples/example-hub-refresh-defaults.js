import{a as t}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as i}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as r}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var a=e(r()),o=e(i());var s={visualizations:{viz_pcZVNjLm:{type:"splunk.markdown",options:{markdown:`## Overview
Using defaults saves you time by applying a certain configuration or option in one place. One of the datasource options that you can set as default is the **refresh**.  

You can configure whether or not a datasource on your dashboard has a refresh set or not, as well as the type of refresh used. **Delay** starts the timer when the search is complete whereas **interval** starts the timer when the search is dispatched. By default, every visualization comes with the option to show when it was last updated to \`false\`. To see if your refresh is what you expected, turning this option to \`true\` can be a good way to confirm the dashboard is working the way you designed. 
\`\`\`
"showLastUpdated": false
\`\`\`

As with all defaults, you can set them per datasource type, global, or locally within each datasource definition. The locally defined option takes the highest priority, and then the type specific default, and then the global. 

### Default Definition
\`\`\`
"defaults": {
		"dataSources": {
			"global": {
				"options": {
					"refresh": "15s",
					"refreshType": "delay"
				}
			},
			"ds.search": {
				"options": {
					"refresh": "10s",
					"refreshType": "delay"
				}
			}
		}
	}
\`\`\``}},viz_HzpHxRa6:{type:"splunk.singlevalue",dataSources:{primary:"ds_XEyZrqjG"},title:"Refresh Set to 15 seconds - Last Updated On",description:"This visualization uses a ds.chain datasource, therefore the global default of 15s applies here",options:{sparklineDisplay:"after"},showProgressBar:!1,showLastUpdated:!0},viz_dZUpbQPE:{type:"splunk.singlevalue",dataSources:{primary:"ds_WmZ05OjQ"},title:"Refresh set to 10 seconds - Last Updated Off",description:"This visualization uses a ds.search datasource, therefore the configured default of 10s applies here",options:{sparklineDisplay:"after"},showProgressBar:!0}},dataSources:{ds_WmZ05OjQ:{type:"ds.search",options:{queryParameters:{earliest:"-4h@m",latest:"now"},query:"| makeresults count=15| streamstats count| eval _time=_time-(count*86400)| eval value=random()%100| fields _time value"},name:"Search_1"},ds_WRhFn3VE:{type:"ds.search",options:{queryParameters:{earliest:"-60m@m",latest:"now"},query:`| makeresults count=15
| streamstats count
| eval _time=_time-(count*86400)`},name:"Search_2"},ds_XEyZrqjG:{type:"ds.chain",options:{extend:"ds_WRhFn3VE",query:"| eval value=random()%100| fields _time value"},name:"Search_3"}},defaults:{dataSources:{global:{options:{refresh:"15s",refreshType:"delay"}},"ds.search":{options:{refresh:"10s",refreshType:"delay"}}}},inputs:{},layout:{type:"grid",options:{},structure:[{item:"viz_pcZVNjLm",type:"block",position:{x:0,y:0,w:600,h:726}},{item:"viz_dZUpbQPE",type:"block",position:{x:600,y:364,w:600,h:362}},{item:"viz_HzpHxRa6",type:"block",position:{x:600,y:0,w:600,h:364}}],globalInputs:[]},description:"Data sources of different types can refresh at different intervals, or a global default can be set for all data sources",title:"Refresh Defaults and Show Last Updated"};(0,o.default)(a.default.createElement(t,{definition:s}),{pageTitle:"Refresh Defaults",hideFooter:!0,layout:"fixed"});
