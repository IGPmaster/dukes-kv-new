import{_ as E}from"./CgnyxvZK.js";import{_ as N}from"./DMzAGznB.js";import{_ as V,m as F,r as S,n as H,X as I,Z as $,c as n,a as o,b as i,F as A,s as W,o as a,B as K,t as l,J as d,w as R,W as q}from"./Bz25RTwc.js";import{u as z}from"./bv8wstrL.js";const J={class:"pt-24 bg-gradient-to-b from-primary_bg to-tertiary_dark min-h-screen"},U={class:"container mx-auto px-4 sm:px-6 lg:px-8"},X={class:"text-center mb-12"},Z={class:"text-4xl font-bold text-primary mb-4"},G={class:"text-gray-400 max-w-2xl mx-auto"},Q={key:0,class:"flex justify-center items-center min-h-[400px]"},Y={key:1,class:"text-center py-12"},tt={class:"max-w-md mx-auto"},et={class:"mt-2 text-sm font-medium text-gray-300"},ot={class:"mt-1 text-sm text-gray-400"},st={key:2,class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"},nt={class:"relative aspect-[16/9] overflow-hidden"},at=["src","alt"],rt=["src","alt"],it={class:"p-6 flex-grow flex flex-col justify-between"},lt={key:0,class:"inline-block mb-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"},ct={class:"text-xl font-bold text-primary mb-3 line-clamp-2"},dt={key:1,class:"text-xs font-semibold text-green-400 mb-2"},ut=["innerHTML"],mt={class:"flex items-center justify-between mt-4"},pt=["onClick"],ft={__name:"index",setup(xt){F(()=>q);const c=S([]),u=S(!0),m=t=>t||"/images/placeholder-promotion.jpg",B=t=>new DOMParser().parseFromString(t,"text/html").body.textContent||"",p=t=>({seasonal:"Seasonal Promotion",welcome:"Welcome Offer",loyalty:"Loyalty Reward"})[t]||t,f=t=>t&&t.length===3?"Available for all players":t!=null&&t.includes("new")?"New Players Only":t!=null&&t.includes("returning")?"Returning Players Only":t!=null&&t.includes("vip")?"VIP Players Only":"";H(async()=>{try{await I(),c.value=$.value.filter(t=>t.status==="active"||t.status==="scheduled").sort((t,s)=>new Date(s.valid_from)-new Date(t.valid_from))}catch(t){console.error("Error fetching promotions:",t)}finally{u.value=!1}});const O=t=>{console.log(`Claiming offer for promotion: ${t.title}`)};return z({title:"Special Promotions - Dukes Casino",meta:[{name:"description",content:"Explore our latest casino promotions and special offers. Find the best bonuses and rewards at Dukes Casino."},{name:"keywords",content:"casino promotions, bonuses, special offers, casino rewards, Dukes Casino"},{property:"og:title",content:"Special Promotions - Dukes Casino"},{property:"og:description",content:"Explore our latest casino promotions and special offers. Find the best bonuses and rewards at Dukes Casino."}]}),(t,s)=>{const r=E,T=N;return a(),n("div",J,[o("div",U,[o("div",X,[o("h1",Z,[i(r,{"translation-key":"special_promotions","loading-text":"Special Promotions"})]),o("p",G,[i(r,{"translation-key":"promotions_quote","loading-text":"Check out our promotions selection. Something for everyone!"})])]),u.value?(a(),n("div",Q,s[0]||(s[0]=[o("div",{class:"animate-spin rounded-full h-12 w-12 border-b-2 border-primary"},null,-1),o("p",{class:"text-gray-300 ml-4"},"Loading promotions...",-1)]))):c.value.length?(a(),n("div",st,[(a(!0),n(A,null,W(c.value,e=>{var x,_,g,y,h,b,v,w,k,C,D,P,j,L,M;return a(),n("div",{key:e.slug,class:"bg-tertiary_dark rounded-lg overflow-hidden shadow-lg flex flex-col"},[o("div",nt,[o("img",{src:m((_=(x=e.images)==null?void 0:x.mobile)==null?void 0:_.url),alt:((y=(g=e.images)==null?void 0:g.mobile)==null?void 0:y.alt)||e.title,class:"w-full h-full object-cover"},null,8,at),o("img",{src:m(((b=(h=e.images)==null?void 0:h.mobile)==null?void 0:b.url)||((v=e.images)==null?void 0:v.mobile)||((k=(w=e.images)==null?void 0:w.desktop)==null?void 0:k.url)),alt:((D=(C=e.images)==null?void 0:C.mobile)==null?void 0:D.alt)||e.title,class:"w-full h-full object-cover md:hidden"},null,8,rt),e.status?(a(),n("div",{key:0,class:K({"absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold":!0,"bg-green-500 text-white":e.status==="active","bg-yellow-500 text-white":e.status==="scheduled","bg-gray-500 text-white":e.status==="expired"})},l(e.status),3)):d("",!0)]),o("div",it,[o("div",null,[p(e.type)?(a(),n("span",lt,l(p(e.type)),1)):d("",!0),o("h2",ct,l(e.title),1),f((P=e.targeting)==null?void 0:P.player_segments)?(a(),n("p",dt,l(f((j=e.targeting)==null?void 0:j.player_segments)),1)):d("",!0),o("div",{innerHTML:B(((L=e.content)==null?void 0:L.short_description)||((M=e.content)==null?void 0:M.description)),class:"text-gray-400 mb-4 line-clamp-3 text-sm prose prose-sm max-w-none prose-invert"},null,8,ut)]),o("div",mt,[i(T,{to:`/promotion/${e.slug}`,class:"inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm text-gray-300 font-medium rounded-md text-black bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"},{default:R(()=>[i(r,{"translation-key":"view_details","loading-text":"View Details"}),s[2]||(s[2]=o("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-4 w-4 ml-2",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[o("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 5l7 7-7 7"})],-1))]),_:2},1032,["to"]),o("button",{onClick:_t=>O(e),class:"px-6 py-2 bg-orange-500 text-white text-sm font-semibold rounded-md shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"}," Claim Offer ",8,pt)])])])}),128))])):(a(),n("div",Y,[o("div",tt,[s[1]||(s[1]=o("svg",{class:"mx-auto h-12 w-12 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[o("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"})],-1)),o("h3",et,[i(r,{"translation-key":"no_promotions_title","loading-text":"No Promotions Available"})]),o("p",ot,[i(r,{"translation-key":"no_promotions_message","loading-text":"Check back soon for new exciting promotions!"})])])]))])])}}},vt=V(ft,[["__scopeId","data-v-8c8c8988"]]);export{vt as default};
