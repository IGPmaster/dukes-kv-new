import{r as c,m as p,n as v,a2 as g,W as h,c as a,a as s,t as l,C as d,D as x,o as n,a4 as f}from"./AuDPTbWI.js";const y={key:0,class:"promotion-page"},b={class:"relative"},w=["src"],k=["src"],L={class:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"},T={class:"text-3xl font-bold text-gray-900 mb-4"},B={class:"mb-6 text-sm text-gray-500"},D={key:0},M={key:1},R=["innerHTML"],E={class:"bg-gray-50 p-6 rounded-lg"},H=["innerHTML"],C={key:1,class:"text-center py-12"},I={class:"text-red-600"},O={key:2,class:"text-center py-12"},$={__name:"[slug]",setup(P){const u=x(),m=f(),t=c(null),i=c(null),_=p(()=>m.public.lang),r=e=>new Date(e).toLocaleDateString();return v(async()=>{try{const e=await fetch(`${g}/promotion?brandId=${h}&lang=${_.value}&slug=${u.params.slug}`);if(!e.ok)throw new Error("Promotion not found");const o=await e.json();t.value=o}catch(e){i.value=e.message}}),(e,o)=>t.value?(n(),a("div",y,[s("div",b,[s("img",{src:t.value.images.desktop,alt:"Promotion Banner",class:"w-full hidden md:block"},null,8,w),s("img",{src:t.value.images.mobile,alt:"Promotion Banner",class:"w-full md:hidden"},null,8,k)]),s("div",L,[s("h1",T,l(t.value.title),1),s("div",B,[t.value.valid_from?(n(),a("span",D," Valid from: "+l(r(t.value.valid_from)),1)):d("",!0),t.value.valid_to?(n(),a("span",M," - Valid until: "+l(r(t.value.valid_to)),1)):d("",!0)]),s("div",{class:"prose max-w-none mb-8",innerHTML:t.value.description},null,8,R),s("div",E,[o[0]||(o[0]=s("h2",{class:"text-lg font-semibold mb-4"},"Terms & Conditions",-1)),s("div",{class:"prose max-w-none",innerHTML:t.value.terms},null,8,H)])])])):i.value?(n(),a("div",C,[s("p",I,l(i.value),1)])):(n(),a("div",O,o[1]||(o[1]=[s("div",{class:"animate-spin h-8 w-8 mx-auto mb-4"},"Loading...",-1)])))}};export{$ as default};
