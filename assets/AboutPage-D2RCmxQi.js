const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-srMkFXdj.js","assets/index-CDuOHj3I.js","assets/index-DSUr7664.css"])))=>i.map(i=>d[i]);
import{t as w,r as c,j as e,as as N,at as k,au as $,av as A,aw as I,ax as S,ay as z,az as C,L as d,V as b,G as v,ac as E}from"./index-CDuOHj3I.js";const P=()=>{const{darkMode:t}=w(),n=c.useRef(null),u=c.useRef(null),g=c.useRef(null);return c.useEffect(()=>{(async()=>{try{const a=await E(()=>import("./index-srMkFXdj.js"),__vite__mapDeps([0,1,2]));n.current=a,u.current=new a.PolySynth(a.Synth,{oscillator:{type:"fatsine"},volume:-20,envelope:{attack:.005,decay:.2,sustain:0,release:.2}}).toDestination(),g.current=new a.PolySynth(a.Synth,{volume:-12,oscillator:{type:"fmsquare",modulationType:"sawtooth",modulationIndex:.5},envelope:{attack:.01,decay:.3,sustain:.1,release:.5}}).toDestination()}catch{}})()},[]),c.useEffect(()=>{(()=>{const a=document.createElement("script");a.src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js",a.onload=()=>{window.particlesJS&&window.particlesJS("particles-js",{particles:{number:{value:80,density:{enable:!0,value_area:800}},color:{value:"#ffffff"},shape:{type:"circle",stroke:{width:0,color:"#000000"}},opacity:{value:.5,random:!0,anim:{enable:!0,speed:1,opacity_min:.1,sync:!1}},size:{value:3,random:!0,anim:{enable:!1}},line_linked:{enable:!0,distance:150,color:"#4444ff",opacity:.4,width:1},move:{enable:!0,speed:2,direction:"none",random:!1,straight:!1,out_mode:"out",bounce:!1}},interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"grab"},onclick:{enable:!1},resize:!0},modes:{grab:{distance:140,line_linked:{opacity:1}}}},retina_detect:!0})},a.onerror=()=>{},document.head.appendChild(a)})()},[]),c.useEffect(()=>{const o=document.getElementById("services-grid"),a=document.querySelectorAll(".service-card");if(!o||a.length===0)return;const m=()=>{a.forEach(s=>s.classList.remove("active")),o.classList.remove("active")},f=(s,i,r=20)=>new Promise(l=>{let x=0;s.innerHTML="",s.classList.add("typing"),s.style.display="block",s.style.opacity="1";function h(){x<i.length?(s.innerHTML+=i.charAt(x),x++,setTimeout(h,r)):(s.classList.remove("typing"),s.style.opacity="1",s.style.display="block",l())}h()}),j=async s=>{const i=s.querySelector(".card-details ul"),r=Array.from(i.querySelectorAll("li")).map(l=>l.innerText);i.innerHTML="";for(let l=0;l<r.length;l++){const x=r[l],h=document.createElement("li");i.appendChild(h),await new Promise(y=>setTimeout(y,50)),await f(h,x,10)}},p=s=>{m(),s.classList.add("active"),o.classList.add("active"),j(s)};return a.forEach(s=>{const i=s.querySelector(".card-close");s.addEventListener("mouseenter",async()=>{if(n.current&&u.current)try{n.current.context.state!=="running"&&await n.current.start(),u.current.triggerAttackRelease("C5","8n")}catch{}}),s.addEventListener("click",async r=>{if(!(s.classList.contains("active")||r.target===i)){if(n.current&&g.current)try{n.current.context.state!=="running"&&await n.current.start(),g.current.triggerAttackRelease(["C3","G3","C4"],"4n")}catch{}p(s)}}),i.addEventListener("click",r=>{r.stopPropagation(),m()})}),document.addEventListener("click",s=>{o.classList.contains("active")&&!s.target.closest(".service-card")&&m()}),()=>{a.forEach(s=>{const i=s.querySelector(".card-close");s.removeEventListener("click",p),i.removeEventListener("click",m)})}},[]),e.jsxs("div",{className:`min-h-screen ${t?"bg-gray-900 text-white":"bg-white text-gray-800"} relative`,children:[e.jsx("div",{id:"particles-js",className:"fixed inset-0 w-full h-full z-0 pointer-events-none"}),e.jsx("section",{className:`py-16 ${t?"bg-gray-800":"bg-gradient-to-r from-indigo-50 to-blue-50"} relative z-10`,children:e.jsx("div",{className:"container mx-auto px-6",children:e.jsxs("div",{className:"text-center max-w-4xl mx-auto",children:[e.jsx("h1",{className:"text-4xl md:text-5xl font-bold mb-6",children:e.jsx("span",{className:"text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400",children:"About AI Waverider"})}),e.jsx("p",{className:"text-xl md:text-2xl mb-8 leading-relaxed",children:"Building the bridge between cutting-edge AI technology and practical business applications."})]})})}),e.jsx("section",{className:`py-14 ${t?"bg-gray-900":"bg-gray-100"} relative z-10`,children:e.jsx("div",{className:"container mx-auto px-6",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("h2",{className:`text-3xl font-bold mb-8 text-center ${t?"text-teal-300":"text-teal-600"}`,children:"Our Mission"}),e.jsx("p",{className:"text-lg mb-6 leading-relaxed",children:"AI Waverider was founded with a clear mission: to democratize access to artificial intelligence technologies and help businesses and individuals harness the power of AI without requiring deep technical expertise."}),e.jsx("p",{className:"text-lg mb-6 leading-relaxed",children:"We believe that AI should be accessible to everyone, regardless of their technical background. Our platform provides the tools, resources, and guidance needed to navigate the rapidly evolving AI landscape and turn these powerful technologies into practical, profitable business solutions."})]})})}),e.jsx("section",{className:`py-14 ${t?"bg-gray-800":"bg-gray-50"} relative z-10`,children:e.jsxs("div",{className:"container mx-auto px-6",children:[e.jsx("h2",{className:`text-3xl font-bold mb-12 text-center ${t?"text-teal-300":"text-teal-600"}`,children:"Our Values"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[e.jsxs("div",{className:`p-6 rounded-lg ${t?"bg-gray-700":"bg-white"} shadow-lg`,children:[e.jsx("div",{className:`w-14 h-14 rounded-full ${t?"bg-teal-600":"bg-teal-500"} flex items-center justify-center mb-4 text-white text-2xl`,children:e.jsx(N,{})}),e.jsx("h3",{className:"text-xl font-bold mb-3",children:"Innovation"}),e.jsx("p",{children:"We constantly explore the cutting edge of AI technology to bring you the most powerful and effective solutions."})]}),e.jsxs("div",{className:`p-6 rounded-lg ${t?"bg-gray-700":"bg-white"} shadow-lg`,children:[e.jsx("div",{className:`w-14 h-14 rounded-full ${t?"bg-blue-600":"bg-blue-500"} flex items-center justify-center mb-4 text-white text-2xl`,children:e.jsx(k,{})}),e.jsx("h3",{className:"text-xl font-bold mb-3",children:"Accessibility"}),e.jsx("p",{children:"We believe in making AI understandable and usable for everyone, regardless of technical background."})]}),e.jsxs("div",{className:`p-6 rounded-lg ${t?"bg-gray-700":"bg-white"} shadow-lg`,children:[e.jsx("div",{className:`w-14 h-14 rounded-full ${t?"bg-purple-600":"bg-purple-500"} flex items-center justify-center mb-4 text-white text-2xl`,children:e.jsx($,{})}),e.jsx("h3",{className:"text-xl font-bold mb-3",children:"Practical Application"}),e.jsx("p",{children:"We focus on real-world applications that deliver measurable value and tangible business results."})]})]})]})}),e.jsx("section",{className:`py-14 ${t?"bg-gray-900":"bg-gray-100"} relative z-10`,children:e.jsxs("div",{className:"container mx-auto px-6",children:[e.jsx("h2",{className:`text-3xl font-bold mb-12 text-center ${t?"text-teal-300":"text-teal-600"}`,children:"Meet the Founder"}),e.jsx("div",{className:"max-w-3xl mx-auto",children:e.jsxs("div",{className:`rounded-lg overflow-hidden shadow-lg ${t?"bg-gray-800":"bg-white"} p-8`,children:[e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("div",{className:"w-64 h-64 mb-6 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-teal-100 p-1",children:e.jsx("img",{src:A,alt:"Sakhr Al-absi",className:"w-full h-full rounded-full object-cover"})}),e.jsx("h3",{className:"text-3xl font-bold mb-1 text-center",children:"Sakhr Al-absi"}),e.jsx("p",{className:`text-xl mb-4 ${t?"text-teal-300":"text-teal-600"}`,children:"Founder & CEO"}),e.jsxs("div",{className:"flex justify-center space-x-6 mb-6 relative z-20",style:{position:"relative",zIndex:20},children:[e.jsx("a",{href:"https://www.linkedin.com/in/sakhr-nabil-al-absi/",target:"_blank",rel:"noopener noreferrer",className:`${t?"text-gray-300 hover:text-white":"text-gray-600 hover:text-blue-600"} text-2xl transition-colors duration-200 cursor-pointer relative z-30`,onClick:()=>console.log("LinkedIn clicked"),style:{zIndex:30},children:e.jsx(I,{})}),e.jsx("a",{href:"https://github.com/sakhrNab",target:"_blank",rel:"noopener noreferrer",className:`${t?"text-gray-300 hover:text-white":"text-gray-600 hover:text-gray-900"} text-2xl transition-colors duration-200 cursor-pointer relative z-30`,onClick:()=>console.log("GitHub clicked"),style:{zIndex:30},children:e.jsx(S,{})}),e.jsx("a",{href:"https://www.tiktok.com/@ai.wave.rider",target:"_blank",rel:"noopener noreferrer",className:"text-xl hover:text-pink-600 transition-colors duration-200 cursor-pointer relative z-30",onClick:()=>console.log("TikTok clicked"),style:{zIndex:30},children:e.jsx(z,{icon:C})})]}),e.jsxs("div",{className:"flex justify-center gap-3 mb-6 flex-wrap",children:[e.jsxs(d,{to:"/media-kit",className:"inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30",children:[e.jsx(b,{className:"text-sm"}),e.jsx("span",{className:"text-sm",children:"Personal Media Kit"})]}),e.jsxs(d,{to:"/media-kit-business",className:"inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30",children:[e.jsx(b,{className:"text-sm"}),e.jsx("span",{className:"text-sm",children:"Business Media Kit"})]})]})]}),e.jsx("p",{className:"text-base leading-relaxed mb-4",children:"Sakhr is a technology entrepreneur with over 7 years of experience in software development and AI implementation. He has successfully helped dozens of businesses integrate AI solutions to optimize processes, reduce costs, and create new revenue streams."}),e.jsx("p",{className:"text-base leading-relaxed mb-4",children:"With a degree in Applied Computer Science from Germany and a background in Industrial Engineering, Sakhr brings a unique blend of technical expertise and business acumen. His international experience spans prestigious organizations including Accenture (Big 4 consulting), BMG Rights and Management, and Innocean Worldwide GmbH, where he has worked with major banks and automotive industry leaders across Germany."}),e.jsx("p",{className:"text-base leading-relaxed",children:"Fluent in Arabic, English and German, Sakhr bridges the gap between cutting-edge technology and practical business applications, making complex AI concepts accessible to everyone while delivering solutions that drive real business value."})]})})]})}),e.jsx("section",{className:`py-14 ${t?"bg-gray-800":"bg-gray-50"} relative z-10`,children:e.jsx("div",{className:"container mx-auto px-6",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("h2",{className:`text-3xl font-bold mb-8 text-center ${t?"text-teal-300":"text-teal-600"}`,children:"What We Offer"}),e.jsx("p",{className:"text-lg mb-6 leading-relaxed",children:"AI Waverider specializes in making artificial intelligence accessible and practical for businesses of all sizes. We offer comprehensive solutions across multiple domains to deliver real value to our clients."}),e.jsxs("div",{className:"relative",children:[e.jsx("style",{children:`
                .services-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                  gap: 1.5rem;
                  width: 100%;
                  max-width: 1400px;
                  margin: 0 auto;
                  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
                }
                
                .service-card {
                  background: ${t?"rgba(22, 22, 49, 0.6)":"rgba(255, 255, 255, 0.9)"};
                  border: 1px solid ${t?"rgba(128, 128, 255, 0.25)":"rgba(59, 130, 246, 0.25)"};
                  border-radius: 12px;
                  padding: 2rem;
                  cursor: pointer;
                  backdrop-filter: blur(12px);
                  -webkit-backdrop-filter: blur(12px);
                  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  overflow: hidden;
                  position: relative;
                }
                
                .service-card:hover {
                  transform: translateY(-10px) scale(1.03);
                  box-shadow: 0 0 35px 0px ${t?"hsl(240, 100%, 75%)":"hsl(220, 100%, 60%)"};
                  border-color: ${t?"hsl(240, 100%, 85%)":"hsl(220, 100%, 70%)"};
                }
                
                .service-card.active {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) scale(1);
                  width: clamp(320px, 90vw, 600px);
                  height: auto;
                  max-height: 90vh;
                  z-index: 100;
                  cursor: default;
                  overflow-y: auto;
                  animation: pulseGlow 2.5s infinite ease-in-out;
                }
                
                .services-grid.active .service-card:not(.active) {
                  opacity: 0;
                  transform: scale(0.8);
                  pointer-events: none;
                }
                
                .card-close {
                  position: absolute;
                  top: 1rem;
                  right: 1.5rem;
                  font-size: 2rem;
                  color: ${t?"#A0A0CC":"#6B7280"};
                  cursor: pointer;
                  transition: all 0.3s;
                  opacity: 0;
                  pointer-events: none;
                }
                
                .service-card.active .card-close {
                  opacity: 1;
                  pointer-events: all;
                  transition-delay: 0.5s;
                }
                
                .card-close:hover {
                  color: ${t?"#fff":"#000"};
                  transform: scale(1.2);
                }
                
                .card-details {
                  max-height: 0;
                  opacity: 0;
                  overflow: hidden;
                  transition: max-height 0.6s ease-in-out, opacity 0.6s ease-in-out 0.2s;
                }
                
                .service-card.active .card-details {
                  max-height: 1000px;
                  opacity: 1;
                  display: block;
                }
                
                .card-details ul {
                  list-style: none;
                  padding: 0;
                  margin-top: 1.5rem;
                }
                
                .card-details li {
                  margin-bottom: 0.5rem;
                  color: ${t?"#E0E0FF":"#4B5563"};
                  font-size: 0.95rem;
                }
                
                @keyframes pulseGlow {
                  0% { 
                    box-shadow: 0 0 20px -8px ${t?"hsl(240, 100%, 75%)":"hsl(220, 100%, 60%)"}; 
                    border-color: ${t?"hsl(240, 100%, 75%)":"hsl(220, 100%, 60%)"};
                  }
                  50% { 
                    box-shadow: 0 0 35px 0px ${t?"hsl(240, 100%, 75%)":"hsl(220, 100%, 60%)"}; 
                    border-color: ${t?"hsl(240, 100%, 85%)":"hsl(220, 100%, 70%)"};
                  }
                  100% { 
                    box-shadow: 0 0 20px -8px ${t?"hsl(240, 100%, 75%)":"hsl(220, 100%, 60%)"}; 
                    border-color: ${t?"hsl(240, 100%, 75%)":"hsl(220, 100%, 60%)"};
                  }
                }
                
                @keyframes blink { 
                  50% { opacity: 0; } 
                }
                
                .typing::after {
                  content: '_';
                  animation: blink 0.8s infinite;
                  font-weight: bold;
                  margin-left: 2px;
                }
              `}),e.jsxs("div",{className:"services-grid",id:"services-grid",children:[e.jsxs("div",{className:"service-card","data-service":"software",children:[e.jsx("div",{className:"card-close",children:"×"}),e.jsxs("div",{className:"card-front",children:[e.jsx("div",{className:"text-4xl mb-4",children:"⚙️"}),e.jsx("h3",{className:`text-xl font-bold mb-3 ${t?"text-white":"text-gray-800"}`,children:"Custom Software Development"}),e.jsxs("p",{className:`text-sm leading-relaxed ${t?"text-gray-300":"text-gray-600"}`,children:[e.jsx("strong",{children:"Built with Cursor AI, GitHub Copilot, and live coding sessions."}),"We deliver production-ready applications 3x faster and 50% cheaper than traditional development."]})]}),e.jsx("div",{className:"card-details",children:e.jsxs("ul",{children:[e.jsx("li",{children:"✓ 100+ successful projects"}),e.jsx("li",{children:"✓ 30-day money-back guarantee"}),e.jsx("li",{children:"✓ 24/7 support"}),e.jsx("li",{children:"✓ Agile methodology"}),e.jsx("li",{children:"✓ Scalable architectures"})]})})]}),e.jsxs("div",{className:"service-card","data-service":"saas",children:[e.jsx("div",{className:"card-close",children:"×"}),e.jsxs("div",{className:"card-front",children:[e.jsx("div",{className:"text-4xl mb-4",children:"☁️"}),e.jsx("h3",{className:`text-xl font-bold mb-3 ${t?"text-white":"text-gray-800"}`,children:"Enterprise SaaS Platforms"}),e.jsxs("p",{className:`text-sm leading-relaxed ${t?"text-gray-300":"text-gray-600"}`,children:[e.jsx("strong",{children:"React, Node.js, PostgreSQL, AWS/Azure architecture."}),"Scalable multi-tenant platforms with 99.9% uptime, delivered in 8-12 weeks."]})]}),e.jsx("div",{className:"card-details",children:e.jsxs("ul",{children:[e.jsx("li",{children:"✓ SOC 2 compliant"}),e.jsx("li",{children:"✓ Auto-scaling infrastructure"}),e.jsx("li",{children:"✓ Real-time collaboration"}),e.jsx("li",{children:"✓ Secure data handling"}),e.jsx("li",{children:"✓ Custom API integrations"})]})})]}),e.jsxs("div",{className:"service-card","data-service":"mobile",children:[e.jsx("div",{className:"card-close",children:"×"}),e.jsxs("div",{className:"card-front",children:[e.jsx("div",{className:"text-4xl mb-4",children:"📱"}),e.jsx("h3",{className:`text-xl font-bold mb-3 ${t?"text-white":"text-gray-800"}`,children:"Native Mobile Applications"}),e.jsxs("p",{className:`text-sm leading-relaxed ${t?"text-gray-300":"text-gray-600"}`,children:[e.jsx("strong",{children:"React Native, Swift, Kotlin development."}),"Production-ready iOS and Android apps with 4.8+ App Store ratings, delivered in 6-10 weeks."]})]}),e.jsx("div",{className:"card-details",children:e.jsxs("ul",{children:[e.jsx("li",{children:"✓ App Store optimization"}),e.jsx("li",{children:"✓ Push notifications"}),e.jsx("li",{children:"✓ Offline functionality"}),e.jsx("li",{children:"✓ Biometric authentication"}),e.jsx("li",{children:"✓ Smooth animations"})]})})]}),e.jsxs("div",{className:"service-card","data-service":"automation",children:[e.jsx("div",{className:"card-close",children:"×"}),e.jsxs("div",{className:"card-front",children:[e.jsx("div",{className:"text-4xl mb-4",children:"⚡️"}),e.jsx("h3",{className:`text-xl font-bold mb-3 ${t?"text-white":"text-gray-800"}`,children:"N8N Automation Workflows"}),e.jsxs("p",{className:`text-sm leading-relaxed ${t?"text-gray-300":"text-gray-600"}`,children:[e.jsx("strong",{children:"Custom N8N workflows that save 20+ hours/week."}),"Connect 200+ apps and automate complex business processes with zero coding required."]})]}),e.jsx("div",{className:"card-details",children:e.jsxs("ul",{children:[e.jsx("li",{children:"✓ 200+ app integrations"}),e.jsx("li",{children:"✓ Visual workflow builder"}),e.jsx("li",{children:"✓ Error handling & monitoring"}),e.jsx("li",{children:"✓ Scalable for high volume"}),e.jsx("li",{children:"✓ Secure credential management"})]})})]}),e.jsxs("div",{className:"service-card","data-service":"ai-tools",children:[e.jsx("div",{className:"card-close",children:"×"}),e.jsxs("div",{className:"card-front",children:[e.jsx("div",{className:"text-4xl mb-4",children:"🤖"}),e.jsx("h3",{className:`text-xl font-bold mb-3 ${t?"text-white":"text-gray-800"}`,children:"AI Tool Implementation"}),e.jsxs("p",{className:`text-sm leading-relaxed ${t?"text-gray-300":"text-gray-600"}`,children:[e.jsx("strong",{children:"Strategic AI adoption with proven ROI."}),"We've helped 50+ businesses increase productivity by 40% using ChatGPT, Claude, and custom AI solutions."]})]}),e.jsx("div",{className:"card-details",children:e.jsxs("ul",{children:[e.jsx("li",{children:"✓ Free AI audit"}),e.jsx("li",{children:"✓ ROI tracking"}),e.jsx("li",{children:"✓ Training & support"}),e.jsx("li",{children:"✓ Custom model fine-tuning"}),e.jsx("li",{children:"✓ Prompt engineering"})]})})]}),e.jsxs("div",{className:"service-card","data-service":"ai-strategy",children:[e.jsx("div",{className:"card-close",children:"×"}),e.jsxs("div",{className:"card-front",children:[e.jsx("div",{className:"text-4xl mb-4",children:"🧠"}),e.jsx("h3",{className:`text-xl font-bold mb-3 ${t?"text-white":"text-gray-800"}`,children:"AI Strategy Consulting"}),e.jsxs("p",{className:`text-sm leading-relaxed ${t?"text-gray-300":"text-gray-600"}`,children:[e.jsx("strong",{children:"End-to-end AI transformation for enterprises."}),"From strategy to implementation, we help Fortune 500 companies integrate AI across all departments."]})]}),e.jsx("div",{className:"card-details",children:e.jsxs("ul",{children:[e.jsx("li",{children:"✓ C-suite advisory"}),e.jsx("li",{children:"✓ Change management"}),e.jsx("li",{children:"✓ Performance metrics"}),e.jsx("li",{children:"✓ Technology roadmap"}),e.jsx("li",{children:"✓ Competitive analysis"})]})})]})]})]}),e.jsx("div",{className:"text-center",children:e.jsx("p",{className:"text-lg mb-6",children:"Whether you're just starting your AI journey or looking to optimize existing systems, we're here to guide you every step of the way."})})]})})}),e.jsx("section",{className:`py-14 ${t?"bg-gray-800":"bg-gray-50"} relative z-10`,children:e.jsx("div",{className:"container mx-auto px-6",children:e.jsx("div",{className:"max-w-4xl mx-auto",children:e.jsxs("div",{className:`text-center mb-8 ${t?"bg-gray-700":"bg-white"} rounded-lg p-8 shadow-lg border ${t?"border-gray-600":"border-gray-200"}`,children:[e.jsx("h2",{className:`text-2xl md:text-3xl font-bold mb-4 ${t?"text-teal-300":"text-teal-600"}`,children:"For Media & Partners"}),e.jsx("p",{className:`text-base md:text-lg mb-6 ${t?"text-gray-300":"text-gray-700"}`,children:"Access our complete media kits with channel statistics, top-performing content, engagement metrics, automation services, and sponsorship packages. Perfect for brand partnerships, media inquiries, business automation needs, and collaboration opportunities."}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3 justify-center items-center",children:[e.jsxs(d,{to:"/media-kit",className:"inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg shadow-teal-600/30",children:[e.jsx(v,{className:"text-sm"}),e.jsx("span",{children:"Personal Media Kit"})]}),e.jsxs(d,{to:"/media-kit-business",className:"inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-600/30",children:[e.jsx(v,{className:"text-sm"}),e.jsx("span",{children:"Business Media Kit"})]})]})]})})})}),e.jsx("section",{className:`py-14 ${t?"bg-gray-900":"bg-gray-100"} relative z-10`,children:e.jsx("div",{className:"container mx-auto px-6",children:e.jsxs("div",{className:"max-w-4xl mx-auto text-center",children:[e.jsx("h2",{className:`text-3xl font-bold mb-8 ${t?"text-teal-300":"text-teal-600"}`,children:"Ready to Get Started?"}),e.jsx("p",{className:"text-lg mb-8",children:"Discover how AI can transform your business. Explore our services, check out our AI tool recommendations, or get in touch to discuss your specific needs."}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 justify-center",children:[e.jsx(d,{to:"/agents",className:`inline-block px-8 py-3 bg-teal-600 hover:bg-teal-700 
                  text-white rounded-lg font-semibold transition duration-300`,children:"Browse AI Solutions"}),e.jsx(d,{to:"/contact",className:`inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 
                  text-white rounded-lg font-semibold transition duration-300`,children:"Get in Touch"})]})]})})})]})};export{P as default};
