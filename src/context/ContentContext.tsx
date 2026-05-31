import React, { createContext, useContext, useState, useEffect } from "react";
import { WebsiteProduct, Service, PortfolioItem, Testimonial, TeamMember, NoticeItem, NoticeConfig, OfferConfig, ContactConfig } from "../types";
import { SERVICES, WEBSITES, PORTFOLIO, TESTIMONIALS, TEAM } from "../data";

export interface HeroConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  whatsappNumber: string;
}

export interface OwnerConfig {
  name: string;
  role: string;
  title: string;
  picUrl: string;
}

export interface HeaderBrandingConfig {
  brandName: string;
  brandBadge: string;
  brandSubtitle: string;
  fontFamily: string;
  googleFontUrl: string;
  customFontUrl?: string;
  subtitleFontFamily?: string;
  subtitleCustomFontUrl?: string;
  subtitleFontSize?: string;
}

interface ContentContextType {
  hero: HeroConfig;
  owner: OwnerConfig;
  services: Service[];
  websites: WebsiteProduct[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  team: TeamMember[];
  logoUrl: string;
  headerBranding: HeaderBrandingConfig;
  noticeConfig: NoticeConfig;
  offerConfig: OfferConfig;
  contactConfig: ContactConfig;
  updateHero: (newHero: HeroConfig) => void;
  updateOwner: (newOwner: OwnerConfig) => void;
  updateServices: (newServices: Service[]) => void;
  updateWebsites: (newWebsites: WebsiteProduct[]) => void;
  updatePortfolio: (newPortfolio: PortfolioItem[]) => void;
  updateTestimonials: (newTestimonials: Testimonial[]) => void;
  updateTeam: (newTeam: TeamMember[]) => void;
  updateLogoUrl: (url: string) => void;
  updateHeaderBranding: (newBranding: HeaderBrandingConfig) => void;
  updateNoticeConfig: (newNoticeConfig: NoticeConfig) => void;
  updateOfferConfig: (newOfferConfig: OfferConfig) => void;
  updateContactConfig: (newContactConfig: ContactConfig) => void;
  resetAll: () => void;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const defaultHero: HeroConfig = {
  title: "এভেক্সন (Avexon)",
  subtitle: "আপনার ব্যবসার জন্য প্রফেশনাল ডিজাইন ও ডেভেলপমেন্ট এবং সাশ্রয়ী রেডিমেড ওয়েবসাইট সলিউশন!",
  ctaText: "আজই প্রকল্প শুরু করুন",
  whatsappNumber: "01613911528"
};

const defaultOwner: OwnerConfig = {
  name: "তাহসিন রিজন",
  role: "CEO",
  title: "প্রতিষ্ঠাতা ও লিড ডেভেলপার",
  picUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=350&h=350"
};

const defaultHeaderBranding: HeaderBrandingConfig = {
  brandName: "Avexon",
  brandBadge: "Studio",
  brandSubtitle: "Premium Web Agency",
  fontFamily: "",
  googleFontUrl: "",
  customFontUrl: "",
  subtitleFontFamily: "",
  subtitleCustomFontUrl: "",
  subtitleFontSize: "9px"
};

const defaultNotices: NoticeItem[] = [
  {
    id: "n-1",
    iconName: "Sparkles",
    text: "যেকোনো কাস্টম বা প্রি-মেড ওয়েবসাইট অর্ডারে পাচ্ছেন ফ্ল্যাট ১০% মেগা ডিসকাউন্ট!",
    badge: "সীমিত সময়ের অফার",
    highlight: "PROMO: AVEXON10"
  },
  {
    id: "n-2",
    iconName: "Flame",
    text: "আমাদের প্রিমিয়াম রেডি-মেড ওয়েবসাইটগুলো মাত্র ৩ থেকে ৫ দিনে সম্পূর্ণ প্রস্তুত ও লাইভ করা হয়।",
    badge: "দ্রুততম ডেলিভারি"
  },
  {
    id: "n-3",
    iconName: "HeartHandshake",
    text: "প্রতিটি ব্রোঞ্জ, সিলভার ও গোল্ড প্রজেক্টের সাথে পাচ্ছেন ১ বছরের ফ্রি প্রিমিয়াম মেইনটেন্যান্স সাপোর্ট।",
    badge: "লাইফটাইম সাপোর্ট"
  },
  {
    id: "n-4",
    iconName: "ShieldCheck",
    text: "bKash, Nagad এবং Rocket পেমেন্ট ভেরিফিকেশন সহ শতভাগ নিরাপদ ও স্বয়ংক্রিয় অর্ডার ম্যানেজমেন্ট!",
    badge: "সিকিউরড"
  },
  {
    id: "n-5",
    iconName: "Clock",
    text: "আপনার বাজেট ও প্রয়োজন অনুযায়ী নিজস্ব ফিচার দিয়ে ওয়েবসাইট প্যাকেজ তৈরি করতে পারেন অত্যন্ত সহজে।",
    badge: "নতুন ফিচার",
    highlight: "কাস্টমাইজেশন"
  }
];

const defaultNoticeConfig: NoticeConfig = {
  show: true,
  notices: defaultNotices
};

const defaultOfferConfig: OfferConfig = {
  show: true,
  badgeText: "আজকের বিশেষ মেগা অফার",
  urgencyText: "দ্রুত ফুরিয়ে যাচ্ছে!",
  descriptionText: "সীমিত সময়ের মেগা ফ্ল্যাশ ডিল শেষ হওয়ার পূর্বেই অর্ডার কনফার্ম করে ওয়েবসাইট ওনারশিপ বুঝে নিন।",
  timerType: "midnight",
  customTargetDate: "",
  discountActive: false,
  discountPercentage: 10
};

const defaultContact: ContactConfig = {
  officeAddress: "লেভেল ৪, রূপায়ন টাওয়ার, কারওয়ান বাজার, ঢাকা-১২১৫",
  helplineNumbers: "+৮৮০ ১৭৬৩-৪৪৫৬৯৯, +৮৮০ ১৮১২-৯৯০১১১",
  officialEmails: "support@avexon.com, info@avexon.com",
  supportHours: "শনিবার থেকে বৃহস্পতিবার, সকাল ১০:০০ টা থেকে রাত ০৮:০০ টা",
  facebookUrl: "https://facebook.com",
  twitterUrl: "https://twitter.com",
  linkedinUrl: "https://linkedin.com",
  githubUrl: "https://github.com",
  bkashNumber: "01613911528",
  nagadNumber: "01613911528"
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [hero, setHeroConfig] = useState<HeroConfig>(defaultHero);
  const [owner, setOwner] = useState<OwnerConfig>(defaultOwner);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [websites, setWebsites] = useState<WebsiteProduct[]>(WEBSITES);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(PORTFOLIO);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [team, setTeam] = useState<TeamMember[]>(TEAM);
  const [logoUrl, setLogoUrl] = useState<string>("https://www.image2url.com/r2/default/images/1780210596854-d50e17fe-f288-45b0-8d70-5a0cb736b9be.jpeg");
  const [headerBranding, setHeaderBranding] = useState<HeaderBrandingConfig>(defaultHeaderBranding);
  const [noticeConfig, setNoticeConfig] = useState<NoticeConfig>(defaultNoticeConfig);
  const [offerConfig, setOfferConfig] = useState<OfferConfig>(defaultOfferConfig);
  const [contactConfig, setContactConfig] = useState<ContactConfig>(defaultContact);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from server JSON database with localStorage as offline fallback
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch("/api/content");
        const resJson = await response.json();
        if (resJson.success && resJson.data) {
          const d = resJson.data;
          if (d.hero) setHeroConfig(d.hero);
          if (d.owner) setOwner(d.owner);
          if (d.services) setServices(d.services);
          if (d.websites) setWebsites(d.websites);
          if (d.portfolio) setPortfolio(d.portfolio);
          if (d.testimonials) setTestimonials(d.testimonials);
          if (d.team) setTeam(d.team);
          if (d.logoUrl) setLogoUrl(d.logoUrl);
          if (d.headerBranding) setHeaderBranding(d.headerBranding);
          if (d.noticeConfig) setNoticeConfig(d.noticeConfig);
          if (d.offerConfig) setOfferConfig(d.offerConfig);
          if (d.contactConfig) setContactConfig(d.contactConfig);
        } else {
          // Fallback to local storage
          const storedHero = localStorage.getItem("avx_c_hero");
          const storedOwner = localStorage.getItem("avx_c_owner");
          const storedServices = localStorage.getItem("avx_c_services");
          const storedWebsites = localStorage.getItem("avx_c_websites");
          const storedPortfolio = localStorage.getItem("avx_c_portfolio");
          const storedTestimonials = localStorage.getItem("avx_c_testimonials");
          const storedTeam = localStorage.getItem("avx_c_team");
          const storedLogo = localStorage.getItem("avx_c_logo");
          const storedBranding = localStorage.getItem("avx_c_header_branding");
          const storedNotice = localStorage.getItem("avx_c_notice");
          const storedOffer = localStorage.getItem("avx_c_offer");
          const storedContact = localStorage.getItem("avx_c_contact");

          if (storedHero) setHeroConfig(JSON.parse(storedHero));
          if (storedOwner) setOwner(JSON.parse(storedOwner));
          if (storedServices) setServices(JSON.parse(storedServices));
          if (storedWebsites) setWebsites(JSON.parse(storedWebsites));
          if (storedPortfolio) setPortfolio(JSON.parse(storedPortfolio));
          if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
          if (storedTeam) setTeam(JSON.parse(storedTeam));
          if (storedLogo) setLogoUrl(storedLogo);
          if (storedBranding) setHeaderBranding(JSON.parse(storedBranding));
          if (storedNotice) setNoticeConfig(JSON.parse(storedNotice));
          if (storedOffer) setOfferConfig(JSON.parse(storedOffer));
          if (storedContact) setContactConfig(JSON.parse(storedContact));
        }
      } catch (e) {
        console.warn("Failed to load state from server, falling back to local storage: ", e);
        try {
          const storedHero = localStorage.getItem("avx_c_hero");
          if (storedHero) setHeroConfig(JSON.parse(storedHero));
        } catch (subErr) {}
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Save changes to the server backend JSON database
  const saveStateToServer = async (updates: {
    hero?: HeroConfig;
    owner?: OwnerConfig;
    services?: Service[];
    websites?: WebsiteProduct[];
    portfolio?: PortfolioItem[];
    testimonials?: Testimonial[];
    team?: TeamMember[];
    logoUrl?: string;
    headerBranding?: HeaderBrandingConfig;
    noticeConfig?: NoticeConfig;
    offerConfig?: OfferConfig;
    contactConfig?: ContactConfig;
  }) => {
    try {
      const payload = {
        hero: updates.hero !== undefined ? updates.hero : hero,
        owner: updates.owner !== undefined ? updates.owner : owner,
        services: updates.services !== undefined ? updates.services : services,
        websites: updates.websites !== undefined ? updates.websites : websites,
        portfolio: updates.portfolio !== undefined ? updates.portfolio : portfolio,
        testimonials: updates.testimonials !== undefined ? updates.testimonials : testimonials,
        team: updates.team !== undefined ? updates.team : team,
        logoUrl: updates.logoUrl !== undefined ? updates.logoUrl : logoUrl,
        headerBranding: updates.headerBranding !== undefined ? updates.headerBranding : headerBranding,
        noticeConfig: updates.noticeConfig !== undefined ? updates.noticeConfig : noticeConfig,
        offerConfig: updates.offerConfig !== undefined ? updates.offerConfig : offerConfig,
        contactConfig: updates.contactConfig !== undefined ? updates.contactConfig : contactConfig,
      };

      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Could not save content state to server: ", e);
    }
  };

  // Dynamically inject custom Google Font link if googleFontUrl is provided
  useEffect(() => {
    const fontId = "dynamic-branding-google-font";
    let existingLink = document.getElementById(fontId) as HTMLLinkElement | null;

    if (headerBranding.googleFontUrl) {
      if (existingLink) {
        existingLink.href = headerBranding.googleFontUrl;
      } else {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        link.href = headerBranding.googleFontUrl;
        document.head.appendChild(link);
      }
    } else {
      if (existingLink) {
        existingLink.remove();
      }
    }
  }, [headerBranding.googleFontUrl]);

  // Dynamically inject custom uploaded font style if customFontUrl is provided
  useEffect(() => {
    const styleId = "dynamic-branding-custom-font";
    let existingStyle = document.getElementById(styleId) as HTMLStyleElement | null;

    if (headerBranding.customFontUrl) {
      const cssRule = `
        @font-face {
          font-family: 'CustomUploadedFont';
          src: url('${headerBranding.customFontUrl}');
          font-display: swap;
        }
      `;
      if (existingStyle) {
        existingStyle.textContent = cssRule;
      } else {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = cssRule;
        document.head.appendChild(style);
      }
    } else {
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [headerBranding.customFontUrl]);

  // Dynamically inject custom uploaded subtitle font style if subtitleCustomFontUrl is provided
  useEffect(() => {
    const styleId = "dynamic-branding-custom-subtitle-font";
    let existingStyle = document.getElementById(styleId) as HTMLStyleElement | null;

    if (headerBranding.subtitleCustomFontUrl) {
      const cssRule = `
        @font-face {
          font-family: 'CustomUploadedSubtitleFont';
          src: url('${headerBranding.subtitleCustomFontUrl}');
          font-display: swap;
        }
      `;
      if (existingStyle) {
        existingStyle.textContent = cssRule;
      } else {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = cssRule;
        document.head.appendChild(style);
      }
    } else {
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [headerBranding.subtitleCustomFontUrl]);

  const updateHero = (newHero: HeroConfig) => {
    setHeroConfig(newHero);
    localStorage.setItem("avx_c_hero", JSON.stringify(newHero));
    saveStateToServer({ hero: newHero });
  };

  const updateOwner = (newOwner: OwnerConfig) => {
    setOwner(newOwner);
    localStorage.setItem("avx_c_owner", JSON.stringify(newOwner));
    saveStateToServer({ owner: newOwner });
  };

  const updateServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem("avx_c_services", JSON.stringify(newServices));
    saveStateToServer({ services: newServices });
  };

  const updateWebsites = (newWebsites: WebsiteProduct[]) => {
    setWebsites(newWebsites);
    localStorage.setItem("avx_c_websites", JSON.stringify(newWebsites));
    try {
      localStorage.setItem("avexon_user_custom_websites", JSON.stringify(newWebsites));
    } catch(err) {}
    saveStateToServer({ websites: newWebsites });
  };

  const updatePortfolio = (newPortfolio: PortfolioItem[]) => {
    setPortfolio(newPortfolio);
    localStorage.setItem("avx_c_portfolio", JSON.stringify(newPortfolio));
    saveStateToServer({ portfolio: newPortfolio });
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    localStorage.setItem("avx_c_testimonials", JSON.stringify(newTestimonials));
    saveStateToServer({ testimonials: newTestimonials });
  };

  const updateTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    localStorage.setItem("avx_c_team", JSON.stringify(newTeam));
    saveStateToServer({ team: newTeam });
  };

  const updateLogoUrl = (url: string) => {
    setLogoUrl(url);
    localStorage.setItem("avx_c_logo", url);
    saveStateToServer({ logoUrl: url });
  };

  const updateHeaderBranding = (newBranding: HeaderBrandingConfig) => {
    setHeaderBranding(newBranding);
    localStorage.setItem("avx_c_header_branding", JSON.stringify(newBranding));
    saveStateToServer({ headerBranding: newBranding });
  };

  const updateNoticeConfig = (newNoticeConfig: NoticeConfig) => {
    setNoticeConfig(newNoticeConfig);
    localStorage.setItem("avx_c_notice", JSON.stringify(newNoticeConfig));
    saveStateToServer({ noticeConfig: newNoticeConfig });
  };

  const updateOfferConfig = (newOfferConfig: OfferConfig) => {
    setOfferConfig(newOfferConfig);
    localStorage.setItem("avx_c_offer", JSON.stringify(newOfferConfig));
    saveStateToServer({ offerConfig: newOfferConfig });
  };

  const updateContactConfig = (newContactConfig: ContactConfig) => {
    setContactConfig(newContactConfig);
    localStorage.setItem("avx_c_contact", JSON.stringify(newContactConfig));
    saveStateToServer({ contactConfig: newContactConfig });
  };

  const resetAll = async () => {
    setHeroConfig(defaultHero);
    setOwner(defaultOwner);
    setServices(SERVICES);
    setWebsites(WEBSITES);
    setPortfolio(PORTFOLIO);
    setTestimonials(TESTIMONIALS);
    setTeam(TEAM);
    setLogoUrl("");
    setHeaderBranding(defaultHeaderBranding);
    setNoticeConfig(defaultNoticeConfig);
    setOfferConfig(defaultOfferConfig);
    setContactConfig(defaultContact);

    localStorage.removeItem("avx_c_hero");
    localStorage.removeItem("avx_c_owner");
    localStorage.removeItem("avx_c_services");
    localStorage.removeItem("avx_c_websites");
    localStorage.removeItem("avx_c_portfolio");
    localStorage.removeItem("avx_c_testimonials");
    localStorage.removeItem("avx_c_team");
    localStorage.removeItem("avx_c_logo");
    localStorage.removeItem("avx_c_header_branding");
    localStorage.removeItem("avx_c_notice");
    localStorage.removeItem("avx_c_offer");
    localStorage.removeItem("avx_c_contact");

    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: defaultHero,
          owner: defaultOwner,
          services: SERVICES,
          websites: WEBSITES,
          portfolio: PORTFOLIO,
          testimonials: TESTIMONIALS,
          team: TEAM,
          logoUrl: "",
          headerBranding: defaultHeaderBranding,
          noticeConfig: defaultNoticeConfig,
          offerConfig: defaultOfferConfig,
          contactConfig: defaultContact
        })
      });
    } catch (e) {}
  };

  return (
    <ContentContext.Provider
      value={{
        hero,
        owner,
        services,
        websites,
        portfolio,
        testimonials,
        team,
        logoUrl,
        headerBranding,
        noticeConfig,
        offerConfig,
        contactConfig,
        updateHero,
        updateOwner,
        updateServices,
        updateWebsites,
        updatePortfolio,
        updateTestimonials,
        updateTeam,
        updateLogoUrl,
        updateHeaderBranding,
        updateNoticeConfig,
        updateOfferConfig,
        updateContactConfig,
        resetAll
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
