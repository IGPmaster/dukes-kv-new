import{a3 as d,u as f,r,e as h,g as p,h as v,j as y,k as g,l as m}from"./CFNCpwwr.js";let b;function w(){return b}function _(e){return typeof e=="function"?e():f(e)}function i(e){if(e instanceof Promise||e instanceof Date||e instanceof RegExp)return e;const n=_(e);if(!e||!n)return n;if(Array.isArray(n))return n.map(t=>i(t));if(typeof n=="object"){const t={};for(const a in n)if(Object.prototype.hasOwnProperty.call(n,a)){if(a==="titleTemplate"||a[0]==="o"&&a[1]==="n"){t[a]=f(n[a]);continue}t[a]=i(n[a])}return t}return n}const j="usehead",c=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},u="__unhead_injection_handler__";function H(){if(u in c)return c[u]();const e=d(j);return e||w()}function T(e,n={}){const t=n.head||H();if(t)return t.ssr?t.push(e,n):x(t,e,n)}function x(e,n,t={}){const a=r(!1),o=r({});h(()=>{o.value=a.value?{}:i(n)});const s=e.push(o.value,t);return p(o,l=>{s.patch(l)}),m()&&(v(()=>{s.dispose()}),y(()=>{a.value=!0}),g(()=>{a.value=!1})),s}export{T as u};