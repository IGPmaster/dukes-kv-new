import{_ as i}from"./DMzAGznB.js";import{m as l,E as d,r as u,K as _,c as p,a as t,b as m,w as f,P as h,W as n,N as w,o as x,d as g,t as v,u as y,A as b}from"./Bz25RTwc.js";const L={class:""},T={class:"container mx-auto bg-white pt-32"},B={class:"px-4"},C={class:""},I=["innerHTML"],P={__name:"[slug]",setup(N){l(()=>n);const r=d().params.slug;async function c(s){try{return(await(await fetch(`${h}GetInfoContentByCode?whitelabelId=${n}&country=${w.value}&code=${s}`)).json())[0].Html}catch(e){console.error(e)}}const a=u("");return(async()=>(a.value=await c(r),await _()))(),(s,e)=>{const o=i;return x(),p("div",null,[t("div",L,[t("div",T,[t("div",B,[m(o,{to:"/compliance",class:"flex justify-center gap-4 p-2 border rounded border-primary text-gray-800 text-center w-1/2 md:w-1/5 cursor-pointer"},{default:f(()=>[e[0]||(e[0]=t("i",{class:"material-icons"},"arrow_back",-1)),g(" "+v(y(b).legal),1)]),_:1}),t("div",C,[t("div",{innerHTML:a.value},null,8,I)])])])])])}}};export{P as default};