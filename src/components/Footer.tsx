import React from "react";
import { Facebook, Twitter, Github, Linkedin, ShieldCheck } from "lucide-react";
import { useContent } from "../context/ContentContext";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onAdminClick?: () => void;
}

export default function Footer({ onNavigate, onAdminClick }: FooterProps) {
  const { contactConfig, hero } = useContent();
  const handleItemClick = (id: string) => {
    onNavigate(id);
  };

  return (
    <footer id="main-footer" className="bg-[#050B12] border-t border-slate-900 pt-16 pb-8 text-left relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-900/80">
          
          {/* Logo & Intro column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleItemClick("hero")}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-fuchsia-400 p-[1.5px]">
                <div className="w-full h-full bg-[#050B12] rounded-[7px] flex items-center justify-center">
                  <span className="font-sans font-black text-sm text-purple-400">
                    A
                  </span>
                </div>
              </div>
              <div>
                <span className="text-lg font-bold font-sans tracking-tight text-white">
                  Avexon{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-fuchsia-300 bg-clip-text text-transparent">
                    Studio
                  </span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              আমরা আপনার ব্যবসায়িক দৃষ্টিভঙ্গিকে আকর্ষণীয় ডিজাইনে রূপান্তর করার পাশাপাশি আপনার ব্যবসার জন্য প্রিমিয়াম ও গতিশীল কাস্টম ও রেডিমেড ওয়েবসাইট সার্ভিস প্রদানে প্রতিশ্রুতিবদ্ধ।
            </p>

            {/* Social media handles */}
            <div className="flex items-center gap-2.5 pt-2">
              <a 
                href={contactConfig.facebookUrl || "https://facebook.com"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-xl text-slate-400 hover:text-purple-400 bg-slate-900 hover:bg-slate-950 border border-slate-900/60 transition-colors"
                aria-label="Facebook link"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={contactConfig.linkedinUrl || "https://linkedin.com"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-xl text-slate-400 hover:text-purple-400 bg-slate-900 hover:bg-slate-950 border border-slate-900/60 transition-colors"
                aria-label="LinkedIn link"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={contactConfig.twitterUrl || "https://twitter.com"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-xl text-slate-400 hover:text-purple-400 bg-slate-900 hover:bg-slate-950 border border-slate-900/60 transition-colors"
                aria-label="Twitter link"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={contactConfig.githubUrl || "https://github.com"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-xl text-slate-400 hover:text-purple-400 bg-slate-900 hover:bg-slate-950 border border-slate-900/60 transition-colors"
                aria-label="Github link"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Sitemap Navigation column */}
          <div className="lg:col-span-3 lg:pl-10 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              সাইট ম্যাপ
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { id: "hero", label: "হোম" },
                { id: "services", label: "আমাদের সেবা" },
                { id: "portfolio", label: "আমাদের প্রজেক্টস" },
                { id: "websites", label: "ওয়েবসাইট শপ" },
                { id: "why-choose-us", label: "কেন এভেক্সন" },
                { id: "team", label: "আমাদের টিম" }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className="text-slate-400 hover:text-purple-400 hover:translate-x-1.5 transition-all text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialities Services column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              স্পেশাল সার্ভিসেস
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                "টেইলার্ড ইউজার ইন্টারফেস ডিজাইন",
                "MERN স্ট্যাক ওয়েব ডেভেলপমেন্ট",
                "প্রিমিয়াম ই-কমার্স ওয়েবসাইট",
                "ব্র্যান্ড আইডেন্টিটি প্যাকেজ",
                "লাইফটাইম সার্ভার মেইনটেইন্যান্স"
              ].map((val, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleItemClick("services")}
                    className="text-slate-400 hover:text-slate-200 transition-colors text-left"
                  >
                    {val}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms & Badges summary */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              নিরাপত্তা নিশ্চয়তা
            </h4>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3.5">
              <div className="flex items-center gap-2 text-purple-400">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span className="text-[11px] font-bold tracking-wide">১০০% ভেরিফাইড কোড</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                আমাদের ডেলিভারিকৃত প্রতিটি ওয়েবসাইট ম্যালওয়্যার-মুক্ত, হাইপার-সিকিউর এবং লেটেস্ট কোডিং স্ট্যান্ডার্ড মেনে ডেভেলপ করা।
              </p>
            </div>
          </div>

        </div>

        {/* Legal copyrights block */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500">
          <div>
            <p className="font-sans">
              © {new Date().getFullYear()} Avexon Studio. সর্বস্বত্ব সংরক্ষিত।
            </p>
            <p className="text-[10px] mt-1">
              উнят অভিজ্ঞতার জন্য ঢাকার কারওয়ান বাজারস্থ হেডকোয়ার্টার থেকে নিয়ন্ত্রিত।
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#hero" className="hover:text-purple-400 transition-colors">শর্তাবলী</a>
            <span className="text-slate-800">|</span>
            <a href="#hero" className="hover:text-purple-400 transition-colors">পলিসি নিয়মাবলি</a>
            <span className="text-slate-800">|</span>
            <a href="#hero" className="hover:text-purple-400 transition-colors">কুকিস কনফিগার</a>
            {onAdminClick && (
              <>
                <span className="text-slate-800">|</span>
                <button
                  onClick={onAdminClick}
                  className="hover:text-purple-400 opacity-45 hover:opacity-100 transition-all font-semibold cursor-pointer"
                >
                  🔐 এডমিন প্যানেল
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
