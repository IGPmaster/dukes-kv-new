import{m as h,r as f,K as x,c as o,a as s,F as g,s as y,u as r,P as v,W as d,N as w,o as c,t as b,A as u,O as _}from"./Bz25RTwc.js";const C={class:"bg-white py-10"},L={class:"container mx-auto px-0"},k={class:"g-btn-wrapper mt-10 md:mt-20 flex flex-wrap justify-center"},B=["onClick"],I={class:"px-4"},T=["innerHTML"],A={__name:"index",setup($){h(()=>d);function p(e,t){return t[e]}async function i(e){try{return(await(await fetch(`${v}GetInfoContentByCode?whitelabelId=${d}&country=${w.value}&code=${e}`)).json())[0].Html}catch(t){console.error(t)}}const n=f("");(async()=>(n.value=await i("aboutus"),await x()))();const m=async e=>{const t=p(e,_.value);n.value=await i(t)};return(e,t)=>(c(),o("div",null,[s("div",C,[s("div",L,[s("div",k,[(c(!0),o(g,null,y(r(_),(a,l)=>(c(),o("button",{key:l,onClick:H=>m(l),class:"h-10 px-4 md:px-8 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800 uppercase text-xs md:text-base"},b(r(u)[a]?r(u)[a]:a),9,B))),128))]),s("div",I,[s("div",{innerHTML:n.value},null,8,T)])])])]))}};export{A as default};
