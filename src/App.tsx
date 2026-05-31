import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Websites from "./components/Websites";
import CustomisePackages from "./components/CustomisePackages";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingNav from "./components/FloatingNav";
import CheckoutModal from "./components/CheckoutModal";
import AdminPanel from "./components/AdminPanel";
import { useContent } from "./context/ContentContext";

export default function App() {
  const { isLoading, logoUrl } = useContent();
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedWebsiteName, setSelectedWebsiteName] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPreselect, setCheckoutPreselect] = useState("");
  const [checkoutType, setCheckoutType] = useState<'readymade' | 'custom'>('readymade');
  const [checkoutInitialMode, setCheckoutInitialMode] = useState<'checkout' | 'tracking'>('checkout');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        window.location.search.includes("mode=standalone")
      );
    }
    return false;
  });

  const handleOpenCheckout = (websiteTitle: string = "", type: 'readymade' | 'custom' = 'readymade') => {
    setCheckoutPreselect(websiteTitle);
    setCheckoutType(type);
    setCheckoutInitialMode('checkout');
    setIsCheckoutOpen(true);
  };

  const handleOpenTracking = () => {
    setCheckoutPreselect("");
    setCheckoutInitialMode('tracking');
    setIsCheckoutOpen(true);
  };

  // Update active section highlight based on scrolled view position
  useEffect(() => {
    if (isStandalone) return;
    const sections = ["hero", "services", "portfolio", "websites", "customise", "why-choose-us", "reviews", "team", "contact"];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200; // Trigger threshold offset
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isStandalone]);

  // Soft scroll to selected component block
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Directly prefill the website model selector and pop up order modal
  const handleOrderClick = (websiteTitle: string, type: 'readymade' | 'custom' = 'readymade') => {
    setSelectedWebsiteName(websiteTitle);
    handleOpenCheckout(websiteTitle, type);
  };

  // 0. Premium cosmic loading screen while content boots up from SQLite server backend
  if (isLoading) {
    return (
      <div className="bg-[#0A0512] min-h-screen font-sans text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Premium background ambient gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_60%)] animate-pulse pointer-events-none" />
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none" />

        <div className="relative flex flex-col items-center z-10">
          {/* Pulsing neon orb ring around logo */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping duration-1000 opacity-25" />
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-purple-500/40 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/10 to-pink-500/10 blur-xl animate-pulse" />
            
            {/* Glowing website brand custom database-driven logo */}
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Avexon Logo" 
                className="w-24 h-24 rounded-full object-cover border border-purple-500/40 shadow-[0_0_25px_rgba(147,51,234,0.3)] select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-900 via-slate-900 to-pink-950 flex items-center justify-center border border-purple-500/30 shadow-[0_0_25px_rgba(147,51,234,0.3)]">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">AV</span>
              </div>
            )}
          </div>

          {/* Brand title */}
          <h2 className="mt-8 text-2xl font-semibold tracking-[0.25em] bg-gradient-to-r from-purple-200 via-slate-100 to-pink-200 bg-clip-text text-transparent animate-pulse">
            AVEXON
          </h2>
          
          {/* Status tagline */}
          <div className="mt-4 flex items-center space-x-2 text-xs font-mono text-purple-400/80 bg-purple-950/20 px-4 py-2 rounded-full border border-purple-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>CONNECTING TO CORE PLATFORM SYSTEM...</span>
          </div>
        </div>
      </div>
    );
  }

  // If launched as a standalone PWA application on home screen, render full screen directly
  if (isStandalone) {
    return (
      <div className="bg-gradient-to-b from-[#0A0512] via-[#040108] to-[#010003] text-slate-100 min-h-screen font-sans selection:bg-purple-500/20 selection:text-purple-400 overflow-x-hidden">
        <AdminPanel
          isOpen={true}
          isStandalonePWA={true}
          onClose={() => {}}
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-b from-[#0A0512] via-[#040108] to-[#010003] text-slate-100 min-h-screen font-sans selection:bg-purple-500/20 selection:text-purple-400 overflow-x-hidden"
    >
      
      {/* 1. Transparent Floating Navigation Bar */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={scrollToSection} 
        onOpenTracking={handleOpenTracking}
      />

      {/* 2. Target Landing components sequentially */}
      <main>
        {/* Hero Section */}
        <Hero onNavigate={scrollToSection} />

        {/* Services Showcase */}
        <Services onContactRequest={() => scrollToSection("contact")} />

        {/* Real Projects Portfolio */}
        <Portfolio onOrderRequest={handleOrderClick} />

        {/* Ready-made & Custom Websites Catalog */}
        <Websites onOrderRequest={handleOrderClick} />

        {/* Dynamic Custom Packages Section */}
        <CustomisePackages onOrderRequest={(title) => handleOrderClick(title, 'custom')} />

        {/* Why Choose Avexon Section */}
        <WhyChooseUs />

        {/* Experience Reviews */}
        <Testimonials />

        {/* Professional Mentorship Team */}
        <Team />

        {/* Counseling & Inquiries Contact panel */}
        <Contact initialSelectedWebsite={selectedWebsiteName} />
      </main>

      {/* Floating interactive navigation system */}
      <FloatingNav 
        activeSection={activeSection} 
        onNavigate={scrollToSection} 
      />

      {/* 3. Fully comprehensive Sitemap Footer (Admin triggers require appending '?admin=true' suffix to secure url) */}
      <Footer onNavigate={scrollToSection} onAdminClick={window.location.search.includes("admin=true") ? () => setIsAdminOpen(true) : undefined} />

      {/* 4. Complete Step-by-Step Checkout & Tracking System */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal 
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            preselectedWebsiteTitle={checkoutPreselect}
            checkoutType={checkoutType}
            initialMode={checkoutInitialMode}
          />
        )}
      </AnimatePresence>

      {/* 5. Secure & Hidden Super Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </motion.div>
  );
}
