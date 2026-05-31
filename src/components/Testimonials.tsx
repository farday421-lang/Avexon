import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../context/ContentContext";
import { Star, MessageSquareCode, Quote } from "lucide-react";
import ScrollBlurReveal from "./ScrollBlurReveal";

export default function Testimonials() {
  const { testimonials } = useContent();
  const [activeTab, setActiveTab] = useState<"all" | "readymade" | "custom">("all");

  const filteredReviews = activeTab === "all"
    ? testimonials
    : testimonials.filter(item => item.type === activeTab);

  return (
    <section id="reviews" className="relative py-24 bg-transparent overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <MessageSquareCode className="w-4 h-4" />
              <span>সফলতার গল্প ও পর্যালোচনা</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white animate-fade-in">
              আমাদের সফলতার হিরো ও{" "}
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-300 bg-clip-text text-transparent">
                ক্লায়েন্ট ফিডব্যাক
              </span>
            </h2>
            
            <ScrollBlurReveal
              text="শুধুমাত্র আমাদের কথার ওপর বিশ্বাস করতে হবে না, দেখুন আমাদের প্রিমিয়াম কাস্টম ও রেডিমেড ওয়েবসাইট ক্রেতারা আমাদের সেবা সম্পর্কে কী ডাইরেক্ট মতামত প্রদান করেছেন।"
              className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed"
              as="p"
              delay={0.12}
              stagger={0.035}
            />
          </div>

          {/* Tab Selector Filtering */}
          <div className="flex gap-1.5 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80 shrink-0">
            <button
              id="review-tab-all"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              সব পর্যালোচনা
            </button>
            <button
              id="review-tab-readymade"
              onClick={() => setActiveTab("readymade")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "readymade"
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              রেডিমেড ওয়েবসাইট
            </button>
            <button
              id="review-tab-custom"
              onClick={() => setActiveTab("custom")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "custom"
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              কাস্টম প্রজেক্ট
            </button>
          </div>
        </div>

        {/* Reviews Grid Panels */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((rev, idx) => (
              <motion.div
                id={`review-card-${rev.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={rev.id}
                className="bg-[#130725]/40 border border-purple-950/40 hover:border-purple-500/20 rounded-2xl p-6.5 flex flex-col justify-between shadow-xl shadow-black/30 hover:shadow-purple-500/5 transition-all group relative"
              >
                {/* Visual Quote Icon behind card elements */}
                <Quote className="absolute top-6 right-6 w-12 h-12 text-purple-500/5 group-hover:text-purple-500/10 pointer-events-none transition-colors" />

                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#ffb74d] text-[#ffb74d]" />
                    ))}
                  </div>

                  {/* Feedback text */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic relative z-10">
                    "{rev.text}"
                  </p>
                </div>

                {/* Profile info footer */}
                <div className="flex items-center gap-3.5 pt-5 border-t border-slate-800/50 mt-auto">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-purple-500/20">
                    <img
                      src={rev.avatarUrl}
                      alt={rev.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{rev.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rev.role}</p>
                    
                    {/* Badge type tag overlay */}
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5 border ${
                      rev.type === "readymade"
                        ? "bg-purple-500/5 text-purple-400 border-purple-500/10"
                        : "bg-blue-500/5 text-blue-400 border-blue-500/10"
                    }`}>
                      {rev.type === "readymade" ? "রেডিমেড ওয়েবসাইট" : "কাস্টম প্রজেক্ট"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Fallback */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12 max-w-xs mx-auto bg-[#0B1521] border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">কোনো মতামত খুঁজে পাওয়া যায়নি।</p>
          </div>
        )}

      </div>
    </section>
  );
}
