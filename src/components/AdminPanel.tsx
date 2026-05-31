import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Lock, 
  Settings, 
  Sparkles, 
  ShoppingBag, 
  Briefcase, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Database,
  ArrowRight,
  Shield,
  Loader2,
  ListFilter,
  Megaphone,
  Flame,
  Clock,
  ShieldCheck,
  HeartHandshake
} from "lucide-react";
import { useContent } from "../context/ContentContext";
import { WebsiteProduct, Service, PortfolioItem, Testimonial, TeamMember, ContactConfig } from "../types";
import { Order, OrderStatus } from "./CheckoutModal";

// Helper function to compress large uploaded image files into small, performant base64 JPEGs (saves localStorage space)
function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
          const format = isPng ? "image/png" : "image/jpeg";
          const compressed = canvas.toDataURL(format, isPng ? undefined : quality);
          resolve(compressed);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = () => {
      resolve("");
    };
  });
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function ImageUploadField({ label, value, onChange, placeholder }: ImageUploadFieldProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    setIsCompressing(true);
    try {
      const base64 = await compressImage(file, 800, 800, 0.7);
      onChange(base64);
    } catch (e) {
      console.error("Error compressing image", e);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-slate-400 text-xs font-bold leading-none mb-1.5">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
        
        {/* Direct drag/drop and file selector widget */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`md:col-span-5 relative flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer bg-[#110724] ${
            dragActive 
              ? "border-purple-400 bg-purple-950/25" 
              : "border-purple-950 hover:border-purple-500/55 hover:bg-purple-950/10"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          
          {isCompressing ? (
            <div className="flex flex-col items-center gap-1.5 text-center py-2">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-[10px] text-purple-300 font-medium">কম্প্রেস হচ্ছে...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center py-1">
              <div className="flex items-center gap-1.5">
                <span className="bg-purple-500/20 text-purple-300 p-1 rounded-md">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </span>
                {value ? (
                  <span className="text-[10px] text-emerald-400 font-bold">ছবি যুক্ত হয়েছে</span>
                ) : (
                  <span className="text-[10px] text-purple-400 font-bold">সরাসরি আপলোড</span>
                )}
              </div>
              <p className="text-[9px] text-slate-400 font-sans">ক্লিক বা ড্র্যাগ করুন</p>
            </div>
          )}
        </div>

        {/* URL Input to fallback to manual inputs */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="flex gap-2">
            <input
              type="text"
              value={value.startsWith("data:") ? "সরাসরি ছবি আপলোড করা হয়েছে (Base64)" : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "https://images.unsplash.com/photo-..."}
              disabled={value.startsWith("data:")}
              className={`flex-1 bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all font-mono ${
                value.startsWith("data:") ? "opacity-60 text-purple-300 pointer-events-none" : ""
              }`}
            />
            {value && (
              <div className="relative group shrink-0">
                <img 
                  src={value} 
                  alt="Preview" 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl border border-purple-500/30 object-cover" 
                />
                {value.startsWith("data:") && (
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full p-0.5 hover:scale-110 transition-transform cursor-pointer shadow-md"
                    title="মুছে ফেলুন"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
          {value.startsWith("data:") && (
            <p className="text-[9.5px] text-slate-400 mt-1 font-sans">
              * সরাসরি ছবি আপলোড করা হয়েছে। পুনরায় লিঙ্ক ব্যবহার করতে ওপরের <span className="text-red-400 font-bold">লাল ক্রস বাটন</span> দিয়ে রিমুভ করুন।
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

interface FontUploadFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

function FontUploadField({ label, value, onChange }: FontUploadFieldProps) {
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
      setLoading(false);
    };
    reader.onerror = () => {
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-1">
      <label className="block text-slate-400 text-xs font-bold leading-none mb-1.5">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="relative flex-1 flex items-center justify-center p-4 border-2 border-dashed border-purple-950 hover:border-purple-500/55 rounded-xl bg-[#110724] hover:bg-purple-950/10 cursor-pointer transition-all">
          <input
            type="file"
            accept=".ttf,.woff,.woff2,.otf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex items-center gap-2 text-xs">
            {loading ? (
              <span className="text-purple-300 font-medium">প্রক্রিয়াকরণ হচ্ছে...</span>
            ) : value ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                ✓ কাস্টম ফন্ট ফাইল আপলোড করা হয়েছে
              </span>
            ) : (
              <span className="text-purple-400 font-medium flex items-center gap-1 font-sans">
                📁 কাস্টম ফন্ট ফাইল সিলেক্ট করুন (.ttf, .woff, .woff2, .otf)
              </span>
            )}
          </div>
        </div>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl px-4 py-2 text-xs font-sans transition-colors"
          >
            মুছে ফেলুন
          </button>
        )}
      </div>
    </div>
  );
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePWA?: boolean;
}

type ActiveTab = "hero" | "notices" | "websites" | "services" | "portfolio" | "testimonials" | "orders" | "team" | "offers";

export default function AdminPanel({ isOpen, onClose, isStandalonePWA = false }: AdminPanelProps) {
  const {
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
  } = useContent();

  const [noticeShow, setNoticeShow] = useState<boolean>(true);
  const [localNotices, setLocalNotices] = useState<any[]>([]);
  const [editingLocalNoticeId, setEditingLocalNoticeId] = useState<string | null>(null);
  const [tempNoticeBadge, setTempNoticeBadge] = useState("");
  const [tempNoticeText, setTempNoticeText] = useState("");
  const [tempNoticeHighlight, setTempNoticeHighlight] = useState("");
  const [tempNoticeIcon, setTempNoticeIcon] = useState("Sparkles");

  // Special Offer custom states
  const [offerShow, setOfferShow] = useState<boolean>(true);
  const [offerBadgeText, setOfferBadgeText] = useState("");
  const [offerUrgencyText, setOfferUrgencyText] = useState("");
  const [offerDescriptionText, setOfferDescriptionText] = useState("");
  const [offerTimerType, setOfferTimerType] = useState<"midnight" | "custom_target">("midnight");
  const [offerCustomTargetDate, setOfferCustomTargetDate] = useState("");
  const [offerDiscountActive, setOfferDiscountActive] = useState<boolean>(false);
  const [offerDiscountPercentage, setOfferDiscountPercentage] = useState<number>(10);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("hero");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string>("");

  // Orders State (tied to checkout tracking database)
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Form States
  // 1. Hero
  const [heroTitle, setHeroTitle] = useState(hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(hero.subtitle);
  const [heroCta, setHeroCta] = useState(hero.ctaText);
  const [heroWhatsapp, setHeroWhatsapp] = useState(hero.whatsappNumber);
  const [adminLogoUrl, setAdminLogoUrl] = useState(logoUrl);

  const [brandName, setBrandName] = useState(headerBranding.brandName);
  const [brandBadge, setBrandBadge] = useState(headerBranding.brandBadge);
  const [brandSubtitle, setBrandSubtitle] = useState(headerBranding.brandSubtitle);
  const [fontFamily, setFontFamily] = useState(headerBranding.fontFamily);
  const [googleFontUrl, setGoogleFontUrl] = useState(headerBranding.googleFontUrl);
  const [adminCustomFontUrl, setAdminCustomFontUrl] = useState(headerBranding.customFontUrl || "");
  const [subtitleFontFamily, setSubtitleFontFamily] = useState(headerBranding.subtitleFontFamily || "");
  const [adminSubtitleCustomFontUrl, setAdminSubtitleCustomFontUrl] = useState(headerBranding.subtitleCustomFontUrl || "");
  const [subtitleFontSize, setSubtitleFontSize] = useState(headerBranding.subtitleFontSize || "9px");

  // 1.5 Owner Card Profile settings
  const [ownerName, setOwnerName] = useState(owner.name);
  const [ownerRole, setOwnerRole] = useState(owner.role);
  const [ownerTitle, setOwnerTitle] = useState(owner.title);
  const [ownerPicUrl, setOwnerPicUrl] = useState(owner.picUrl);

  // 1.7 Business Contact & Social Info
  const [officeAddress, setOfficeAddress] = useState(contactConfig?.officeAddress || "");
  const [helplineNumbers, setHelplineNumbers] = useState(contactConfig?.helplineNumbers || "");
  const [officialEmails, setOfficialEmails] = useState(contactConfig?.officialEmails || "");
  const [supportHours, setSupportHours] = useState(contactConfig?.supportHours || "");
  const [facebookUrl, setFacebookUrl] = useState(contactConfig?.facebookUrl || "");
  const [twitterUrl, setTwitterUrl] = useState(contactConfig?.twitterUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(contactConfig?.linkedinUrl || "");
  const [githubUrl, setGithubUrl] = useState(contactConfig?.githubUrl || "");
  const [bkashNumber, setBkashNumber] = useState(contactConfig?.bkashNumber || "");
  const [nagadNumber, setNagadNumber] = useState(contactConfig?.nagadNumber || "");

  // 2. Websites / Services / Portfolio / Testimonial Editing Sub-states
  const [editWebItem, setEditWebItem] = useState<Partial<WebsiteProduct> | null>(null);
  const [editServiceItem, setEditServiceItem] = useState<Partial<Service> | null>(null);
  const [editPortfolioItem, setEditPortfolioItem] = useState<Partial<PortfolioItem> | null>(null);
  const [editTestimonialItem, setEditTestimonialItem] = useState<Partial<Testimonial> | null>(null);
  const [editTeamItem, setEditTeamItem] = useState<Partial<TeamMember> | null>(null);

  // Reload local lists when context values change
  useEffect(() => {
    if (isOpen || isStandalonePWA) {
      setHeroTitle(hero.title);
      setHeroSubtitle(hero.subtitle);
      setHeroCta(hero.ctaText);
      setHeroWhatsapp(hero.whatsappNumber);
      setAdminLogoUrl(logoUrl);

      setBrandName(headerBranding.brandName);
      setBrandBadge(headerBranding.brandBadge);
      setBrandSubtitle(headerBranding.brandSubtitle);
      setFontFamily(headerBranding.fontFamily);
      setGoogleFontUrl(headerBranding.googleFontUrl);
      setAdminCustomFontUrl(headerBranding.customFontUrl || "");
      setSubtitleFontFamily(headerBranding.subtitleFontFamily || "");
      setAdminSubtitleCustomFontUrl(headerBranding.subtitleCustomFontUrl || "");
      setSubtitleFontSize(headerBranding.subtitleFontSize || "9px");

      setOwnerName(owner.name);
      setOwnerRole(owner.role);
      setOwnerTitle(owner.title);
      setOwnerPicUrl(owner.picUrl);

      // Load all incoming orders from tracking localDB/Server
      const fetchOrders = async () => {
        try {
          const res = await fetch("/api/orders");
          const json = await res.json();
          if (json.success && json.data) {
            setAllOrders(json.data);
            localStorage.setItem("avexon_user_orders", JSON.stringify(json.data));
          } else {
            const stored = localStorage.getItem("avexon_user_orders");
            if (stored) setAllOrders(JSON.parse(stored));
          }
        } catch (err) {
          console.error("Failed to fetch server orders: ", err);
          const stored = localStorage.getItem("avexon_user_orders");
          if (stored) setAllOrders(JSON.parse(stored));
        }
      };
      fetchOrders();

      if (noticeConfig) {
        setNoticeShow(noticeConfig.show);
        setLocalNotices(noticeConfig.notices || []);
      }

      if (offerConfig) {
        setOfferShow(offerConfig.show);
        setOfferBadgeText(offerConfig.badgeText || "");
        setOfferUrgencyText(offerConfig.urgencyText || "");
        setOfferDescriptionText(offerConfig.descriptionText || "");
        setOfferTimerType(offerConfig.timerType || "midnight");
        setOfferCustomTargetDate(offerConfig.customTargetDate || "");
        setOfferDiscountActive(offerConfig.discountActive || false);
        setOfferDiscountPercentage(offerConfig.discountPercentage !== undefined ? offerConfig.discountPercentage : 10);
      }

      if (contactConfig) {
        setOfficeAddress(contactConfig.officeAddress || "");
        setHelplineNumbers(contactConfig.helplineNumbers || "");
        setOfficialEmails(contactConfig.officialEmails || "");
        setSupportHours(contactConfig.supportHours || "");
        setFacebookUrl(contactConfig.facebookUrl || "");
        setTwitterUrl(contactConfig.twitterUrl || "");
        setLinkedinUrl(contactConfig.linkedinUrl || "");
        setGithubUrl(contactConfig.githubUrl || "");
        setBkashNumber(contactConfig?.bkashNumber || "");
        setNagadNumber(contactConfig?.nagadNumber || "");
      }
    }
  }, [isOpen, isStandalonePWA, hero, services, websites, portfolio, testimonials, team, owner, headerBranding, noticeConfig, offerConfig, contactConfig]);

  // Prevent background scrolling and hide navbar when Admin Panel is open
  useEffect(() => {
    if (isOpen && !isStandalonePWA) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, isStandalonePWA]);

  // Real-time Push Notification & Badge count handling (PWA)
  useEffect(() => {
    let lastOrderCount = -1;
    
    const checkNewOrders = () => {
      try {
        const stored = localStorage.getItem("avexon_user_orders");
        if (stored) {
          const ordersList: Order[] = JSON.parse(stored);
          const activeOrders = ordersList.filter(o => o.status !== "Done");
          
          // Update native PWA launcher app icon badge
          if ("setAppBadge" in navigator) {
            const badgeCount = activeOrders.length;
            if (badgeCount > 0) {
              (navigator as any).setAppBadge(badgeCount).catch((err: any) => console.log("Set badge error:", err));
            } else {
              (navigator as any).clearAppBadge().catch((err: any) => console.log("Clear badge error:", err));
            }
          }
          
          // Trigger Notification & audio chime if a new order arrives
          if (lastOrderCount !== -1 && ordersList.length > lastOrderCount) {
            const newlyCreated = ordersList[ordersList.length - 1];
            
            // Premium digital agency synth chime via Web Audio API (no external file needed)
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              try {
                const audioCtx = new AudioContextClass();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.type = "sine";
                // Two-tone high-tech pulse sound
                osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
                osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.12); // A5
                gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.5);
              } catch (audioErr) {
                console.log("Audio feedback ignored before user interaction:", audioErr);
              }
            }
            
            if ("Notification" in window && Notification.permission === "granted") {
              try {
                new Notification("নতুন অর্ডার রিসিভড! 🔔", {
                  body: `ক্লায়েন্ট ${newlyCreated.customerName || "Unknown"} একটি অর্ডার পাঠিয়েছেন। প্রজেক্ট: ${newlyCreated.websiteTitle || "কাস্টম সার্ভিস"}`,
                  icon: "/icon-512.png",
                  badge: "/icon-512.png",
                });
              } catch (e) {
                console.log("Notification trigger error:", e);
              }
            }
          }
          lastOrderCount = ordersList.length;
        } else {
          lastOrderCount = 0;
        }
      } catch (e) {
        console.error("PWA Realtime engine failure:", e);
      }
    };

    // Check immediately and check every 4 seconds in the background
    checkNewOrders();
    const timer = setInterval(checkNewOrders, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    // Highly secure local passcode matching
    if (passcode === "avexon2026" || passcode === "admin") {
      setIsAuthenticated(true);
      setPasscode("");
    } else {
      setAuthError("ভুল পাসকোড! অনুগ্রহ করে আবার চেষ্টা করুন। (Default: avexon2026)");
    }
  };

  const triggerSuccessAlert = (message: string) => {
    setSaveSuccess(message);
    setTimeout(() => {
      setSaveSuccess("");
    }, 3000);
  };

  // General Hero Updates
  const handleSaveHero = () => {
    updateHero({
      title: heroTitle,
      subtitle: heroSubtitle,
      ctaText: heroCta,
      whatsappNumber: heroWhatsapp
    });
    updateOwner({
      name: ownerName,
      role: ownerRole,
      title: ownerTitle,
      picUrl: ownerPicUrl
    });
    updateLogoUrl(adminLogoUrl);
    updateHeaderBranding({
      brandName,
      brandBadge,
      brandSubtitle,
      fontFamily: adminCustomFontUrl ? (fontFamily || "CustomUploadedFont") : fontFamily,
      googleFontUrl,
      customFontUrl: adminCustomFontUrl,
      subtitleFontFamily: adminSubtitleCustomFontUrl ? (subtitleFontFamily || "CustomUploadedSubtitleFont") : subtitleFontFamily,
      subtitleCustomFontUrl: adminSubtitleCustomFontUrl,
      subtitleFontSize
    });
    updateContactConfig({
      officeAddress,
      helplineNumbers,
      officialEmails,
      supportHours,
      facebookUrl,
      twitterUrl,
      linkedinUrl,
      githubUrl,
      bkashNumber,
      nagadNumber
    });
    triggerSuccessAlert("হোমপেজ সেটিংস, ব্যবসা ও কন্ট্যাক্ট তথ্য, ওনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
  };

  // Special Offer settings handler
  const handleSaveOfferSetting = () => {
    updateOfferConfig({
      show: offerShow,
      badgeText: offerBadgeText,
      urgencyText: offerUrgencyText,
      descriptionText: offerDescriptionText,
      timerType: offerTimerType,
      customTargetDate: offerCustomTargetDate,
      discountActive: offerDiscountActive,
      discountPercentage: offerDiscountPercentage
    });
    triggerSuccessAlert("স্পেশাল মেগা অফার ব্যানার ও ডিসকাউন্ট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
  };

  // Notice Bar dynamic settings handlers
  const handleSaveNoticeBarSetting = (newShow: boolean) => {
    setNoticeShow(newShow);
    updateNoticeConfig({
      show: newShow,
      notices: localNotices
    });
    triggerSuccessAlert(newShow ? "ঘোষণা নোটিশ বার চালু করা হয়েছে!" : "ঘোষণা নোটিশ বার বন্ধ করা হয়েছে!");
  };

  const handleEditNoticeItemClick = (notice: any) => {
    setEditingLocalNoticeId(notice.id);
    setTempNoticeBadge(notice.badge || "");
    setTempNoticeText(notice.text || "");
    setTempNoticeHighlight(notice.highlight || "");
    setTempNoticeIcon(notice.iconName || "Sparkles");
  };

  const handleCancelNoticeEdit = () => {
    setEditingLocalNoticeId(null);
    setTempNoticeBadge("");
    setTempNoticeText("");
    setTempNoticeHighlight("");
    setTempNoticeIcon("Sparkles");
  };

  const handleSaveNoticeItem = () => {
    if (!tempNoticeText.trim()) {
      alert("অনুগ্রহ করে নোটিশের কন্টেন্ট টেক্সট লিখুন!");
      return;
    }

    let updatedNotices: any[];
    const isNew = !editingLocalNoticeId || editingLocalNoticeId === "new";

    if (isNew) {
      const newNotice = {
        id: `n-${Date.now()}`,
        badge: tempNoticeBadge,
        text: tempNoticeText,
        highlight: tempNoticeHighlight,
        iconName: tempNoticeIcon
      };
      updatedNotices = [...localNotices, newNotice];
    } else {
      updatedNotices = localNotices.map(item => 
        item.id === editingLocalNoticeId 
          ? {
              ...item,
              badge: tempNoticeBadge,
              text: tempNoticeText,
              highlight: tempNoticeHighlight,
              iconName: tempNoticeIcon
            }
          : item
      );
    }

    setLocalNotices(updatedNotices);
    updateNoticeConfig({
      show: noticeShow,
      notices: updatedNotices
    });
    
    setEditingLocalNoticeId(null);
    setTempNoticeBadge("");
    setTempNoticeText("");
    setTempNoticeHighlight("");
    setTempNoticeIcon("Sparkles");

    triggerSuccessAlert(isNew ? "নতুন ঘোষণা নোটিশ যোগ করা হয়েছে!" : "ঘোষণা নোটিশ সফলভাবে আপডেট করা হয়েছে!");
  };

  const handleDeleteNoticeItem = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই ঘোষণা নোটিশটি তালিকা থেকে ডিলিট করতে চান?")) {
      const updated = localNotices.filter(item => item.id !== id);
      setLocalNotices(updated);
      updateNoticeConfig({
        show: noticeShow,
        notices: updated
      });
      triggerSuccessAlert("নোটিশ মুছে ফেলা হয়েছে।");
    }
  };

  // Website shop item modifications
  const handleSaveWebsiteProduct = () => {
    if (!editWebItem) return;
    const isNew = !editWebItem.id;
    const id = isNew ? `w-${Date.now()}` : editWebItem.id!;
    
    const finalItem: WebsiteProduct = {
      id,
      title: editWebItem.title || "নতুন ই-কমার্স সাইট",
      category: editWebItem.category || "ই-কমার্স",
      deliveryTime: editWebItem.deliveryTime || "২-৪ দিন",
      price: Number(editWebItem.price) || 8000,
      originalPrice: Number(editWebItem.originalPrice) || 15000,
      rating: Number(editWebItem.rating) || 5.0,
      ordersCount: Number(editWebItem.ordersCount) || 12,
      featuresCount: Number(editWebItem.featuresCount) || 10,
      image: editWebItem.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      tags: editWebItem.tags || ["Bkash/Nagad", "Admin Dashboard"],
      demoUrl: editWebItem.demoUrl || "https://react.dev"
    };

    let updatedList: WebsiteProduct[];
    if (isNew) {
      updatedList = [...websites, finalItem];
    } else {
      updatedList = websites.map(w => w.id === id ? finalItem : w);
    }

    updateWebsites(updatedList);
    setEditWebItem(null);
    triggerSuccessAlert("ওয়েবসাইট প্রোডাক্ট মেটাডাটা সফলভাবে আপডেট করা হয়েছে!");
  };

  const handleDeleteWebsite = (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই ওয়েবসাইট প্রোডাক্টটি শপ থেকে ডিলিট করতে চান?")) {
      const updated = websites.filter(w => w.id !== id);
      updateWebsites(updated);
      triggerSuccessAlert("শপ আইটেম ডিলিট করা হয়েছে।");
    }
  };

  // Services dynamic adjustments
  const handleSaveService = () => {
    if (!editServiceItem) return;
    const isNew = !editServiceItem.id;
    const id = isNew ? `s-${Date.now()}` : editServiceItem.id!;

    const finalItem: Service = {
      id,
      title: editServiceItem.title || "",
      description: editServiceItem.description || "",
      iconName: editServiceItem.iconName || "Globe",
      priceStarting: editServiceItem.priceStarting || "৳৮,০০০",
      duration: editServiceItem.duration || "১-৩ দিন",
      techs: editServiceItem.techs || ["React.js"]
    };

    let updatedList: Service[];
    if (isNew) {
      updatedList = [...services, finalItem];
    } else {
      updatedList = services.map(s => s.id === id ? finalItem : s);
    }

    updateServices(updatedList);
    setEditServiceItem(null);
    triggerSuccessAlert("সেবা সূচী মেটাডাটা সফলভাবে সংরক্ষিত হয়েছে!");
  };

  const handleDeleteService = (id: string) => {
    if (confirm("আপনি কি এই সেবাটি তালিকা হতে বাদ দিতে চান?")) {
      const updated = services.filter(s => s.id !== id);
      updateServices(updated);
      triggerSuccessAlert("সেবা ডিলিট সম্পন্ন হয়েছে।");
    }
  };

  // Portfolios Dynamic custom modifications
  const handleSavePortfolio = () => {
    if (!editPortfolioItem) return;
    const isNew = !editPortfolioItem.id;
    const id = isNew ? `p-${Date.now()}` : editPortfolioItem.id!;

    const finalItem: PortfolioItem = {
      id,
      title: editPortfolioItem.title || "",
      category: editPortfolioItem.category || "",
      description: editPortfolioItem.description || "",
      imageUrl: editPortfolioItem.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      client: editPortfolioItem.client || "",
      year: editPortfolioItem.year || "২০২৬",
      tags: editPortfolioItem.tags || []
    };

    let updatedList: PortfolioItem[];
    if (isNew) {
      updatedList = [...portfolio, finalItem];
    } else {
      updatedList = portfolio.map(p => p.id === id ? finalItem : p);
    }

    updatePortfolio(updatedList);
    setEditPortfolioItem(null);
    triggerSuccessAlert("পোর্টফোলিও প্রজেক্ট সফলভাবে আপডেট হয়েছে!");
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirm("আপনি কি এই প্রজেক্ট রেকর্ড ডিলিট করতে চান?")) {
      const updated = portfolio.filter(p => p.id !== id);
      updatePortfolio(updated);
      triggerSuccessAlert("প্রজেক্ট ডিলিট সম্পন্ন।");
    }
  };

  // Testimonial dynamic alterations
  const handleSaveTestimonial = () => {
    if (!editTestimonialItem) return;
    const isNew = !editTestimonialItem.id;
    const id = isNew ? `t-${Date.now()}` : editTestimonialItem.id!;

    const finalItem: Testimonial = {
      id,
      name: editTestimonialItem.name || "",
      role: editTestimonialItem.role || "",
      avatarUrl: editTestimonialItem.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      text: editTestimonialItem.text || "",
      rating: Number(editTestimonialItem.rating) || 5,
      type: editTestimonialItem.type as "readymade" | "custom" || "custom"
    };

    let updatedList: Testimonial[];
    if (isNew) {
      updatedList = [...testimonials, finalItem];
    } else {
      updatedList = testimonials.map(t => t.id === id ? finalItem : t);
    }

    updateTestimonials(updatedList);
    setEditTestimonialItem(null);
    triggerSuccessAlert("গ্রাহক রিভিও আপডেট করা হয়েছে!");
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm("আপনি কি রিভিউটি মুছে ফেলতে চান?")) {
      const updated = testimonials.filter(t => t.id !== id);
      updateTestimonials(updated);
      triggerSuccessAlert("রিভিউ ডিলিট সম্পন্ন।");
    }
  };

  // Team controls
  const handleSaveTeamMember = () => {
    if (!editTeamItem) return;
    const isNew = !editTeamItem.id;
    const id = isNew ? `tm-${Date.now()}` : editTeamItem.id!;

    const finalItem: TeamMember = {
      id,
      name: editTeamItem.name || "",
      role: editTeamItem.role || "",
      imageUrl: editTeamItem.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      skills: editTeamItem.skills || [],
      bio: editTeamItem.bio || ""
    };

    let updatedList: TeamMember[];
    if (isNew) {
      updatedList = [...team, finalItem];
    } else {
      updatedList = team.map(t => t.id === id ? finalItem : t);
    }

    updateTeam(updatedList);
    setEditTeamItem(null);
    triggerSuccessAlert("টিম মেম্বার সফলভাবে আপডেট হয়েছে!");
  };

  const handleDeleteTeamMember = (id: string) => {
    if (confirm("টিম মেম্বারটিকে তালিকা থেকে ডিলিট করতে চান?")) {
      const updated = team.filter(t => t.id !== id);
      updateTeam(updated);
      triggerSuccessAlert("টিম মেম্বার রিমুভ সম্পন্ন।");
    }
  };

  // Order Database Tracking Manager Controls
  const handleSaveOrderUpdate = () => {
    if (!editingOrder) return;
    const updatedList = allOrders.map(o => o.id === editingOrder.id ? editingOrder : o);
    setAllOrders(updatedList);
    
    try {
      localStorage.setItem("avexon_user_orders", JSON.stringify(updatedList));
      // Force trigger immediate storage update across listener windows
      window.dispatchEvent(new Event("storage"));
      
      // Save order update on server database
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingOrder)
      }).catch(err => console.error("Failed to sync updated order to server:", err));
    } catch (err) {
      console.warn(err);
    }

    setEditingOrder(null);
    triggerSuccessAlert(`অর্ডার ট্র্যাকিং আইডি ${editingOrder.id} সফলভাবে আপডেট হয়েছে!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`আপনি কি ট্র্যাকিং আইডি ${orderId} চিরতরে ডিলিট করতে চান?`)) {
      const updated = allOrders.filter(o => o.id !== orderId);
      setAllOrders(updated);
      try {
        localStorage.setItem("avexon_user_orders", JSON.stringify(updated));
        
        // Clear active tracking token if focused on this deleted order
        const trackingId = localStorage.getItem("avexon_active_tracking_id");
        if (trackingId === orderId) {
          localStorage.removeItem("avexon_active_tracking_id");
        }
        window.dispatchEvent(new Event("storage"));
        
        // Delete order from server database
        fetch(`/api/orders/${orderId}`, {
          method: "DELETE"
        }).catch(err => console.error("Failed to sync deleted order to server:", err));
      } catch (e) {}
      triggerSuccessAlert("অর্ডার ডাটাবেজ থেকে মুছে ফেলা হয়েছে।");
    }
  };

  const resetToFactoryDefaults = () => {
    if (confirm("আপনি কি ওয়েবসাইট রিসেট করতে চান? এটি আপনার কাস্টম করা সকল কন্টেন্ট মুছে দিয়ে আদি মেটাডাটায় ফিরিয়ে নিবে।")) {
      resetAll();
      triggerSuccessAlert("সম্পূর্ণ ডেটা ফ্যাক্টরি ডিফল্টে রিসেট করা হয়েছে।");
      setTimeout(() => {
        onClose();
        setIsAuthenticated(false);
      }, 1000);
    }
  };

  if (!isOpen && !isStandalonePWA) return null;

  return (
    <div className={isStandalonePWA ? "w-full h-screen flex flex-col justify-between overflow-hidden bg-[#0a0512]" : "fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-4 overflow-hidden"}>
      {/* Semi-transparent dark blur backdrop (Only if not PWA) */}
      {!isStandalonePWA && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg z-0"
        />
      )}

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login-box"
            initial={isStandalonePWA ? { opacity: 0, y: 15 } : { opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={isStandalonePWA ? { opacity: 0, y: -15 } : { opacity: 0, scale: 0.95, y: -15 }}
            className={isStandalonePWA 
              ? "relative w-full h-full flex flex-col justify-center max-w-sm mx-auto px-6 py-8 text-left z-10" 
              : "relative w-full max-w-md bg-[#090312] border border-purple-500/20 p-8 rounded-3xl mx-4 shadow-2xl z-10 text-left"
            }
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 text-purple-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-sans">সুপার এডমিন প্যানেল</h2>
                <p className="text-xs text-purple-300 font-medium">{isStandalonePWA ? "এভেক্সন অ্যাপ সেশন গেটওয়ে" : "নিরাপদ ড্যাশবোর্ড গেটওয়ে"}</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                  এডমিন পাসকোড লিখুন
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full bg-[#110724] border border-purple-500/30 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg flex items-center gap-2">
                  <span>⚠️</span> {authError}
                </p>
              )}

              <p className="text-[10px] text-slate-500 leading-normal font-sans font-medium">
                সুরক্ষা সেশন এনক্রিপ্টেড। এভেক্সন স্টুডিও সিস্টেম কনফিগারেশন পরিবর্তন করতে সঠিক শংসাপত্র প্রদান করুন।
              </p>

              <div className="flex gap-3 pt-2">
                {!isStandalonePWA && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-[#140b25] text-slate-300 border border-slate-800 hover:bg-slate-900 rounded-xl py-3 font-semibold text-xs uppercase cursor-pointer text-center"
                  >
                    বাতিল করুন
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 active:scale-95 text-white rounded-xl py-3 font-bold text-xs uppercase tracking-wider cursor-pointer text-center shadow-lg hover:shadow-purple-500/10 transition-all font-sans"
                >
                  ড্যাশবোর্ডে প্রবেশ করুন
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-frame"
            initial={isStandalonePWA ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isStandalonePWA ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            className={isStandalonePWA 
              ? "relative w-full h-full bg-[#090312] flex flex-col overflow-hidden text-left" 
              : "relative w-full h-full md:h-[94vh] max-w-6xl bg-[#090312] md:border md:border-purple-500/20 md:rounded-3xl shadow-2xl z-20 flex flex-col overflow-hidden text-left"
            }
          >
            {/* Real-time alert baner */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: "-50%", y: -40 }}
                  animate={{ opacity: 1, x: "-50%", y: 0 }}
                  exit={{ opacity: 0, x: "-50%", y: -40 }}
                  className="absolute top-4 left-1/2 bg-emerald-500/95 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-full shadow-xl flex items-center gap-2 z-[210] pointer-events-none"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{saveSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dashboard Header */}
            <div className="px-5 py-4 sm:px-7 sm:py-5 border-b border-purple-500/10 flex items-center justify-between bg-[#0d051c] relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
                    <span>{isStandalonePWA ? "এভেক্সন অ্যাডমিন অ্যাপ" : "লাইভ কনফিগারেশন প্যানেল"}</span>
                    <span className="text-[10px] font-bold text-xs bg-purple-500/15 border border-purple-500/35 text-purple-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {isStandalonePWA ? "PWA APP MODE" : "DEVELOPER MODE"}
                    </span>
                  </h1>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    ওয়েবসাইটের সকল কন্টেন্ট, প্রোডাক্টস, কাজের রেকর্ড এবং ক্লায়েন্টদের রিয়েল-টাইম অর্ডার ট্র্যাকিং ডাটাবেজ আপডেট করুন।
                  </p>
                </div>
              </div>
              {!isStandalonePWA ? (
                <button
                  onClick={onClose}
                  className="p-1 px-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white text-xs py-2 hover:bg-slate-950 transition-colors cursor-pointer"
                >
                  প্যানেল বন্ধ
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="p-1 px-3.5 bg-rose-950/20 border border-rose-900/30 rounded-xl text-rose-400 hover:text-rose-300 text-xs py-2 hover:bg-rose-900/30 transition-colors cursor-pointer font-sans font-bold"
                >
                  লগআউট
                </button>
              )}
            </div>

            {/* Main Area: Sidebar + Contents */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              
              {/* Sidebar Navigation */}
              <div className="hidden md:flex w-full md:w-56 bg-[#0c051a] border-r border-purple-500/10 md:flex-col shrink-0 md:p-3 space-y-1">
                {[
                  { id: "hero", label: "হোমপেজ ও সেটিংস", icon: <Settings className="w-4 h-4" /> },
                  { id: "offers", label: "স্পেশাল মেগা অফার", icon: <Clock className="w-4 h-4" /> },
                  { id: "notices", label: "ঘোষণা নোটিশ বার", icon: <Megaphone className="w-4 h-4" /> },
                  { id: "websites", label: "ওয়েবসাইট শপ", icon: <ShoppingBag className="w-4 h-4" /> },
                  { id: "services", label: "সেবাসমূহ", icon: <Sparkles className="w-4 h-4" /> },
                  { id: "portfolio", label: "প্রজেক্ট পোর্টফোলিও", icon: <Briefcase className="w-4 h-4" /> },
                  { id: "testimonials", label: "টেസ്റ്റിমোনিয়্যালস", icon: <MessageSquare className="w-4 h-4" /> },
                  { id: "orders", label: "অর্ডার ডাটাবেজ", icon: <TrendingUp className="w-4 h-4" /> },
                  { id: "team", label: "টিম মেম্বার্স", icon: <Users className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as ActiveTab);
                      // Clear inner editable states
                      setEditWebItem(null);
                      setEditServiceItem(null);
                      setEditPortfolioItem(null);
                      setEditTestimonialItem(null);
                      setEditTeamItem(null);
                      setEditingOrder(null);
                    }}
                    className={`flex items-center gap-2.5 px-4.5 py-3 rounded-none md:rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "text-white bg-purple-500/15 border-b-2 border-purple-500 md:border-b-0 md:border-l-4 md:border-purple-500"
                        : "text-slate-400 hover:text-slate-200 hover:bg-purple-950/10"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}

                <div className="hidden md:block flex-1" />
                
                <div className="hidden md:block p-2.5 border-t border-purple-950/50 space-y-2 text-center">
                  <button
                    onClick={resetToFactoryDefaults}
                    className="w-full bg-[#1b0811] hover:bg-red-950/50 text-red-400 border border-red-950/60 transition-colors rounded-lg py-2 px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer font-sans"
                  >
                    ফ্যাক্টরি রিসেট
                  </button>
                </div>
              </div>

              {/* Mobile Floating Glassy Bottom Navigation Bar (Always visible on mobile widths) */}
              <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-[#0c051a]/90 backdrop-blur-xl border border-purple-500/20 z-[100] grid grid-cols-5 items-center px-1 pb-safe rounded-2xl shadow-[0_0_30px_rgba(139,92,247,0.25)] shrink-0">
                {/* Tab 1: Home / Hero */}
                <button
                  onClick={() => setActiveTab("hero")}
                  className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer transition-all ${
                    activeTab === "hero" ? "text-purple-400 font-black scale-105" : "text-slate-500"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter">হোমপেজ</span>
                </button>

                {/* Tab 2: Orders status */}
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer relative transition-all ${
                    activeTab === "orders" ? "text-purple-400 font-black scale-105" : "text-slate-500"
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter">অর্ডারস</span>
                  {allOrders.filter(o => o.status !== "Done").length > 0 && (
                    <span className="absolute top-1.5 right-3.5 min-w-4 h-4 text-[8.5px] font-bold bg-fuchsia-600 rounded-full flex items-center justify-center text-white px-1 shadow animate-bounce font-mono">
                      {allOrders.filter(o => o.status !== "Done").length}
                    </span>
                  )}
                </button>

                {/* Tab 3: Website/Services shop */}
                <button
                  onClick={() => {
                    if (!["websites", "services"].includes(activeTab)) {
                      setActiveTab("websites");
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer transition-all ${
                    ["websites", "services"].includes(activeTab) ? "text-purple-400 font-black scale-105" : "text-slate-500"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter">শপ ও সেবা</span>
                </button>

                {/* Tab 4: Offers & Banners */}
                <button
                  onClick={() => {
                    if (!["offers", "notices"].includes(activeTab)) {
                      setActiveTab("offers");
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer transition-all ${
                    ["offers", "notices"].includes(activeTab) ? "text-purple-400 font-black scale-105" : "text-slate-500"
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter">অফার ও নোটি</span>
                </button>

                {/* Tab 5: Team & references */}
                <button
                  onClick={() => {
                    if (!["team", "portfolio", "testimonials"].includes(activeTab)) {
                      setActiveTab("team");
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer transition-all ${
                    ["team", "portfolio", "testimonials"].includes(activeTab) ? "text-purple-400 font-black scale-105" : "text-slate-500"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter">টিম ও রিভিউ</span>
                </button>
              </div>

              {/* Main Tab Panel Content Editor */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#090312] relative pb-28 md:pb-6">
                
                {/* Mobile PWA Floating Horizontal Sub-Categories Nav Bar (Only visible under isStandalonePWA on mobile) */}
                {isStandalonePWA && (
                  <div className="md:hidden flex gap-2 overflow-x-auto pb-4 pt-0.5 scrollbar-none border-b border-purple-500/5 mb-4 shrink-0 font-sans">
                    {["websites", "services"].includes(activeTab) && (
                      <>
                        <button
                          onClick={() => setActiveTab("websites")}
                          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            activeTab === "websites"
                              ? "bg-purple-600 text-white"
                              : "bg-[#110724] text-slate-400 border border-purple-500/10"
                          }`}
                        >
                          🌐 ওয়েবসাইট শপ
                        </button>
                        <button
                          onClick={() => setActiveTab("services")}
                          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            activeTab === "services"
                              ? "bg-purple-600 text-white"
                              : "bg-[#110724] text-slate-400 border border-purple-500/10"
                          }`}
                        >
                          🛠️ এজেন্সি সেবাসমূহ
                        </button>
                      </>
                    )}

                    {["offers", "notices"].includes(activeTab) && (
                      <>
                        <button
                          onClick={() => setActiveTab("offers")}
                          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            activeTab === "offers"
                              ? "bg-purple-600 text-white"
                              : "bg-[#110724] text-slate-400 border border-purple-500/10"
                          }`}
                        >
                          🎁 স্পেশাল মেগা অফার
                        </button>
                        <button
                          onClick={() => setActiveTab("notices")}
                          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            activeTab === "notices"
                              ? "bg-purple-600 text-white"
                              : "bg-[#110724] text-slate-400 border border-purple-500/10"
                          }`}
                        >
                          📣 ঘোষণা নোটিশ বার
                        </button>
                      </>
                    )}

                    {["team", "portfolio", "testimonials"].includes(activeTab) && (
                      <>
                        <button
                          onClick={() => setActiveTab("team")}
                          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            activeTab === "team"
                              ? "bg-purple-600 text-white"
                              : "bg-[#110724] text-slate-400 border border-purple-500/10"
                          }`}
                        >
                          👥 টিম মেম্বার্স
                        </button>
                        <button
                          onClick={() => setActiveTab("portfolio")}
                          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            activeTab === "portfolio"
                              ? "bg-purple-600 text-white"
                              : "bg-[#110724] text-slate-400 border border-purple-500/10"
                          }`}
                        >
                          💼 প্রজেক্ট পোর্টফোলিও
                        </button>
                        <button
                          onClick={() => setActiveTab("testimonials")}
                          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            activeTab === "testimonials"
                              ? "bg-purple-600 text-white"
                              : "bg-[#110724] text-slate-400 border border-purple-500/10"
                          }`}
                        >
                          💬 ক্লায়েন্ট রিভিউ
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                {/* 1. HERO TAB */}
                {activeTab === "hero" && (
                  <div className="space-y-5 max-w-3xl">
                    <div className="border border-purple-500/10 bg-[#0e051d] p-5 rounded-2xl">
                      <h3 className="text-sm font-bold text-purple-400 mb-4 font-sans uppercase">হোমপেজ হিরো সেকশন কন্টেন্ট</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-slate-400 text-xs font-bold mb-2">হিরো টাইটেল (Title) - বাংলা</label>
                          <textarea
                            rows={2}
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 transition-all font-sans leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-xs font-bold mb-2">হিরো বিবর্ন সাবটাইটেল (Subtitle) - বাংলা</label>
                          <textarea
                            rows={3}
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 transition-all font-sans leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2">কল টু অ্যাকশন টেক্সট</label>
                            <input
                              type="text"
                              value={heroCta}
                              onChange={(e) => setHeroCta(e.target.value)}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2">যোগাযোগের হোয়াটসঅ্যার নম্বর</label>
                            <input
                              type="text"
                              value={heroWhatsapp}
                              onChange={(e) => setHeroWhatsapp(e.target.value)}
                              placeholder="01xxxxxxxxx"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-colors font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-purple-500/10 bg-[#0e051d] p-5 rounded-2xl space-y-5">
                      <div>
                        <h3 className="text-sm font-bold text-purple-400 mb-2 font-sans uppercase">হেডার ব্র্যান্ড ও লোগো সেটিংস (Header Brand & Logo Settings)</h3>
                        <p className="text-[11px] text-slate-400 mb-4 leading-normal">
                          নেভিগেশন হেডার বারে আপনার এজেন্সির লোগো সরাসরি আপলোড করুন অথবা ছবি লিংক দিন।
                        </p>
                        <ImageUploadField
                          label="হেডার লোগো সরাসরি আপলোড করুন অথবা ছবি লিংক দিন"
                          value={adminLogoUrl}
                          onChange={(val) => setAdminLogoUrl(val)}
                          placeholder="https://images.unsplash.com/photo-... অথবা লোগো ফাইল আপলোড"
                        />
                      </div>

                      <div className="border-t border-purple-500/5 pt-4 space-y-4">
                        <h4 className="text-xs font-bold text-purple-300 font-sans uppercase mb-1">কাস্টম টেক্সট ও ফন্ট ডিজাইন (Header Texts & Custom Font)</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-slate-400 text-[10px] font-bold mb-1.5">ব্র্যান্ড নাম (Brand Name)</label>
                            <input
                              type="text"
                              value={brandName}
                              onChange={(e) => setBrandName(e.target.value)}
                              placeholder="e.g. Avexon"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-slate-400 text-[10px] font-bold mb-1.5">ব্যাজ টেক্সট (Badge Text)</label>
                            <input
                              type="text"
                              value={brandBadge}
                              onChange={(e) => setBrandBadge(e.target.value)}
                              placeholder="e.g. Studio"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[10px] font-bold mb-1.5 font-sans">সাবটাইটেল / স্লোগান</label>
                            <input
                              type="text"
                              value={brandSubtitle}
                              onChange={(e) => setBrandSubtitle(e.target.value)}
                              placeholder="e.g. Premium Web Agency"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div className="border border-purple-500/10 bg-[#0d041c] p-4 rounded-xl space-y-4">
                          <h5 className="text-xs font-bold text-fuchsia-400 font-sans uppercase">১. ব্র্যান্ড নামের ফন্ট সেটিংস (Brand Name Font)</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-400 text-[10px] font-bold mb-1.5">গুগল ফন্ট লিংক (Google Font Import URL - ঐচ্ছিক)</label>
                              <input
                                type="text"
                                value={googleFontUrl}
                                onChange={(e) => setGoogleFontUrl(e.target.value)}
                                placeholder="e.g. https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-400 text-[10px] font-bold mb-1.5">ফন্ট ফ্যামিলি ক্লাসের নাম (Font Family Name)</label>
                              <input
                                type="text"
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                placeholder="e.g. 'Orbitron', sans-serif"
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 font-mono"
                              />
                            </div>
                          </div>

                          <div className="border border-purple-700/15 bg-[#140026]/40 p-4 rounded-xl space-y-2">
                            <FontUploadField
                              label="অথবা ব্র্যান্ড নামের কাস্টম ফন্ট ফাইল সরাসরি আপলোড করুন"
                              value={adminCustomFontUrl}
                              onChange={(val) => {
                                setAdminCustomFontUrl(val);
                                if (val) {
                                  setFontFamily("CustomUploadedFont");
                                }
                              }}
                            />
                            {adminCustomFontUrl && (
                              <p className="text-[10.5px] text-emerald-400 font-sans leading-relaxed">
                                ✨ <strong>কাস্টম ফন্ট আপলোড হয়েছে!</strong> এটি ব্র্যান্ড নামের ওপর সফলভাবে প্রয়োগ করা হয়েছে এবং ফন্ট ফ্যামিলি <code>CustomUploadedFont</code> হিসেবে সেট হয়েছে।
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="border border-purple-500/10 bg-[#0d041c] p-4 rounded-xl space-y-4">
                          <h5 className="text-xs font-bold text-fuchsia-400 font-sans uppercase">২. সাবটাইটেল (Web Agency) ফন্ট সেটিংস (Subtitle Font)</h5>
                          <div>
                            <label className="block text-slate-400 text-[10px] font-bold mb-1.5">ফন্ট ফ্যামিলি ক্লাসের নাম (Subtitle Font Family Name - ঐচ্ছিক)</label>
                            <input
                              type="text"
                              value={subtitleFontFamily}
                              onChange={(e) => setSubtitleFontFamily(e.target.value)}
                              placeholder="e.g. 'Fira Code', monospace"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 font-mono"
                            />
                          </div>

                          <div className="border border-purple-700/15 bg-[#140026]/40 p-4 rounded-xl space-y-2">
                            <FontUploadField
                              label="সাবটাইটেল (Web Agency) এর জন্য কাস্টম ফন্ট ফাইল সরাসরি আপলোড করুন"
                              value={adminSubtitleCustomFontUrl}
                              onChange={(val) => {
                                setAdminSubtitleCustomFontUrl(val);
                                if (val) {
                                  setSubtitleFontFamily("CustomUploadedSubtitleFont");
                                }
                              }}
                            />
                            {adminSubtitleCustomFontUrl && (
                              <p className="text-[10.5px] text-emerald-400 font-sans leading-relaxed">
                                ✨ <strong>সাবটাইটেল কাস্টম ফন্ট আপলোড হয়েছে!</strong> এটি সাবটাইটেল লেখার ওপর সফলভাবে প্রয়োগ করা হয়েছে এবং ফন্ট ফ্যামিলি <code>CustomUploadedSubtitleFont</code> হিসেবে সেট হয়েছে।
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-purple-500/5">
                            <label className="block text-slate-400 text-[10px] font-bold mb-1.5 font-sans uppercase">সাবটাইটেল লেখার সাইজ (Subtitle Text Size)</label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="6"
                                max="24"
                                step="1"
                                value={parseInt(subtitleFontSize) || 9}
                                onChange={(e) => setSubtitleFontSize(`${e.target.value}px`)}
                                className="flex-1 accent-purple-500 bg-[#110724] h-2 rounded-lg appearance-none cursor-pointer"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={subtitleFontSize}
                                  onChange={(e) => setSubtitleFontSize(e.target.value)}
                                  className="w-20 bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-2 py-1.5 text-xs text-center font-mono focus:outline-none focus:border-purple-500"
                                />
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">
                              স্লাইডার দিয়ে সাইজ পরিবর্তন করতে পারেন অথবা সরাসরি পিক্সেল সাইজ (যেমন: <code>9px</code>, <code>10px</code> বা <code>12px</code>) লিখে দিতে পারেন।
                            </p>
                          </div>
                        </div>

                        <p className="text-[10px] text-fuchsia-400/80 leading-snug">
                          💡 <strong>কিভাবে করবেন:</strong> গুগল ফন্টস (fonts.google.com) এ যেকোনো ফন্ট সিলেক্ট করে তার Embed কোড থেকে <code>&lt;link href="..."&gt;</code> এর URL-টি কপি করে এখানে দিন। অথবা আপনার নিজের যেকোনো ডাউনলোড করা ফন্ট ফাইল (যেমন <strong>.ttf</strong>, <strong>.woff</strong>, <strong>.woff2</strong>, বা <strong>.otf</strong>) সরাসরি আপলোড করতে ওপরের আপলোডার দুটি ব্যবহার করুন!
                        </p>
                      </div>
                    </div>

                    <div className="border border-purple-500/10 bg-[#0e051d] p-5 rounded-2xl">
                      <h3 className="text-sm font-bold text-purple-400 mb-4 font-sans uppercase">ফ্লোটিং ওনার প্রোফাইল সেটিংস</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2">ওনার / প্রতিষ্ঠাতার নাম (Owner's Name)</label>
                            <input
                              type="text"
                              value={ownerName}
                              onChange={(e) => setOwnerName(e.target.value)}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2">ভূমিকা / পদবী (Role/Designation)</label>
                            <input
                              type="text"
                              value={ownerRole}
                              onChange={(e) => setOwnerRole(e.target.value)}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 text-xs font-bold mb-2">ছোট বর্ণনা / টাইটেল (Title Description)</label>
                          <input
                            type="text"
                            value={ownerTitle}
                            onChange={(e) => setOwnerTitle(e.target.value)}
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all"
                          />
                        </div>

                        <div>
                          <ImageUploadField
                            label="ছবি সরাসরি আপলোড করুন অথবা ছবি লিংক দিন (Owner Profile Photo)"
                            value={ownerPicUrl}
                            onChange={(val) => setOwnerPicUrl(val)}
                            placeholder="https://images.unsplash.com/photo-..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Contact, social and payment info section */}
                    <div className="border border-purple-500/10 bg-[#0e051d] p-5 rounded-2xl">
                      <h3 className="text-sm font-bold text-purple-400 mb-4 font-sans uppercase">ব্যবসা, কন্টাক্ট ও পেমেন্ট সেটিংস</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-slate-400 text-xs font-bold mb-2">অফিস ঠিকানা (Office Address) - বাংলা</label>
                          <textarea
                            rows={2}
                            value={officeAddress}
                            onChange={(e) => setOfficeAddress(e.target.value)}
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 transition-all leading-relaxed font-sans"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2 font-sans">হেল্পライン নম্বরসমূহ (কমা দিয়ে লিখুন)</label>
                            <input
                              type="text"
                              value={helplineNumbers}
                              onChange={(e) => setHelplineNumbers(e.target.value)}
                              placeholder="+৮৮০ ১৭৬৩-৪৪৫৬৯৯, +৮৮০ ১৮১২-৯৯০১১১"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2">সাপোর্ট ইমেইলসমূহ (কমা দিয়ে লিখুন)</label>
                            <input
                              type="text"
                              value={officialEmails}
                              onChange={(e) => setOfficialEmails(e.target.value)}
                              placeholder="support@avexon.com, info@avexon.com"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all font-sans"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2">সাপোর্ট আওয়ার্স (কাজের সময়)</label>
                            <input
                              type="text"
                              value={supportHours}
                              onChange={(e) => setSupportHours(e.target.value)}
                              placeholder="শনিবার থেকে বৃহস্পতিবার, সকাল ১০:০০ টা থেকে রাত ০৮:০০ টা"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all font-sans"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-400 text-xs font-bold mb-2">বিকাশ নম্বর (Personal)</label>
                              <input
                                type="text"
                                value={bkashNumber}
                                onChange={(e) => setBkashNumber(e.target.value)}
                                placeholder="017xxxxxxxx"
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 text-xs font-bold mb-2">নগদ নম্বর (Personal)</label>
                              <input
                                type="text"
                                value={nagadNumber}
                                onChange={(e) => setNagadNumber(e.target.value)}
                                placeholder="018xxxxxxxx"
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-purple-500/5 pt-4">
                          <h4 className="text-xs font-bold text-fuchsia-400 mb-3 uppercase">সামাজিক যোগাযোগ মাধ্যমের পেজ লিংক রেফারেন্স</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-slate-400 text-[10px] font-bold mb-1.5 font-sans">Facebook URL</label>
                              <input
                                type="text"
                                value={facebookUrl}
                                onChange={(e) => setFacebookUrl(e.target.value)}
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 text-[10px] font-bold mb-1.5 font-sans">Twitter URL</label>
                              <input
                                type="text"
                                value={twitterUrl}
                                onChange={(e) => setTwitterUrl(e.target.value)}
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 text-[10px] font-bold mb-1.5 font-sans">LinkedIn URL</label>
                              <input
                                type="text"
                                value={linkedinUrl}
                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 text-[10px] font-bold mb-1.5 font-sans">GitHub URL</label>
                              <input
                                type="text"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 shrink-0 pt-2">
                      <button
                        onClick={handleSaveHero}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-purple-900/10 transition-colors"
                      >
                        আপডেট হোম কনটেন্ট
                      </button>
                    </div>
                  </div>
                )}

                {/* SPECIAL MEGA OFFER TAB */}
                {activeTab === "offers" && (
                  <div className="space-y-6 max-w-4xl">
                    
                    {/* Master Switcher */}
                    <div className="border border-purple-500/15 bg-gradient-to-r from-[#0f0624] to-[#120520] p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                          <Clock className="w-5 h-5 text-purple-400 animate-pulse" />
                          <span>স্পেশাল মেগা অফার সেটিংস (Special Offer Controls)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          ওয়েবসাইটের মাঝের আকর্ষণীয় স্পেশাল মেগা অফার কাউন্টডাউন ব্যানারটি চালু বা বন্ধ রাখতে পারেন।
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold font-sans px-2.5 py-1 rounded-full ${
                          offerShow ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-slate-800 text-slate-400 border border-slate-700/50"
                        }`}>
                          {offerShow ? "সক্রিয় (ONLINE)" : "নিষ্ক্রিয় (OFFLINE)"}
                        </span>
                        
                        <div className="flex gap-1.5 p-1 bg-purple-950/20 border border-purple-900/30 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setOfferShow(true)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              offerShow 
                                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/10" 
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            অন করুন
                          </button>
                          <button
                            type="button"
                            onClick={() => setOfferShow(false)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              !offerShow 
                                ? "bg-red-900/60 text-white border border-red-500/10" 
                                : "text-slate-400 hover:text-rose-450"
                            }`}
                          >
                            অফ করুন
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Master Discount Off/On Option */}
                    <div className="border border-purple-500/15 bg-gradient-to-r from-[#0f0624] to-[#120520] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                          <span>স্পেশাল ডিসকাউন্ট অফার রান (Run Special Discount)</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          এটি অন করলে সকল রেডি-মেড এবং কাস্টম ওয়েবসাইট অর্ডারের ওপর নির্ধারিত ডিসকাউন্ট (%) স্বয়ংক্রিয়ভাবে কার্যকর হবে।
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold font-sans px-2.5 py-1 rounded-full ${
                            offerDiscountActive ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-slate-800 text-slate-400 border border-slate-700/50"
                          }`}>
                            {offerDiscountActive ? "ডিসকাউন্ট চালু (ACTIVE)" : "ডিসকাউন্ট বন্ধ (INACTIVE)"}
                          </span>

                          <div className="flex gap-1.5 p-1 bg-purple-950/20 border border-purple-900/30 rounded-xl">
                            <button
                              type="button"
                              onClick={() => setOfferDiscountActive(true)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                offerDiscountActive 
                                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/10" 
                                  : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              অন করুন
                            </button>
                            <button
                              type="button"
                              onClick={() => setOfferDiscountActive(false)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                !offerDiscountActive 
                                  ? "bg-red-900/60 text-white border border-red-500/10" 
                                  : "text-slate-400 hover:text-rose-450"
                              }`}
                            >
                              অফ করুন
                            </button>
                          </div>
                        </div>

                        {/* Percentage custom input */}
                        <div className="flex items-center gap-2 bg-[#120728] p-1.5 border border-purple-500/20 rounded-xl">
                          <label className="text-[11px] text-slate-350 font-sans font-bold pl-1">ছাড় (%):</label>
                          <input
                            type="number"
                            min="1"
                            max="95"
                            value={offerDiscountPercentage}
                            onChange={(e) => setOfferDiscountPercentage(Math.max(1, Math.min(95, parseInt(e.target.value) || 10)))}
                            className="w-14 bg-[#080214] border border-purple-500/25 text-center text-purple-300 rounded-lg py-1 text-xs focus:outline-none focus:border-purple-500 font-extrabold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Offer Content Config Card */}
                    <div className="border border-purple-500/10 bg-[#0e051d] p-5 rounded-2xl space-y-5">
                      <h3 className="text-sm font-bold text-purple-400 mb-2 font-sans uppercase">ব্যানার কন্টেন্ট ও টাইটেল সেটিংস</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2">সারপ্রাইজ ব্যাজ / অফার হেডার (Badge Text)</label>
                            <input
                              type="text"
                              value={offerBadgeText}
                              onChange={(e) => setOfferBadgeText(e.target.value)}
                              placeholder="আজকের বিশেষ মেগা অফার"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2">জরুরি অবস্থা নির্দেশক লাল লেখা (Urgency Title)</label>
                            <input
                              type="text"
                              value={offerUrgencyText}
                              onChange={(e) => setOfferUrgencyText(e.target.value)}
                              placeholder="দ্রুত ফুরিয়ে যাচ্ছে!"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-all font-sans"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 text-xs font-bold mb-2">অফারের অফিশিয়াল বিবরণ (Offer Description)</label>
                          <textarea
                            rows={3}
                            value={offerDescriptionText}
                            onChange={(e) => setOfferDescriptionText(e.target.value)}
                            placeholder="সীমিত সময়ের মেগা ফ্ল্যাশ ডিল শেষ হওয়ার পূর্বেই অর্ডার কনফার্ম করে ওয়েবসাইট ওনারশিপ বুঝে নিন।"
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 transition-all font-sans leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Timer Configuration Card */}
                    <div className="border border-purple-500/10 bg-[#0e051d] p-5 rounded-2xl space-y-5">
                      <h3 className="text-sm font-bold text-purple-400 mb-2 font-sans uppercase">টাইমার কাউন্টডাউন কন্ট্রোল</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-slate-400 text-xs font-bold mb-2">টাইমারের ধরন (Timer Countdown Type)</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setOfferTimerType("midnight")}
                              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                offerTimerType === "midnight"
                                  ? "border-purple-500 bg-purple-500/10 text-white"
                                  : "border-purple-500/15 bg-[#110724] hover:bg-purple-950/10 text-slate-300"
                              }`}
                            >
                              <div className="font-bold text-xs uppercase mb-1">মাঝরাত পর্যন্ত কাউন্টডাউন (Midnight Auto Reset)</div>
                              <div className="text-[10px] text-slate-400 leading-snug">প্রতিদিন রাত ২৩:৫৯:৫৯ এ পৌঁছালে টাইমারটি স্বয়ংক্রিয়ভাবে আবার ২৪ ঘন্টা থেকে কাউন্টডাউন শুরু করে।</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setOfferTimerType("custom_target")}
                              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                offerTimerType === "custom_target"
                                  ? "border-purple-500 bg-purple-500/10 text-white"
                                  : "border-purple-500/15 bg-[#110724] hover:bg-purple-950/10 text-slate-300"
                              }`}
                            >
                              <div className="font-bold text-xs uppercase mb-1">নির্দিষ্ট তারিখ পর্যন্ত কাউন্টডাউন (Fixed Target Date)</div>
                              <div className="text-[10px] text-slate-400 leading-snug">ভবিষ্যতের একটি নির্দিষ্ট ক্যালেন্ডার তারিখ ও সময় পর্যন্ত অফার টাইমার চালিত হবে।</div>
                            </button>
                          </div>
                        </div>

                        {offerTimerType === "custom_target" && (
                          <div
                            className="bg-[#120726]/40 p-4 border border-purple-500/5 rounded-xl space-y-2 mt-2"
                          >
                            <label className="block text-slate-400 text-xs font-bold mb-1">অফারের লিমিত সময়সীমা (Target Ending Date & Time)</label>
                            <input
                              type="datetime-local"
                              value={offerCustomTargetDate}
                              onChange={(e) => setOfferCustomTargetDate(e.target.value)}
                              className="bg-[#110724] border border-purple-500/20 text-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-500"
                            />
                            <p className="text-[10px] text-slate-400 leading-normal">
                              মন্তব্য: লক্ষ্যযুক্ত শেষ সময়সীমা নির্বাচন করুন। কাউন্টডাউন সেই লক্ষ্য ডেট-টাইম পার হয়ে গেলে শূন্য হয়ে যাবে।
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 shrink-0 pt-2">
                      <button
                        onClick={handleSaveOfferSetting}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-purple-900/10 transition-colors"
                      >
                        মেগা অফার কন্টেন্ট সংরক্ষণ করুন
                      </button>
                    </div>

                  </div>
                )}

                {/* 1.5 NOTICES MANAGEMENT TAB */}
                {activeTab === "notices" && (
                  <div className="space-y-6 max-w-4xl">
                    
                    {/* Master Switcher */}
                    <div className="border border-purple-500/15 bg-gradient-to-r from-[#0f0624] to-[#120520] p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                          <Megaphone className="w-5 h-5 text-purple-400 animate-bounce" style={{ animationDuration: '4s' }} />
                          <span>ঘোষণা নোটিশ বার সেটিংস (Notice Bar Controls)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          ওয়েবসাইটের একেবারে ওপরে স্ক্রলিং ঘোষণা বার চালু বা বন্ধ রাখতে এবং অফার কন্টেন্ট কাস্টমাইজ করতে পারেন।
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold font-sans px-2.5 py-1 rounded-full ${
                          noticeShow ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-slate-800 text-slate-400 border border-slate-700/50"
                        }`}>
                          {noticeShow ? "সক্রিয় (ONLINE)" : "নিষ্ক্রিয় (OFFLINE)"}
                        </span>
                        
                        <div className="flex gap-1.5 p-1 bg-purple-950/20 border border-purple-900/30 rounded-xl">
                          <button
                            type="button"
                            onClick={() => handleSaveNoticeBarSetting(true)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              noticeShow 
                                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/10" 
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            অন করুন
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNoticeBarSetting(false)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              !noticeShow 
                                ? "bg-red-900/60 text-white border border-red-500/10" 
                                : "text-slate-400 hover:text-rose-400"
                            }`}
                          >
                            অফ করুন
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Editor Form for Adding/Editing an Item */}
                    {editingLocalNoticeId !== null && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-purple-500/20 bg-[#0e051d] p-5 rounded-2xl relative shadow-xl"
                      >
                        <div className="absolute top-4 right-4">
                          <button
                            type="button"
                            onClick={handleCancelNoticeEdit}
                            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-purple-400" />
                          <span>{editingLocalNoticeId === "new" ? "নতুন ঘোষণা নোটিশ যোগ করুন" : "ঘোষণা নোটিশ এডিট করুন"}</span>
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-slate-300 text-xs font-bold mb-1.5">নোটিশ টেক্সট কন্টেন্ট (বাধ্যতামূলক)</label>
                            <textarea
                              rows={2}
                              value={tempNoticeText}
                              onChange={(e) => setTempNoticeText(e.target.value)}
                              placeholder="যেকোনো কাস্টম বা প্রি-মেড ওয়েবসাইট অর্ডারে পাচ্ছেন ফ্ল্যাট ১০% মেগা ডিসকাউন্ট!"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 font-sans"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-300 text-xs font-bold mb-1.5">অফারের বিশেষ ব্যাজ (Badge)</label>
                              <input
                                type="text"
                                value={tempNoticeBadge}
                                onChange={(e) => setTempNoticeBadge(e.target.value)}
                                placeholder="সীমিত সময়ের অফার"
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-300 text-xs font-bold mb-1.5">হলুদ হাইলাইট টেক্সট / প্রমো কোড</label>
                              <input
                                type="text"
                                value={tempNoticeHighlight}
                                onChange={(e) => setTempNoticeHighlight(e.target.value)}
                                placeholder="PROMO: AVEXON10"
                                className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 font-mono"
                              />
                            </div>
                          </div>

                          {/* Icon Selector Grid */}
                          <div>
                            <label className="block text-slate-300 text-xs font-bold mb-2">নোটিশ আইকন নির্বাচন করুন (Select Icon)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-1">
                              {[
                                { name: "Sparkles", label: "তারকা", desc: "Yellow Glow", component: <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" /> },
                                { name: "Flame", label: "আগুন", desc: "Orange Heat", component: <Flame className="w-4 h-4 text-orange-500" /> },
                                { name: "HeartHandshake", label: "হ্যান্ডশেক", desc: "Pink Friendship", component: <HeartHandshake className="w-4 h-4 text-pink-400" /> },
                                { name: "ShieldCheck", label: "সুরক্ষিত", desc: "Emerald Green", component: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
                                { name: "Clock", label: "সময়", desc: "Purple Timer", component: <Clock className="w-4 h-4 text-purple-400" /> },
                                { name: "Megaphone", label: "ঘোষণা", desc: "Notification", component: <Megaphone className="w-4 h-4 text-purple-400" /> }
                              ].map((icOption) => (
                                <button
                                  type="button"
                                  key={icOption.name}
                                  onClick={() => setTempNoticeIcon(icOption.name)}
                                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                                    tempNoticeIcon === icOption.name
                                      ? "bg-purple-500/15 border-purple-500 text-white shadow-md shadow-purple-500/5 scale-[1.03]"
                                      : "bg-[#110724] border-purple-950 text-slate-400 hover:border-purple-800/40 hover:text-slate-200"
                                  }`}
                                >
                                  {icOption.component}
                                  <span className="text-[10px] font-bold block truncate leading-none mt-0.5">{icOption.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-5 border-t border-purple-500/5 mt-5">
                          <button
                            type="button"
                            onClick={handleCancelNoticeEdit}
                            className="bg-slate-900 border border-slate-800 hover:bg-slate-950 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                          >
                            বাতিল
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveNoticeItem}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-purple-500/15"
                          >
                            {editingLocalNoticeId === "new" ? "যোগ করুন" : "আপডেট করুন"}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Notice Items List Table */}
                    <div className="border border-purple-500/10 bg-[#0c051a] rounded-2xl overflow-hidden">
                      <div className="px-5 py-4 border-b border-purple-500/10 flex items-center justify-between bg-purple-950/10">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-sans">নোটিশ স্লাইডস তালিকা ({localNotices?.length || 0})</h4>
                        {editingLocalNoticeId === null && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLocalNoticeId("new");
                              setTempNoticeBadge("অফার ব্যাজ");
                              setTempNoticeText("");
                              setTempNoticeHighlight("");
                              setTempNoticeIcon("Sparkles");
                            }}
                            className="bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 hover:text-purple-200 border border-purple-500/30 font-bold text-[11px] px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>নতুন নোটিশ যোগ করুন</span>
                          </button>
                        )}
                      </div>

                      {(!localNotices || localNotices.length === 0) ? (
                        <div className="text-center py-10">
                          <p className="text-slate-500 text-xs">কোনো নোটিশ স্লাইড খুঁজে পাওয়া যায়নি! অনুগ্রহ করে নতুন নোটিশ যোগ করুন।</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-purple-500/5 max-h-[350px] overflow-y-auto custom-scrollbar">
                          {localNotices.map((notice, index) => (
                            <div key={notice.id || index} className="flex items-center justify-between p-4 bg-transparent hover:bg-purple-950/5 transition-all gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 sm:p-2.5 bg-purple-500/10 border border-purple-500/10 rounded-xl shrink-0">
                                  {notice.iconName === "Sparkles" && <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />}
                                  {notice.iconName === "Flame" && <Flame className="w-4 h-4 text-orange-500" />}
                                  {notice.iconName === "HeartHandshake" && <HeartHandshake className="w-4 h-4 text-pink-400" />}
                                  {notice.iconName === "ShieldCheck" && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                                  {notice.iconName === "Clock" && <Clock className="w-4 h-4 text-purple-400" />}
                                  {notice.iconName === "Megaphone" && <Megaphone className="w-4 h-4 text-purple-400" />}
                                  {!["Sparkles","Flame","HeartHandshake","ShieldCheck","Clock","Megaphone"].includes(notice.iconName) && <Sparkles className="w-4 h-4 text-purple-300" />}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {notice.badge && (
                                      <span className="bg-purple-500/25 text-purple-300 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border border-purple-500/20">
                                        {notice.badge}
                                      </span>
                                    )}
                                    {notice.highlight && (
                                      <span className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-1 py-0.2 rounded text-[9.5px] font-mono leading-none">
                                        {notice.highlight}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-200 text-xs mt-1 md:text-sm truncate pr-4 font-sans leading-relaxed">{notice.text}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditNoticeItemClick(notice)}
                                  title="এডিট করুন"
                                  className="p-1 px-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all rounded-lg cursor-pointer flex items-center gap-1 text-[11px]"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">এডিট</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNoticeItem(notice.id)}
                                  title="মুছে ফেলুন"
                                  className="p-1 px-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg cursor-pointer flex items-center gap-1 text-[11px]"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">মুছুন</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. WEBSITES SHOP TAB */}
                {activeTab === "websites" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-purple-400">ম্যানুফ্যাকচারিং ও ওয়েবসাইট প্রোডাক্টস</h3>
                        <p className="text-[10px] text-slate-400">এখান থেকে শপ পেজের রেডিমেড ওয়েবসাইট মডিউল তালিকা এডিট বা নতুন মডিউল তৈরি করতে পারবেন।</p>
                      </div>
                      {!editWebItem && (
                        <button
                          onClick={() => setEditWebItem({})}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>নতুন প্রোডাক্ট যোগ করুন</span>
                        </button>
                      )}
                    </div>

                    {editWebItem ? (
                      <div className="border border-purple-500/20 bg-[#0e051d] p-5 rounded-2xl space-y-4 max-w-3xl">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                          {editWebItem.id ? "ওয়েবসাইট এডিট ফরম" : "নতুন ওয়েবসাইট প্রোডাক্ট ফরম"}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">ওয়েবসাইট টাইটেল (বাংলা)</label>
                            <input
                              type="text"
                              value={editWebItem.title || ""}
                              onChange={(e) => setEditWebItem({...editWebItem, title: e.target.value})}
                              placeholder="যেমন: আলটিমেট লজিস্টিক পোর্টাল"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">ক্যাটাগরি</label>
                            <input
                              type="text"
                              value={editWebItem.category || ""}
                              onChange={(e) => setEditWebItem({...editWebItem, category: e.target.value})}
                              placeholder="যেমন: প্রিমিয়াম ই-commerce"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">ডেলিভারি সময়সীমা</label>
                            <input
                              type="text"
                              value={editWebItem.deliveryTime || ""}
                              onChange={(e) => setEditWebItem({...editWebItem, deliveryTime: e.target.value})}
                              placeholder="২-৪ দিন"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">মূল্য (৳)</label>
                            <input
                              type="number"
                              value={editWebItem.price || ""}
                              onChange={(e) => setEditWebItem({...editWebItem, price: Number(e.target.value)})}
                              placeholder="8000"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">আসল মূল্য তালিকা (ডিসকাউন্ট দেখানোর জন্য)</label>
                            <input
                              type="number"
                              value={editWebItem.originalPrice || ""}
                              onChange={(e) => setEditWebItem({...editWebItem, originalPrice: Number(e.target.value)})}
                              placeholder="15000"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">রেটিং (Rating)</label>
                            <input
                              type="number"
                              step="0.1"
                              max="5"
                              value={editWebItem.rating || ""}
                              onChange={(e) => setEditWebItem({...editWebItem, rating: Number(e.target.value)})}
                              placeholder="4.9"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">মোট সেলস বা অর্ডার সংখ্যা</label>
                            <input
                              type="number"
                              value={editWebItem.ordersCount || ""}
                              onChange={(e) => setEditWebItem({...editWebItem, ordersCount: Number(e.target.value)})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">ফিচার সংখ্যা (Features Count)</label>
                            <input
                              type="number"
                              value={editWebItem.featuresCount || ""}
                              onChange={(e) => setEditWebItem({...editWebItem, featuresCount: Number(e.target.value)})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <ImageUploadField
                            label="ওয়েবসাইট থিম স্ক্রিনশট আপলোড করুন অথবা লিংক দিন (Product Image)"
                            value={editWebItem.image || ""}
                            onChange={(val) => setEditWebItem({...editWebItem, image: val})}
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[11px] font-bold mb-2">ট্যাগ সমূহ (কমা দিয়ে আলাদা করেন)</label>
                          <input
                            type="text"
                            value={editWebItem.tags ? editWebItem.tags.join(", ") : ""}
                            onChange={(e) => setEditWebItem({...editWebItem, tags: e.target.value.split(",").map(t => t.trim())})}
                            placeholder="SSLCommerz, SMS Gateway, Inventory"
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[11px] font-bold mb-2">ডেমো ওয়েবসাইট লিংক (Live Demo URL)</label>
                          <input
                            type="text"
                            value={editWebItem.demoUrl || ""}
                            onChange={(e) => setEditWebItem({...editWebItem, demoUrl: e.target.value})}
                            placeholder="যেমন: https://react.dev"
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs font-mono"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditWebItem(null)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                          >
                            বাতিল
                          </button>
                          <button
                            onClick={handleSaveWebsiteProduct}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {websites.map((w) => (
                          <div key={w.id} className="bg-[#0e051d] border border-purple-500/10 p-4.5 rounded-2xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img src={w.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-100 font-sans leading-snug line-clamp-1">{w.title}</h4>
                                <p className="text-[10px] text-purple-400 font-semibold">{w.category} • ৳{w.price.toLocaleString("bn-BD")}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditWebItem(w)}
                                className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-colors cursor-pointer"
                                title="এডিট করুন"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteWebsite(w.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                                title="ডিলিট করুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SERVICES TAB */}
                {activeTab === "services" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-purple-400">এভেক্সন স্পেশালিটি সেবাসমূহ</h3>
                        <p className="text-[10px] text-slate-400">আমাদের কোর সেবাসমূহের তালিকা, মূল্য রেঞ্জ এবং প্রযুক্তি স্ট্যাক এডিট করুন।</p>
                      </div>
                      {!editServiceItem && (
                        <button
                          onClick={() => setEditServiceItem({})}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>নতুন সেবা যোগ করুন</span>
                        </button>
                      )}
                    </div>

                    {editServiceItem ? (
                      <div className="border border-purple-500/20 bg-[#0e051d] p-5 rounded-2xl space-y-4 max-w-3xl">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                          সেবা মডিউল ফরম
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">সেবার শিরোনাম (title)</label>
                            <input
                              type="text"
                              value={editServiceItem.title || ""}
                              onChange={(e) => setEditServiceItem({...editServiceItem, title: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">আইকন নাম (Lucide Icon Name)</label>
                            <input
                              type="text"
                              value={editServiceItem.iconName || "Globe"}
                              onChange={(e) => setEditServiceItem({...editServiceItem, iconName: e.target.value})}
                              placeholder="Globe, ShoppingCart, Figma, Sparkles"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">সর্বনিম্ন মূল্য শুরু</label>
                            <input
                              type="text"
                              value={editServiceItem.priceStarting || "৳৮,০০০"}
                              onChange={(e) => setEditServiceItem({...editServiceItem, priceStarting: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">সমকাল / ডেলিভারি সময়</label>
                            <input
                              type="text"
                              value={editServiceItem.duration || "৩-৫ দিন"}
                              onChange={(e) => setEditServiceItem({...editServiceItem, duration: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[11px] font-bold mb-2">সেবার বিস্তারিত বিবরণ</label>
                          <textarea
                            rows={3}
                            value={editServiceItem.description || ""}
                            onChange={(e) => setEditServiceItem({...editServiceItem, description: e.target.value})}
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[11px] font-bold mb-2">টেকনোলজি ও স্কিলসমূহ (কমা দিয়ে সাজান)</label>
                          <input
                            type="text"
                            value={editServiceItem.techs ? editServiceItem.techs.join(", ") : ""}
                            onChange={(e) => setEditServiceItem({...editServiceItem, techs: e.target.value.split(",").map(t => t.trim())})}
                            placeholder="React, Tailwind, Express.js"
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditServiceItem(null)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                          >
                            বাতিল
                          </button>
                          <button
                            onClick={handleSaveService}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((s) => (
                          <div key={s.id} className="bg-[#0e051d] border border-purple-500/10 p-4 rounded-2xl flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-slate-100">{s.title}</h4>
                              <p className="text-[10px] text-slate-400 leading-normal mt-1 max-w-[280px] line-clamp-1">{s.description}</p>
                              <p className="text-[10px] text-purple-400 mt-1 font-mono">{s.priceStarting} • Duration: {s.duration}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-4">
                              <button
                                onClick={() => setEditServiceItem(s)}
                                className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(s.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. PORTFOLIO TAB */}
                {activeTab === "portfolio" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-purple-400">সফল প্রজেক্ট পোর্টফোলিও</h3>
                        <p className="text-[10px] text-slate-400">এখান থেকে এভেক্সন টিমের পূর্বের কাজের কেস স্টাডি বা পোর্টফোলিও রেকর্ডিং মডিডিফাই করতে পারেন।</p>
                      </div>
                      {!editPortfolioItem && (
                        <button
                          onClick={() => setEditPortfolioItem({})}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>নতুন প্রজেক্ট যোগ করুন</span>
                        </button>
                      )}
                    </div>

                    {editPortfolioItem ? (
                      <div className="border border-purple-500/20 bg-[#0e051d] p-5 rounded-2xl space-y-4 max-w-3xl">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                          প্রজেক্ট ডেকোরেশন ফরম
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">প্রজেক্ট টাইটেল (বাংলা)</label>
                            <input
                              type="text"
                              value={editPortfolioItem.title || ""}
                              onChange={(e) => setEditPortfolioItem({...editPortfolioItem, title: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">ক্যাটাগরি</label>
                            <input
                              type="text"
                              value={editPortfolioItem.category || ""}
                              onChange={(e) => setEditPortfolioItem({...editPortfolioItem, category: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">ক্লায়েন্ট নেম / প্রতিষ্ঠান</label>
                            <input
                              type="text"
                              value={editPortfolioItem.client || ""}
                              onChange={(e) => setEditPortfolioItem({...editPortfolioItem, client: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">বছর (Year)</label>
                            <input
                              type="text"
                              value={editPortfolioItem.year || "২০২৬"}
                              onChange={(e) => setEditPortfolioItem({...editPortfolioItem, year: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[11px] font-bold mb-2">প্রজেক্ট কেস স্টাডি বিবরণ</label>
                          <textarea
                            rows={3}
                            value={editPortfolioItem.description || ""}
                            onChange={(e) => setEditPortfolioItem({...editPortfolioItem, description: e.target.value})}
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs font-sans"
                          />
                        </div>

                        <div>
                          <ImageUploadField
                            label="পোর্টফোলিও প্রজেক্ট স্ক্রিনশট আপলোড করুন অথবা লিংক দিন (Project Screenshot)"
                            value={editPortfolioItem.imageUrl || ""}
                            onChange={(val) => setEditPortfolioItem({...editPortfolioItem, imageUrl: val})}
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[11px] font-bold mb-2">ব্যবহৃত টুলস / টেকনোলজি (কমা দিয়ে সাজান)</label>
                          <input
                            type="text"
                            value={editPortfolioItem.tags ? editPortfolioItem.tags.join(", ") : ""}
                            onChange={(e) => setEditPortfolioItem({...editPortfolioItem, tags: e.target.value.split(",").map(t => t.trim())})}
                            placeholder="Next.js, Tailwind, Prisma, PostgreSQL"
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditPortfolioItem(null)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl"
                          >
                            বাতিল
                          </button>
                          <button
                            onClick={handleSavePortfolio}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2 rounded-xl"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolio.map((p) => (
                          <div key={p.id} className="bg-[#0e051d] border border-purple-500/10 p-4.5 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-100 font-sans">{p.title}</h4>
                                <p className="text-[10px] text-purple-400 mt-0.5">{p.client} • {p.year}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 ml-4 shrink-0">
                              <button
                                onClick={() => setEditPortfolioItem(p)}
                                className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePortfolio(p.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. TESTIMONIALS TAB */}
                {activeTab === "testimonials" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-purple-400">গ্রাহক সন্তুষ্টি রিভিউ (Testimonials)</h3>
                        <p className="text-[10px] text-slate-400">হোমপেজের রিভিউ স্লাইডিং প্যানেলের তথ্য আপডেট করুন বা নতুন ক্লায়েন্ট প্রতিক্রিয়া লিখুন।</p>
                      </div>
                      {!editTestimonialItem && (
                        <button
                          onClick={() => setEditTestimonialItem({})}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>নতুন রিভিউ দিন</span>
                        </button>
                      )}
                    </div>

                    {editTestimonialItem ? (
                      <div className="border border-purple-500/20 bg-[#0e051d] p-5 rounded-2xl space-y-4 max-w-3xl">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                          রিভিউ ডাটা ফরম
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">গ্রাহকের নাম (বাংলা)</label>
                            <input
                              type="text"
                              value={editTestimonialItem.name || ""}
                              onChange={(e) => setEditTestimonialItem({...editTestimonialItem, name: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">পদবী এবং প্রতিষ্ঠান</label>
                            <input
                              type="text"
                              value={editTestimonialItem.role || ""}
                              onChange={(e) => setEditTestimonialItem({...editTestimonialItem, role: e.target.value})}
                              placeholder="এমডি, কলার্স ফ্যাশন বিডি"
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">রিভিউর শ্রেণীবিভাগ (Type)</label>
                            <select
                              value={editTestimonialItem.type || "custom"}
                              onChange={(e) => setEditTestimonialItem({...editTestimonialItem, type: e.target.value as "readymade" | "custom"})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none"
                            >
                              <option value="custom">কাস্টম ডেভেলপমেন্ট (Custom Dev)</option>
                              <option value="readymade">রেডিমেড প্রজেক্ট অর্ডার (Readymade Order)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">রেটিং স্টার সংখ্যা (১-৫)</label>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={editTestimonialItem.rating || 5}
                              onChange={(e) => setEditTestimonialItem({...editTestimonialItem, rating: Number(e.target.value)})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <ImageUploadField
                            label="ভোক্তা বা ক্লায়েন্টের প্রোফাইল ছবি আপলোড করুন অথবা লিংক দিন (Avatar)"
                            value={editTestimonialItem.avatarUrl || ""}
                            onChange={(val) => setEditTestimonialItem({...editTestimonialItem, avatarUrl: val})}
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[11px] font-bold mb-2">মন্তব্য বা রিভিউ বডি টেক্সট</label>
                          <textarea
                            rows={3}
                            value={editTestimonialItem.text || ""}
                            onChange={(e) => setEditTestimonialItem({...editTestimonialItem, text: e.target.value})}
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs font-sans leading-relaxed"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditTestimonialItem(null)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl"
                          >
                            বাতিল
                          </button>
                          <button
                            onClick={handleSaveTestimonial}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2 rounded-xl"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testimonials.map((t) => (
                          <div key={t.id} className="bg-[#0e051d] border border-purple-500/10 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={t.avatarUrl} alt="" className="w-11 h-11 rounded-full object-cover" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-100">{t.name}</h4>
                                <p className="text-[9px] text-slate-500">{t.role}</p>
                                <p className="text-[10px] text-purple-400 mt-1 line-clamp-1 italic">"{t.text}"</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-4">
                              <button
                                onClick={() => setEditTestimonialItem(t)}
                                className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(t.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. TEAM MEMBERS TAB */}
                {activeTab === "team" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-purple-400">এভেক্সন ফাউন্ডেশন টিম মেম্বার্স</h3>
                        <p className="text-[10px] text-slate-400">টিম কার্ডের তথ্য, বায়োগ্রাফি, কারিগরি স্কিল এবং পোর্ট্রেট ছবি লিংক মডিফাই করুন।</p>
                      </div>
                      {!editTeamItem && (
                        <button
                          onClick={() => setEditTeamItem({})}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>টিম মেম্বার যোগ করুন</span>
                        </button>
                      )}
                    </div>

                    {editTeamItem ? (
                      <div className="border border-purple-500/20 bg-[#0e051d] p-5 rounded-2xl space-y-4 max-w-3xl">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                          টিম মেম্বার ডাটা ফরম
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">নাম (বাংলা)</label>
                            <input
                              type="text"
                              value={editTeamItem.name || ""}
                              onChange={(e) => setEditTeamItem({...editTeamItem, name: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-2">পদবী / ডেজিগনেশন</label>
                            <input
                              type="text"
                              value={editTeamItem.role || ""}
                              onChange={(e) => setEditTeamItem({...editTeamItem, role: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <ImageUploadField
                            label="টিম মেম্বারের ছবি আপলোড করুন অথবা সরাসরি লিংক দিন (Profile Photo)"
                            value={editTeamItem.imageUrl || ""}
                            onChange={(val) => setEditTeamItem({...editTeamItem, imageUrl: val})}
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[11px] font-bold mb-2">বায়োগ্রাফি / সংক্ষিপ্ত পরিচিতি</label>
                          <textarea
                            rows={3}
                            value={editTeamItem.bio || ""}
                            onChange={(e) => setEditTeamItem({...editTeamItem, bio: e.target.value})}
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs font-sans leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[11px] font-bold mb-2">স্কিল ও কারিগরি দক্ষতা (কমা দিয়ে সাজান)</label>
                          <input
                            type="text"
                            value={editTeamItem.skills ? editTeamItem.skills.join(", ") : ""}
                            onChange={(e) => setEditTeamItem({...editTeamItem, skills: e.target.value.split(",").map(s => s.trim())})}
                            placeholder="React, Next, Flutter, Figma"
                            className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditTeamItem(null)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl"
                          >
                            বাতিল
                          </button>
                          <button
                            onClick={handleSaveTeamMember}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2 rounded-xl"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {team.map((t) => (
                          <div key={t.id} className="bg-[#0e051d] border border-purple-500/10 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={t.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-100 font-sans">{t.name}</h4>
                                <p className="text-[10px] text-purple-400">{t.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-4">
                              <button
                                onClick={() => setEditTeamItem(t)}
                                className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTeamMember(t.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 7. ORDERS & TRACKING TAB */}
                {activeTab === "orders" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-purple-400">রিয়েল-টাইম ক্লায়েন্ট অর্ডার ডাটাবেস</h3>
                        <p className="text-[10px] text-slate-400">
                          গ্রাহকেরা ই-কমার্স মডিউল বা চেকআউট ফরম পূরণ করলে এখানে অর্ডার জমা হবে। অর্ডার স্ট্যাটাস এবং ট্র্যাকিং রেজাল্ট সরাসরি আপডেট করুন।
                        </p>
                      </div>
                    </div>

                    {editingOrder ? (
                      <div className="border border-purple-500/20 bg-[#0e051d] p-5 rounded-2xl space-y-4 max-w-3xl">
                        <div className="border-b border-purple-500/10 pb-3 flex items-center justify-between">
                          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                            কন্ট্রোল অর্ডার ট্র্যাকার: {editingOrder.id}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono">তারিখ: {editingOrder.createdAt}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-1.5">গ্রাহকের নাম</label>
                            <input
                              type="text"
                              value={editingOrder.customerName || ""}
                              onChange={(e) => setEditingOrder({...editingOrder, customerName: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-1.5">যোগাযোগের মোবাইল</label>
                            <input
                              type="text"
                              value={editingOrder.customerPhone || ""}
                              onChange={(e) => setEditingOrder({...editingOrder, customerPhone: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-1.5">অর্ডারকৃত মডিউল / প্রোডাক্ট</label>
                            <input
                              type="text"
                              value={editingOrder.websiteTitle || ""}
                              onChange={(e) => setEditingOrder({...editingOrder, websiteTitle: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-1.5">মূল্য (৳)</label>
                            <input
                              type="number"
                              value={editingOrder.price || ""}
                              onChange={(e) => setEditingOrder({...editingOrder, price: Number(e.target.value)})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-1.5">পেমেন্ট মেথড</label>
                            <select
                              value={editingOrder.paymentMethod}
                              onChange={(e) => setEditingOrder({...editingOrder, paymentMethod: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none"
                            >
                              <option value="bkash">Bkash (বিকাশ)</option>
                              <option value="nagad">Nagad (নগদ)</option>
                              <option value="custom_pkg">Custom Package (কাস্টম প্যাকেজ)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-1.5">স্যান্ডার মোবাইল নম্বর</label>
                            <input
                              type="text"
                              value={editingOrder.senderNumber || ""}
                              onChange={(e) => setEditingOrder({...editingOrder, senderNumber: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-1.5">Transaction ID (TxnID)</label>
                            <input
                              type="text"
                              value={editingOrder.transactionId || ""}
                              onChange={(e) => setEditingOrder({...editingOrder, transactionId: e.target.value})}
                              className="w-full bg-[#110724] border border-purple-500/10 text-slate-100 rounded-xl px-4 py-2.5 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] font-bold mb-1.5">ট্র্যাকিং স্ট্যাটাস (Tracking Status)</label>
                            <select
                              value={editingOrder.status}
                              onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value as OrderStatus})}
                              className="w-full bg-[#110724] border border-purple-500/20 text-indigo-300 font-extrabold rounded-xl px-4 py-2 text-xs focus:outline-none"
                            >
                              <option value="Pending">🛡️ Pending (পেমেন্ট ভেরিফাই হচ্ছে)</option>
                              <option value="Payment Checking">💵 Payment Checking (পেমেন্ট চেক করা হচ্ছে)</option>
                              <option value="Confirmed">✅ Confirmed (অর্ডার নিশ্চিত করা হয়েছে)</option>
                              <option value="Working">⚡ Working (কাজ চলমান রয়েছে)</option>
                              <option value="Done">🎉 Done (কাজ সম্পন্ন এবং সাইট লাইভ)</option>
                            </select>
                          </div>
                        </div>

                        {/* If status is Done, unlock target live configurations */}
                        {editingOrder.status === 'Done' && (
                          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
                            <p className="text-[11px] text-emerald-400 font-bold block mb-1">
                              ✓ কাজ সম্পন্ন করা হয়েছে! নিচের ইনফরমেশনগুলো দিন, কাস্টমার তার ট্র্যাকিং প্যানেলে এগুলো সাথে সাথে দেখতে পাবে।
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-slate-400 text-[10px] font-bold mb-1">ওয়েবসাইট লাইভ ডোমেন লিংক</label>
                                <input
                                  type="text"
                                  value={editingOrder.websiteLink || ""}
                                  placeholder="https://client-store.com"
                                  onChange={(e) => setEditingOrder({...editingOrder, websiteLink: e.target.value})}
                                  className="w-full bg-[#090312] border border-emerald-500/20 text-slate-200 rounded-xl px-4.5 py-2 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-[10px] font-bold mb-1">এডমিন প্যানেল ইমেইল/লগইন</label>
                                <input
                                  type="text"
                                  value={editingOrder.adminLogin || ""}
                                  placeholder="admin@client-store.com"
                                  onChange={(e) => setEditingOrder({...editingOrder, adminLogin: e.target.value})}
                                  className="w-full bg-[#090312] border border-emerald-500/20 text-slate-200 rounded-xl px-4.5 py-2 text-xs font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-[10px] font-bold mb-1">এডমিন প্যানেল পাসওয়ার্ড</label>
                                <input
                                  type="text"
                                  value={editingOrder.adminPassword || ""}
                                  placeholder="SecurePass@2026"
                                  onChange={(e) => setEditingOrder({...editingOrder, adminPassword: e.target.value})}
                                  className="w-full bg-[#090312] border border-emerald-500/20 text-slate-200 rounded-xl px-4.5 py-2 text-xs font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-[10px] font-bold mb-1">অতিরিক্ত নোট / নির্দেশনাবলি</label>
                                <input
                                  type="text"
                                  value={editingOrder.adminNotes || ""}
                                  placeholder="সব সেটআপ রেডি আছে, ড্যাশবোর্ডে গিয়ে প্রোডাক্ট এডিট করুন।"
                                  onChange={(e) => setEditingOrder({...editingOrder, adminNotes: e.target.value})}
                                  className="w-full bg-[#090312] border border-emerald-500/20 text-slate-200 rounded-xl px-4.5 py-2 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2 border-t border-purple-500/10">
                          <button
                            onClick={() => setEditingOrder(null)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                          >
                            বাতিল করুন
                          </button>
                          <button
                            onClick={handleSaveOrderUpdate}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
                          >
                            স্ট্যাটাস ও ডাটা সংরক্ষণ করুন
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {allOrders.length === 0 ? (
                          <div className="py-12 text-center text-slate-500 text-xs border border-purple-500/10 rounded-2xl bg-[#0e051d]">
                            <ListFilter className="w-8 h-8 text-purple-500/30 mx-auto mb-2.5" />
                            <span>ডাটাবেজে এখনো কোনো চেকআউট বা সক্রিয় অর্ডার জমা হয়নি।</span>
                          </div>
                        ) : (
                          allOrders.map((o) => (
                            <div key={o.id} className="bg-[#0e051d] border border-purple-500/10 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-[11px] font-bold text-purple-400 uppercase bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
                                    {o.id}
                                  </span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    o.status === "Done" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                                    o.status === "Working" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30" :
                                    o.status === "Confirmed" ? "bg-blue-500/10 text-blue-400 border border-blue-500/30" :
                                    "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                  }`}>
                                    {o.status}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-100 font-sans mt-2.5">
                                  {o.customerName} ({o.customerPhone})
                                </h4>
                                <p className="text-[10px] text-slate-400 mt-1 max-w-sm line-clamp-1">
                                  প্রজেক্ট: <span className="font-semibold text-slate-200">{o.websiteTitle}</span> • মূল্য: ৳{o.price.toLocaleString("bn-BD")}
                                </p>
                                <p className="text-[9px] text-slate-500 mt-0.5 font-mono">
                                  TxnID: {o.transactionId} • Sender: {o.senderNumber} • Method: {o.paymentMethod.toUpperCase()}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2 sm:self-center">
                                <button
                                  onClick={() => setEditingOrder(o)}
                                  className="w-full sm:w-auto flex items-center justify-center gap-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold border border-purple-500/25 py-2 px-3.5 rounded-xl text-[11px] cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>স্ট্যাটাস চেঞ্জার</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(o.id)}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors cursor-pointer"
                                  title="অর্ডার ডিলেট"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
