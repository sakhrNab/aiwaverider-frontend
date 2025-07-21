import{r as o,u,j as a,L as E,l as N,a2 as A}from"./index-DDW9AazE.js";import{b as p}from"./blur-C-hAURcX.js";import{f as C,a as g}from"./recommendationService-Cau7Eusk.js";const S=`
.recommendation-card {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.recommendation-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.recommendation-image img, 
.recommendation-image .lazy-load-image-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommendation-card:hover .recommendation-image img,
.recommendation-card:hover .recommendation-image .lazy-load-image-background {
  transform: scale(1.05);
}
`,P=({purchasedItems:l,currency:h="USD",limit:s=3})=>{const[f,x]=o.useState(!0),[v,B]=o.useState(null),{agents:i,recommendedAgents:r,isLoading:m}=u(),c=o.useMemo(()=>{if(r&&r.length>0)return r.slice(0,s);if(i&&i.length>0){const e=new Set(l.map(n=>n.category).filter(Boolean));let t=i.filter(n=>n.category&&e.has(n.category));if(t.length<s){const n=i.filter(j=>!t.some(b=>b.id===j.id)).sort(()=>.5-Math.random());t=[...t,...n.slice(0,s-t.length)]}return t.slice(0,s)}return[]},[i,r,l,s]);o.useEffect(()=>{x(m)},[m]);const w=e=>{console.log("Image error for product recommendation");const t=e.target.alt||"Product";e.target.src=`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%233498db'/%3E%3Ctext x='150' y='100' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23ffffff'%3E${encodeURIComponent(t)}%3C/text%3E%3C/svg%3E`},d=e=>{if(!e)return"";if(e.image&&e.image.url)return e.image.url;if(e.imageUrl)return e.imageUrl;const t=e.title||e.name||"Product";return`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%233498db'/%3E%3Ctext x='150' y='100' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23ffffff'%3E${encodeURIComponent(t)}%3C/text%3E%3C/svg%3E`},y=e=>e?typeof e=="object"&&e.average?g(e.average):g(e):"0.0";return f?a.jsx("div",{children:a.jsx("h1",{children:"Payment Success Recommendations"})}):v||c.length===0?null:a.jsxs("div",{className:"payment-success-recommendations",children:[a.jsx("style",{children:S}),a.jsx("h2",{children:"You Might Also Like"}),a.jsx("p",{className:"recommendation-subtitle",children:"Based on your purchase, we think you'll enjoy these products"}),a.jsx("div",{className:"recommendation-grid",children:c.map(e=>a.jsxs(E,{to:`/agents/${e.id}`,className:"recommendation-card",children:[a.jsxs("div",{className:"recommendation-image",children:[a.jsx(p.LazyLoadImage,{src:d(e),alt:e.title||e.name||"AI Agent",onError:w,effect:"blur",placeholderSrc:d(e),threshold:1e3,width:"100%",height:200,visibleByDefault:!1}),e.isBestseller&&a.jsx("span",{className:"bestseller-badge",children:"Bestseller"}),e.isNew&&a.jsx("span",{className:"new-badge",children:"New"}),!e.isBestseller&&!e.isNew&&e.category&&a.jsx("span",{className:"category-badge",children:e.category})]}),a.jsxs("div",{className:"recommendation-content",children:[a.jsx("h3",{children:typeof e.title=="string"?e.title:typeof e.name=="string"?e.name:"AI Agent"}),a.jsxs("div",{className:"recommendation-meta",children:[a.jsxs("div",{className:"recommendation-rating",children:[a.jsx(N,{className:"star-icon"}),a.jsx("span",{children:y(e.rating)})]}),a.jsx("div",{className:"recommendation-price",children:e.price===0||e.isFree?"Free":C(e.price,h)})]}),a.jsx("div",{className:"recommendation-category",children:typeof e.category=="string"?e.category:"AI Agent"}),a.jsxs("div",{className:"view-details",children:["View Details ",a.jsx(A,{size:12})]})]})]},e.id))})]})};export{P};
