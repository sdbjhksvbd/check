import{a as o}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as s}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as r}from"../chunks/chunk-NP732JJA.js";import{i as e}from"../chunks/chunk-FOXWPXSG.js";var n=e(r()),a=e(s());var t={visualizations:{viz_NO70IXtY:{type:"splunk.map",options:{center:[37.7749,-122.4195],zoom:0,scaleUnit:"imperial",layers:[{type:"marker",latitude:'> primary | seriesByName("lat")',longitude:'> primary | seriesByName("lon")',resultLimit:1e3}]},dataSources:{primary:"ds_search_table"},title:"Marker Layer with Base Configurations",description:"Center, zoom, imperial scale unit, result limit"},viz_HiUiyhHB:{type:"splunk.markdown",options:{markdown:`### Source Definition 
\`\`\`
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "scaleUnit": "imperial",
        "layers": [
            {
                "type": "marker",
                "latitude": "> primary | seriesByName(\\"lat\\")",
                "longitude": "> primary | seriesByName(\\"lon\\")",
                "resultLimit": 1000
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_table"
    }
}
\`\`\``}},viz_jWqObBES:{type:"splunk.markdown",options:{markdown:`## Overview
Splunk Dashboards provides out of the box functionality to visualize geospatial data on a map area of your choice. These examples can allow you to adjust your data and configurations to make sure it matches the visualization you're looking for. 

### SPL for Marker Layers
\`\`\`
| inputlookup geomaps_data.csv
| iplocation device_ip
| table bytes device_ip lat lon
\`\`\``}},viz_9xL20GgN:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "layers": [
            {
                "type": "bubble",
                "latitude": "> primary | seriesByName(\\"lat\\")",
                "longitude": "> primary | seriesByName(\\"lon\\")",
                "bubbleSize": "> primary | frameWithoutSeriesNames(\\"geobin\\", \\"latitude\\", \\"longitude\\") | frameBySeriesTypes(\\"number\\")"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_geostats_by"
    }
}
\`\`\``}},viz_yVAZGHP2:{type:"splunk.map",options:{center:[12.897491671831347,-122.41949999999997],zoom:0,layers:[{type:"bubble",latitude:"> primary | seriesByName('latitude')",longitude:"> primary | seriesByName('longitude')",bubbleSize:'> primary | frameWithoutSeriesNames("geobin", "latitude", "longitude") | frameBySeriesTypes("number")'}]},dataSources:{primary:"ds_search_geostats_by"},title:"Bubble Layer with Multiple Series"},viz_fPceEFFv:{type:"splunk.map",options:{center:[28.30438293026387,-122.41949999999997],zoom:0,layers:[{type:"marker",latitude:'> primary | seriesByName("lat")',longitude:'> primary | seriesByName("lon")',dataColors:'> primary | seriesByName("bytes") | rangeValue(colorRangeConfig)'}]},dataSources:{primary:"ds_search_table"},title:"Marker Layer with Dynamic Coloring",context:{colorRangeConfig:[{from:3e3,value:"#d41f1f"},{from:2e3,to:3e3,value:"#d97a0d"},{from:100,to:2e3,value:"#9d9f0d"},{to:1e3,value:"#118832"}]}},viz_kI660Tcg:{type:"splunk.map",options:{center:[31.35363912124076,-122.41949999999997],zoom:0,layers:[{type:"bubble",latitude:'> primary | seriesByName("latitude")',longitude:'> primary | seriesByName("longitude")',bubbleSize:"> primary | seriesByName('count')"}]},dataSources:{primary:"ds_search_geostats"},title:"Bubble Layer with Single Series",showProgressBar:!1,showLastUpdated:!1},viz_bHoqIDQp:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "layers": [
            {
                "type": "marker",
                "latitude": "> primary | seriesByName(\\"lat\\")",
                "longitude": "> primary | seriesByName(\\"lon\\")",
                "dataColors": "> primary | seriesByName(\\"bytes\\") | rangeValue(colorRangeConfig)"
            }
        ]
    },
    "context": {
        "colorRangeConfig": [
            {
                "from": 3000,
                "value": "#d41f1f"
            },
            {
                "from": 2000,
                "to": 3000,
                "value": "#d97a0d"
            },
            {
                "from": 100,
                "to": 2000,
                "value": "#9d9f0d"
            },
            {
                "to": 1000,
                "value": "#118832"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_table"
    }
}
\`\`\``}},viz_KxrwVvi1:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "layers": [
            {
                "type": "bubble",
                "latitude": "> primary | seriesByName(\\"latitude\\")",
                "longitude": "> primary | seriesByName(\\"longitude\\")",
                "bubbleSize": "> primary | frameWithoutSeriesNames(\\"geobin\\", \\"latitude\\", \\"longitude\\") | frameBySeriesTypes(\\"number\\")"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_geostats"
    }
}
\`\`\``}},viz_NIzTFa8m:{type:"splunk.markdown",options:{markdown:"### SPL for Bubble Layers with Geostats (single-series)\n```\n| inputlookup geomaps_data.csv\n| iplocation device_ip\n| geostats latfield=lat longfield=lon count\n```"}},viz_kYBM8BgO:{type:"splunk.markdown",options:{markdown:"### SPL for Bubble Layers with Geostats (multi-series)\n```\n| inputlookup geomaps_data.csv\n| iplocation device_ip\n| geostats latfield=lat longfield=lon count by method\n```"}},viz_HqNuMadG:{type:"splunk.map",options:{center:[2842170943040401e-29,-122.41949999999997],zoom:.022367792570463528,layers:[{type:"choropleth",areaIds:"> primary | seriesByName('country')",areaValues:"> primary | seriesByName('count')"}]},dataSources:{primary:"ds_search_geom"},title:"Choropleth Layer"},viz_OcKFTY8Z:{type:"splunk.markdown",options:{markdown:`### SPL for Choropleth Layers with Geom
\`\`\`
| inputlookup geomaps_data.csv
| iplocation device_ip
| lookup geo_countries latitude AS lat longitude AS lon OUTPUT featureId AS country
| stats count by country
| geom geo_countries featureIdField=country

\`\`\``},showProgressBar:!1,showLastUpdated:!1},viz_TGGfIlS8:{type:"splunk.markdown",options:{markdown:`### Source Defintion
\`\`\`
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "layers": [
            {
                "type": "choropleth",
                "areaIds": "> primary | seriesByName('country')",
                "areaValues": "> primary | seriesByName('count')"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_geom"
    }
}
\`\`\``},showProgressBar:!1,showLastUpdated:!1},viz_Ymt3ZWaa:{type:"splunk.map",options:{center:[42.8093628214485,-7.0098652590829715],zoom:0,layers:[{type:"choropleth",source:"geo://default/world",choroplethStrokeColor:"#000000",choroplethOpacity:1}],showBaseLayer:!1,backgroundColor:"#000000"},dataSources:{primary:"ds_search_lookup_countries"},title:"World Choropleth Layer with hidden base layer",description:"Background color: black"},viz_jTgDCo7q:{type:"splunk.markdown",options:{markdown:`### SPL for Choropleth Layers with World Source

\`\`\`
|  inputlookup geo_attr_countries
|  eval numb=len(country)
|  eval numby=numb*3
|  fields country, numb
\`\`\``}},viz_0sCPm5Qi:{type:"splunk.markdown",options:{markdown:`### Source Defintion
\`\`\`
{
    "type": "splunk.map",
    "options": {
        "center": [
            46.56,
            10.35
        ],
        "zoom": 0.45,
        "layers": [
            {
                "type": "choropleth",
                "source": "geo://default/world",
                "choroplethStrokeColor": "#000000",
                "choroplethOpacity": 1
            }
        ],
        "showBaseLayer": false,
        "backgroundColor": "#000000"
    },
    "dataSources": {
        "primary": "ds_search_lookup_countries"
    },
    "title": "World Choropleth Layer with hidden base layer",
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}},viz_emxH8Rwz:{type:"splunk.map",options:{center:[37.76029219846083,-96.48145996055393],zoom:2.405974906342065,layers:[{type:"choropleth",source:"geo://default/us",choroplethStrokeColor:"#000000",choroplethOpacity:1}],showBaseLayer:!1,backgroundColor:"transparent",showScale:!1,showZoomControls:!1},dataSources:{primary:"ds_search_lookup_states"},title:"US Choropleth Layer with hidden base layer",description:"Background color: transparent, Hidden zoom controls"},viz_6ULmRsyY:{type:"splunk.markdown",options:{markdown:`### SPL for Choropleth Layers with US Source

\`\`\`
|  inputlookup geo_us_states
|  eval numb=len(featureId)
|  eval numb2=numb*2
|  rename featureId as state
|  fields - _featureIdField
|  fields state, numb
\`\`\``}},viz_myQsYzhp:{type:"splunk.markdown",options:{markdown:`### Source Defintion
\`\`\`
{
    "type": "splunk.map",
    "options": {
        "center": [
            39.83000000000001,
            -98.57999999999998
        ],
        "zoom": 3,
        "layers": [
            {
                "type": "choropleth",
                "source": "geo://default/us",
                "choroplethStrokeColor": "#000000",
                "choroplethOpacity": 1
            }
        ],
        "showBaseLayer": false,
        "backgroundColor": "transparent",
        "showScale": false,
        "showZoomControls": false
    },
    "dataSources": {
        "primary": "ds_search_lookup_states"
    },
    "title": "US Choropleth Layer with transparent background",
    "description": "Hidden zoom controls",
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``},showProgressBar:!1,showLastUpdated:!1}},dataSources:{ds_search_geostats_by:{type:"ds.search",options:{query:`| inputlookup geomaps_data.csv
| iplocation device_ip
| geostats latfield=lat longfield=lon count by method`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_Geostats_By"},ds_search_table:{type:"ds.search",options:{query:`| inputlookup geomaps_data.csv
| iplocation device_ip
| table bytes device_ip lat lon`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_Table"},ds_search_geostats:{type:"ds.search",options:{query:`| inputlookup geomaps_data.csv
| iplocation device_ip
| geostats latfield=lat longfield=lon count`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_Geostats"},ds_search_geom:{type:"ds.search",options:{query:`| inputlookup geomaps_data.csv
| iplocation device_ip
| lookup geo_countries latitude AS lat longitude AS lon OUTPUT featureId AS country
| stats count by country
| geom geo_countries featureIdField=country
`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_Geom"},ds_search_lookup_countries:{type:"ds.search",options:{query:`|  inputlookup geo_attr_countries
|  eval numb=len(country)
|  eval numby=numb*3
|  fields country, numb`,queryParameters:{earliest:"0",latest:""}},name:"Search_GeoJSON_Countries"},ds_search_lookup_states:{type:"ds.search",options:{query:`|  inputlookup geo_us_states
|  eval numb=len(featureId)
|  eval numb2=numb*2
|  rename featureId as state
|  fields - _featureIdField
|  fields state, numb`,queryParameters:{earliest:"0",latest:""}},name:"Search_GeoJSON_States"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},layout:{type:"grid",options:{display:"auto-scale"},structure:[{item:"viz_jWqObBES",type:"block",position:{x:0,y:0,w:1440,h:210}},{item:"viz_NO70IXtY",type:"block",position:{x:0,y:210,w:463,h:399}},{item:"viz_fPceEFFv",type:"block",position:{x:0,y:609,w:463,h:468}},{item:"viz_kI660Tcg",type:"block",position:{x:0,y:1077,w:463,h:458}},{item:"viz_yVAZGHP2",type:"block",position:{x:0,y:1535,w:463,h:515}},{item:"viz_HqNuMadG",type:"block",position:{x:0,y:2050,w:463,h:528}},{item:"viz_HiUiyhHB",type:"block",position:{x:463,y:210,w:737,h:399}},{item:"viz_bHoqIDQp",type:"block",position:{x:463,y:609,w:737,h:468}},{item:"viz_KxrwVvi1",type:"block",position:{x:463,y:1202,w:737,h:333}},{item:"viz_NIzTFa8m",type:"block",position:{x:463,y:1077,w:737,h:125}},{item:"viz_9xL20GgN",type:"block",position:{x:463,y:1660,w:737,h:390}},{item:"viz_kYBM8BgO",type:"block",position:{x:463,y:1535,w:737,h:125}},{item:"viz_TGGfIlS8",type:"block",position:{x:463,y:2233,w:737,h:345}},{item:"viz_OcKFTY8Z",type:"block",position:{x:463,y:2050,w:737,h:183}},{item:"viz_Ymt3ZWaa",type:"block",position:{x:0,y:2578,w:463,h:400}},{item:"viz_0sCPm5Qi",type:"block",position:{x:463,y:2778,w:737,h:200}},{item:"viz_jTgDCo7q",type:"block",position:{x:463,y:2578,w:737,h:200}},{item:"viz_emxH8Rwz",type:"block",position:{x:0,y:2978,w:463,h:400}},{item:"viz_myQsYzhp",type:"block",position:{x:463,y:3178,w:737,h:200}},{item:"viz_6ULmRsyY",type:"block",position:{x:463,y:2978,w:737,h:200}}],globalInputs:[]},description:"Visualize geospatial data on an interactive map area",title:"Interactive Maps"};(0,a.default)(n.default.createElement(o,{definition:t}),{pageTitle:"Interactive Maps",hideFooter:!0,layout:"fixed"});
