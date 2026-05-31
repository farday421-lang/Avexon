import React from "react";
import { motion } from "motion/react";
import { useContent } from "../context/ContentContext";
import { Users2, Linkedin, Github, Compass, Users } from "lucide-react";

export default function Team() {
  const { team } = useContent();
  return (
    <section id="team" className="relative py-24 bg-transparent overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-5 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Users2 className="w-4 h-4" />
            <span>আমাদের বিশেষজ্ঞ টিম</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            যাঁদের গাইডেন্সে আপনি{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-300 bg-clip-text text-transparent">
              পথ চলবেন প্রতিদিন
            </span>
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
            লাইভ ক্লাসের প্রতিটি মডিউল এবং রিয়েল ক্লায়েন্ট প্রজেক্টগুলি আমাদের দেশের সেরা অভিজ্ঞ মেন্টর এবং প্রকৌশলীদের দিয়ে ডিরেক্টলি তদারকি করা হয়ে থাকে।
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {team.map((member, idx) => (
            <motion.div
              id={`team-card-${member.id}`}
              key={member.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-[#130725]/40 border border-purple-950/40 hover:border-purple-500/25 rounded-2xl p-6.5 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 shadow-xl shadow-black/30 hover:shadow-purple-500/5 group transition-all"
            >
              {/* Profile Image Column */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-auto rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info Column */}
              <div className="flex-grow flex flex-col justify-between text-center sm:text-left">
                <div>
                  {/* Name and Role */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition-colors leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-purple-400 text-xs font-semibold mt-1.5 uppercase tracking-wide">
                      {member.role}
                    </p>
                  </div>

                  {/* Biography */}
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-4">
                    {member.bio}
                  </p>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-5">
                    {member.skills.map((sk, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-bold text-slate-300 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-900"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social media profile connectors */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-6 pt-4 border-t border-slate-800/50">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mr-1">সংযুক্ত থাকুন:</span>
                  
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 bg-slate-950 border border-slate-900 hover:border-purple-500/20 transition-all"
                    aria-label={`${member.name} - LinkedIn Profile`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 bg-slate-950 border border-slate-900 hover:border-purple-500/20 transition-all"
                    aria-label={`${member.name} - Github Profiles`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 bg-slate-950 border border-slate-900 hover:border-purple-500/20 transition-all"
                    aria-label={`${member.name} - Company details`}
                  >
                    <Compass className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
