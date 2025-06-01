// // File: YouAreYouWantStyled.jsx
// import React from 'react';
// import { motion } from 'framer-motion';
// import { useTheme } from '../../contexts/ThemeContext';
// import Xarrow from 'react-xarrows';

// const YouAreYouWantStyledCorrected = () => {
//   // --- Base Styles (Light mode = default, dark: prefix for dark mode) ---
//   const pageBg = 'bg-yellow-50/40 dark:bg-[#0D1117]';
//   const noteBg = 'bg-yellow-100 dark:bg-[#161B22]';
//   const noteBorder = 'border-yellow-300 dark:border-slate-700';
//   const noteTextColor = 'text-yellow-950 dark:text-slate-300';
//   const noteTitleColor = 'text-orange-600 dark:text-yellow-500';
//   const bulletColor = 'bg-orange-500 dark:bg-yellow-500';
//   const primaryTextColor = 'text-slate-800 dark:text-slate-200';

//   // Arrow colors in light vs. dark
//   const arrowStrokeColorLightMode = '#4B5563'; // slate-600
//   const arrowStrokeColorDarkMode = '#94A3B8';  // slate-400

//   // Base card styles
//   const noteBaseStyle    = `w-full p-6 md:p-8 rounded-xl shadow-xl relative ${noteBorder} border`;
//   const currentNoteStyle = `${noteBaseStyle} ${noteBg} ${noteTextColor}`;

//   // Section title styling
//   const sectionTitleStyle =
//     'text-2xl md:text-3xl font-semibold mb-10 md:mb-12 text-center max-w-3xl mx-auto ' +
//     'text-orange-600 dark:text-amber-400';

//   // Framer-Motion variants
//   const sectionContainerVariants = {
//     hidden:  { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.2, delayChildren: 0.1 },
//     },
//   };
//   const itemVariants = {
//     hidden:  { opacity: 0, y: 25 },
//     visible:{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 12 } },
//   };

//   const itemVariantsRight = {
//     hidden:  { opacity: 0, y: 10, rotate: 10 },
//     visible:{ opacity: 1, y: 102, rotate: 4, transition: { type: 'spring', stiffness: 90, damping: 120 }, x: 90 },
//   };
//   // const itemVariantsYouAre = {
//   //   hidden:  { opacity: 0, y: 25 },
//   //   visible:{ opacity: 1, y: 100, transition: { type: 'spring', stiffness: 90, damping: 12 } },
//   // };

//   const itemVariantsYouWant = {
//     hidden:  { opacity: 0, y: 10, rotate: 10 },
//     visible:{ opacity: 1, y: 102, rotate: 4, transition: { type: 'spring', stiffness: 90, damping: 120 }, x: 90 },
//   };



//   // Simple bullet
//   const Bullet = () => (
//     <span className={`inline-block w-2 h-2 rounded-full ${bulletColor} mr-3 mt-[6px] shrink-0`} />
//   );

//   // Get darkMode from context to choose arrow color
//   const { darkMode } = useTheme();
//   const arrowColor = darkMode ? arrowStrokeColorDarkMode : arrowStrokeColorLightMode;

//   return (
//     <section className={`py-16 md:py-20 overflow-visible ${pageBg} ${primaryTextColor}`}>
//       <div className="container mx-auto px-4">

//         {/* ─────────────────────────────────────────────────────────────
//            SECTION 1: “Fears, Self-Doubt, and Questions”
//         ───────────────────────────────────────────────────────────── */}
//         <motion.div
//           className="mb-20 md:mb-28 relative overflow-visible"
//           variants={sectionContainerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.05 }}
//         >
//           {/* ─── Title (give it an ID so Xarrow can attach to it) ─── */}
//           <motion.h2
//             id="section1-title"
//             variants={itemVariants}
//             className={sectionTitleStyle}
//           >
//             Suddenly, all those fears, self-doubt and questions creep in
//             <br className="hidden sm:inline" /> and you find yourself…
//           </motion.h2>

//           {/* ─── Cards Container (relative needed for Xarrow) ─── */}
//           <div className="mt-10 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-16 md:gap-y-0 max-w-4xl lg:max-w-5xl mx-auto relative overflow-visible">
//             {/* ─ Left Card: “Thinking…” ─ */}
//             <motion.div
//               id="thinking-card"
//               variants={itemVariants}
//               className={`${currentNoteStyle} md:transform md:rotate-[-2.5deg] z-10 md:translate-y-0`}
//             >
//               {/* Decorative mini arrow on top-left of this card */}
//               <motion.div
//                 className="absolute -top-5 -left-5 md:-top-7 md:-left-7 z-0"
//                 initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
//                 animate={{ opacity: 1, scale: 1, rotate: -10 }}
//                 transition={{ delay: 0.8, type: 'spring', stiffness: 80 }}
//               />
//               {/* ─────────── Arrow from “Title” to “Thinking…” (md+ only) ─────────── */}
//               <div className="hidden md:block">
//                 <Xarrow
//                   start="section1-title"
//                   end="thinking-card"
//                   color={arrowColor}
//                   strokeWidth={2.5}
//                   headSize={6}
//                   path="smooth"
//                   showHead={true}
//                   startAnchor="bottom"
//                   endAnchor="top"
//                 />
//               </div>
//               <h3 className={`text-xl font-semibold mb-5 relative z-10 ${noteTitleColor}`}>
//                 Thinking…
//               </h3>
//               <ul className="space-y-2.5 text-sm md:text-[15px] relative z-10">
//                 <li className="flex">
//                   <Bullet />
//                   <span>"I need to be a tech wizard to profit from AI."</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"Learning AI and setting things up will take months I don't have."</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"The AI world is overwhelming; I don't know what services to offer or which tools to use."</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"How do I find businesses willing to pay for AI help?"</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"I have no idea how to price AI services fairly and profitably."</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"I'll be all alone trying to figure this out; what if I get stuck?"</span>
//                 </li>
//               </ul>
//             </motion.div>

//             {/* ─ Right Card: “Wondering…” ─ */}
//             <motion.div
//               id="wondering-card"
//               variants={itemVariantsRight}
//               className={`${currentNoteStyle} md:transform md:rotate-[2deg] md:translate-y-3 z-10`}
//             >
//               <h3 className={`text-xl font-semibold mb-5 ${noteTitleColor}`}>Wondering…</h3>
//               <ul className="space-y-2.5 text-sm md:text-[15px]">
//                 <li className="flex">
//                   <Bullet />
//                   <span>"How can I quickly offer valuable AI solutions people will actually buy?"</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"Is there a way to monetize AI without needing deep technical skills?"</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"What if I had proven models to reach $2k–$10k/month with AI?"</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"Should I focus on one specific AI service, or try to do everything?"</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"How can I clearly show clients the ROI of AI and get them to say 'yes'?"</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>"Where can I find support and a community to guide me on this AI journey?"</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>Etc.</span>
//                 </li>
//               </ul>
//             </motion.div>

//             {/* ─────────── Arrow from “Thinking…” to “Wondering…” (md+ only) ─────────── */}
//             <div className="hidden md:block">
//               <Xarrow
//                 start="thinking-card"
//                 end="wondering-card"
//                 color={arrowColor}
//                 strokeWidth={2.5}
//                 headSize={6}
//                 path="smooth"
//                 showHead={true}
//                 startAnchor="right"
//                 endAnchor="left"
//               />
//             </div>
//           </div>
//         </motion.div>

//         {/* ─────────────────────────────────────────────────────────────
//            SECTION 2: “You Are / You Want To”
//         ───────────────────────────────────────────────────────────── */}
//         <motion.div
//           className="mt-24 md:mt-32 relative overflow-visible"
//           variants={sectionContainerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.05 }}
//         >
//           {/* ─── Cards Container (2-column on md+) ─── */}
//           <div className="mt-10 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-12 md:gap-y-0 max-w-4xl lg:max-w-5xl mx-auto relative overflow-visible">
//             {/* ─ Left Card: “You are…” (higher on md+) ─ */}
//             <motion.div
//               id="youare-card"
//               variants={itemVariants}
//               className={`${currentNoteStyle} md:transform md:rotate-[-1.5deg] flex flex-col z-10 md:translate-y-0`}
//             >
//               <h3 className={`text-xl font-semibold mb-5 ${noteTitleColor}`}>You are…</h3>
//               <ul className="space-y-2.5 text-sm md:text-[15px] mb-5">
//                 <li className="flex">
//                   <Bullet />
//                   <span>A forward-thinking creator, entrepreneur, or professional.</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>Eager to tap into new income streams and boost your expertise.</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>Seeing the massive potential of AI but need a clear starting point.</span>
//                 </li>
//               </ul>
//               <p className="text-xs md:text-sm mt-auto text-slate-600 dark:text-slate-400">
//                 You're ready to innovate and lead, not just follow. You value practical strategies over hype and want to make a real impact while growing your business.
//               </p>
//             </motion.div>

//             {/* ─ Mobile Fallback Arrow between stacked cards (<md) ─ */}
//             <div className="block md:hidden my-8 flex justify-center order-first">
//               <svg
//                 className="w-10 h-10 transform rotate-90 text-slate-600 dark:text-slate-500"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 fill="none"
//               >
//                 <path d="M5 12h14M12 5l7 7-7 7" />
//               </svg>
//             </div>

//             {/* ─ Right Card: “You want to…” (lower on md+) ─ */}
//             <motion.div
//               id="youwant-card"
//               variants={itemVariantsYouWant}
//               className={`${currentNoteStyle} md:transform md:rotate-[1.5deg] flex flex-col z-10 md:translate-y-3`}
//             >
//               <h3 className={`text-xl font-semibold mb-5 ${noteTitleColor}`}>You want to…</h3>
//               <ul className="space-y-2.5 text-sm md:text-[15px]">
//                 <li className="flex">
//                   <Bullet />
//                   <span>Confidently sell AI services, even if you're not 'techy'.</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>Implement proven AI business models that generate $2,000–$10,000+ per month.</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>Launch AI-powered offerings in days, not months.</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>Automate tasks, save time, and focus on high-value work.</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>Become a go-to AI resource in your industry.</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>Partner with experts who provide tools, training, and support.</span>
//                 </li>
//                 <li className="flex">
//                   <Bullet />
//                   <span>Ride the AI wave to achieve greater freedom and financial success.</span>
//                 </li>
//               </ul>
//             </motion.div>

//             {/* ─────────── Arrow between “You are…” and “You want to…” (md+ only) ─────────── */}
//             <div className="hidden md:block">
//               <Xarrow
//                 start="youare-card"
//                 end="youwant-card"
//                 color={arrowColor}
//                 strokeWidth={2.5}
//                 headSize={6}
//                 path="smooth"
//                 showHead={true}
//                 startAnchor="right"
//                 endAnchor="left"
//               />
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default YouAreYouWantStyled;
