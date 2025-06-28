import{w as ae,r as a,x as W,j as e,e as oe,I as J,b3 as H,y as I,P as le}from"./index-BSxDJeTD.js";import{V as Z}from"./videosService-Bfepd1X7.js";const ne=r=>{const t=ae();a.useEffect(()=>{const c=`${r} | AIWaverider`;document.title=c;const C=window.history.state;C&&window.history.replaceState({...C,title:c},c,t.pathname+t.search+t.hash)},[r,t])},ie=(r,t=1)=>{const[l,c]=a.useState([]),[C,v]=a.useState(!1),[x,$]=a.useState(null),[s,y]=a.useState(t),[m,h]=a.useState(0),[S,k]=a.useState(0),[u,w]=a.useState(!1),[f,E]=a.useState(!1),i=a.useRef(new Map),M=a.useRef(!0),N=a.useCallback(async n=>{if(!r||typeof r!="string"||r.trim()===""){c([]),v(!1),$(null);return}const p=`${r}-${n}`;if(i.current.has(p)){const d=i.current.get(p);c(d.videos),h(d.totalPages),k(d.totalVideos),w(d.hasNextPage),E(d.hasPreviousPage),y(n);return}v(!0),$(null);try{const d=await Z.getVideosByPlatform(r,n),P={videos:d.videos||[],totalPages:d.totalPages||0,totalVideos:d.totalVideos||0,hasNextPage:d.hasNextPage||!1,hasPreviousPage:d.hasPreviousPage||!1};i.current.set(p,P),c(P.videos),h(P.totalPages),k(P.totalVideos),w(P.hasNextPage),E(P.hasPreviousPage),y(n)}catch(d){$(d.message),console.error(`Error fetching ${r} videos:`,d),c([]),h(0),k(0),w(!1),E(!1)}finally{v(!1)}},[r]),b=a.useCallback(()=>{if(u){const n=s+1;N(n)}},[s,u,N]),V=a.useCallback(()=>{if(f){const n=s-1;N(n)}},[s,f,N]),L=a.useCallback(n=>{n>=1&&n<=m&&N(n)},[m,N]),U=a.useCallback(()=>{if(!r)return;const n=`${r}-${s}`;i.current.delete(n),N(s)},[r,s,N]),A=a.useCallback(()=>{i.current.clear()},[]);return a.useEffect(()=>{r&&typeof r=="string"&&r.trim()!==""&&M.current&&(M.current=!1,N(t))},[r,t,N]),a.useEffect(()=>{r&&typeof r=="string"&&r.trim()!==""?(y(1),M.current=!0,$(null)):(c([]),v(!1),$(null),h(0),k(0),w(!1),E(!1),y(1))},[r]),{videos:l,loading:C,error:x,currentPage:s,totalPages:m,totalVideos:S,hasNextPage:u,hasPreviousPage:f,nextPage:b,previousPage:V,goToPage:L,refresh:U,clearCache:A,isEmpty:l.length===0&&!C,isFirstPage:s===1,isLastPage:s===m}},de=(r={})=>{const[t,l]=a.useState(!1),[c,C]=a.useState(!1),v=a.useRef(null),x=a.useRef(null),{threshold:$=.1,rootMargin:s="50px",triggerOnce:y=!0,enabled:m=!0}=r,h=a.useCallback(()=>{!m||!v.current||(x.current=new IntersectionObserver(S=>{const[k]=S,u=k.isIntersecting;l(u),u&&!c&&(C(!0),y&&x.current&&x.current.unobserve(v.current))},{threshold:$,rootMargin:s}),x.current.observe(v.current))},[$,s,y,m,c]);return a.useEffect(()=>(h(),()=>{x.current&&x.current.disconnect()}),[h]),a.useEffect(()=>{!m&&x.current?(x.current.disconnect(),l(!1),y&&C(!1)):m&&!x.current&&h()},[m,h,y]),{targetRef:v,isIntersecting:t,hasIntersected:c,shouldLoad:m&&(y?c:t)}},ce=(r,t={})=>{const[l,c]=a.useState(null),[C,v]=a.useState(!1),[x,$]=a.useState(!1),{targetRef:s,shouldLoad:y}=de(t);return a.useEffect(()=>{if(!y||!r||l)return;v(!0),$(!1);const m=new Image;return m.onload=()=>{c(r),v(!1)},m.onerror=()=>{$(!0),v(!1)},m.src=r,()=>{m.onload=null,m.onerror=null}},[y,r,l]),{targetRef:s,imageSrc:l,imageLoading:C,imageError:x,shouldLoad:y}};function ue({title:r,titleId:t,...l},c){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:c,"aria-labelledby":t},l),r?a.createElement("title",{id:t},r):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"}))}const me=a.forwardRef(ue),D={youtube:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-full h-full",fill:"currentColor",children:e.jsx("path",{d:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"})}),tiktok:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-full h-full",fill:"currentColor",children:e.jsx("path",{d:"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"})}),instagram:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-full h-full",fill:"currentColor",children:e.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"})})},xe=r=>{if(!r||typeof r!="string")return null;const t=/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,l=r.match(t);return l?l[1]:null},he=r=>{if(!r||typeof r!="string")return null;const t=/tiktok\.com\/.*\/video\/(\d+)/,l=r.match(t);return l?l[1]:null},ge=r=>{if(!r||typeof r!="string")return null;const t=/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/,l=r.match(t);return l?l[1]:null},X=({video:r,onPlay:t,className:l=""})=>{const{darkMode:c}=W(),{targetRef:C,imageSrc:v,imageLoading:x,imageError:$}=ce(r.thumbnailUrl,{threshold:.1,rootMargin:"100px"}),[s,y]=a.useState(r.platform.toLowerCase()==="instagram"),[m,h]=a.useState(!1);a.useCallback(()=>{y(!0),h(!1)},[]);const S=a.useCallback(()=>{h(!0)},[]),k=()=>{if(!s||m)return null;const{platform:b,originalUrl:V}=r;if(!V||typeof V!="string")return h(!0),null;switch(b.toLowerCase()){case"youtube":{const L=xe(V);return L?e.jsx("div",{className:"aspect-video w-full",children:e.jsx("iframe",{src:`https://www.youtube.com/embed/${L}?autoplay=1&rel=0`,title:r.title,frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,className:"w-full h-full rounded-lg",onError:S})}):(h(!0),null)}case"tiktok":{const L=he(V);return L?e.jsx("div",{className:"aspect-[9/16] w-full max-w-lg mx-auto",children:e.jsx("iframe",{src:`https://www.tiktok.com/embed/v2/${L}?autoplay=1`,title:r.title,frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,className:"w-full h-full rounded-lg",onError:S,style:{minHeight:"700px"}})}):(h(!0),null)}case"instagram":{const L=ge(V);if(!L)return h(!0),null;const U=V.includes("/reel/"),A=U?"aspect-[9/16]":"aspect-square",n=U?"max-w-md":"max-w-lg";return e.jsxs("div",{className:`${A} ${n} mx-auto w-full relative`,children:[e.jsx("iframe",{src:`https://www.instagram.com/p/${L}/embed/`,title:r.title,frameBorder:"0",scrolling:"no",allowtransparency:"true",allow:"encrypted-media",className:"w-full h-full rounded-lg border-0",onError:S,style:{minHeight:U?"700px":"600px"}}),e.jsxs("div",{className:`
              absolute bottom-4 left-4 right-4 z-20 p-3 rounded-lg text-sm
              ${c?"bg-gray-900/90 text-white":"bg-white/90 text-gray-900"}
              backdrop-blur-sm border
              ${c?"border-gray-700/50":"border-white/50"}
              flex items-center justify-between
            `,children:[e.jsx("span",{children:"To like, comment, or share"}),e.jsx("button",{onClick:M,className:`
                  px-3 py-1 rounded-md text-xs font-medium
                  ${c?"bg-purple-600 hover:bg-purple-700":"bg-purple-500 hover:bg-purple-600"}
                  text-white transition-colors
                `,children:"Open Instagram"})]})]})}default:return h(!0),null}},w=(b=>{switch(b){case"youtube":return{accent:"from-red-500/20 to-red-600/20",icon:D.youtube,color:"text-red-500"};case"tiktok":return{accent:"from-pink-500/20 to-purple-600/20",icon:D.tiktok,color:"text-pink-500"};case"instagram":return{accent:"from-purple-500/20 to-pink-600/20",icon:D.instagram,color:"text-purple-500"};default:return{accent:"from-blue-500/20 to-cyan-600/20",icon:e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M8 5v14l11-7z"})}),color:"text-blue-500"}}})(r.platform),f=b=>b>=1e6?`${(b/1e6).toFixed(1)}M`:b>=1e3?`${(b/1e3).toFixed(1)}K`:(b==null?void 0:b.toString())||"0",E=b=>{try{return new Date(b).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}catch{return"Unknown"}},i=b=>{if(r.platform.toLowerCase()!=="instagram"){if(!s&&!m){y(!0),h(!1);return}t?t(r):window.open(r.originalUrl,"_blank","noopener,noreferrer")}},M=b=>{b.stopPropagation(),window.open(r.originalUrl,"_blank","noopener,noreferrer")},N=r.platform.toLowerCase()==="instagram";return e.jsxs("div",{ref:C,className:`
        group relative overflow-hidden rounded-2xl
        ${N?"":"cursor-pointer"}
        transform transition-all duration-300 ease-out
        ${N?"":"hover:scale-105 hover:-translate-y-2"}
        ${c?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
        shadow-lg hover:shadow-2xl
        ${l}
      `,onClick:N?void 0:i,children:[!s&&e.jsxs("div",{className:`
          absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded-md text-xs font-medium
          ${c?"bg-gray-900/90":"bg-white/90"}
          backdrop-blur-sm border
          ${c?"border-gray-700/50":"border-white/50"}
          ${w.color}
          flex items-center space-x-1
        `,children:[e.jsx("span",{className:"w-3 h-3",children:w.icon}),e.jsx("span",{className:"text-xs font-medium",children:r.platform.toUpperCase()})]}),!s&&e.jsx("button",{onClick:M,className:`
            absolute top-2 right-2 z-20 p-1.5 rounded-md
            ${c?"bg-gray-900/90 hover:bg-gray-800":"bg-white/90 hover:bg-white"}
            backdrop-blur-sm border
            ${c?"border-gray-700/50 text-gray-300":"border-white/50 text-gray-600"}
            transition-all duration-200 
            ${N?"opacity-100":"opacity-0 group-hover:opacity-100"}
          `,title:`Open on ${r.platform} to comment, like, or share`,children:e.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"})})}),s&&!m?e.jsx("div",{className:N?"":"p-4",children:k()}):e.jsx(e.Fragment,{children:e.jsxs("div",{className:"relative aspect-video overflow-hidden",children:[x&&e.jsx("div",{className:`
                w-full h-full flex items-center justify-center
                ${c?"bg-gray-800":"bg-gray-200"}
                animate-pulse
              `,children:e.jsx("div",{className:"w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50"})}),$&&e.jsxs("div",{className:`
                w-full h-full flex flex-col items-center justify-center
                ${c?"bg-gray-800 text-gray-400":"bg-gray-200 text-gray-500"}
              `,children:[e.jsx("svg",{className:"w-12 h-12 mb-2 opacity-50",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("span",{className:"text-sm",children:"Failed to load thumbnail"})]}),v&&e.jsxs(e.Fragment,{children:[e.jsx("img",{src:v,alt:r.title||"Video thumbnail",className:"w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",loading:"lazy"}),e.jsx("div",{className:`
                  absolute inset-0 bg-gradient-to-t
                  ${w.accent}
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                `}),e.jsx("div",{className:`
                  absolute inset-0 flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-all duration-300
                  transform scale-50 group-hover:scale-100
                `,children:e.jsx("div",{className:`
                    p-4 rounded-full backdrop-blur-sm
                    ${c?"bg-gray-900/80":"bg-white/80"}
                    border ${c?"border-gray-700/50":"border-white/50"}
                    shadow-lg
                  `,children:e.jsx("svg",{className:`w-8 h-8 ${w.color}`,fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M8 5v14l11-7z"})})})})]})]})}),m&&e.jsxs("div",{className:"p-4 text-center",children:[e.jsxs("p",{className:`text-sm mb-3 ${c?"text-gray-400":"text-gray-600"}`,children:["Unable to embed video. Click below to watch on ",r.platform,"."]}),e.jsxs("a",{href:r.originalUrl,target:"_blank",rel:"noopener noreferrer",className:`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600
              text-white font-medium transition-transform duration-200 hover:scale-105
            `,onClick:b=>b.stopPropagation(),children:[e.jsx(me,{className:"w-4 h-4"}),"Watch on ",r.platform]})]}),(!s||m||!N)&&e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("h3",{className:`
            font-semibold text-sm leading-tight line-clamp-2
            ${c?"text-white":"text-gray-900"}
          `,children:r.title||"Untitled Video"}),r.authorName&&e.jsxs("div",{className:`
              flex items-center space-x-2 text-xs
              ${c?"text-gray-400":"text-gray-600"}
            `,children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"})}),e.jsx("span",{className:"truncate",children:r.authorName})]}),e.jsxs("div",{className:`
            flex items-center justify-between text-xs
            ${c?"text-gray-400":"text-gray-600"}
          `,children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[r.views>0&&e.jsxs("div",{className:"flex items-center space-x-1",children:[e.jsxs("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]}),e.jsx("span",{children:f(r.views)})]}),r.likes>0&&e.jsxs("div",{className:"flex items-center space-x-1",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"})}),e.jsx("span",{children:f(r.likes)})]})]}),r.createdAt&&e.jsxs("div",{className:"flex items-center space-x-1",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})}),e.jsx("span",{children:E(r.createdAt)})]})]})]}),!N&&e.jsx("div",{className:`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none
          bg-gradient-to-r ${w.accent}
          blur-xl transform scale-110
        `})]})};X.displayName="VideoCard";const Q=a.memo(({currentPage:r,totalPages:t,hasNextPage:l,hasPreviousPage:c,onNext:C,onPrevious:v,onGoToPage:x,className:$=""})=>{const{darkMode:s}=W(),m=(()=>{const f=[],E=Math.max(2,r-2),i=Math.min(t-1,r+2);t>0&&f.push(1),E>2&&f.push("...");for(let M=E;M<=i;M++)M!==1&&M!==t&&f.push(M);return i<t-1&&f.push("..."),t>1&&f.push(t),f})(),h=`
    px-3 py-2 text-sm font-medium rounded-lg
    transition-all duration-200 ease-in-out
    backdrop-blur-sm border
    flex items-center justify-center min-w-[40px]
  `,S=`
    ${h}
    ${s?"bg-blue-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/25":"bg-blue-500/80 text-white border-blue-400/50 shadow-lg shadow-blue-500/25"}
    hover:shadow-xl hover:shadow-blue-500/30
  `,k=`
    ${h}
    ${s?"bg-gray-800/60 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white":"bg-white/60 text-gray-700 border-gray-300/50 hover:bg-white/80 hover:text-gray-900"}
    hover:shadow-md
  `,u=`
    ${h}
    ${s?"bg-gray-800/30 text-gray-600 border-gray-700/30":"bg-gray-200/30 text-gray-400 border-gray-300/30"}
    cursor-not-allowed opacity-50
  `;return t<=1?null:e.jsxs("nav",{className:`flex items-center justify-center space-x-2 ${$}`,"aria-label":"Pagination",children:[e.jsxs("button",{onClick:v,disabled:!c,className:c?k:u,"aria-label":"Previous page",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 19l-7-7 7-7"})}),e.jsx("span",{className:"ml-1 hidden sm:inline",children:"Previous"})]}),e.jsx("div",{className:"flex items-center space-x-1",children:m.map((w,f)=>e.jsx(oe.Fragment,{children:w==="..."?e.jsx("span",{className:`
                px-2 py-2 text-sm
                ${s?"text-gray-500":"text-gray-400"}
              `,children:"..."}):e.jsx("button",{onClick:()=>x(w),className:w===r?S:k,"aria-label":`Page ${w}`,"aria-current":w===r?"page":void 0,children:w})},`${w}-${f}`))}),e.jsxs("button",{onClick:C,disabled:!l,className:l?k:u,"aria-label":"Next page",children:[e.jsx("span",{className:"mr-1 hidden sm:inline",children:"Next"}),e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})})]})]})});Q.displayName="Pagination";const ee=a.memo(({videos:r,loading:t,error:l,currentPage:c,totalPages:C,totalVideos:v,hasNextPage:x,hasPreviousPage:$,onNext:s,onPrevious:y,onGoToPage:m,onRefresh:h,onVideoPlay:S,platform:k,isAdmin:u=!1,className:w=""})=>{const{darkMode:f}=W(),E=b=>{switch(b){case"tiktok":return"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";default:return"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}},i=()=>e.jsx("div",{className:E(k),children:Array.from({length:8}).map((b,V)=>e.jsxs("div",{className:`
            rounded-2xl overflow-hidden
            ${f?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
            animate-pulse
          `,children:[e.jsx("div",{className:`aspect-video ${f?"bg-gray-700":"bg-gray-300"}`}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("div",{className:`h-4 rounded ${f?"bg-gray-700":"bg-gray-300"}`}),e.jsx("div",{className:`h-3 rounded w-3/4 ${f?"bg-gray-700":"bg-gray-300"}`}),e.jsx("div",{className:`h-3 rounded w-1/2 ${f?"bg-gray-700":"bg-gray-300"}`})]})]},V))}),M=()=>e.jsxs("div",{className:`
      text-center py-12 px-6 rounded-2xl
      ${f?"bg-red-900/20 border border-red-800/30 text-red-300":"bg-red-50/80 border border-red-200/50 text-red-600"}
      backdrop-blur-sm
    `,children:[e.jsx("svg",{className:"w-12 h-12 mx-auto mb-4 opacity-50",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Failed to load videos"}),e.jsx("p",{className:"text-sm opacity-80 mb-4",children:l}),h&&u&&e.jsx("button",{onClick:h,className:`
            px-4 py-2 rounded-lg font-medium text-sm
            ${f?"bg-red-700/50 hover:bg-red-600/60 border border-red-600/50":"bg-red-100 hover:bg-red-200 border border-red-300"}
            transition-colors duration-200 backdrop-blur-sm
          `,title:"Admin: Try again",children:"Try Again"}),!u&&e.jsxs("div",{className:`
          text-xs px-3 py-2 rounded-lg inline-flex items-center space-x-2
          ${f?"bg-blue-900/20 text-blue-300 border border-blue-700/30":"bg-blue-50 text-blue-600 border border-blue-200"}
          backdrop-blur-sm
        `,children:[e.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("span",{children:"Data will refresh automatically at midnight"})]})]}),N=()=>e.jsxs("div",{className:`
      text-center py-16 px-6 rounded-2xl
      ${f?"bg-gray-800/40 border border-gray-700/30 text-gray-400":"bg-white/40 border border-white/30 text-gray-600"}
      backdrop-blur-sm
    `,children:[e.jsx("svg",{className:"w-16 h-16 mx-auto mb-4 opacity-50",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"})}),e.jsx("h3",{className:"text-xl font-semibold mb-2",children:"No videos found"}),e.jsxs("p",{className:"text-sm opacity-80",children:["No ",k," videos are available at the moment."]})]});return e.jsxs("div",{className:`space-y-6 ${w}`,children:[(v>0||t)&&e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("div",{className:`text-sm ${f?"text-gray-400":"text-gray-600"}`,children:t?e.jsx("span",{children:"Loading videos..."}):e.jsxs("span",{children:["Showing ",(c-1)*50+1," - ",Math.min(c*50,v)," of ",v," videos"]})}),e.jsxs("div",{className:"flex items-center space-x-3",children:[h&&!t&&u&&e.jsx("button",{onClick:h,className:`
                  p-2 rounded-lg transition-colors duration-200
                  ${f?"text-gray-400 hover:text-white hover:bg-gray-800/60":"text-gray-600 hover:text-gray-900 hover:bg-white/60"}
                  backdrop-blur-sm
                `,title:"Admin: Refresh videos (Auto-refresh runs daily at midnight)",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})})}),!u&&!t&&e.jsxs("div",{className:`
                text-xs px-2 py-1 rounded-lg flex items-center space-x-1
                ${f?"bg-green-900/20 text-green-300 border border-green-700/30":"bg-green-50 text-green-600 border border-green-200"}
                backdrop-blur-sm
              `,children:[e.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),e.jsx("span",{children:"Auto-sync"})]})]})]}),t?e.jsx(i,{}):l?e.jsx(M,{}):r.length===0?e.jsx(N,{}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:E(k),children:r.map(b=>e.jsx(X,{video:b,onPlay:S,className:"h-full"},b.id))}),C>1&&e.jsx("div",{className:"pt-8",children:e.jsx(Q,{currentPage:c,totalPages:C,hasNextPage:x,hasPreviousPage:$,onNext:s,onPrevious:y,onGoToPage:m})})]})]})});ee.displayName="VideoGrid";const G={youtube:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-6 h-6",fill:"currentColor",children:e.jsx("path",{d:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"})}),tiktok:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-6 h-6",fill:"currentColor",children:e.jsx("path",{d:"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"})}),instagram:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-6 h-6",fill:"currentColor",children:e.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"})})},_=a.memo(({platform:r,onVideoPlay:t,filters:l={},searchQuery:c="",onResultsChange:C,className:v=""})=>{const{darkMode:x}=W(),{user:$}=a.useContext(J),[s,y]=a.useState(!1),{videos:m,loading:h,error:S,currentPage:k,totalPages:u,totalVideos:w,hasNextPage:f,hasPreviousPage:E,nextPage:i,previousPage:M,goToPage:N,refresh:b}=ie(r);a.useEffect(()=>{(async()=>{if(!$){y(!1);return}try{const d=(await H.collection("users").doc($.uid).get()).data();y((d==null?void 0:d.role)==="admin")}catch(p){console.error("Error checking admin status:",p),y(!1)}})()},[$]),a.useEffect(()=>{const n=()=>{const d=new Date,P=new Date(d);P.setDate(P.getDate()+1),P.setHours(0,0,0,0);const F=P.getTime()-d.getTime();return console.log(`[${r}] Auto-refresh scheduled for: ${P.toLocaleString()}`),console.log(`[${r}] Time until next refresh: ${Math.round(F/1e3/60)} minutes`),setTimeout(()=>{console.log(`[${r}] Executing automatic daily refresh at midnight`),I.info(`🔄 ${r.toUpperCase()} videos refreshed automatically`,{position:"bottom-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0}),b(),n()},F)},p=n();return()=>{p&&(clearTimeout(p),console.log(`[${r}] Auto-refresh timeout cleared`))}},[r,b]);const V=a.useMemo(()=>{if(!m||m.length===0)return m;let n=[...m];if(c&&c.trim()){const p=c.toLowerCase().trim();n=n.filter(d=>!!((d.title||"").toLowerCase().includes(p)||(d.description||"").toLowerCase().includes(p)||(d.authorName||d.author||"").toLowerCase().includes(p)||(d.authorUser||d.username||"").toLowerCase().includes(p)||(d.platform||r||"").toLowerCase().includes(p)))}if(l.author&&l.author.trim()){const p=l.author.toLowerCase().trim();n=n.filter(d=>{const P=d.authorName||d.author||"",F=d.authorUser||d.username||"";return P.toLowerCase().includes(p)||F.toLowerCase().includes(p)})}if(l.category&&l.category!=="all"&&(n=n.filter(p=>(p.category||"").toLowerCase()===l.category.toLowerCase())),l.minViews&&l.minViews.trim()){const p=parseInt(l.minViews);isNaN(p)||(n=n.filter(d=>(d.views||0)>=p))}if(l.maxViews&&l.maxViews.trim()){const p=parseInt(l.maxViews);isNaN(p)||(n=n.filter(d=>(d.views||0)<=p))}if(l.minLikes&&l.minLikes.trim()){const p=parseInt(l.minLikes);isNaN(p)||(n=n.filter(d=>(d.likes||0)>=p))}if(l.maxLikes&&l.maxLikes.trim()){const p=parseInt(l.maxLikes);isNaN(p)||(n=n.filter(d=>(d.likes||0)<=p))}return n},[m,l,c,r]),L=a.useMemo(()=>({totalVideos:(V==null?void 0:V.length)||0,hasResults:V&&V.length>0}),[V]);a.useEffect(()=>{C&&typeof C=="function"&&C(r,L.totalVideos)},[r,L.totalVideos,C]);const A=(n=>{switch(n){case"youtube":return{name:"YouTube",icon:G.youtube,description:"Trending videos from YouTube creators",gradient:"from-red-500/20 via-red-600/10 to-transparent",accentColor:"text-red-500",borderColor:x?"border-red-500/20":"border-red-300/30"};case"tiktok":return{name:"TikTok",icon:G.tiktok,description:"Viral videos from TikTok",gradient:"from-pink-500/20 via-purple-600/10 to-transparent",accentColor:"text-pink-500",borderColor:x?"border-pink-500/20":"border-pink-300/30"};case"instagram":return{name:"Instagram",icon:G.instagram,description:"Popular reels and videos from Instagram",gradient:"from-purple-500/20 via-pink-600/10 to-transparent",accentColor:"text-purple-500",borderColor:x?"border-purple-500/20":"border-purple-300/30"};default:return{name:n,icon:e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M8 5v14l11-7z"})}),description:"Videos from this platform",gradient:"from-blue-500/20 via-cyan-600/10 to-transparent",accentColor:"text-blue-500",borderColor:x?"border-blue-500/20":"border-blue-300/30"}}})(r);return e.jsxs("section",{className:`space-y-6 ${v}`,children:[e.jsxs("div",{className:`
        relative overflow-hidden rounded-2xl p-6
        ${x?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
        ${A.borderColor}
      `,children:[e.jsx("div",{className:`
          absolute inset-0 bg-gradient-to-r ${A.gradient}
          opacity-50
        `}),e.jsxs("div",{className:"relative z-10",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:`
                w-12 h-12 rounded-2xl flex items-center justify-center ${A.accentColor}
                ${x?"bg-gray-900/50 backdrop-blur-sm":"bg-white/50 backdrop-blur-sm"}
                border ${x?"border-gray-700/50":"border-white/50"}
              `,children:A.icon}),e.jsxs("div",{children:[e.jsx("h2",{className:`
                  text-2xl font-bold
                  ${x?"text-white":"text-gray-900"}
                `,children:A.name}),e.jsx("p",{className:`
                  text-sm
                  ${x?"text-gray-400":"text-gray-600"}
                `,children:A.description})]})]}),e.jsx("div",{className:`
              flex items-center space-x-4 text-sm
              ${x?"text-gray-400":"text-gray-600"}
            `,children:!h&&w>0&&e.jsxs("div",{className:"text-right",children:[e.jsxs("div",{className:`font-bold text-lg ${A.accentColor}`,children:[L.totalVideos.toLocaleString(),L.totalVideos!==w&&e.jsxs("span",{className:"text-xs opacity-60",children:["/",w.toLocaleString()]})]}),e.jsxs("div",{className:"text-xs",children:[L.totalVideos===1?"video":"videos",L.totalVideos!==w&&" (filtered)"]})]})})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[s&&e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("button",{onClick:b,disabled:h,className:`
                      px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${x?"bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-white border border-gray-600/50":"bg-white/50 hover:bg-white/70 text-gray-700 hover:text-gray-900 border border-gray-300/50"}
                      backdrop-blur-sm
                      ${h?"opacity-50 cursor-not-allowed":"hover:shadow-md"}
                    `,title:"Admin: Manual refresh (Auto-refresh runs daily at midnight)",children:h?e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("div",{className:"w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"}),e.jsx("span",{children:"Loading..."})]}):e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})}),e.jsx("span",{children:"Refresh"})]})}),!1]}),!s&&e.jsxs("div",{className:`
                  text-xs px-3 py-2 rounded-lg flex items-center space-x-2
                  ${x?"bg-blue-900/20 text-blue-300 border border-blue-700/30":"bg-blue-50 text-blue-600 border border-blue-200"}
                  backdrop-blur-sm
                `,children:[e.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("span",{children:"Auto-updates daily at midnight"})]})]}),e.jsx("div",{className:"flex items-center space-x-4",children:u>1&&e.jsxs("div",{className:`
                  text-xs px-3 py-2 rounded-lg
                  ${x?"bg-gray-700/30 text-gray-400":"bg-white/30 text-gray-600"}
                  backdrop-blur-sm
                `,children:["Page ",k," of ",u]})})]}),!h&&w>0&&!L.hasResults&&e.jsxs("div",{className:`
              mt-4 p-4 rounded-lg text-center
              ${x?"bg-yellow-900/20 border border-yellow-700/50 text-yellow-300":"bg-yellow-50 border border-yellow-200 text-yellow-800"}
            `,children:[e.jsx("svg",{className:"w-8 h-8 mx-auto mb-2 opacity-60",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m6-6V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-4z"})}),e.jsx("p",{className:"text-sm font-medium",children:"No videos match your current filters"}),e.jsx("p",{className:"text-xs opacity-75 mt-1",children:"Try adjusting your filter criteria to see more results"})]})]})]}),e.jsx(ee,{videos:V,loading:h,error:S,currentPage:k,totalPages:u,totalVideos:L.totalVideos,hasNextPage:f,hasPreviousPage:E,onNext:i,onPrevious:M,onGoToPage:N,onRefresh:b,onVideoPlay:t,platform:r,isAdmin:s})]})});_.displayName="PlatformSection";const R={all:e.jsxs("svg",{viewBox:"0 0 24 24",className:"w-5 h-5",fill:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"allGradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#6366f1"}),e.jsx("stop",{offset:"100%",stopColor:"#8b5cf6"})]})}),e.jsx("path",{d:"M8 5v14l11-7z",fill:"url(#allGradient)"}),e.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"url(#allGradient)",strokeWidth:"1.5",fill:"none",opacity:"0.3"})]}),youtube:e.jsxs("svg",{viewBox:"0 0 24 24",className:"w-5 h-5",fill:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"youtubeGradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#ff0000"}),e.jsx("stop",{offset:"100%",stopColor:"#cc0000"})]})}),e.jsx("path",{d:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",fill:"url(#youtubeGradient)"})]}),tiktok:e.jsxs("svg",{viewBox:"0 0 24 24",className:"w-5 h-5",fill:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"tiktokGradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#ff0050"}),e.jsx("stop",{offset:"50%",stopColor:"#00f2ea"}),e.jsx("stop",{offset:"100%",stopColor:"#ff0050"})]})}),e.jsx("path",{d:"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",fill:"url(#tiktokGradient)"})]}),instagram:e.jsxs("svg",{viewBox:"0 0 24 24",className:"w-5 h-5",fill:"none",children:[e.jsx("defs",{children:e.jsxs("radialGradient",{id:"instagramGradient",cx:"30%",cy:"107%",children:[e.jsx("stop",{offset:"0%",stopColor:"#fdf497"}),e.jsx("stop",{offset:"5%",stopColor:"#fdf497"}),e.jsx("stop",{offset:"45%",stopColor:"#fd5949"}),e.jsx("stop",{offset:"60%",stopColor:"#d6249f"}),e.jsx("stop",{offset:"90%",stopColor:"#285AEB"})]})}),e.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",fill:"url(#instagramGradient)"})]})},fe=()=>{var Y;const{darkMode:r}=W(),{user:t}=a.useContext(J),[l,c]=a.useState("all"),[C,v]=a.useState(!1),[x,$]=a.useState(!1),[s,y]=a.useState(""),m=a.useRef(null),h=a.useRef(null),[S,k]=a.useState(!1),[u,w]=a.useState({author:"",minViews:"",maxViews:"",minLikes:"",maxLikes:"",category:"all"}),[f,E]=a.useState({youtube:0,tiktok:0,instagram:0}),[i,M]=a.useState({platform:"youtube",title:"",authorName:"",username:"",originalUrl:"",thumbnailUrl:"",views:0,likes:0,addedBy:(t==null?void 0:t.displayName)||(t==null?void 0:t.email)||"Admin"}),[N,b]=a.useState(!1);ne("Videos Gallery");const[V,L]=a.useState(!1);a.useEffect(()=>{const o=g=>{(g.ctrlKey||g.metaKey)&&g.key==="k"&&(g.preventDefault(),m.current&&(m.current.focus(),m.current.select())),g.key==="Escape"&&document.activeElement===m.current&&(y(""),m.current.blur(),k(!1))};return document.addEventListener("keydown",o),()=>document.removeEventListener("keydown",o)},[]),a.useEffect(()=>{s&&s.trim()?(k(!0),setTimeout(()=>{h.current&&h.current.scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"})},300)):k(!1)},[s]),a.useEffect(()=>{const o=()=>{var g;if(s&&s.trim()){const j=window.pageYOffset||document.documentElement.scrollTop,B=((g=m.current)==null?void 0:g.offsetTop)||0;j<B+200?k(!1):k(!0)}};return window.addEventListener("scroll",o,{passive:!0}),()=>{window.removeEventListener("scroll",o)}},[s]),a.useEffect(()=>{(async()=>{if(!t){L(!1);return}try{const j=(await H.collection("users").doc(t.uid).get()).data();L((j==null?void 0:j.role)==="admin")}catch(g){console.error("Error checking admin status:",g),L(!1)}})()},[t]);const U=a.useCallback(o=>{console.log("Playing video:",o),window.open(o.originalUrl,"_blank","noopener,noreferrer")},[]),A=[{id:"all",label:"All Categories"},{id:"tech",label:"Tech"},{id:"entertainment",label:"Entertainment"},{id:"education",label:"Education"},{id:"music",label:"Music"},{id:"sports",label:"Sports"},{id:"news",label:"News"},{id:"lifestyle",label:"Lifestyle"},{id:"gaming",label:"Gaming"},{id:"comedy",label:"Comedy"}],n=(o,g)=>{w(j=>({...j,[o]:g}))},p=()=>{w({author:"",minViews:"",maxViews:"",minLikes:"",maxLikes:"",category:"all"})},d=()=>u.author||u.minViews||u.maxViews||u.minLikes||u.maxLikes||u.category!=="all"||s&&s.trim(),P=o=>d()?Object.entries(o).sort(([,j],[,B])=>j>0&&B===0?-1:j===0&&B>0?1:j!==B?B-j:0).map(([j])=>j):["youtube","tiktok","instagram"],F=()=>{v(!0)},T=o=>{const{name:g,value:j}=o.target;M(B=>({...B,[g]:j}))},O=async o=>{o.preventDefault(),b(!0);try{if(console.log("=== handleFormSubmit ==="),console.log("Form data:",JSON.stringify(i,null,2)),!i.originalUrl){I.error("Video URL is required");return}const g=/^https?:\/\/.+/;if(!g.test(i.originalUrl)){I.error("Please enter a valid URL starting with http:// or https://");return}const j={youtube:/youtube\.com\/watch\?v=|youtu\.be\//,tiktok:/tiktok\.com\//,instagram:/instagram\.com\/(p|reel)\//},B=i.platform.toLowerCase();if(j[B]&&!j[B].test(i.originalUrl)){I.error(`The URL doesn't appear to be a valid ${i.platform} URL`);return}const z={platform:i.platform.toLowerCase().trim(),originalUrl:i.originalUrl.trim(),addedBy:i.addedBy||(t==null?void 0:t.displayName)||(t==null?void 0:t.email)||"Admin"};if(i.title&&i.title.trim()&&(z.title=i.title.trim()),i.authorName&&i.authorName.trim()&&(z.authorName=i.authorName.trim()),i.username&&i.username.trim()&&(z.username=i.username.trim()),i.thumbnailUrl&&i.thumbnailUrl.trim()){if(!g.test(i.thumbnailUrl.trim())){I.error("Please enter a valid thumbnail URL");return}z.thumbnailUrl=i.thumbnailUrl.trim()}if(i.views&&parseInt(i.views)>0&&(z.views=parseInt(i.views)),i.likes&&parseInt(i.likes)>0&&(z.likes=parseInt(i.likes)),console.log("Final video data to send:",JSON.stringify(z,null,2)),!z.platform||!z.originalUrl||!z.addedBy){console.error("Missing required fields:",{platform:z.platform,originalUrl:z.originalUrl,addedBy:z.addedBy}),I.error("Missing required fields. Please check the form.");return}console.log("Sending video to VideosService.addVideo...");const se=await Z.addVideo(z);console.log("VideosService.addVideo result:",se),I.success("Video added successfully!"),v(!1),M({platform:"youtube",title:"",authorName:"",username:"",originalUrl:"",thumbnailUrl:"",views:0,likes:0,addedBy:(t==null?void 0:t.displayName)||(t==null?void 0:t.email)||"Admin"})}catch(g){console.error("=== Error in handleFormSubmit ==="),console.error("Error object:",g),console.error("Error message:",g.message),console.error("Error stack:",g.stack);let j="Failed to add video. Please try again.";g.message&&(g.message.includes("Authentication required")?j="Please log in as an admin to add videos.":g.message.includes("400")?j="Invalid video data. Please check all fields and try again.":g.message.includes("401")?j="You are not authorized to add videos. Admin access required.":g.message.includes("403")?j="Access denied. Admin privileges required.":g.message.includes("Network")?j="Network error. Please check your connection and try again.":j=g.message),I.error(j)}finally{b(!1)}},q=[{id:"all",label:"All Platforms",icon:R.all},{id:"youtube",label:"YouTube",icon:R.youtube},{id:"tiktok",label:"TikTok",icon:R.tiktok},{id:"instagram",label:"Instagram",icon:R.instagram}],re=o=>`
      px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
      backdrop-blur-sm border
      ${l===o?r?"bg-blue-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/25":"bg-blue-500/80 text-white border-blue-400/50 shadow-lg shadow-blue-500/25":r?"bg-gray-800/60 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white":"bg-white/60 text-gray-700 border-gray-300/50 hover:bg-white/80 hover:text-gray-900"}
      hover:shadow-md cursor-pointer
    `,te=async()=>{if(!t){I.error("Please log in first");return}try{await H.collection("users").doc(t.uid).set({email:t.email,displayName:t.displayName,role:"admin",createdAt:new Date,updatedAt:new Date},{merge:!0}),console.log("Admin role set successfully"),I.success("Admin role set! Please refresh the page.")}catch(o){console.error("Error setting admin role:",o),I.error("Failed to set admin role")}},K=a.useCallback((o,g)=>{E(j=>({...j,[o]:g}))},[]);return e.jsxs("div",{className:`min-h-screen pb-16 ${r?"dark bg-[#2D1846]":"bg-gray-50"} bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70] stars-pattern`,children:[e.jsx(le,{}),e.jsx("div",{className:"absolute inset-0 opacity-30",children:e.jsx("div",{className:`
          absolute inset-0
          ${r?"bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent)] bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent)]":"bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05),transparent)] bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.05),transparent)]"}
        `})}),e.jsxs("div",{className:"relative z-10",children:[e.jsx("header",{className:"px-4 sm:px-6 lg:px-8 pt-8 pb-6",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[t&&!V&&e.jsxs("div",{className:"mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg",children:[e.jsx("p",{className:"text-sm text-yellow-800 dark:text-yellow-200 mb-2",children:"Debug: User is not admin. Click to set admin role:"}),e.jsx("button",{onClick:te,className:"px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium",children:"Set Admin Role (Debug)"})]}),V&&e.jsx("div",{className:"flex justify-end mb-4",children:e.jsxs("button",{onClick:F,className:`
                    px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    backdrop-blur-sm border flex items-center space-x-2
                    ${r?"bg-purple-600/80 text-white border-purple-500/50 hover:bg-purple-700/80":"bg-purple-500/80 text-white border-purple-400/50 hover:bg-purple-600/80"}
                    shadow-lg hover:shadow-xl
                  `,children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})}),e.jsx("span",{children:"Edit"})]})}),e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h1",{className:`
                text-4xl sm:text-5xl lg:text-6xl font-bold mb-4
                ${r?"text-white":"text-gray-900"}
                bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
              `,children:"Videos Gallery"}),e.jsx("p",{className:`
                text-lg sm:text-xl max-w-3xl mx-auto mb-8
                ${r?"text-gray-300":"text-gray-600"}
              `,children:"Discover trending videos from YouTube, TikTok, and Instagram all in one place"}),e.jsxs("div",{className:"max-w-2xl mx-auto mb-8",children:[e.jsxs("div",{className:"relative group",children:[e.jsx("input",{type:"text",value:s,onChange:o=>y(o.target.value),onFocus:()=>{s&&s.trim()&&k(!0)},placeholder:"Search videos by title, description, author, or platform... (Ctrl+K)",className:`
                      w-full px-6 py-4 pl-12 pr-16 rounded-2xl border
                      ${r?"bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400":"bg-white/70 border-gray-300/50 text-gray-900 placeholder-gray-500"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      backdrop-blur-sm transition-all duration-300 ease-out
                      ${s&&s.trim()?`shadow-2xl transform hover:scale-105 hover:-translate-y-1 
                           ${r?"shadow-blue-500/25 border-blue-500/50 bg-gray-800/80":"shadow-blue-500/20 border-blue-400/60 bg-white/90"}
                           ring-2 ring-blue-500/30`:"shadow-lg hover:shadow-xl hover:scale-102 hover:-translate-y-0.5"}
                      group-hover:shadow-2xl
                      ${S&&s?"opacity-70":""}
                    `,ref:m}),e.jsx("div",{className:`
                    absolute left-4 top-1/2 transform -translate-y-1/2 
                    transition-all duration-300 ease-out
                    ${s&&s.trim()?`scale-110 ${r?"text-blue-400":"text-blue-600"}`:`${r?"text-gray-400 group-hover:text-blue-400":"text-gray-500 group-hover:text-blue-600"}`}
                  `,children:e.jsx("svg",{className:"w-5 h-5 transition-transform duration-300 group-hover:rotate-12",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})}),s&&e.jsx("button",{onClick:()=>{y(""),k(!1),window.scrollTo({top:0,behavior:"smooth"})},className:`
                        absolute right-3 top-1/2 transform -translate-y-1/2 
                        p-1.5 rounded-full transition-all duration-300 ease-out
                        hover:scale-125 hover:rotate-180 active:scale-95
                        ${r?"text-gray-400 hover:text-white hover:bg-red-600/30 hover:shadow-xl hover:shadow-red-500/40":"text-gray-500 hover:text-red-600 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/30"}
                        group
                        border border-transparent hover:border-red-500/50
                      `,title:"Close search and return to top",children:e.jsx("svg",{className:"w-4 h-4 transition-transform duration-500 group-hover:rotate-90",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),!s&&e.jsxs("div",{className:`
                      absolute right-4 top-1/2 transform -translate-y-1/2 
                      hidden sm:flex items-center space-x-1 text-xs
                      ${r?"text-gray-500":"text-gray-400"}
                      transition-all duration-300 group-hover:opacity-100
                    `,children:[e.jsx("kbd",{className:`
                        px-1.5 py-0.5 rounded text-xs font-mono
                        ${r?"bg-gray-700/50 border border-gray-600/50":"bg-gray-100/50 border border-gray-300/50"}
                      `,children:navigator.platform.includes("Mac")?"⌘":"Ctrl"}),e.jsx("kbd",{className:`
                        px-1.5 py-0.5 rounded text-xs font-mono
                        ${r?"bg-gray-700/50 border border-gray-600/50":"bg-gray-100/50 border border-gray-300/50"}
                      `,children:"K"})]}),!s&&!S&&e.jsx("button",{onClick:()=>{m.current&&m.current.focus()},className:`
                        absolute right-4 top-1/2 transform -translate-y-1/2 
                        px-3 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-300 ease-out opacity-0 group-hover:opacity-100
                        hover:scale-110 active:scale-95
                        ${r?"bg-blue-600/80 text-white hover:bg-blue-500 border border-blue-500/50":"bg-blue-500/80 text-white hover:bg-blue-600 border border-blue-400/50"}
                        backdrop-blur-sm shadow-lg hover:shadow-xl
                        sm:hidden
                      `,title:"Start searching",children:"Search"}),s&&s.trim()&&e.jsx("div",{className:`
                      absolute inset-0 rounded-2xl transition-all duration-300
                      ${r?"bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10":"bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"}
                      -z-10 blur-xl scale-105 animate-pulse-slow
                    `})]}),s&&s.trim()&&e.jsx("div",{className:`
                    mt-4 text-center transition-all duration-300 animate-fadeIn
                  `,children:e.jsxs("div",{className:`
                      inline-flex items-center space-x-2 px-4 py-2 rounded-full
                      ${r?"bg-blue-900/30 text-blue-300 border border-blue-700/50":"bg-blue-50/80 text-blue-700 border border-blue-200/60"}
                      backdrop-blur-sm shadow-lg
                    `,children:[e.jsx("svg",{className:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e.jsxs("span",{className:"text-sm font-medium",children:["Searching for: ",e.jsxs("span",{className:"font-bold",children:['"',s,'"']})]}),e.jsx("div",{className:`
                        w-2 h-2 rounded-full animate-pulse
                        ${r?"bg-blue-400":"bg-blue-600"}
                      `})]})})]})]}),e.jsx("div",{className:`
              flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl
              ${r?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
              shadow-lg
            `,children:q.map(o=>e.jsxs("button",{onClick:()=>c(o.id),className:re(o.id),children:[e.jsx("span",{className:"mr-2",children:o.icon}),o.label]},o.id))}),e.jsxs("div",{className:`
              mt-6 rounded-2xl overflow-hidden transition-all duration-300
              ${r?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
              shadow-lg
            `,children:[e.jsxs("button",{onClick:()=>$(!x),className:`
                  w-full px-6 py-4 flex items-center justify-between
                  ${r?"text-white hover:bg-gray-700/50":"text-gray-900 hover:bg-gray-100/50"}
                  transition-colors duration-200
                `,children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"})}),e.jsx("span",{className:"font-medium",children:"Filters"}),d()&&e.jsx("span",{className:`
                      px-2 py-1 text-xs rounded-full
                      ${r?"bg-blue-600 text-white":"bg-blue-500 text-white"}
                    `,children:"Active"})]}),e.jsx("svg",{className:`w-5 h-5 transition-transform duration-200 ${x?"rotate-180":""}`,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]}),x&&e.jsxs("div",{className:"px-6 pb-6 space-y-6 border-t border-gray-200/20",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:`block text-sm font-medium ${r?"text-gray-300":"text-gray-700"}`,children:"Author/Creator"}),e.jsx("input",{type:"text",value:u.author,onChange:o=>n("author",o.target.value),placeholder:"Search by author name...",className:`
                          w-full px-4 py-2 rounded-lg border
                          ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                        `})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:`block text-sm font-medium ${r?"text-gray-300":"text-gray-700"}`,children:"Category"}),e.jsx("select",{value:u.category,onChange:o=>n("category",o.target.value),className:`
                          w-full px-4 py-2 rounded-lg border
                          ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white/70 border-gray-300 text-gray-900"}
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                        `,children:A.map(o=>e.jsx("option",{value:o.id,children:o.label},o.id))})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:`block text-sm font-medium ${r?"text-gray-300":"text-gray-700"}`,children:"Views Range"}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsx("input",{type:"number",value:u.minViews,onChange:o=>n("minViews",o.target.value),placeholder:"Min views",className:`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `}),e.jsx("input",{type:"number",value:u.maxViews,onChange:o=>n("maxViews",o.target.value),placeholder:"Max views",className:`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:`block text-sm font-medium ${r?"text-gray-300":"text-gray-700"}`,children:"Likes Range"}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsx("input",{type:"number",value:u.minLikes,onChange:o=>n("minLikes",o.target.value),placeholder:"Min likes",className:`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `}),e.jsx("input",{type:"number",value:u.maxLikes,onChange:o=>n("maxLikes",o.target.value),placeholder:"Max likes",className:`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `})]})]}),e.jsx("div",{className:"flex items-end",children:e.jsx("button",{onClick:p,disabled:!d(),className:`
                          w-full px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                          ${d()?r?"bg-red-600/80 text-white hover:bg-red-700/80 border border-red-500/50":"bg-red-500/80 text-white hover:bg-red-600/80 border border-red-400/50":r?"bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/50":"bg-gray-200/50 text-gray-400 cursor-not-allowed border border-gray-300/50"}
                        `,children:"Clear Filters"})})]}),d()&&e.jsx("div",{className:"pt-4 border-t border-gray-200/20",children:e.jsxs("div",{className:"flex flex-wrap gap-2",children:[u.author&&e.jsxs("span",{className:`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${r?"bg-blue-600/20 text-blue-300":"bg-blue-100 text-blue-800"}
                          `,children:[e.jsxs("span",{children:["Author: ",u.author]}),e.jsx("button",{onClick:()=>n("author",""),className:"ml-1 hover:text-red-400",children:"×"})]}),u.category!=="all"&&e.jsxs("span",{className:`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${r?"bg-purple-600/20 text-purple-300":"bg-purple-100 text-purple-800"}
                          `,children:[e.jsxs("span",{children:["Category: ",(Y=A.find(o=>o.id===u.category))==null?void 0:Y.label]}),e.jsx("button",{onClick:()=>n("category","all"),className:"ml-1 hover:text-red-400",children:"×"})]}),(u.minViews||u.maxViews)&&e.jsxs("span",{className:`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${r?"bg-yellow-600/20 text-yellow-300":"bg-yellow-100 text-yellow-800"}
                          `,children:[e.jsxs("span",{children:["Views: ",u.minViews||"0"," - ",u.maxViews||"∞"]}),e.jsx("button",{onClick:()=>{n("minViews",""),n("maxViews","")},className:"ml-1 hover:text-red-400",children:"×"})]}),(u.minLikes||u.maxLikes)&&e.jsxs("span",{className:`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${r?"bg-pink-600/20 text-pink-300":"bg-pink-100 text-pink-800"}
                          `,children:[e.jsxs("span",{children:["Likes: ",u.minLikes||"0"," - ",u.maxLikes||"∞"]}),e.jsx("button",{onClick:()=>{n("minLikes",""),n("maxLikes","")},className:"ml-1 hover:text-red-400",children:"×"})]})]})})]})]})]})}),e.jsx("main",{className:"px-4 sm:px-6 lg:px-8 pb-16",ref:h,children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[d()&&e.jsxs("div",{className:`
                p-4 rounded-lg text-center text-sm transition-all duration-300 animate-fadeIn
                ${r?"bg-blue-900/20 border border-blue-700/30 text-blue-300":"bg-blue-50 border border-blue-200 text-blue-800"}
              `,children:[e.jsx("div",{className:"flex items-center justify-center space-x-2 mb-2",children:s&&s.trim()?e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-5 h-5 animate-pulse",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e.jsxs("span",{className:"font-medium",children:['Search results for "',s,'" - Platforms with matches shown first']})]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"})}),e.jsx("span",{className:"font-medium",children:"Platforms with filter results shown first"})]})}),e.jsxs("div",{className:"flex items-center justify-center space-x-1 text-xs opacity-75",children:[e.jsxs("span",{children:[Object.values(f).reduce((o,g)=>o+g,0)," total results"]}),s&&s.trim()&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"•"}),e.jsx("span",{className:"animate-pulse",children:"Live search active"})]})]})]}),l==="all"&&e.jsx("div",{className:"space-y-16",children:P(f).map(o=>e.jsx(_,{platform:o,onVideoPlay:U,filters:u,searchQuery:s,onResultsChange:K},o))}),l!=="all"&&e.jsx(_,{platform:l,onVideoPlay:U,filters:u,searchQuery:s,onResultsChange:K})]})}),e.jsx("footer",{className:`
          text-center py-8 px-4
          ${r?"text-gray-400":"text-gray-600"}
        `,children:e.jsx("div",{className:`
            max-w-md mx-auto p-4 rounded-xl
            ${r?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
          `,children:e.jsx("p",{className:"text-sm",children:"Powered by AI Waverider • Discover the best content across platforms"})})})]}),S&&e.jsx("div",{className:`
          fixed top-4 left-1/2 transform -translate-x-1/2 z-40
          transition-all duration-500 ease-out animate-slideUp
        `,children:e.jsxs("div",{className:`
            relative max-w-2xl mx-auto p-4 rounded-2xl
            ${r?"bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/25":"bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl shadow-blue-500/20"}
            transform hover:scale-105 transition-all duration-300 ease-out
            animate-floatSearch
          `,children:[e.jsxs("div",{className:"relative group",children:[e.jsx("input",{type:"text",value:s,onChange:o=>y(o.target.value),placeholder:"Search videos...",className:`
                  w-full px-6 py-3 pl-12 pr-14 rounded-xl border
                  ${r?"bg-gray-800/80 border-gray-600/50 text-white placeholder-gray-300":"bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-400"}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  backdrop-blur-sm transition-all duration-300 ease-out
                  shadow-lg hover:shadow-xl
                `,autoFocus:!0}),e.jsx("div",{className:`
                absolute left-4 top-1/2 transform -translate-y-1/2 
                ${r?"text-blue-400":"text-blue-600"}
                transition-all duration-300
              `,children:e.jsx("svg",{className:"w-5 h-5 animate-pulse",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})}),e.jsx("button",{onClick:()=>{y(""),k(!1),window.scrollTo({top:0,behavior:"smooth"})},className:`
                  absolute right-3 top-1/2 transform -translate-y-1/2 
                  p-1.5 rounded-full transition-all duration-300 ease-out
                  hover:scale-125 hover:rotate-180 active:scale-95
                  ${r?"text-gray-400 hover:text-white hover:bg-red-600/30 hover:shadow-xl hover:shadow-red-500/40":"text-gray-500 hover:text-red-600 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/30"}
                  group
                  border border-transparent hover:border-red-500/50
                `,title:"Close search and return to top",children:e.jsx("svg",{className:"w-4 h-4 transition-transform duration-500 group-hover:rotate-90",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:`
              mt-3 flex items-center justify-center space-x-2 text-sm
              ${r?"text-blue-300":"text-blue-700"}
            `,children:[e.jsx("svg",{className:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e.jsxs("span",{className:"font-medium",children:["Searching for: ",e.jsxs("span",{className:"font-bold",children:['"',s,'"']})]}),e.jsx("div",{className:`
                w-2 h-2 rounded-full animate-pulse
                ${r?"bg-blue-400":"bg-blue-600"}
              `})]}),e.jsx("div",{className:`
              absolute inset-0 rounded-2xl transition-all duration-500
              ${r?"bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20":"bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10"}
              -z-10 blur-2xl scale-110 animate-pulse-slow
            `})]})}),C&&e.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:e.jsx("div",{className:`
            w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl
            ${r?"bg-gray-800/95 backdrop-blur-xl border border-gray-700/50":"bg-white/95 backdrop-blur-xl border border-white/50"}
            shadow-2xl
          `,children:e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("h2",{className:`text-2xl font-bold ${r?"text-white":"text-gray-900"}`,children:"Add New Video"}),e.jsx("button",{onClick:()=>v(!1),className:`
                    p-2 rounded-lg transition-colors
                    ${r?"text-gray-400 hover:text-white hover:bg-gray-700":"text-gray-600 hover:text-gray-900 hover:bg-gray-100"}
                  `,children:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("form",{onSubmit:O,className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Platform"}),e.jsxs("select",{name:"platform",value:i.platform,onChange:T,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `,children:[e.jsx("option",{value:"youtube",children:"YouTube"}),e.jsx("option",{value:"tiktok",children:"TikTok"}),e.jsx("option",{value:"instagram",children:"Instagram"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Title (Optional)"}),e.jsx("input",{type:"text",name:"title",value:i.title,onChange:T,placeholder:"Enter video title (will be auto-generated if empty)",className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700 border-gray-600 text-white placeholder-gray-400":"bg-white border-gray-300 text-gray-900 placeholder-gray-500"}
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    `})]}),e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Author Name"}),e.jsx("input",{type:"text",name:"authorName",value:i.authorName,onChange:T,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `,placeholder:"Enter author name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Username"}),e.jsx("input",{type:"text",name:"username",value:i.username,onChange:T,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `,placeholder:"Enter username"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Video URL *"}),e.jsx("input",{type:"url",name:"originalUrl",value:i.originalUrl,onChange:T,required:!0,placeholder:"https://www.youtube.com/watch?v=... or https://www.tiktok.com/... or https://www.instagram.com/...",className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700 border-gray-600 text-white placeholder-gray-400":"bg-white border-gray-300 text-gray-900 placeholder-gray-500"}
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    `})]}),e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Thumbnail URL"}),e.jsx("input",{type:"url",name:"thumbnailUrl",value:i.thumbnailUrl,onChange:T,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `,placeholder:"Enter thumbnail URL"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Views"}),e.jsx("input",{type:"number",name:"views",value:i.views,onChange:T,min:"0",className:`
                        w-full px-3 py-2 rounded-lg border
                        ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `,placeholder:"0"})]}),e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Likes"}),e.jsx("input",{type:"number",name:"likes",value:i.likes,onChange:T,min:"0",className:`
                        w-full px-3 py-2 rounded-lg border
                        ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `,placeholder:"0"})]})]}),e.jsxs("div",{className:"flex justify-end space-x-3 pt-4",children:[e.jsx("button",{type:"button",onClick:()=>v(!1),className:`
                      px-6 py-2 rounded-lg font-medium transition-colors
                      ${r?"bg-gray-700 text-gray-300 hover:bg-gray-600":"bg-gray-200 text-gray-700 hover:bg-gray-300"}
                    `,children:"Cancel"}),e.jsx("button",{type:"submit",disabled:N,className:`
                      px-6 py-2 rounded-lg font-medium transition-colors
                      ${r?"bg-blue-600 text-white hover:bg-blue-700":"bg-blue-500 text-white hover:bg-blue-600"}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `,children:N?"Adding...":"Add Video"})]})]})]})})})]})};export{fe as default};
