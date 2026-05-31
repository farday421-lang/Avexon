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

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedWebsiteName, setSelectedWebsiteName] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPreselect, setCheckoutPreselect] = useState("");
  const [checkoutType, setCheckoutType] = useState<'readymade' | 'custom'>('readymade');
  const [checkoutInitialMode, setCheckoutInitialMode] = useState<'checkout' | 'tracking'>('checkout');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Detect standalone layout mode (PWA installed launch)
  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        window.location.search.includes("mode=standalone");
      setIsStandalone(standalone);
    };
    checkStandalone();
  }, []);

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
