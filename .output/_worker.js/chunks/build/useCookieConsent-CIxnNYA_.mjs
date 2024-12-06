import{r as e,aa as a}from"./server.mjs";function useCookieConsent(){const t=e(!1),i=e(!1),n=e(null),s=e(""),o=e(""),r=e(""),l=e({necessary:!0,analytics:!1,affiliate:!0}),updateLobbyLinks=e=>{e||(e=null);const t=e?`?tracker=${e}`:"";s.value=`${a}${t}#registration`,o.value=`${a}${t}#login`,r.value=`${a}${t}#play/`},saveToLocalStorage=e=>{if(localStorage.setItem("cookieConsent",JSON.stringify({preferences:e,timestamp:(new Date).toISOString(),version:"1.0"})),e.affiliate){const e=n.value;if(e)(e=>{if(!e||!l.value.affiliate)return;const a=new Date;a.setDate(a.getDate()+30),a.toISOString().split("T")[0],(void 0).cookie=`affiliateTracker=${e}; expires=${a.toUTCString()}; path=/; SameSite=Strict; max-age=2592000`,updateLobbyLinks(e)})(e);else{updateLobbyLinks(null)}}else updateLobbyLinks(null);e.analytics&&((void 0).doNotTrack||(void 0).doNotTrack||(void 0).msDoNotTrack)};return{showBanner:t,isPreferencesOpen:i,preferences:l,cookieCategories:[{id:"necessary",label:"Necessary Cookies",description:"Essential for website functionality. These cookies are required and cannot be disabled.",required:!0},{id:"analytics",label:"Analytics Cookies",description:"Help us understand how visitors interact with our website. These cookies collect anonymous information.",required:!1},{id:"affiliate",label:"Affiliate Tracking",description:"Essential for our business operations. We use a unique identifier stored for 30 days to credit our partners when you visit gaming sites. No personal data is collected.",required:!0}],handleAcceptAll:()=>{const e={necessary:!0,analytics:!0,affiliate:!0};l.value=e,saveToLocalStorage(e),t.value=!1},handleDeclineAll:()=>{const e={necessary:!0,analytics:!1,affiliate:!1};l.value=e,saveToLocalStorage(e),t.value=!1},savePreferences:()=>{const e={...l.value,necessary:!0};l.value=e,saveToLocalStorage(e),t.value=!1,i.value=!1},handleOpenPreferences:()=>{localStorage.getItem("cookieConsent")||(l.value={necessary:!0,analytics:!0,affiliate:!0}),i.value=!0},withdrawConsent:()=>{localStorage.removeItem("cookieConsent"),l.value={necessary:!0,analytics:!1,affiliate:!1},updateLobbyLinks(null),t.value=!0},getConsentStatus:()=>{const e=localStorage.getItem("cookieConsent");if(!e)return null;try{return JSON.parse(e)}catch(e){return null}},regLink:s,loginLink:o,playLink:r}}export{useCookieConsent as u};
//# sourceMappingURL=useCookieConsent-CIxnNYA_.mjs.map
