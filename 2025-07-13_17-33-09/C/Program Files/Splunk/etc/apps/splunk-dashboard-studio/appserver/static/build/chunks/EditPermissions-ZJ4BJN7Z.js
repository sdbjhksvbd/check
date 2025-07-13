import{a as ue,b as me}from"./chunk-XLE52FNY.js";import{a as fe,b as _e}from"./chunk-2YWXDMAC.js";import{a as he,b as ve,c as B,d as ge}from"./chunk-QURMAAFJ.js";import{a as ce}from"./chunk-6BPMW6O6.js";import{p as pe}from"./chunk-7UHH6O2S.js";import"./chunk-5E5J2XQS.js";import{D as $,O as de,c as d,d as M,f as S,g as P,j as E,k as e,l,m as x,o as ie,p as D,r as u}from"./chunk-JNNA6YYS.js";import{d as ae,e as le}from"./chunk-LT4H6J3K.js";import"./chunk-JNARL5PJ.js";import"./chunk-ELIEG7M2.js";import"./chunk-GECC65SD.js";import{r as ne,s as oe,t as se}from"./chunk-UVCMF6AG.js";import"./chunk-VWCNWZTS.js";import"./chunk-HSXE43VV.js";import"./chunk-6VJEWO5O.js";import"./chunk-EZGXPQUG.js";import{ua as te}from"./chunk-NP732JJA.js";import{i as b}from"./chunk-FOXWPXSG.js";var F=b(te(),1),Ie=b(te(),1),f={};S(f,{default:()=>ze});P(f,Ie);var be,Ee,ze=(Ee=(be=F.default)==null?void 0:be.default)!=null?Ee:F.default;var L=b(le(),1),Ne=b(le(),1),Q=b(ae(),1),Ue=b(ae(),1);var Ve={filename:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs/EditPermissions.js",dirname:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs",relativefilename:"../../../enterprise-dashboard-dialogs/EditPermissions.js",relativedirname:"../../../enterprise-dashboard-dialogs",line:0},Ye=(r,t)=>B(["getDashboard",r],()=>se({id:r}),{select:n=>n.entry[0],retry:!1,enabled:t,refetchOnWindowFocus:!1}),Je=r=>B(["roles"],ne,{select:t=>{let n=t.entry;for(let s of n)s.value=s.name;return[{name:(0,l._)("Everyone"),value:"*"},...n]},retry:!1,enabled:r,refetchOnWindowFocus:!1}),Ke=(r,t)=>ve(n=>oe(n),{onSuccess:n=>{t.setQueryData(["getDashboard",r],n)}}),De={};S(De,{default:()=>Te});P(De,Ne);var xe,ye,Te=(ye=(xe=L.default)==null?void 0:xe.default)!=null?ye:L.default,He={};S(He,{default:()=>m});P(He,Ue);var we,Ce,m=(Ce=(we=Q.default)==null?void 0:we.default)!=null?Ce:Q.default,T=u(ie)`
    width: 550px;
`,We=u(_e)`
    max-width: 1000px;
    margin: 0px;
    margin-left: 30px;
`,Xe=u(ue)`
    max-width: 100%;
`,Se=u(me)`
    width: 16px;
    height: 16px;
    align-items: center;
`,Ze=u.div`
    margin-top: 5px;
    margin-left: -27px;
    margin-right: -27px;
`,er=u(m)`
    margin-top: 10px;
`,A=u(m.HeadCell)`
    background-color: transparent;
    border-top: 1px solid ${D.variables.backgroundColorHover};
    > div {
        justify-content: center;
        padding: 3px 0px;
        font-weight: bold;
        width: 40px;
    }
`,rr=u(m.Row)`
    td:first-child {
        text-indent: 10px;
        min-width: 300px;
    }

    &:nth-child(odd) {
        background-color: ${D.variables.backgroundColorHover};
    }
`,Pe=function(r,t){return(0,f.includes)(t,"*")?r!=="*":!1},ke=function(r,t){return t.length?!!((0,f.includes)(t,"*")&&r==="*"||(0,f.includes)(t,r)):!1},_=de(Ve.filename),tr=e.memo(({handleCloseModal:r})=>e.createElement(T.Header,{"aria-labelledby":"modal-header-text",title:e.createElement("span",{id:"modal-header-text"},(0,l._)("Edit Permissions")),onRequestClose:r})),ar=e.memo(({handleCloseModal:r,handleEditPerm:t})=>e.createElement(T.Footer,null,e.createElement(x,d({appearance:"default",onClick:r,label:(0,l._)("Cancel")},_("cancel-permission"))),e.createElement(x,d({appearance:"primary",onClick:t,label:(0,l._)("Save")},_("save-permission"))))),G=({label:r,info:t})=>e.createElement(We,{label:r},e.createElement(Xe,d({},_(t)),e.createElement("strong",null,t))),lr=()=>e.createElement(E.Fragment,null,e.createElement(A,null)),nr=({name:r,value:t,readPerms:n,writePerms:s,handleRead:c,handleWrite:h})=>e.createElement(rr,null,e.createElement(m.Cell,null,r),e.createElement(m.Cell,null,e.createElement(Se,d({"aria-label":`${(0,l._)("Read permissions for")} ${r}`,value:t,onClick:c,selected:ke(t,n),disabled:Pe(t,n)},_(`${r}-read`)))),e.createElement(m.Cell,null,e.createElement(Se,d({"aria-label":`${(0,l._)("Write permissions for")} ${r}`,value:t,onClick:h,selected:ke(t,s),disabled:Pe(t,s)},_(`${r}-write`))))),or=({roles:r,readPerms:t,writePerms:n,handleRead:s,handleWrite:c})=>e.createElement(er,null,e.createElement(m.Head,null,e.createElement(lr,null),e.createElement(A,null,(0,l._)("Read")),e.createElement(A,null,(0,l._)("Write"))),e.createElement(m.Body,null,r.map(h=>e.createElement(nr,{key:h.name,name:h.name,value:h.value,readPerms:t,writePerms:n,handleRead:s,handleWrite:c})))),Re={read:void 0,write:void 0},sr=({open:r,onCloseModal:t,dashboardTitle:n,dashboardId:s,trackEvent:c,telemetry:h,onUpdateSharing:O})=>{var j,q,I,z,V,Y,J;let[K,k]=(0,E.useState)(void 0),[R,H]=(0,E.useState)(Re),[N,y]=(0,E.useState)([]),[U,Me]=(0,E.useState)(!1),$e=he(),{isLoading:Be,data:a,isError:Fe}=Ye(s,r),{isLoading:Ge,data:X,isError:Le}=Je(r),{mutate:Qe}=Ke(s,$e),w=null;(Ge||Be)&&(w=e.createElement(ce,{size:"small",style:{height:"14px"}})),(Le||Fe)&&(w=e.createElement(pe,{type:"error"},(0,l._)("Permission editing is currently unavailable. Try again in a few minutes.")));let p=(j=K!=null?K:a==null?void 0:a.acl.sharing)!=null?j:"",v=(z=(I=R.read)!=null?I:(q=a==null?void 0:a.acl.perms)==null?void 0:q.read)!=null?z:[],g=(J=(Y=R.write)!=null?Y:(V=a==null?void 0:a.acl.perms)==null?void 0:V.write)!=null?J:[],Z=o=>{c?c(o):h.emit(o)},W=o=>{y([]),H(Re),k(void 0),t(o)},Ae=()=>Me(!U),Oe=o=>{if(N.length){Ae();return}Qe({id:s,display:p,owner:a==null?void 0:a.acl.owner,readPerms:v,writePerms:g},{onSuccess:()=>{O==null||O(p),Z($({name:n,sharing:p,selectedRead:v.length,selectedWrite:g.length},c===void 0,!0)),W(o)},onError:i=>{y([i.message]),Z($({name:n,sharing:p,selectedRead:v.length,selectedWrite:g.length},c===void 0,!1))}})},ee=(o,i)=>{!o.length&&!i.length?y([(0,l._)('You must select at least one "Read" or "Write" permission.')]):y([])},re=(o,i)=>(y([]),(0,f.includes)(o,i)?(0,f.without)(o,i):[...o,i]),je=(o,{value:i})=>{let C=re(v,i);ee(C,g),H(M(d({},R),{read:C}))},qe=(o,{value:i})=>{let C=re(g,i);ee(v,C),H(M(d({},R),{write:C}))};return e.createElement(T,{open:r},e.createElement(tr,{handleCloseModal:W}),e.createElement(T.Body,null,w||e.createElement(e.Fragment,null,e.createElement(fe,{errors:N,errorA11yToggle:U}),e.createElement(G,{label:(0,l._)("Dashboard"),info:n}),e.createElement(G,{label:(0,l._)("Owner"),info:a==null?void 0:a.author}),e.createElement(G,{label:(0,l._)("App"),info:a==null?void 0:a.acl.app}),e.createElement(We,{label:(0,l._)("Display")},e.createElement(Te,null,e.createElement(x,d({appearance:"default",label:(0,l._)("Owner"),onClick:()=>k("user"),selected:p==="user",disabled:!(a!=null&&a.acl.can_share_user)},_("user-permission"))),e.createElement(x,d({style:{marginLeft:0},appearance:"default",label:(0,l._)("App"),onClick:()=>k("app"),selected:p==="app",disabled:!(a!=null&&a.acl.can_share_app)},_("app-permission"))),e.createElement(x,d({style:{marginLeft:0},appearance:"default",label:(0,l._)("All apps"),onClick:()=>k("global"),selected:p==="global",disabled:!(a!=null&&a.acl.can_share_global)},_("global-permission"))))),p!=="user"?e.createElement(Ze,null,e.createElement(or,{roles:X!=null?X:[],readPerms:v,writePerms:g,handleRead:je,handleWrite:qe})):null)),w?null:e.createElement(ar,{handleCloseModal:W,handleEditPerm:Oe}))},ir=ge(sr),$r=(0,D.withSplunkTheme)(ir);export{$r as default};
