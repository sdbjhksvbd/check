import{a as o}from"../chunks/chunk-N2ZXR5A7.js";import"../chunks/chunk-JH24LUXZ.js";import"../chunks/chunk-DLYUP5P4.js";import"../chunks/chunk-P7VIGQO4.js";import"../chunks/chunk-LT4H6J3K.js";import"../chunks/chunk-JNARL5PJ.js";import"../chunks/chunk-ELIEG7M2.js";import"../chunks/chunk-GECC65SD.js";import"../chunks/chunk-IZDCONH5.js";import"../chunks/chunk-UVCMF6AG.js";import"../chunks/chunk-VWCNWZTS.js";import"../chunks/chunk-HSXE43VV.js";import{a as r}from"../chunks/chunk-WZ7HRZ7Q.js";import"../chunks/chunk-S6E35LU3.js";import"../chunks/chunk-RQXY73SC.js";import"../chunks/chunk-6VJEWO5O.js";import"../chunks/chunk-EZGXPQUG.js";import{b as l}from"../chunks/chunk-NP732JJA.js";import{i as n}from"../chunks/chunk-FOXWPXSG.js";var e=n(l()),i=n(r());var t={visualizations:{viz_basic_rect:{type:"splunk.rectangle"},viz_UBCZ0E2L:{type:"splunk.markdown",options:{content:"",markdown:`## Overview

In absolute layout, rectangles, ellipses and lines can be used to help apply storytelling context to your dashboard. `}},viz_sGWsOnIy:{type:"splunk.markdown",options:{content:"",markdown:`### Default Configuration 

\`\`\`
{
    "type": "splunk.rectangle",
    "options": {},
    "context": {}
}
\`\`\``}},viz_jqO2NABZ:{type:"splunk.rectangle",options:{strokeColor:"#dc4e41",strokeWidth:4}},viz_kJpsIF0B:{type:"splunk.markdown",options:{content:"",markdown:`### Stroke Width and Color

\`\`\`
{
    "type": "splunk.rectangle",
    "options": {
        "strokeColor": "#dc4e41",
        "strokeWidth": 4
    },
    "context": {}
}
\`\`\``}},viz_psQgYRzO:{type:"splunk.rectangle",options:{strokeColor:"#c3cbd4",fillColor:"#dc4e41",fillOpacity:.6}},viz_VwbQjyAX:{type:"splunk.markdown",options:{content:"",markdown:`### Fill Color and Opacity
\`\`\`
{
    "type": "splunk.rectangle",
    "options": {
        "fillColor": "#dc4e41",
        "fillOpacity": 0.6
    },
    "context": {}
}
\`\`\``}},viz_git3fKRN:{type:"splunk.rectangle",options:{strokeWidth:5,strokeDashStyle:3,strokeOpacity:.4}},viz_VA3eNLSW:{type:"splunk.markdown",options:{content:"",markdown:`### Stroke Dash and Opacity

\`\`\`
{
    "type": "splunk.rectangle",
    "options": {
        "strokeWidth": 5,
        "strokeDashStyle": 3,
        "strokeOpacity": 0.6
    },
    "context": {}
}
\`\`\``}},viz_vYluumnk:{type:"splunk.rectangle",options:{strokeWidth:10,strokeJoinStyle:"bevel"}},viz_JdJPCeJR:{type:"splunk.markdown",options:{content:"",markdown:`### Join Types

\`\`\`
{
    "type": "splunk.rectangle",
    "options": {
        "strokeWidth": 10,
        "strokeJoinStyle": "bevel"
    },
    "context": {}
}
\`\`\``}},viz_okcgJ60N:{type:"splunk.rectangle",options:{fillColor:"> fillDataValue | rangeValue(fillColorEditorConfig)",strokeColor:"> strokeDataValue | rangeValue(strokeColorEditorConfig)"},context:{fillColorEditorConfig:[{from:100,value:"#088F44"},{from:80,to:100,value:"#2EB82E"},{from:60,to:80,value:"#C3CC33"},{from:40,to:60,value:"#FFD442"},{from:20,to:40,value:"#FFA857"},{from:0,to:20,value:"#FF7149"},{to:0,value:"#FE3A3A"}],strokeColorEditorConfig:[{value:"#088F44",to:0},{value:"#2EB82E",from:0,to:20},{value:"#C3CC33",from:20,to:40},{value:"#FFD442",from:40,to:60},{value:"#FFA857",from:60,to:80},{value:"#FF7149",from:80,to:100},{value:"#FE3A3A",from:100}],fillDataValue:'> primary | seriesByType("number") | lastPoint()',strokeDataValue:'> primary | seriesByType("number") | lastPoint()'},dataSources:{primary:"ds_search1"}},viz_F3lQDXtX:{type:"splunk.markdown",options:{content:"",markdown:`### Dynamic Coloring Fill and Stroke
\`\`\`
{
    "type": "splunk.rectangle",
    "options": {
        "fillColor": "> fillDataValue | rangeValue(fillColorEditorConfig)",
        "strokeColor": "> strokeDataValue | rangeValue(strokeColorEditorConfig)"
    },
    "context": {
        "fillColorEditorConfig": [
            {
                "from": 100,
                "value": "#088F44"
            },
            {
                "from": 80,
                "to": 100,
                "value": "#2EB82E"
            },
            {
                "from": 60,
                "to": 80,
                "value": "#C3CC33"
            },
            {
                "from": 40,
                "to": 60,
                "value": "#FFD442"
            },
            {
                "from": 20,
                "to": 40,
                "value": "#FFA857"
            },
            {
                "from": 0,
                "to": 20,
                "value": "#FF7149"
            },
            {
                "to": 0,
                "value": "#FE3A3A"
            }
        ],
        "strokeColorEditorConfig": [
            {
                "value": "#088F44",
                "to": 0
            },
            {
                "value": "#2EB82E",
                "from": 0,
                "to": 20
            },
            {
                "value": "#C3CC33",
                "from": 20,
                "to": 40
            },
            {
                "value": "#FFD442",
                "from": 40,
                "to": 60
            },
            {
                "value": "#FFA857",
                "from": 60,
                "to": 80
            },
            {
                "value": "#FF7149",
                "from": 80,
                "to": 100
            },
            {
                "value": "#FE3A3A",
                "from": 100
            }
        ],
        "fillDataValue": "> primary | seriesByType(\\"number\\") | lastPoint()",
        "strokeDataValue": "> primary | seriesByType(\\"number\\") | lastPoint()"
    },
    "dataSources": {
        "primary": "ds_search1"
    }
}
\`\`\``}},viz_uC9DId9s:{type:"splunk.markdown",options:{content:"",markdown:"## Rectangles"}},viz_KkYf7kXB:{type:"splunk.ellipse"},viz_q4cfBnaW:{type:"splunk.markdown",options:{content:"",markdown:`### Default Configuration 

\`\`\`
{
    "type": "splunk.ellipse",
    "options": {},
    "context": {}
}
\`\`\``}},viz_yJPGHLqt:{type:"splunk.ellipse",options:{strokeColor:"#dc4e41",strokeWidth:4}},viz_jz2gvx64:{type:"splunk.markdown",options:{content:"",markdown:`### Stroke Width and Color

\`\`\`
{
    "type": "splunk.ellipse",
    "options": {
        "strokeColor": "#dc4e41",
        "strokeWidth": 4
    },
    "context": {}
}
\`\`\``}},viz_Da6eeFwf:{type:"splunk.ellipse",options:{strokeColor:"#c3cbd4",fillColor:"#dc4e41",fillOpacity:.6}},viz_kXU0CFoV:{type:"splunk.markdown",options:{content:"",markdown:`### Fill Color and Opacity
\`\`\`
{
    "type": "splunk.ellipse",
    "options": {
        "fillColor": "#dc4e41",
        "fillOpacity": 0.6
    },
    "context": {}
}
\`\`\``}},viz_f0FAVk5g:{type:"splunk.ellipse",options:{strokeWidth:5,strokeDashStyle:3,strokeOpacity:.4}},viz_qWkbMTO0:{type:"splunk.markdown",options:{content:"",markdown:`### Stroke Dash and Opacity

\`\`\`
{
    "type": "splunk.ellipse",
    "options": {
        "strokeWidth": 5,
        "strokeDashStyle": 3,
        "strokeOpacity": 0.4
    },
    "context": {}
}
\`\`\``}},viz_Au4iw5S7:{type:"splunk.ellipse",options:{fillColor:"> fillDataValue | rangeValue(fillColorEditorConfig)",strokeColor:"> strokeDataValue | rangeValue(strokeColorEditorConfig)"},context:{fillColorEditorConfig:[{from:100,value:"#088F44"},{from:80,to:100,value:"#2EB82E"},{from:60,to:80,value:"#C3CC33"},{from:40,to:60,value:"#FFD442"},{from:20,to:40,value:"#FFA857"},{from:0,to:20,value:"#FF7149"},{to:0,value:"#FE3A3A"}],strokeColorEditorConfig:[{value:"#088F44",to:0},{value:"#2EB82E",from:0,to:20},{value:"#C3CC33",from:20,to:40},{value:"#FFD442",from:40,to:60},{value:"#FFA857",from:60,to:80},{value:"#FF7149",from:80,to:100},{value:"#FE3A3A",from:100}],fillDataValue:'> primary | seriesByType("number") | lastPoint()',strokeDataValue:'> primary | seriesByType("number") | lastPoint()'},dataSources:{primary:"ds_search1"}},viz_mMGIxPHf:{type:"splunk.markdown",options:{content:"",markdown:`### Dynamic Coloring with Fill and Stroke
\`\`\`
{
    "type": "splunk.ellipse",
    "options": {
        "fillColor": "> fillDataValue | rangeValue(fillColorEditorConfig)",
        "strokeColor": "> strokeDataValue | rangeValue(strokeColorEditorConfig)"
    },
    "context": {
        "fillColorEditorConfig": [
            {
                "from": 100,
                "value": "#088F44"
            },
            {
                "from": 80,
                "to": 100,
                "value": "#2EB82E"
            },
            {
                "from": 60,
                "to": 80,
                "value": "#C3CC33"
            },
            {
                "from": 40,
                "to": 60,
                "value": "#FFD442"
            },
            {
                "from": 20,
                "to": 40,
                "value": "#FFA857"
            },
            {
                "from": 0,
                "to": 20,
                "value": "#FF7149"
            },
            {
                "to": 0,
                "value": "#FE3A3A"
            }
        ],
        "strokeColorEditorConfig": [
            {
                "value": "#088F44",
                "to": 0
            },
            {
                "value": "#2EB82E",
                "from": 0,
                "to": 20
            },
            {
                "value": "#C3CC33",
                "from": 20,
                "to": 40
            },
            {
                "value": "#FFD442",
                "from": 40,
                "to": 60
            },
            {
                "value": "#FFA857",
                "from": 60,
                "to": 80
            },
            {
                "value": "#FF7149",
                "from": 80,
                "to": 100
            },
            {
                "value": "#FE3A3A",
                "from": 100
            }
        ],
        "fillDataValue": "> primary | seriesByType(\\"number\\") | lastPoint()",
        "strokeDataValue": "> primary | seriesByType(\\"number\\") | lastPoint()"
    },
    "dataSources": {
        "primary": "ds_search1"
    }
}
\`\`\``}},viz_hWkk8Ohb:{type:"splunk.markdown",options:{content:"",markdown:"## Ellipses"}},viz_XU8yqmEB:{type:"splunk.markdown",options:{content:"",markdown:"## Lines"}},viz_OGwoZJeO:{type:"abslayout.line"},viz_cFU3ChCa:{type:"splunk.markdown",options:{content:"",markdown:`### Default Configuration 

\`\`\`
{
    "type": "abslayout.line",
    "options": {},
    "context": {}
}
\`\`\``}},viz_0HHqp0SW:{type:"abslayout.line",options:{fromArrow:!0,toArrow:!0,strokeWidth:3}},viz_KMliL4GG:{type:"splunk.markdown",options:{content:"",markdown:`### Start and End arrows, Thickness 

\`\`\`
{
    "type": "abslayout.line",
    "options": {
        "fromArrow": true,
        "toArrow": true,
        "strokeWidth": 3
    },
    "context": {}
}
\`\`\``}},viz_QHk1hw54:{type:"abslayout.line",options:{strokeWidth:3,strokeDasharray:5,strokeColor:"#dc4e41"}},viz_4EEFPLCD:{type:"splunk.markdown",options:{content:"",markdown:`### Dash Style

\`\`\`
{
    "type": "abslayout.line",
    "options": {
        "strokeWidth": 3,
        "strokeDasharray": 5,
        "strokeColor": "#dc4e41"
    },
    "context": {}
}
\`\`\``}},viz_E1tPod2h:{type:"splunk.markdown",options:{content:"",markdown:`### Dynamic Coloring
\`\`\`
{
    "type": "abslayout.line",
    "options": {
        "strokeColor": "> strokeDataPoint | rangeValue(strokeColorEditorConfig)"
    },
    "context": {
        "strokeColorEditorConfig": [
            {
                "to": 20,
                "value": "#D41F1F"
            },
            {
                "from": 20,
                "to": 40,
                "value": "#D94E17"
            },
            {
                "from": 40,
                "to": 60,
                "value": "#CBA700"
            },
            {
                "from": 60,
                "to": 80,
                "value": "#669922"
            },
            {
                "from": 80,
                "value": "#118832"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search1"
    }
}
\`\`\``}},viz_JNc15gTF:{type:"abslayout.line",options:{strokeColor:"> strokeDataPoint | rangeValue(strokeColorEditorConfig)"},context:{strokeColorEditorConfig:[{to:20,value:"#D41F1F"},{from:20,to:40,value:"#D94E17"},{from:40,to:60,value:"#CBA700"},{from:60,to:80,value:"#669922"},{from:80,value:"#118832"}]},dataSources:{primary:"ds_search1"}}},dataSources:{ds_search1:{type:"ds.search",options:{query:"| makeresults count=15| streamstats count| eval _time=_time-(count*86400)| eval value=random()%100| fields _time value"},name:"Search_1"}},inputs:{},layout:{type:"absolute",options:{height:2100,display:"auto-scale",width:1440},structure:[{item:"viz_basic_rect",type:"block",position:{x:40,y:220,w:120,h:80}},{item:"viz_UBCZ0E2L",type:"block",position:{x:10,y:0,w:1310,h:130}},{item:"viz_sGWsOnIy",type:"block",position:{x:170,y:160,w:280,h:220}},{item:"viz_jqO2NABZ",type:"block",position:{x:470,y:220,w:120,h:80}},{item:"viz_kJpsIF0B",type:"block",position:{x:600,y:140,w:320,h:250}},{item:"viz_psQgYRzO",type:"block",position:{x:950,y:220,w:120,h:80}},{item:"viz_VwbQjyAX",type:"block",position:{x:1080,y:140,w:290,h:250}},{item:"viz_git3fKRN",type:"block",position:{x:40,y:440,w:120,h:80}},{item:"viz_VA3eNLSW",type:"block",position:{x:170,y:370,w:280,h:250}},{item:"viz_vYluumnk",type:"block",position:{x:470,y:440,w:120,h:80}},{item:"viz_JdJPCeJR",type:"block",position:{x:600,y:370,w:320,h:250}},{item:"viz_okcgJ60N",type:"block",position:{x:950,y:440,w:120,h:80}},{item:"viz_F3lQDXtX",type:"block",position:{x:1080,y:370,w:290,h:230}},{item:"viz_uC9DId9s",type:"block",position:{x:10,y:100,w:130,h:70}},{item:"viz_KkYf7kXB",type:"block",position:{x:40,y:750,w:120,h:80}},{item:"viz_q4cfBnaW",type:"block",position:{x:170,y:670,w:280,h:240}},{item:"viz_yJPGHLqt",type:"block",position:{x:470,y:750,w:120,h:80}},{item:"viz_jz2gvx64",type:"block",position:{x:600,y:670,w:320,h:250}},{item:"viz_Da6eeFwf",type:"block",position:{x:950,y:750,w:120,h:80}},{item:"viz_kXU0CFoV",type:"block",position:{x:1080,y:670,w:290,h:250}},{item:"viz_f0FAVk5g",type:"block",position:{x:40,y:970,w:120,h:80}},{item:"viz_qWkbMTO0",type:"block",position:{x:170,y:900,w:280,h:250}},{item:"viz_Au4iw5S7",type:"block",position:{x:470,y:970,w:120,h:80}},{item:"viz_mMGIxPHf",type:"block",position:{x:600,y:900,w:310,h:230}},{item:"viz_hWkk8Ohb",type:"block",position:{x:20,y:640,w:130,h:70}},{item:"viz_XU8yqmEB",type:"block",position:{x:30,y:1190,w:130,h:70}},{item:"viz_OGwoZJeO",type:"line",position:{from:{x:28,y:1306},to:{x:157,y:1306}}},{item:"viz_cFU3ChCa",type:"block",position:{x:170,y:1210,w:280,h:220}},{item:"viz_0HHqp0SW",type:"line",position:{from:{x:469,y:1307},to:{x:598,y:1307}}},{item:"viz_KMliL4GG",type:"block",position:{x:600,y:1210,w:280,h:250}},{item:"viz_QHk1hw54",type:"line",position:{from:{x:935,y:1308},to:{x:1064,y:1308}}},{item:"viz_4EEFPLCD",type:"block",position:{x:1080,y:1210,w:300,h:250}},{item:"viz_E1tPod2h",type:"block",position:{x:170,y:1430,w:260,h:220}},{item:"viz_JNc15gTF",type:"line",position:{from:{x:27,y:1514},to:{x:156,y:1514}}}]},description:"Use shapes and lines to direct flow and tell a story with your data",title:"Shapes and Lines"};(0,i.default)(e.default.createElement(o,{definition:t}),{pageTitle:"Shapes and Lines",hideFooter:!0,layout:"fixed"});
