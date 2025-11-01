import{s as ae,r as s,t as W,j as e,n as oe,A as Z,b8 as O,y as B}from"./index-CDuOHj3I.js";import{V as J}from"./videosService-BnAcYhNJ.js";const le=r=>{const o=ae();s.useEffect(()=>{const n=`${r} | AIWaverider`;document.title=n;const C=window.history.state;C&&window.history.replaceState({...C,title:n},n,o.pathname+o.search+o.hash)},[r,o])},ne=(r,o=1)=>{const[l,n]=s.useState([]),[C,v]=s.useState(!1),[g,$]=s.useState(null),[t,y]=s.useState(o),[u,b]=s.useState(0),[P,j]=s.useState(0),[d,w]=s.useState(!1),[p,E]=s.useState(!1),i=s.useRef(new Map),V=s.useRef(!0),N=s.useCallback(async x=>{if(!r||typeof r!="string"||r.trim()===""){n([]),v(!1),$(null);return}const c=`${r}-${x}`;if(i.current.has(c)){const m=i.current.get(c);n(m.videos),b(m.totalPages),j(m.totalVideos),w(m.hasNextPage),E(m.hasPreviousPage),y(x);return}v(!0),$(null);try{const m=await J.getVideosByPlatform(r,x),M={videos:m.videos||[],totalPages:m.totalPages||0,totalVideos:m.totalVideos||0,hasNextPage:m.hasNextPage||!1,hasPreviousPage:m.hasPreviousPage||!1};i.current.set(c,M),n(M.videos),b(M.totalPages),j(M.totalVideos),w(M.hasNextPage),E(M.hasPreviousPage),y(x)}catch(m){$(m.message),console.error(`Error fetching ${r} videos:`,m),n([]),b(0),j(0),w(!1),E(!1)}finally{v(!1)}},[r]),f=s.useCallback(()=>{if(d){const x=t+1;N(x)}},[t,d,N]),S=s.useCallback(()=>{if(p){const x=t-1;N(x)}},[t,p,N]),L=s.useCallback(x=>{x>=1&&x<=u&&N(x)},[u,N]),T=s.useCallback(()=>{if(!r)return;const x=`${r}-${t}`;i.current.delete(x),N(t)},[r,t,N]),z=s.useCallback(()=>{i.current.clear()},[]);return s.useEffect(()=>{r&&typeof r=="string"&&r.trim()!==""&&V.current&&(V.current=!1,N(o))},[r,o,N]),s.useEffect(()=>{r&&typeof r=="string"&&r.trim()!==""?(y(1),V.current=!0,$(null)):(n([]),v(!1),$(null),b(0),j(0),w(!1),E(!1),y(1))},[r]),{videos:l,loading:C,error:g,currentPage:t,totalPages:u,totalVideos:P,hasNextPage:d,hasPreviousPage:p,nextPage:f,previousPage:S,goToPage:L,refresh:T,clearCache:z,isEmpty:l.length===0&&!C,isFirstPage:t===1,isLastPage:t===u}},ie=(r={})=>{const[o,l]=s.useState(!1),[n,C]=s.useState(!1),v=s.useRef(null),g=s.useRef(null),{threshold:$=.1,rootMargin:t="50px",triggerOnce:y=!0,enabled:u=!0}=r,b=s.useCallback(()=>{!u||!v.current||(g.current=new IntersectionObserver(P=>{const[j]=P,d=j.isIntersecting;l(d),d&&!n&&(C(!0),y&&g.current&&g.current.unobserve(v.current))},{threshold:$,rootMargin:t}),g.current.observe(v.current))},[$,t,y,u,n]);return s.useEffect(()=>(b(),()=>{g.current&&g.current.disconnect()}),[b]),s.useEffect(()=>{!u&&g.current?(g.current.disconnect(),l(!1),y&&C(!1)):u&&!g.current&&b()},[u,b,y]),{targetRef:v,isIntersecting:o,hasIntersected:n,shouldLoad:u&&(y?n:o)}},de=(r,o={})=>{const[l,n]=s.useState(null),[C,v]=s.useState(!1),[g,$]=s.useState(!1),{targetRef:t,shouldLoad:y}=ie(o);return s.useEffect(()=>{if(!y||!r||l)return;v(!0),$(!1);const u=new Image;return u.onload=()=>{n(r),v(!1)},u.onerror=()=>{$(!0),v(!1)},u.src=r,()=>{u.onload=null,u.onerror=null}},[y,r,l]),{targetRef:t,imageSrc:l,imageLoading:C,imageError:g,shouldLoad:y}};function ce({title:r,titleId:o,...l},n){return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":o},l),r?s.createElement("title",{id:o},r):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"}))}const ue=s.forwardRef(ce),_={youtube:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-full h-full",fill:"currentColor",children:e.jsx("path",{d:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"})}),tiktok:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-full h-full",fill:"currentColor",children:e.jsx("path",{d:"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"})}),instagram:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-full h-full",fill:"currentColor",children:e.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"})})},me=r=>{if(!r||typeof r!="string")return null;const o=/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,l=r.match(o);return l?l[1]:null},xe=r=>{if(!r||typeof r!="string")return null;const o=/tiktok\.com\/.*\/video\/(\d+)/,l=r.match(o);return l?l[1]:null},he=r=>{if(!r||typeof r!="string")return null;const o=/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/,l=r.match(o);return l?l[1]:null},X=({video:r,onPlay:o,className:l=""})=>{const{darkMode:n}=W(),{targetRef:C,imageSrc:v,imageLoading:g,imageError:$}=de(r.thumbnailUrl,{threshold:.1,rootMargin:"100px"}),[t,y]=s.useState(r.platform.toLowerCase()==="instagram"),[u,b]=s.useState(!1);s.useCallback(()=>{y(!0),b(!1)},[]);const P=s.useCallback(()=>{b(!0)},[]),j=()=>{if(!t||u)return null;const{platform:f,originalUrl:S}=r;if(!S||typeof S!="string")return b(!0),null;switch(f.toLowerCase()){case"youtube":{const L=me(S);return L?e.jsx("div",{className:"aspect-video w-full",children:e.jsx("iframe",{src:`https://www.youtube.com/embed/${L}?autoplay=1&rel=0`,title:r.title,frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,className:"w-full h-full rounded-lg",onError:P})}):(b(!0),null)}case"tiktok":{const L=xe(S);return L?e.jsx("div",{className:"aspect-[9/16] w-full max-w-lg mx-auto",children:e.jsx("iframe",{src:`https://www.tiktok.com/embed/v2/${L}?autoplay=1`,title:r.title,frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,className:"w-full h-full rounded-lg",onError:P,style:{minHeight:"700px"}})}):(b(!0),null)}case"instagram":{const L=he(S);if(!L)return b(!0),null;const T=S.includes("/reel/"),z=T?"aspect-[9/16]":"aspect-square",x=T?"max-w-md":"max-w-lg";return e.jsxs("div",{className:`${z} ${x} mx-auto w-full relative`,children:[e.jsx("iframe",{src:`https://www.instagram.com/p/${L}/embed/`,title:r.title,frameBorder:"0",scrolling:"no",allowtransparency:"true",allow:"encrypted-media",className:"w-full h-full rounded-lg border-0",onError:P,style:{minHeight:T?"700px":"600px"}}),e.jsxs("div",{className:`
              absolute bottom-4 left-4 right-4 z-20 p-3 rounded-lg text-sm
              ${n?"bg-gray-900/90 text-white":"bg-white/90 text-gray-900"}
              backdrop-blur-sm border
              ${n?"border-gray-700/50":"border-white/50"}
              flex items-center justify-between
            `,children:[e.jsx("span",{children:"To like, comment, or share"}),e.jsx("button",{onClick:V,className:`
                  px-3 py-1 rounded-md text-xs font-medium
                  ${n?"bg-purple-600 hover:bg-purple-700":"bg-purple-500 hover:bg-purple-600"}
                  text-white transition-colors
                `,children:"Open Instagram"})]})]})}default:return b(!0),null}},w=(f=>{switch(f){case"youtube":return{accent:"from-red-500/20 to-red-600/20",icon:_.youtube,color:"text-red-500"};case"tiktok":return{accent:"from-pink-500/20 to-purple-600/20",icon:_.tiktok,color:"text-pink-500"};case"instagram":return{accent:"from-purple-500/20 to-pink-600/20",icon:_.instagram,color:"text-purple-500"};default:return{accent:"from-blue-500/20 to-cyan-600/20",icon:e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M8 5v14l11-7z"})}),color:"text-blue-500"}}})(r.platform),p=f=>f>=1e6?`${(f/1e6).toFixed(1)}M`:f>=1e3?`${(f/1e3).toFixed(1)}K`:f?.toString()||"0",E=f=>{try{return new Date(f).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}catch{return"Unknown"}},i=f=>{if(r.platform.toLowerCase()!=="instagram"){if(!t&&!u){y(!0),b(!1);return}o?o(r):window.open(r.originalUrl,"_blank","noopener,noreferrer")}},V=f=>{f.stopPropagation(),window.open(r.originalUrl,"_blank","noopener,noreferrer")},N=r.platform.toLowerCase()==="instagram";return e.jsxs("div",{ref:C,className:`
        group relative overflow-hidden rounded-2xl
        ${N?"":"cursor-pointer"}
        transform transition-all duration-300 ease-out
        ${N?"":"hover:scale-105 hover:-translate-y-2"}
        ${n?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
        shadow-lg hover:shadow-2xl
        ${l}
      `,onClick:N?void 0:i,children:[!t&&e.jsxs("div",{className:`
          absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded-md text-xs font-medium
          ${n?"bg-gray-900/90":"bg-white/90"}
          backdrop-blur-sm border
          ${n?"border-gray-700/50":"border-white/50"}
          ${w.color}
          flex items-center space-x-1
        `,children:[e.jsx("span",{className:"w-3 h-3",children:w.icon}),e.jsx("span",{className:"text-xs font-medium",children:r.platform.toUpperCase()})]}),!t&&e.jsx("button",{onClick:V,className:`
            absolute top-2 right-2 z-20 p-1.5 rounded-md
            ${n?"bg-gray-900/90 hover:bg-gray-800":"bg-white/90 hover:bg-white"}
            backdrop-blur-sm border
            ${n?"border-gray-700/50 text-gray-300":"border-white/50 text-gray-600"}
            transition-all duration-200 
            ${N?"opacity-100":"opacity-0 group-hover:opacity-100"}
          `,title:`Open on ${r.platform} to comment, like, or share`,children:e.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"})})}),t&&!u?e.jsx("div",{className:N?"":"p-4",children:j()}):e.jsx(e.Fragment,{children:e.jsxs("div",{className:"relative aspect-video overflow-hidden",children:[g&&e.jsx("div",{className:`
                w-full h-full flex items-center justify-center
                ${n?"bg-gray-800":"bg-gray-200"}
                animate-pulse
              `,children:e.jsx("div",{className:"w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50"})}),$&&e.jsxs("div",{className:`
                w-full h-full flex flex-col items-center justify-center
                ${n?"bg-gray-800 text-gray-400":"bg-gray-200 text-gray-500"}
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
                    ${n?"bg-gray-900/80":"bg-white/80"}
                    border ${n?"border-gray-700/50":"border-white/50"}
                    shadow-lg
                  `,children:e.jsx("svg",{className:`w-8 h-8 ${w.color}`,fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M8 5v14l11-7z"})})})})]})]})}),u&&e.jsxs("div",{className:"p-4 text-center",children:[e.jsxs("p",{className:`text-sm mb-3 ${n?"text-gray-400":"text-gray-600"}`,children:["Unable to embed video. Click below to watch on ",r.platform,"."]}),e.jsxs("a",{href:r.originalUrl,target:"_blank",rel:"noopener noreferrer",className:`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600
              text-white font-medium transition-transform duration-200 hover:scale-105
            `,onClick:f=>f.stopPropagation(),children:[e.jsx(ue,{className:"w-4 h-4"}),"Watch on ",r.platform]})]}),(!t||u||!N)&&e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("h3",{className:`
            font-semibold text-sm leading-tight line-clamp-2
            ${n?"text-white":"text-gray-900"}
          `,children:r.title||"Untitled Video"}),(r.authorName||r.authorUser)&&e.jsxs("div",{className:`
              flex items-center space-x-2 text-xs
              ${n?"text-gray-400":"text-gray-600"}
            `,children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"})}),e.jsx("span",{className:"truncate",children:r.authorName}),r.authorUser&&e.jsxs("span",{className:"truncate opacity-70",children:["@",r.authorUser]})]}),r.description&&e.jsx("p",{className:`text-xs line-clamp-3 ${n?"text-gray-400":"text-gray-600"}`,children:r.description}),e.jsxs("div",{className:`
            flex items-center justify-between text-xs
            ${n?"text-gray-400":"text-gray-600"}
          `,children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[r.views>0&&e.jsxs("div",{className:"flex items-center space-x-1",children:[e.jsxs("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]}),e.jsx("span",{children:p(r.views)})]}),r.likes>0&&e.jsxs("div",{className:"flex items-center space-x-1",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"})}),e.jsx("span",{children:p(r.likes)})]})]}),r.createdAt&&e.jsxs("div",{className:"flex items-center space-x-1",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})}),e.jsx("span",{children:E(r.createdAt)})]})]})]}),!N&&e.jsx("div",{className:`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none
          bg-gradient-to-r ${w.accent}
          blur-xl transform scale-110
        `})]})};X.displayName="VideoCard";const Q=s.memo(({currentPage:r,totalPages:o,hasNextPage:l,hasPreviousPage:n,onNext:C,onPrevious:v,onGoToPage:g,className:$=""})=>{const{darkMode:t}=W(),u=(()=>{const p=[],E=Math.max(2,r-2),i=Math.min(o-1,r+2);o>0&&p.push(1),E>2&&p.push("...");for(let V=E;V<=i;V++)V!==1&&V!==o&&p.push(V);return i<o-1&&p.push("..."),o>1&&p.push(o),p})(),b=`
    px-3 py-2 text-sm font-medium rounded-lg
    transition-all duration-200 ease-in-out
    backdrop-blur-sm border
    flex items-center justify-center min-w-[40px]
  `,P=`
    ${b}
    ${t?"bg-blue-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/25":"bg-blue-500/80 text-white border-blue-400/50 shadow-lg shadow-blue-500/25"}
    hover:shadow-xl hover:shadow-blue-500/30
  `,j=`
    ${b}
    ${t?"bg-gray-800/60 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white":"bg-white/60 text-gray-700 border-gray-300/50 hover:bg-white/80 hover:text-gray-900"}
    hover:shadow-md
  `,d=`
    ${b}
    ${t?"bg-gray-800/30 text-gray-600 border-gray-700/30":"bg-gray-200/30 text-gray-400 border-gray-300/30"}
    cursor-not-allowed opacity-50
  `;return o<=1?null:e.jsxs("nav",{className:`flex items-center justify-center space-x-2 ${$}`,"aria-label":"Pagination",children:[e.jsxs("button",{onClick:v,disabled:!n,className:n?j:d,"aria-label":"Previous page",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 19l-7-7 7-7"})}),e.jsx("span",{className:"ml-1 hidden sm:inline",children:"Previous"})]}),e.jsx("div",{className:"flex items-center space-x-1",children:u.map((w,p)=>e.jsx(oe.Fragment,{children:w==="..."?e.jsx("span",{className:`
                px-2 py-2 text-sm
                ${t?"text-gray-500":"text-gray-400"}
              `,children:"..."}):e.jsx("button",{onClick:()=>g(w),className:w===r?P:j,"aria-label":`Page ${w}`,"aria-current":w===r?"page":void 0,children:w})},`${w}-${p}`))}),e.jsxs("button",{onClick:C,disabled:!l,className:l?j:d,"aria-label":"Next page",children:[e.jsx("span",{className:"mr-1 hidden sm:inline",children:"Next"}),e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})})]})]})});Q.displayName="Pagination";const ee=s.memo(({videos:r,loading:o,error:l,currentPage:n,totalPages:C,totalVideos:v,hasNextPage:g,hasPreviousPage:$,onNext:t,onPrevious:y,onGoToPage:u,onRefresh:b,onVideoPlay:P,platform:j,isAdmin:d=!1,className:w=""})=>{const{darkMode:p}=W(),E=f=>{switch(f){case"tiktok":return"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";default:return"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}},i=()=>e.jsx("div",{className:E(j),children:Array.from({length:8}).map((f,S)=>e.jsxs("div",{className:`
            rounded-2xl overflow-hidden
            ${p?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
            animate-pulse
          `,children:[e.jsx("div",{className:`aspect-video ${p?"bg-gray-700":"bg-gray-300"}`}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("div",{className:`h-4 rounded ${p?"bg-gray-700":"bg-gray-300"}`}),e.jsx("div",{className:`h-3 rounded w-3/4 ${p?"bg-gray-700":"bg-gray-300"}`}),e.jsx("div",{className:`h-3 rounded w-1/2 ${p?"bg-gray-700":"bg-gray-300"}`})]})]},S))}),V=()=>e.jsxs("div",{className:`
      text-center py-12 px-6 rounded-2xl
      ${p?"bg-red-900/20 border border-red-800/30 text-red-300":"bg-red-50/80 border border-red-200/50 text-red-600"}
      backdrop-blur-sm
    `,children:[e.jsx("svg",{className:"w-12 h-12 mx-auto mb-4 opacity-50",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Failed to load videos"}),e.jsx("p",{className:"text-sm opacity-80 mb-4",children:l}),b&&d&&e.jsx("button",{onClick:b,className:`
            px-4 py-2 rounded-lg font-medium text-sm
            ${p?"bg-red-700/50 hover:bg-red-600/60 border border-red-600/50":"bg-red-100 hover:bg-red-200 border border-red-300"}
            transition-colors duration-200 backdrop-blur-sm
          `,title:"Admin: Try again",children:"Try Again"}),!d&&e.jsxs("div",{className:`
          text-xs px-3 py-2 rounded-lg inline-flex items-center space-x-2
          ${p?"bg-blue-900/20 text-blue-300 border border-blue-700/30":"bg-blue-50 text-blue-600 border border-blue-200"}
          backdrop-blur-sm
        `,children:[e.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("span",{children:"Data will refresh automatically at midnight"})]})]}),N=()=>e.jsxs("div",{className:`
      text-center py-16 px-6 rounded-2xl
      ${p?"bg-gray-800/40 border border-gray-700/30 text-gray-400":"bg-white/40 border border-white/30 text-gray-600"}
      backdrop-blur-sm
    `,children:[e.jsx("svg",{className:"w-16 h-16 mx-auto mb-4 opacity-50",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"})}),e.jsx("h3",{className:"text-xl font-semibold mb-2",children:"No videos found"}),e.jsxs("p",{className:"text-sm opacity-80",children:["No ",j," videos are available at the moment."]})]});return e.jsxs("div",{className:`space-y-6 ${w}`,children:[(v>0||o)&&e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("div",{className:`text-sm ${p?"text-gray-400":"text-gray-600"}`,children:o?e.jsx("span",{children:"Loading videos..."}):e.jsxs("span",{children:["Showing ",(n-1)*50+1," - ",Math.min(n*50,v)," of ",v," videos"]})}),e.jsxs("div",{className:"flex items-center space-x-3",children:[b&&!o&&d&&e.jsx("button",{onClick:b,className:`
                  p-2 rounded-lg transition-colors duration-200
                  ${p?"text-gray-400 hover:text-white hover:bg-gray-800/60":"text-gray-600 hover:text-gray-900 hover:bg-white/60"}
                  backdrop-blur-sm
                `,title:"Admin: Refresh videos (Auto-refresh runs daily at midnight)",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})})}),!d&&!o&&e.jsxs("div",{className:`
                text-xs px-2 py-1 rounded-lg flex items-center space-x-1
                ${p?"bg-green-900/20 text-green-300 border border-green-700/30":"bg-green-50 text-green-600 border border-green-200"}
                backdrop-blur-sm
              `,children:[e.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),e.jsx("span",{children:"Auto-sync"})]})]})]}),o?e.jsx(i,{}):l?e.jsx(V,{}):r.length===0?e.jsx(N,{}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:E(j),children:r.map(f=>e.jsx(X,{video:f,onPlay:P,className:"h-full"},f.id))}),C>1&&e.jsx("div",{className:"pt-8",children:e.jsx(Q,{currentPage:n,totalPages:C,hasNextPage:g,hasPreviousPage:$,onNext:t,onPrevious:y,onGoToPage:u})})]})]})});ee.displayName="VideoGrid";const H={youtube:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-6 h-6",fill:"currentColor",children:e.jsx("path",{d:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"})}),tiktok:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-6 h-6",fill:"currentColor",children:e.jsx("path",{d:"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"})}),instagram:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-6 h-6",fill:"currentColor",children:e.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"})})},q=s.memo(({platform:r,onVideoPlay:o,filters:l={},searchQuery:n="",onResultsChange:C,className:v=""})=>{const{darkMode:g}=W(),{user:$}=s.useContext(Z),[t,y]=s.useState(!1),{videos:u,loading:b,error:P,currentPage:j,totalPages:d,totalVideos:w,hasNextPage:p,hasPreviousPage:E,nextPage:i,previousPage:V,goToPage:N,refresh:f}=ne(r);s.useEffect(()=>{(async()=>{if(!$){y(!1);return}try{const m=(await O.collection("users").doc($.uid).get()).data();y(m?.role==="admin")}catch(c){console.error("Error checking admin status:",c),y(!1)}})()},[$]),s.useEffect(()=>{const x=()=>{const m=new Date,M=new Date(m);M.setDate(M.getDate()+1),M.setHours(0,0,0,0);const F=M.getTime()-m.getTime();return console.log(`[${r}] Auto-refresh scheduled for: ${M.toLocaleString()}`),console.log(`[${r}] Time until next refresh: ${Math.round(F/1e3/60)} minutes`),setTimeout(()=>{console.log(`[${r}] Executing automatic daily refresh at midnight`),B.info(`🔄 ${r.toUpperCase()} videos refreshed automatically`,{position:"bottom-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0}),f(),x()},F)},c=x();return()=>{c&&(clearTimeout(c),console.log(`[${r}] Auto-refresh timeout cleared`))}},[r,f]);const S=s.useMemo(()=>{if(!u||u.length===0)return u;let x=[...u];if(n&&n.trim()){const c=n.toLowerCase().trim();x=x.filter(m=>!!((m.title||"").toLowerCase().includes(c)||(m.description||"").toLowerCase().includes(c)||(m.authorName||m.author||"").toLowerCase().includes(c)||(m.authorUser||m.username||"").toLowerCase().includes(c)||(m.platform||r||"").toLowerCase().includes(c)))}if(l.author&&l.author.trim()){const c=l.author.toLowerCase().trim();x=x.filter(m=>{const M=m.authorName||m.author||"",F=m.authorUser||m.username||"";return M.toLowerCase().includes(c)||F.toLowerCase().includes(c)})}if(l.category&&l.category!=="all"&&(x=x.filter(c=>(c.category||"").toLowerCase()===l.category.toLowerCase())),l.minViews&&l.minViews.trim()){const c=parseInt(l.minViews);isNaN(c)||(x=x.filter(m=>(m.views||0)>=c))}if(l.maxViews&&l.maxViews.trim()){const c=parseInt(l.maxViews);isNaN(c)||(x=x.filter(m=>(m.views||0)<=c))}if(l.minLikes&&l.minLikes.trim()){const c=parseInt(l.minLikes);isNaN(c)||(x=x.filter(m=>(m.likes||0)>=c))}if(l.maxLikes&&l.maxLikes.trim()){const c=parseInt(l.maxLikes);isNaN(c)||(x=x.filter(m=>(m.likes||0)<=c))}return x},[u,l,n,r]),L=s.useMemo(()=>({totalVideos:S?.length||0,hasResults:S&&S.length>0}),[S]);s.useEffect(()=>{C&&typeof C=="function"&&C(r,L.totalVideos)},[r,L.totalVideos,C]);const z=(x=>{switch(x){case"youtube":return{name:"YouTube",icon:H.youtube,description:"Trending videos from YouTube creators",gradient:"from-red-500/20 via-red-600/10 to-transparent",accentColor:"text-red-500",borderColor:g?"border-red-500/20":"border-red-300/30"};case"tiktok":return{name:"TikTok",icon:H.tiktok,description:"Viral videos from TikTok",gradient:"from-pink-500/20 via-purple-600/10 to-transparent",accentColor:"text-pink-500",borderColor:g?"border-pink-500/20":"border-pink-300/30"};case"instagram":return{name:"Instagram",icon:H.instagram,description:"Popular reels and videos from Instagram",gradient:"from-purple-500/20 via-pink-600/10 to-transparent",accentColor:"text-purple-500",borderColor:g?"border-purple-500/20":"border-purple-300/30"};default:return{name:x,icon:e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M8 5v14l11-7z"})}),description:"Videos from this platform",gradient:"from-blue-500/20 via-cyan-600/10 to-transparent",accentColor:"text-blue-500",borderColor:g?"border-blue-500/20":"border-blue-300/30"}}})(r);return e.jsxs("section",{className:`space-y-6 ${v}`,children:[e.jsxs("div",{className:`
        relative overflow-hidden rounded-2xl p-6
        ${g?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
        ${z.borderColor}
      `,children:[e.jsx("div",{className:`
          absolute inset-0 bg-gradient-to-r ${z.gradient}
          opacity-50
        `}),e.jsxs("div",{className:"relative z-10",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:`
                w-12 h-12 rounded-2xl flex items-center justify-center ${z.accentColor}
                ${g?"bg-gray-900/50 backdrop-blur-sm":"bg-white/50 backdrop-blur-sm"}
                border ${g?"border-gray-700/50":"border-white/50"}
              `,children:z.icon}),e.jsxs("div",{children:[e.jsx("h2",{className:`
                  text-2xl font-bold
                  ${g?"text-white":"text-gray-900"}
                `,children:z.name}),e.jsx("p",{className:`
                  text-sm
                  ${g?"text-gray-400":"text-gray-600"}
                `,children:z.description})]})]}),e.jsx("div",{className:`
              flex items-center space-x-4 text-sm
              ${g?"text-gray-400":"text-gray-600"}
            `,children:!b&&w>0&&e.jsxs("div",{className:"text-right",children:[e.jsxs("div",{className:`font-bold text-lg ${z.accentColor}`,children:[L.totalVideos.toLocaleString(),L.totalVideos!==w&&e.jsxs("span",{className:"text-xs opacity-60",children:["/",w.toLocaleString()]})]}),e.jsxs("div",{className:"text-xs",children:[L.totalVideos===1?"video":"videos",L.totalVideos!==w&&" (filtered)"]})]})})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[t&&e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("button",{onClick:f,disabled:b,className:`
                      px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${g?"bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-white border border-gray-600/50":"bg-white/50 hover:bg-white/70 text-gray-700 hover:text-gray-900 border border-gray-300/50"}
                      backdrop-blur-sm
                      ${b?"opacity-50 cursor-not-allowed":"hover:shadow-md"}
                    `,title:"Admin: Manual refresh (Auto-refresh runs daily at midnight)",children:b?e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("div",{className:"w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"}),e.jsx("span",{children:"Loading..."})]}):e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})}),e.jsx("span",{children:"Refresh"})]})}),!1]}),!t&&e.jsxs("div",{className:`
                  text-xs px-3 py-2 rounded-lg flex items-center space-x-2
                  ${g?"bg-blue-900/20 text-blue-300 border border-blue-700/30":"bg-blue-50 text-blue-600 border border-blue-200"}
                  backdrop-blur-sm
                `,children:[e.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("span",{children:"Auto-updates daily at midnight"})]})]}),e.jsx("div",{className:"flex items-center space-x-4",children:d>1&&e.jsxs("div",{className:`
                  text-xs px-3 py-2 rounded-lg
                  ${g?"bg-gray-700/30 text-gray-400":"bg-white/30 text-gray-600"}
                  backdrop-blur-sm
                `,children:["Page ",j," of ",d]})})]}),!b&&w>0&&!L.hasResults&&e.jsxs("div",{className:`
              mt-4 p-4 rounded-lg text-center
              ${g?"bg-yellow-900/20 border border-yellow-700/50 text-yellow-300":"bg-yellow-50 border border-yellow-200 text-yellow-800"}
            `,children:[e.jsx("svg",{className:"w-8 h-8 mx-auto mb-2 opacity-60",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m6-6V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-4z"})}),e.jsx("p",{className:"text-sm font-medium",children:"No videos match your current filters"}),e.jsx("p",{className:"text-xs opacity-75 mt-1",children:"Try adjusting your filter criteria to see more results"})]})]})]}),e.jsx(ee,{videos:S,loading:b,error:P,currentPage:j,totalPages:d,totalVideos:L.totalVideos,hasNextPage:p,hasPreviousPage:E,onNext:i,onPrevious:V,onGoToPage:N,onRefresh:f,onVideoPlay:o,platform:r,isAdmin:t})]})});q.displayName="PlatformSection";const D={all:e.jsxs("svg",{viewBox:"0 0 24 24",className:"w-5 h-5",fill:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"allGradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#6366f1"}),e.jsx("stop",{offset:"100%",stopColor:"#8b5cf6"})]})}),e.jsx("path",{d:"M8 5v14l11-7z",fill:"url(#allGradient)"}),e.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"url(#allGradient)",strokeWidth:"1.5",fill:"none",opacity:"0.3"})]}),youtube:e.jsxs("svg",{viewBox:"0 0 24 24",className:"w-5 h-5",fill:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"youtubeGradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#ff0000"}),e.jsx("stop",{offset:"100%",stopColor:"#cc0000"})]})}),e.jsx("path",{d:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",fill:"url(#youtubeGradient)"})]}),tiktok:e.jsxs("svg",{viewBox:"0 0 24 24",className:"w-5 h-5",fill:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"tiktokGradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#ff0050"}),e.jsx("stop",{offset:"50%",stopColor:"#00f2ea"}),e.jsx("stop",{offset:"100%",stopColor:"#ff0050"})]})}),e.jsx("path",{d:"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",fill:"url(#tiktokGradient)"})]}),instagram:e.jsxs("svg",{viewBox:"0 0 24 24",className:"w-5 h-5",fill:"none",children:[e.jsx("defs",{children:e.jsxs("radialGradient",{id:"instagramGradient",cx:"30%",cy:"107%",children:[e.jsx("stop",{offset:"0%",stopColor:"#fdf497"}),e.jsx("stop",{offset:"5%",stopColor:"#fdf497"}),e.jsx("stop",{offset:"45%",stopColor:"#fd5949"}),e.jsx("stop",{offset:"60%",stopColor:"#d6249f"}),e.jsx("stop",{offset:"90%",stopColor:"#285AEB"})]})}),e.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",fill:"url(#instagramGradient)"})]})},pe=()=>{const{darkMode:r}=W(),{user:o}=s.useContext(Z),[l,n]=s.useState("all"),[C,v]=s.useState(!1),[g,$]=s.useState(!1),[t,y]=s.useState(""),u=s.useRef(null),b=s.useRef(null),[P,j]=s.useState(!1),[d,w]=s.useState({author:"",minViews:"",maxViews:"",minLikes:"",maxLikes:"",category:"all"}),[p,E]=s.useState({youtube:0,tiktok:0,instagram:0}),[i,V]=s.useState({platform:"youtube",title:"",authorName:"",username:"",originalUrl:"",thumbnailUrl:"",views:0,likes:0,addedBy:o?.displayName||o?.email||"Admin"}),[N,f]=s.useState(!1);le("Videos Gallery");const[S,L]=s.useState(!1),T=a=>{if(!a)return null;const h=a.toLowerCase();return h.includes("youtube.com")||h.includes("youtu.be")?"youtube":h.includes("tiktok.com")?"tiktok":h.includes("instagram.com")?"instagram":null};s.useEffect(()=>{const a=h=>{(h.ctrlKey||h.metaKey)&&h.key==="k"&&(h.preventDefault(),u.current&&(u.current.focus(),u.current.select())),h.key==="Escape"&&document.activeElement===u.current&&(y(""),u.current.blur(),j(!1))};return document.addEventListener("keydown",a),()=>document.removeEventListener("keydown",a)},[]),s.useEffect(()=>{t&&t.trim()?(j(!0),setTimeout(()=>{b.current&&b.current.scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"})},300)):j(!1)},[t]),s.useEffect(()=>{const a=()=>{if(t&&t.trim()){const h=window.pageYOffset||document.documentElement.scrollTop,k=u.current?.offsetTop||0;h<k+200?j(!1):j(!0)}};return window.addEventListener("scroll",a,{passive:!0}),()=>{window.removeEventListener("scroll",a)}},[t]),s.useEffect(()=>{(async()=>{if(!o){L(!1);return}try{const k=(await O.collection("users").doc(o.uid).get()).data();L(k?.role==="admin")}catch(h){console.error("Error checking admin status:",h),L(!1)}})()},[o]);const z=s.useCallback(a=>{window.open(a.originalUrl,"_blank","noopener,noreferrer")},[]),x=[{id:"all",label:"All Categories"},{id:"tech",label:"Tech"},{id:"entertainment",label:"Entertainment"},{id:"education",label:"Education"},{id:"music",label:"Music"},{id:"sports",label:"Sports"},{id:"news",label:"News"},{id:"lifestyle",label:"Lifestyle"},{id:"gaming",label:"Gaming"},{id:"comedy",label:"Comedy"}],c=(a,h)=>{w(k=>({...k,[a]:h}))},m=()=>{w({author:"",minViews:"",maxViews:"",minLikes:"",maxLikes:"",category:"all"})},M=()=>d.author||d.minViews||d.maxViews||d.minLikes||d.maxLikes||d.category!=="all"||t&&t.trim(),F=a=>M()?Object.entries(a).sort(([,k],[,I])=>k>0&&I===0?-1:k===0&&I>0?1:k!==I?I-k:0).map(([k])=>k):["youtube","tiktok","instagram"],R=()=>{v(!0)},U=a=>{const{name:h,value:k}=a.target;V(I=>{const A={...I,[h]:k};if(h==="originalUrl"){const G=T(k);G&&(A.platform=G)}return A})},K=async a=>{a.preventDefault(),f(!0);try{if(!i.originalUrl){B.error("Video URL is required");return}const h=/^https?:\/\/.+/;if(!h.test(i.originalUrl)){B.error("Please enter a valid URL starting with http:// or https://");return}const k={youtube:/youtube\.com\/watch\?v=|youtu\.be\//,tiktok:/tiktok\.com\//,instagram:/instagram\.com\/(p|reel)\//},I=i.platform.toLowerCase();if(k[I]&&!k[I].test(i.originalUrl)){B.error(`The URL doesn't appear to be a valid ${i.platform} URL`);return}const A={platform:i.platform.toLowerCase().trim(),originalUrl:i.originalUrl.trim(),addedBy:i.addedBy||o?.displayName||o?.email||"Admin"};if(i.title&&i.title.trim()&&(A.title=i.title.trim()),i.authorName&&i.authorName.trim()&&(A.authorName=i.authorName.trim()),i.username&&i.username.trim()&&(A.username=i.username.trim()),i.thumbnailUrl&&i.thumbnailUrl.trim()){if(!h.test(i.thumbnailUrl.trim())){B.error("Please enter a valid thumbnail URL");return}A.thumbnailUrl=i.thumbnailUrl.trim()}if(i.views&&parseInt(i.views)>0&&(A.views=parseInt(i.views)),i.likes&&parseInt(i.likes)>0&&(A.likes=parseInt(i.likes)),!A.platform||!A.originalUrl||!A.addedBy){console.error("Missing required fields:",{platform:A.platform,originalUrl:A.originalUrl,addedBy:A.addedBy}),B.error("Missing required fields. Please check the form.");return}const G=await J.addVideo(A);B.success("Video added successfully!"),v(!1),V({platform:"youtube",title:"",authorName:"",username:"",originalUrl:"",thumbnailUrl:"",views:0,likes:0,addedBy:o?.displayName||o?.email||"Admin"})}catch(h){console.error("=== Error in handleFormSubmit ==="),console.error("Error object:",h),console.error("Error message:",h.message),console.error("Error stack:",h.stack);let k="Failed to add video. Please try again.";h.message&&(h.message.includes("Authentication required")?k="Please log in as an admin to add videos.":h.message.includes("400")?k="Invalid video data. Please check all fields and try again.":h.message.includes("401")?k="You are not authorized to add videos. Admin access required.":h.message.includes("403")?k="Access denied. Admin privileges required.":h.message.includes("Network")?k="Network error. Please check your connection and try again.":k=h.message),B.error(k)}finally{f(!1)}},re=[{id:"all",label:"All Platforms",icon:D.all},{id:"youtube",label:"YouTube",icon:D.youtube},{id:"tiktok",label:"TikTok",icon:D.tiktok},{id:"instagram",label:"Instagram",icon:D.instagram}],te=a=>`
      px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
      backdrop-blur-sm border
      ${l===a?r?"bg-blue-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/25":"bg-blue-500/80 text-white border-blue-400/50 shadow-lg shadow-blue-500/25":r?"bg-gray-800/60 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white":"bg-white/60 text-gray-700 border-gray-300/50 hover:bg-white/80 hover:text-gray-900"}
      hover:shadow-md cursor-pointer
    `,se=async()=>{if(!o){B.error("Please log in first");return}try{await O.collection("users").doc(o.uid).set({email:o.email,displayName:o.displayName,role:"admin",createdAt:new Date,updatedAt:new Date},{merge:!0}),B.success("Admin role set! Please refresh the page.")}catch(a){console.error("Error setting admin role:",a),B.error("Failed to set admin role")}},Y=s.useCallback((a,h)=>{E(k=>({...k,[a]:h}))},[]);return e.jsxs("div",{className:`min-h-screen pb-16 ${r?"dark bg-[#2D1846]":"bg-gray-50"} bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70] stars-pattern`,children:[e.jsx("div",{className:"absolute inset-0 opacity-30",children:e.jsx("div",{className:`
          absolute inset-0
          ${r?"bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent)] bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent)]":"bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05),transparent)] bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.05),transparent)]"}
        `})}),e.jsxs("div",{className:"relative z-10",children:[e.jsx("header",{className:"px-4 sm:px-6 lg:px-8 pt-8 pb-6",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[o&&!S&&e.jsxs("div",{className:"mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg",children:[e.jsx("p",{className:"text-sm text-yellow-800 dark:text-yellow-200 mb-2",children:"Debug: User is not admin. Click to set admin role:"}),e.jsx("button",{onClick:se,className:"px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium",children:"Set Admin Role (Debug)"})]}),S&&e.jsx("div",{className:"flex justify-end mb-4",children:e.jsxs("button",{onClick:R,className:`
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
                text-gray-300
              `,children:"Discover trending videos from YouTube, TikTok, and Instagram all in one place"}),e.jsxs("div",{className:"max-w-2xl mx-auto mb-8",children:[e.jsxs("div",{className:"relative group",children:[e.jsx("input",{type:"text",value:t,onChange:a=>y(a.target.value),onFocus:()=>{t&&t.trim()&&j(!0)},placeholder:"Search videos by title, description, author, or platform... (Ctrl+K)",className:`
                      w-full px-6 py-4 pl-12 pr-16 rounded-2xl border
                      ${r?"bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400":"bg-white/40 border-gray-300/50 text-gray-200 placeholder-gray-800"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      backdrop-blur-sm transition-all duration-300 ease-out
                      ${t&&t.trim()?`shadow-2xl transform hover:scale-105 hover:-translate-y-1 
                           ${r?"shadow-blue-500/25 border-blue-500/50 bg-gray-800/80":"shadow-blue-500/20 border-blue-400/60 bg-white/90"}
                           ring-2 ring-blue-500/30`:"shadow-lg hover:shadow-xl hover:scale-102 hover:-translate-y-0.5"}
                      group-hover:shadow-2xl
                      ${P&&t?"opacity-70":""}
                    `,ref:u}),e.jsx("div",{className:`
                    absolute left-4 top-1/2 transform -translate-y-1/2 
                    transition-all duration-300 ease-out
                    ${t&&t.trim()?`scale-110 ${r?"text-blue-400":"text-blue-700"}`:`${r?"text-gray-400 group-hover:text-blue-400":"text-gray-600 group-hover:text-blue-700"}`}
                  `,children:e.jsx("svg",{className:"w-5 h-5 transition-transform duration-300 group-hover:rotate-12",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})}),t&&e.jsx("button",{onClick:()=>{y(""),j(!1),window.scrollTo({top:0,behavior:"smooth"})},className:`
                        absolute right-3 top-1/2 transform -translate-y-1/2 
                        p-1.5 rounded-full transition-all duration-300 ease-out
                        hover:scale-125 hover:rotate-180 active:scale-95
                        ${r?"text-gray-400 hover:text-white hover:bg-red-600/30 hover:shadow-xl hover:shadow-red-500/40":"text-gray-500 hover:text-red-600 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/30"}
                        group
                        border border-transparent hover:border-red-500/50
                      `,title:"Close search and return to top",children:e.jsx("svg",{className:"w-4 h-4 transition-transform duration-500 group-hover:rotate-90",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),!t&&e.jsxs("div",{className:`
                      absolute right-4 top-1/2 transform -translate-y-1/2 
                      hidden sm:flex items-center space-x-1 text-xs
                      ${r?"text-gray-500":"text-gray-400"}
                      transition-all duration-300 group-hover:opacity-100
                    `,children:[e.jsx("kbd",{className:`
                        px-1.5 py-0.5 rounded text-xs font-mono
                        ${r?"bg-gray-700/50 border border-gray-600/50 text-gray-300":"bg-gray-200/80 border border-gray-400/50 text-gray-700"}
                      `,children:navigator.platform.includes("Mac")?"⌘":"Ctrl"}),e.jsx("kbd",{className:`
                        px-1.5 py-0.5 rounded text-xs font-mono
                        ${r?"bg-gray-700/50 border border-gray-600/50 text-gray-300":"bg-gray-200/80 border border-gray-400/50 text-gray-700"}
                      `,children:"K"})]}),!t&&!P&&e.jsx("button",{onClick:()=>{u.current&&u.current.focus()},className:`
                        absolute right-4 top-1/2 transform -translate-y-1/2 
                        px-3 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-300 ease-out opacity-0 group-hover:opacity-100
                        hover:scale-110 active:scale-95
                        ${r?"bg-blue-600/80 text-white hover:bg-blue-500 border border-blue-500/50":"bg-blue-500/80 text-white hover:bg-blue-600 border border-blue-400/50"}
                        backdrop-blur-sm shadow-lg hover:shadow-xl
                        sm:hidden
                      `,title:"Start searching",children:"Search"}),t&&t.trim()&&e.jsx("div",{className:`
                      absolute inset-0 rounded-2xl transition-all duration-300
                      ${r?"bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10":"bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"}
                      -z-10 blur-xl scale-105 animate-pulse-slow
                    `})]}),t&&t.trim()&&e.jsx("div",{className:`
                    mt-4 text-center transition-all duration-300 animate-fadeIn
                  `,children:e.jsxs("div",{className:`
                      inline-flex items-center space-x-2 px-4 py-2 rounded-full
                      ${r?"bg-blue-900/30 text-blue-300 border border-blue-700/50":"bg-blue-50/80 text-blue-700 border border-blue-200/60"}
                      backdrop-blur-sm shadow-lg
                    `,children:[e.jsx("svg",{className:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e.jsxs("span",{className:"text-sm font-medium",children:["Searching for: ",e.jsxs("span",{className:"font-bold",children:['"',t,'"']})]}),e.jsx("div",{className:`
                        w-2 h-2 rounded-full animate-pulse
                        ${r?"bg-blue-400":"bg-blue-600"}
                      `})]})})]})]}),e.jsx("div",{className:`
              flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl
              ${r?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
              shadow-lg
            `,children:re.map(a=>e.jsxs("button",{onClick:()=>n(a.id),className:te(a.id),children:[e.jsx("span",{className:"mr-2",children:a.icon}),a.label]},a.id))}),e.jsxs("div",{className:`
              mt-6 rounded-2xl overflow-hidden transition-all duration-300
              ${r?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
              shadow-lg
            `,children:[e.jsxs("button",{onClick:()=>$(!g),className:`
                  w-full px-6 py-4 flex items-center justify-between
                  ${r?"text-white hover:bg-gray-700/50":"text-gray-900 hover:bg-gray-100/50"}
                  transition-colors duration-200
                `,children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"})}),e.jsx("span",{className:"font-medium",children:"Filters"}),M()&&e.jsx("span",{className:`
                      px-2 py-1 text-xs rounded-full
                      ${r?"bg-blue-600 text-white":"bg-blue-500 text-white"}
                    `,children:"Active"})]}),e.jsx("svg",{className:`w-5 h-5 transition-transform duration-200 ${g?"rotate-180":""}`,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]}),g&&e.jsxs("div",{className:"px-6 pb-6 space-y-6 border-t border-gray-200/20",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:`block text-sm font-medium ${r?"text-gray-300":"text-gray-700"}`,children:"Author/Creator"}),e.jsx("input",{type:"text",value:d.author,onChange:a=>c("author",a.target.value),placeholder:"Search by author name...",className:`
                          w-full px-4 py-2 rounded-lg border
                          ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                        `})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:`block text-sm font-medium ${r?"text-gray-300":"text-gray-700"}`,children:"Category"}),e.jsx("select",{value:d.category,onChange:a=>c("category",a.target.value),className:`
                          w-full px-4 py-2 rounded-lg border
                          ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white/70 border-gray-300 text-gray-900"}
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                        `,children:x.map(a=>e.jsx("option",{value:a.id,children:a.label},a.id))})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:`block text-sm font-medium ${r?"text-gray-300":"text-gray-700"}`,children:"Views Range"}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsx("input",{type:"number",value:d.minViews,onChange:a=>c("minViews",a.target.value),placeholder:"Min views",className:`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `}),e.jsx("input",{type:"number",value:d.maxViews,onChange:a=>c("maxViews",a.target.value),placeholder:"Max views",className:`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:`block text-sm font-medium ${r?"text-gray-300":"text-gray-700"}`,children:"Likes Range"}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsx("input",{type:"number",value:d.minLikes,onChange:a=>c("minLikes",a.target.value),placeholder:"Min likes",className:`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `}),e.jsx("input",{type:"number",value:d.maxLikes,onChange:a=>c("maxLikes",a.target.value),placeholder:"Max likes",className:`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${r?"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400":"bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500"}
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `})]})]}),e.jsx("div",{className:"flex items-end",children:e.jsx("button",{onClick:m,disabled:!M(),className:`
                          w-full px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                          ${M()?r?"bg-red-600/80 text-white hover:bg-red-700/80 border border-red-500/50":"bg-red-500/80 text-white hover:bg-red-600/80 border border-red-400/50":r?"bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/50":"bg-gray-200/50 text-gray-400 cursor-not-allowed border border-gray-300/50"}
                        `,children:"Clear Filters"})})]}),M()&&e.jsx("div",{className:"pt-4 border-t border-gray-200/20",children:e.jsxs("div",{className:"flex flex-wrap gap-2",children:[d.author&&e.jsxs("span",{className:`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${r?"bg-blue-600/20 text-blue-300":"bg-blue-100 text-blue-800"}
                          `,children:[e.jsxs("span",{children:["Author: ",d.author]}),e.jsx("button",{onClick:()=>c("author",""),className:"ml-1 hover:text-red-400",children:"×"})]}),d.category!=="all"&&e.jsxs("span",{className:`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${r?"bg-purple-600/20 text-purple-300":"bg-purple-100 text-purple-800"}
                          `,children:[e.jsxs("span",{children:["Category: ",x.find(a=>a.id===d.category)?.label]}),e.jsx("button",{onClick:()=>c("category","all"),className:"ml-1 hover:text-red-400",children:"×"})]}),(d.minViews||d.maxViews)&&e.jsxs("span",{className:`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${r?"bg-yellow-600/20 text-yellow-300":"bg-yellow-100 text-yellow-800"}
                          `,children:[e.jsxs("span",{children:["Views: ",d.minViews||"0"," - ",d.maxViews||"∞"]}),e.jsx("button",{onClick:()=>{c("minViews",""),c("maxViews","")},className:"ml-1 hover:text-red-400",children:"×"})]}),(d.minLikes||d.maxLikes)&&e.jsxs("span",{className:`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${r?"bg-pink-600/20 text-pink-300":"bg-pink-100 text-pink-800"}
                          `,children:[e.jsxs("span",{children:["Likes: ",d.minLikes||"0"," - ",d.maxLikes||"∞"]}),e.jsx("button",{onClick:()=>{c("minLikes",""),c("maxLikes","")},className:"ml-1 hover:text-red-400",children:"×"})]})]})})]})]})]})}),e.jsx("main",{className:"px-4 sm:px-6 lg:px-8 pb-16",ref:b,children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[M()&&e.jsxs("div",{className:`
                p-4 rounded-lg text-center text-sm transition-all duration-300 animate-fadeIn
                ${r?"bg-blue-900/20 border border-blue-700/30 text-blue-300":"bg-blue-50 border border-blue-200 text-blue-800"}
              `,children:[e.jsx("div",{className:"flex items-center justify-center space-x-2 mb-2",children:t&&t.trim()?e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-5 h-5 animate-pulse",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e.jsxs("span",{className:"font-medium",children:['Search results for "',t,'" - Platforms with matches shown first']})]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"})}),e.jsx("span",{className:"font-medium",children:"Platforms with filter results shown first"})]})}),e.jsxs("div",{className:"flex items-center justify-center space-x-1 text-xs opacity-75",children:[e.jsxs("span",{children:[Object.values(p).reduce((a,h)=>a+h,0)," total results"]}),t&&t.trim()&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"•"}),e.jsx("span",{className:"animate-pulse",children:"Live search active"})]})]})]}),l==="all"&&e.jsx("div",{className:"space-y-16",children:F(p).map(a=>e.jsx(q,{platform:a,onVideoPlay:z,filters:d,searchQuery:t,onResultsChange:Y},a))}),l!=="all"&&e.jsx(q,{platform:l,onVideoPlay:z,filters:d,searchQuery:t,onResultsChange:Y})]})}),e.jsx("footer",{className:`
          text-center py-8 px-4
          ${r?"text-gray-400":"text-gray-600"}
        `,children:e.jsx("div",{className:`
            max-w-md mx-auto p-4 rounded-xl
            ${r?"bg-gray-800/40 backdrop-blur-xl border border-gray-700/30":"bg-white/40 backdrop-blur-xl border border-white/30"}
          `,children:e.jsx("p",{className:"text-sm",children:"Powered by AI Waverider • Discover the best content across platforms"})})})]}),P&&e.jsx("div",{className:`
          fixed top-4 left-1/2 transform -translate-x-1/2 z-40
          transition-all duration-500 ease-out animate-slideUp
        `,children:e.jsxs("div",{className:`
            relative max-w-2xl mx-auto p-4 rounded-2xl
            ${r?"bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/25":"bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl shadow-blue-500/20"}
            transform hover:scale-105 transition-all duration-300 ease-out
            animate-floatSearch
          `,children:[e.jsxs("div",{className:"relative group",children:[e.jsx("input",{type:"text",value:t,onChange:a=>y(a.target.value),placeholder:"Search videos...",className:`
                  w-full px-6 py-3 pl-12 pr-14 rounded-xl border
                  ${r?"bg-gray-800/80 border-gray-600/50 text-white placeholder-gray-300":"bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-600"}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  backdrop-blur-sm transition-all duration-300 ease-out
                  shadow-lg hover:shadow-xl
                `,autoFocus:!0}),e.jsx("div",{className:`
                absolute left-4 top-1/2 transform -translate-y-1/2 
                ${r?"text-blue-400":"text-blue-700"}
                transition-all duration-300
              `,children:e.jsx("svg",{className:"w-5 h-5 animate-pulse",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})}),e.jsx("button",{onClick:()=>{y(""),j(!1),window.scrollTo({top:0,behavior:"smooth"})},className:`
                  absolute right-3 top-1/2 transform -translate-y-1/2 
                  p-1.5 rounded-full transition-all duration-300 ease-out
                  hover:scale-125 hover:rotate-180 active:scale-95
                  ${r?"text-gray-400 hover:text-white hover:bg-red-600/30 hover:shadow-xl hover:shadow-red-500/40":"text-gray-500 hover:text-red-600 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/30"}
                  group
                  border border-transparent hover:border-red-500/50
                `,title:"Close search and return to top",children:e.jsx("svg",{className:"w-4 h-4 transition-transform duration-500 group-hover:rotate-90",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:`
              mt-3 flex items-center justify-center space-x-2 text-sm
              ${r?"text-blue-300":"text-blue-700"}
            `,children:[e.jsx("svg",{className:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e.jsxs("span",{className:"font-medium",children:["Searching for: ",e.jsxs("span",{className:"font-bold",children:['"',t,'"']})]}),e.jsx("div",{className:`
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
                  `,children:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("form",{onSubmit:K,className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Platform"}),e.jsxs("select",{name:"platform",value:i.platform,onChange:U,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `,children:[e.jsx("option",{value:"youtube",children:"YouTube"}),e.jsx("option",{value:"tiktok",children:"TikTok"}),e.jsx("option",{value:"instagram",children:"Instagram"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Title (Optional)"}),e.jsx("input",{type:"text",name:"title",value:i.title,onChange:U,placeholder:"Enter video title (will be auto-generated if empty)",className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700 border-gray-600 text-white placeholder-gray-400":"bg-white border-gray-300 text-gray-900 placeholder-gray-500"}
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    `})]}),e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Author Name"}),e.jsx("input",{type:"text",name:"authorName",value:i.authorName,onChange:U,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `,placeholder:"Enter author name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Username"}),e.jsx("input",{type:"text",name:"username",value:i.username,onChange:U,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `,placeholder:"Enter username"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Video URL *"}),e.jsx("input",{type:"url",name:"originalUrl",value:i.originalUrl,onChange:U,required:!0,placeholder:"https://www.youtube.com/watch?v=... or https://www.tiktok.com/... or https://www.instagram.com/...",className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700 border-gray-600 text-white placeholder-gray-400":"bg-white border-gray-300 text-gray-900 placeholder-gray-500"}
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    `})]}),e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Thumbnail URL"}),e.jsx("input",{type:"url",name:"thumbnailUrl",value:i.thumbnailUrl,onChange:U,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `,placeholder:"Enter thumbnail URL"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Views"}),e.jsx("input",{type:"number",name:"views",value:i.views,onChange:U,min:"0",className:`
                        w-full px-3 py-2 rounded-lg border
                        ${r?"bg-gray-700/50 border-gray-600 text-white":"bg-white border-gray-300 text-gray-900"}
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `,placeholder:"0"})]}),e.jsxs("div",{children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${r?"text-gray-300":"text-gray-700"}`,children:"Likes"}),e.jsx("input",{type:"number",name:"likes",value:i.likes,onChange:U,min:"0",className:`
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
                    `,children:N?"Adding...":"Add Video"})]})]})]})})})]})};export{pe as default};
