import{E as k,Ea as D,F as X,Fa as E,g as H,t as J,w as Y,x as Q,z as F}from"./chunk-JH24LUXZ.js";import{a as G,fa as K,ya as Z}from"./chunk-VWCNWZTS.js";import{P as N,R as U,T as A,b as R,n as T,ra as q}from"./chunk-NP732JJA.js";import{b as v,c as y,i as n}from"./chunk-FOXWPXSG.js";var o=n(R()),P=n(A()),f=n(T()),B=n(G()),W=n(N()),M=n(Y()),w=n(q()),a=n(H()),z=n(Q());var h=n(J()),O=n(K());var i=n(R()),C=n(A()),S=n(T()),V=n(X()),j=n(U()),ee=["bash","clike","css","html","json","javascript","js","jsx","typescript","ts","tsx","markup","mathml","svg","xml"],oe={content:"",language:"json"},te=S.default.div`
    background-color: ${(0,j.pick)({enterprise:{light:"#121316",dark:"#121316"},prisma:"#121316"})};
    overflow: hidden;
    height: ${e=>e.height?e.height:200}px;
    color: #9cdcfe;
`,re=S.default.div`
    padding: 12px 24px;
    overflow: auto;
    height: 100%;
`,b=({height:e,options:{content:g,language:l}=oe})=>{let c=(0,i.useRef)(null),[t,d]=(0,i.useState)(!1),p=(0,i.useCallback)(()=>{if(!(!c.current||!document.createRange||!window.getSelection))if(t){let r=window.getSelection();r==null||r.removeAllRanges(),d(!1)}else{let r=document.createRange();r.selectNodeContents(c.current);let m=window.getSelection();m==null||m.removeAllRanges(),m==null||m.addRange(r),d(!0)}},[t]),u=(0,i.useCallback)(()=>{if(!(!c.current||!document.createRange||!window.getSelection)&&t){let r=window.getSelection();r==null||r.removeAllRanges(),d(!1)}},[t]),s=(0,i.useCallback)(r=>{c.current=r},[]);return i.default.createElement(te,{height:e},i.default.createElement(re,null,i.default.createElement(V.default,{value:g,language:l,onDoubleClick:p,onClick:u,elementRef:s})))};b.propTypes={options:C.default.shape({content:C.default.string,language:C.default.oneOf(ee)}),height:C.default.number.isRequired};b.defaultProps={options:{content:"",language:"json"}};b.showTitleAndDescription=!0;var I=b;var _=n(Z());var ne=y(v({},D),{visualizations:y(v({},D.visualizations),{"viz.code":I})}),ie=f.default.div`
    display: flex;
    flex-direction: row;
    ${e=>(0,O.toDimension)({width:e.width,height:e.height})};
`,ae=f.default.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
    min-width: 0;
`,se=(0,f.default)("div")`
    display: flex;
    flex-grow: 1;
    overflow: auto;
    padding: 0px 16px 8px 16px;
    background-color: ${h.customThemeVariables.dashboardBackgroundColor};
`,ce=f.default.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
    z-index: 5;
`,le=(0,f.default)(_.default)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`,$=a.GeoRegistry.create();$.addDefaultProvider(new a.GeoJsonProvider);var L=a.IconRegistry.create();L.addDefaultProvider(new a.LocalIconProvider);L.addProvider(new a.StandardIconProvider);var de=new z.SWACollector,pe={enableRiskyCommand:!!window.$C.ENABLE_RISKY_COMMAND_CHECK_DASHBOARD},x=e=>(e!=null?e:"")[0]==="/",ge=e=>{var g,l,c;if(x((c=(l=(g=e==null?void 0:e.layout)==null?void 0:g.options)==null?void 0:l.backgroundImage)==null?void 0:c.src)){let{backgroundImage:t}=e.layout.options;t.src=(0,w.createURL)(t.src)}return Object.values(e.visualizations).forEach(t=>{var p,u;x((p=t.options)==null?void 0:p.src)&&(t.options.src=(0,w.createURL)(t.options.src)),x((u=t.options)==null?void 0:u.icon)&&(t.options.icon=(0,w.createURL)(t.options.icon));let{eventHandlers:d=[]}=t;d.forEach(s=>{var r;x((r=s==null?void 0:s.options)==null?void 0:r.url)&&(s.options.url=(0,w.createURL)(s.options.url))})}),e},ue=({definition:e,webFeatureFlags:g})=>{let[l,c]=(0,o.useState)(g),[t,d]=(0,o.useState)({}),p=(0,o.useMemo)(()=>ge(e),[e]),u=(0,o.useCallback)(({width:s,height:r})=>o.default.createElement(M.DashboardCore,{width:s,height:r}),[]);return(0,o.useEffect)(()=>{l===void 0&&F().then(s=>{c(k(s["feature:dashboard_studio"]))}).catch(()=>{c(k())})},[l]),l===void 0?o.default.createElement(le,null):o.default.createElement(a.DashboardContextProvider,{featureFlags:l,geoRegistry:$,iconRegistry:L,mapTileConfig:E,metricsCollectors:de,preset:ne,initialDefinition:p,onTokenBindingChange:d,initialTokenBinding:t,dataSourceContext:pe},o.default.createElement(W.default,{family:"enterprise",colorScheme:"dark",density:"comfortable"},o.default.createElement(ie,{width:"100%",height:"calc(100vh - 78px)"},o.default.createElement(ae,null,o.default.createElement(ce,null,o.default.createElement(h.Header,{mode:"view",definition:p,onDefinitionChange:B.default}),o.default.createElement(se,null,o.default.createElement(h.SizeAwareWrapper,null,u)))))))};ue.propTypes={definition:P.default.object.isRequired,webFeatureFlags:P.default.object};export{ue as a};
