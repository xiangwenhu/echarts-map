import{c as J,l as L,a as P,b as G,i as T,A as p,p as F}from"./park-DynUjEja.js";import{e as D,f,g as E,o as B,h as H,r as h,n as R,i as U,c as j,a as V,b as d,w as m,d as g,F as q}from"./index-Zwf6n4Rh.js";const K=D({__name:"PCAOffline",emits:["nodeChange"],setup(z,{emit:s}){const o=f(),_=s,k={value:"adcode",label:"name",children:"children",checkStrictly:!0},v=f();function l(i){var r;const n=((r=v.value)==null?void 0:r.getCheckedNodes(!1))||[];_("nodeChange",n.map(y=>y.data))}async function C(){const i=await J({url:"/echarts-map/data/pca/pca-code.json"});o.value=i.children}return E(()=>{C()}),(i,n)=>{const r=h("el-cascader");return B(),H(r,{ref_key:"refCascader",ref:v,filterable:"",props:k,options:o.value,placeholder:"请选择省市区",onChange:l},null,8,["options"])}}}),Q={style:{position:"fixed",top:"10px",left:"10px",cursor:"pointer","z-index":"99"}},Z=D({__name:"MapOffline",setup(z){const s={[p]:{adcode:p,name:"中国",level:"country",childrenNum:34}},o=[];function _(){if(o.length===1)return;o.pop();const e=o[o.length-1];o.pop(),l(e)}function k(){o.length=0,l(s[p])}function v(e){o.length>0&&e.adcode===o[o.length-1].adcode||o.push(e)}async function l(e){const t=typeof e=="number"?s[e]:e;console.log("onViewMap:",t),await C(t),console.log("stacks:",o)}async function C(e){var O,S;(O=n.value)==null||O.showLoading();const{adcode:t,level:a,childrenNum:b}=e,x=await y(e);let c=[];e.level==="country"&&(c=[{tooltip:{formatter(u,W){return`${u.name} <br/> 空位: ${u.value[2]}`}},name:"停车场",type:"scatter",coordinateSystem:"geo",data:[{name:"停车场1",value:[88.718619,38.138863,100]}],symbolSize:20,symbol:`image://${F}`,symbolRotate:0}]);const $={series:[{data:x.features.map(u=>({name:u.properties.name,value:L.random(0,1e4),adcode:u.properties.adcode}))},...c]};v(e),(S=n.value)==null||S.hideLoading(),r(t,$)}const i=f(),n=f();function r(e,t){const a=P(e,t);n.value.setOption(a,!0)}async function y(e){const t=await G(e,!0);return t.features.forEach(a=>{s[a.properties.adcode]={adcode:a.properties.adcode,name:a.properties.name,level:a.properties.level,childrenNum:a.properties.childrenNum}}),t}function N(){if(n.value){const e=n.value.getOption();n.value.resize(),n.value.setOption(e,!0)}}E(()=>{R(()=>{n.value=T(i.value),n.value.on("click","series",function(e){var a;if(e.componentSubType!=="map")return;const t=(a=e.data)==null?void 0:a.adcode;if(t in s){if(o.length>0&&t==o[o.length-1].adcode)return;l(t)}}),l(s[p])}),window.addEventListener("resize",N)}),U(()=>{var e;window.removeEventListener("resize",N),n.value&&!n.value.isDisposed()&&((e=n.value)==null||e.dispose())});const w=f();function A(e){if(!e||e.length==0)return l(s[p]);console.log(w.value),l(e[0])}function M(){location.reload()}return(e,t)=>{const a=h("el-button"),b=h("router-link"),x=h("el-space");return B(),j(q,null,[V("div",Q,[d(x,null,{default:m(()=>[d(K,{onNodeChange:A,modelValue:w.value,"onUpdate:modelValue":t[0]||(t[0]=c=>w.value=c),style:{width:"300px"}},null,8,["modelValue"]),d(a,{onClick:t[1]||(t[1]=c=>_())},{default:m(()=>t[3]||(t[3]=[g("返回地图上一级")])),_:1}),d(a,{onClick:t[2]||(t[2]=c=>k())},{default:m(()=>t[4]||(t[4]=[g("返回地图首页")])),_:1}),d(b,{to:"/"},{default:m(()=>t[5]||(t[5]=[g("返回网站首页")])),_:1}),d(a,{onClick:M},{default:m(()=>t[6]||(t[6]=[g("页面刷新")])),_:1})]),_:1})]),V("div",{id:"main",style:{height:"calc(100vh - 1px)",width:"calc(100vw - 1px)"},ref_key:"refDom",ref:i},null,512)],64)}}});export{Z as default};
