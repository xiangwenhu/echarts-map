import{g as M,A as p,l as G,a as L,b as j,i as F,p as P}from"./park-DynUjEja.js";import{e as z,f as h,g as D,o as E,h as T,r as N,n as H,i as R,c as U,a as V,b as f,w as g,d as y,F as q}from"./index-Zwf6n4Rh.js";const K=z({__name:"PCAOnline",emits:["nodeChange"],setup(B,{emit:c}){const n={adcode:p,name:"中国",level:"country",childrenNum:34},k=h(),C=c,w={value:"adcode",label:"name",children:"children",checkStrictly:!0,lazy:!0,lazyLoad:O};function u({adcode:s,name:l,level:r,childrenNum:d}){return s===p?`${s}_full.json`:d==0?`${s}.json`:r=="district"?`${s}.json`:`${s}_full.json`}async function O(s,l){const r=s.root?n:s.data,d=await _(r);l(d)}async function _(s){const l=u(s);return(await M(l)).features.filter(i=>i.properties.name).map(i=>({adcode:i.properties.adcode,name:i.properties.name,level:i.properties.level,childrenNum:i.properties.childrenNum,leaf:i.properties.childrenNum==0}))}const o=h();function S(s){var r;const l=((r=o.value)==null?void 0:r.getCheckedNodes(!1))||[];C("nodeChange",l.map(d=>d.data))}return D(()=>{}),(s,l)=>{const r=N("el-cascader");return E(),T(r,{ref_key:"refCascader",ref:o,filterable:"",props:w,options:k.value,placeholder:"请选择省市区",onChange:S},null,8,["options"])}}}),Q={style:{position:"fixed",top:"10px",left:"10px",cursor:"pointer","z-index":"99"}},Z=z({__name:"MapOnline",setup(B){const c={[p]:{adcode:p,name:"中国",level:"country",childrenNum:34}},n=[];function k(){if(n.length===1)return;n.pop();const e=n[n.length-1];n.pop(),u(e)}function C(){n.length=0,u(c[p])}function w(e){n.length>0&&e.adcode===n[n.length-1].adcode||n.push(e)}async function u(e){const t=typeof e=="number"?c[e]:e;console.log("onViewMap:",t),await O(t),console.log("stacks:",n)}async function O(e){var $,J;($=o.value)==null||$.showLoading();const{adcode:t,level:a,childrenNum:b}=e,x=await s(e);let m=[];e.level==="country"&&(m=[{tooltip:{formatter(v,W){return`${v.name} <br/> 空位: ${v.value[2]}`}},name:"停车场",type:"scatter",coordinateSystem:"geo",data:[{name:"停车场1",value:[88.718619,38.138863,100]}],symbolSize:20,symbol:`image://${P}`,symbolRotate:0}]);const A={series:[{data:x.features.map(v=>({name:v.properties.name,value:G.random(0,1e4),adcode:v.properties.adcode}))},...m]};w(e),(J=o.value)==null||J.hideLoading(),S(t,A)}const _=h(),o=h();function S(e,t){const a=L(e,t);o.value.setOption(a,!0)}async function s(e){const t=await j(e);return t.features.forEach(a=>{c[a.properties.adcode]={adcode:a.properties.adcode,name:a.properties.name,level:a.properties.level,childrenNum:a.properties.childrenNum}}),t}function l(){if(o.value){const e=o.value.getOption();o.value.resize(),o.value.setOption(e,!0)}}D(()=>{H(()=>{o.value=F(_.value),o.value.on("click","series",function(e){var a;if(e.componentSubType!=="map")return;const t=(a=e.data)==null?void 0:a.adcode;if(t in c){if(n.length>0&&t==n[n.length-1].adcode)return;u(t)}}),u(c[p])}),window.addEventListener("resize",l)}),R(()=>{var e;window.removeEventListener("resize",l),o.value&&!o.value.isDisposed()&&((e=o.value)==null||e.dispose())});const r=h();function d(e){if(!e||e.length==0)return u(c[p]);console.log(r.value),u(e[0])}function i(){location.reload()}return(e,t)=>{const a=N("el-button"),b=N("router-link"),x=N("el-space");return E(),U(q,null,[V("div",Q,[f(x,null,{default:g(()=>[f(K,{onNodeChange:d,modelValue:r.value,"onUpdate:modelValue":t[0]||(t[0]=m=>r.value=m),style:{width:"300px"}},null,8,["modelValue"]),f(a,{onClick:t[1]||(t[1]=m=>k())},{default:g(()=>t[3]||(t[3]=[y("返回地图上一级")])),_:1}),f(a,{onClick:t[2]||(t[2]=m=>C())},{default:g(()=>t[4]||(t[4]=[y("返回地图首页")])),_:1}),f(b,{to:"/"},{default:g(()=>t[5]||(t[5]=[y("返回网站首页")])),_:1}),f(a,{onClick:i},{default:g(()=>t[6]||(t[6]=[y("页面刷新")])),_:1})]),_:1})]),V("div",{id:"main",style:{height:"calc(100vh - 1px)",width:"calc(100vw - 1px)"},ref_key:"refDom",ref:_},null,512)],64)}}});export{Z as default};
