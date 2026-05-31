import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight, ShieldCheck, GraduationCap, Compass } from "lucide-react";
import NoticeBar from "./NoticeBar";
import { useContent } from "../context/ContentContext";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenTracking?: () => void;
}

export default function Navbar({ activeSection, onNavigate, onOpenTracking }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasOrders, setHasOrders] = useState(false);
  const { logoUrl, headerBranding, noticeConfig } = useContent();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkOrders = () => {
      try {
        const stored = localStorage.getItem("avexon_user_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasTrackable = parsed.some((o: any) => o.paymentMethod !== 'custom_pkg');
            setHasOrders(hasTrackable);
            return;
          }
        }
      } catch (e) {}
      setHasOrders(false);
    };

    checkOrders();

    window.addEventListener("storage", checkOrders);
    const interval = setInterval(checkOrders, 1000);

    return () => {
      window.removeEventListener("storage", checkOrders);
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { id: "hero", label: "হোম" },
    { id: "services", label: "আমাদের সেবা" },
    { id: "portfolio", label: "পোর্টফোলিও" },
    { id: "websites", label: "ওয়েবসাইট শপ" },
    { id: "customise", label: "প্যাকেজ রেডি করুন" },
    { id: "why-choose-us", label: "কেন এভেক্সন" },
    { id: "reviews", label: "সফল ক্লায়েন্ট" },
    { id: "team", label: "আমাদের টিম" },
    { id: "contact", label: "যোগাযোগ" },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <>
      <nav
        id="main-navbar"
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#0A0512] border-b border-purple-500/10 py-4 shadow-lg shadow-purple-500/5"
      >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
         {/* Logo with integrated floating motion, outline animations, and inner glow */}
        <motion.div
          id="navbar-logo"
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => handleItemClick("hero")}
        >
          {/* Main custom floating logo wrapper matching websites' floating buttons */}
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative flex items-center justify-center w-11 h-11 logo-neon-card rounded-xl group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 pointer-events-auto"
          >
            {/* Outline Inner Glow Container matching websites' neon button style */}
            <div className="logo-neon-inner flex items-center justify-center w-full h-full relative">
              {/* Internal HTML layer for line glow and image layout alignment */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-white/5 pointer-events-none rounded-[10px]" />
              
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px] scale-90 group-hover:scale-95 transition-all duration-350 p-0.5" 
                />
              ) : (
                <span 
                  className="font-sans font-bold text-lg bg-gradient-to-r from-purple-400 to-fuchsia-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 relative z-10"
                  style={{ fontFamily: headerBranding.fontFamily || undefined }}
                >
                  {headerBranding.brandName ? headerBranding.brandName.charAt(0) : "A"}
                </span>
              )}
            </div>
          </motion.div>
          <div>
            <div className="flex items-baseline gap-1">
              <span 
                className="text-xl font-bold font-logo tracking-tight text-white mb-[1px]"
                style={{ fontFamily: headerBranding.fontFamily || undefined }}
              >
                {headerBranding.brandName || "Avexon"}
              </span>
              {headerBranding.brandBadge && (
                <span className="text-xs bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded-md font-medium border border-purple-500/20">
                  {headerBranding.brandBadge}
                </span>
              )}
            </div>
            <p 
              className="text-purple-400/70 tracking-[0.2em] uppercase -mt-[2px] font-sans font-semibold"
              style={{ 
                fontFamily: headerBranding.subtitleFontFamily || undefined, 
                fontSize: headerBranding.subtitleFontSize || "9px" 
              }}
            >
              {headerBranding.brandSubtitle || "Premium Web Agency"}
            </p>
          </div>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 bg-purple-950/10 p-1 rounded-full border border-purple-900/40">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                id={`nav-btn-${item.id}`}
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-purple-300 z-10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/15 to-fuchsia-500/15 md:from-purple-950/50 md:to-fuchsia-950/50 border border-purple-500/20 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Controls Container */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tracking Button */}
          {hasOrders && onOpenTracking && (
            <div className="track-btn-neon">
              <button
                id="nav-track-btn"
                onClick={onOpenTracking}
                className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-purple-200 bg-[#0d041b] hover:text-white hover:bg-purple-950/40 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>অর্ডার ট্র্যাক</span>
              </button>
            </div>
          )}

          {/* Desktop CTA Button */}
          <button
            id="nav-cta-btn"
            onClick={() => handleItemClick("contact")}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-100 bg-[#160D25] hover:bg-purple-600 border border-purple-500/20 hover:border-purple-400/40 shadow-md shadow-purple-950/40 hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            <span>প্রজেক্ট আলোচনা</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </button>

          {/* Hamburger Icon */}
          <button
            id="navbar-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-purple-400 hover:bg-purple-950/30 hover:text-purple-300 border border-purple-500/10 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#0A0512]/95 backdrop-blur-lg border-b border-purple-500/15 overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-6 space-y-2 flex flex-col items-stretch max-w-md mx-auto">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    id={`mobile-nav-btn-${item.id}`}
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-950/70 to-fuchsia-950/70 text-purple-300 border border-purple-500/20"
                        : "text-slate-300 hover:bg-purple-900/20 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-purple-400 shadow-glow" />
                    )}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-purple-900/30 mt-2 space-y-2.5">
                <button
                   id="mobile-nav-cta"
                  onClick={() => handleItemClick("contact")}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-500/10 transition-all text-sm uppercase tracking-wider cursor-pointer"
                >
                  <span>আজই প্রকল্প শুরু করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow Line at bottom of Navbar (Header bar) - always visible to frame the header beautifully */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 via-fuchsia-400 via-purple-500 to-transparent shadow-[0_0_8px_rgba(168,85,247,0.95),0_0_15px_rgba(168,85,247,0.6),0_0_30px_rgba(236,72,153,0.3)] z-50 pointer-events-none" />
    </nav>

    {/* Auto Sliding Notice Bar - positioned precisely right underneath our fixed header */}
    {noticeConfig?.show && (
      <div 
        id="global-notice-bar"
        className="fixed left-0 w-full z-40 transition-all duration-300 select-none top-[72px] bg-[#0A0512]"
      >
        <NoticeBar />
        {/* Glow Line at bottom of entire header wrapper (below NoticeBar) */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 via-fuchsia-400 via-purple-500 to-transparent shadow-[0_0_8px_rgba(168,85,247,0.95),0_0_15px_rgba(168,85,247,0.6),0_0_30px_rgba(236,72,153,0.3)] z-50 pointer-events-none" />
      </div>
    )}
  </>
);
}
