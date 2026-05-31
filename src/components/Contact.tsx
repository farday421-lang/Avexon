import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../context/ContentContext";
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  HelpCircle,
  MessageSquareReply,
  ShieldCheck
} from "lucide-react";

interface ContactProps {
  initialSelectedWebsite: string;
}

export default function Contact({ initialSelectedWebsite }: ContactProps) {
  const { contactConfig } = useContent();

  // Navigation form state
  const [requestType, setRequestType] = useState<"custom" | "readymade">("custom");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  
  // Submit actions states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Update selected website if passed down from clicking "অর্ডার প্লেস করুন"
  useEffect(() => {
    if (initialSelectedWebsite) {
      setRequestType("readymade");
      setSelectedCourse(initialSelectedWebsite);
    }
  }, [initialSelectedWebsite]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (!name || !phone) {
      setValidationError("অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর সঠিকভাবে প্রদান করুন।");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API process trigger
    setTimeout(() => {
      const newSubmission = {
        id: Date.now().toString(),
        type: requestType === "custom" ? "কাস্টম প্রজেক্ট ক্লায়েন্ট" : "রেডিমেড ওয়েবসাইট ক্রেতা",
        name,
        phone,
        email: email || "প্রদান করা হয়নি",
        course: requestType === "readymade" ? selectedCourse : "N/A",
        message,
        timestamp: new Date().toLocaleTimeString("bn-BD")
      };

      setSubmissions([newSubmission, ...submissions]);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Clean inputs
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  return (
    <section id="contact" className="relative py-24 bg-transparent overflow-hidden">
      {/* Decorative ambient visual filters */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/5 to-fuchsia-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider"
          >
            <HelpCircle className="w-4 h-4" />
            <span>যোগাযোগ করুন</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            আসুন কথা বলি আপনার{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-300 bg-clip-text text-transparent">
              পরবর্তী কাস্টম বা রেডিমেড প্রজেক্ট নিয়ে
            </span>
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
            আপনার কি একটি চমৎকার ওয়েবসাইট প্রয়োজন? নাকি আমাদের প্রোডাক্টসমূহ নিয়ে কোনো বিশেষ জিজ্ঞাসা আছে? কোনো চিন্তা নেই, নিচের ফর্মটি পূরণ করুন—আমাদের এক্সপার্ট সাপোর্ট গাইড আপনাকে খুব দ্রুত সাহায্য করবে।
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* Left Column: Direct contact information references */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-100">
                আমাদের সাথে সরাসরি দেখা করুন
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                যেকোনো ওয়েবসাইট এবং কাস্টম প্রজেক্ট সম্পর্কিত বিষয়ে আমাদের অফিসে এসে সরাসরি কথা বলতে পারেন। চা পানের আমন্ত্রণ রইল!
              </p>

              {/* Direct location details panel */}
              <div className="space-y-4.5 pt-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-purple-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">অফিস ঠিকানা:</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-snug">
                      {contactConfig.officeAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-purple-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">হেল্পলাইন নম্বর:</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                      {contactConfig.helplineNumbers}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-purple-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">অফিসিয়াল ইমেইল:</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                      {contactConfig.officialEmails}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">সাপোর্ট আওয়ার্স:</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-snug">
                      {contactConfig.supportHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick trust metrics panel */}
            <div className="p-5 rounded-2xl bg-[#110620]/60 border border-purple-950/40 flex items-center gap-3.5 shadow-lg">
              <ShieldCheck className="w-10 h-10 text-purple-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-200">গোপনীয়তার শতভাগ নিশ্চয়তা</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  আপনার মোবাইল নম্বর ও শেয়ারকৃত ডেটা সম্পূর্ণরূপে সুরক্ষিত থাকবে।
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive contact Form */}
          <div className="lg:col-span-7 bg-[#130725]/50 rounded-3xl p-6 sm:p-8 border border-purple-950/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-400" />
            
            {/* Form Toggle buttons matching screenshot aesthetics */}
            <div className="grid grid-cols-2 gap-3 mb-8 bg-slate-950 p-1.5 rounded-2xl border border-slate-900">
              <button
                id="contact-toggle-custom"
                type="button"
                onClick={() => { setRequestType("custom"); setValidationError(""); }}
                className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  requestType === "custom"
                    ? "bg-[#240e44] text-purple-400 border border-purple-500/25 shadow-md shadow-black/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                কাস্টম প্রজেক্ট
              </button>
              <button
                id="contact-toggle-readymade"
                type="button"
                onClick={() => { setRequestType("readymade"); setValidationError(""); }}
                className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  requestType === "readymade"
                    ? "bg-[#240e44] text-purple-400 border border-purple-500/25 shadow-md shadow-black/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                রেডিমেড ওয়েবসাইট
              </button>
            </div>

            {/* Standard contact inputs */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    আপনার নাম *
                  </label>
                  <input
                    id="contact-input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন- আমিনুল ইসলাম"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    id="contact-input-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="যেমন- ০১৭xxxxxxxx"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-sans font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  ইমেইল এড্রেস (ঐচ্ছিক)
                </label>
                <input
                  id="contact-input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="যেমন- aminul@example.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-sans font-medium"
                />
              </div>

              {/* Conditional website select field */}
              {requestType === "readymade" && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    পছন্দের ওয়েবসাইট মডেল সিলেক্ট করুন *
                  </label>
                  <select
                    id="contact-select-course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-[#070E17] border border-slate-800 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                  >
                    <option value="">-- একটি মডেল সিলেক্ট করুন --</option>
                    <option value="আলটিমেট মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম">আলটিমেট মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম</option>
                    <option value="ক্ল্যাসিক কর্পোরেট ও এজেন্সি বিজনেস রানিং পোর্টফোলিও">ক্ল্যাসিক কর্পোরেট ও এজেন্সি বিজনেস রানিং পোর্টফোলিও</option>
                    <option value="স্মার্ট অনলাইন নিউজ পোর্টাল ও ব্লগিং সলিউশন">স্মার্ট অনলাইন নিউজ পোর্টাল ও ব্লগিং সলিউশন</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  আপনার বার্তা / আবদার বিস্তারিত লিখুন
                </label>
                <textarea
                  id="contact-input-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    requestType === "custom" 
                      ? "আপনার কাঙ্ক্ষিত প্রজেক্ট বা ব্র্যান্ডের প্রকারভেদ এবং বাজেট আইডিয়া এখানে লিখতে পারেন..."
                      : "আপনার কাঙ্ক্ষিত ডেলিভারি টাইমলাইন এবং নির্দিষ্ট কোনো পরিবর্তনের বিবরণ লিখুন..."
                  }
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium custom-scrollbar resize-none"
                />
              </div>

              {/* Inline warning error instead of native alert dialog */}
              {validationError && (
                <div className="p-3 text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl text-center">
                  ⚠️ {validationError}
                </div>
              )}

              {/* Send Button trigger */}
              <button
                id="contact-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-fuchsia-700 hover:from-purple-500 hover:to-fuchsia-500 text-sm font-bold text-white shadow-xl shadow-purple-900/20 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-100 border-t-transparent rounded-full animate-spin" />
                    <span>রিকোয়েস্ট সাবমিট করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>রিকোয়েস্ট পাঠান</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Success notification popup overlay */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  id="contact-success-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-20"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="max-w-md space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-2 text-purple-400">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                      সাবমিশন সফল হয়েছে!
                    </h3>
                    <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
                      ধন্যবাদ! আমরা আপনার আবেদনটি সযত্নে গ্রহণ করেছি। আমাদের এক্সপার্ট রিলেশনশিপ অফিসার আগামী ৩ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবেন।
                    </p>
                    <div className="pt-4">
                      <button
                        id="success-form-reset-btn"
                        onClick={() => setSubmitSuccess(false)}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                      >
                        নতুন রিকোয়েস্ট ফর্ম
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Live Presentation Submissions List panel (Incredibly interactive) */}
        {submissions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 bg-[#110620]/60 border border-purple-950/40 rounded-2xl p-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareReply className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-bold text-slate-200">সক্ষমতা ট্র্যাকার (সিমিউলেটেড সাবমিশন ডেক)</h4>
            </div>
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub.id} className="flex flex-col sm:flex-row justify-between text-left sm:items-center bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{sub.name}</span>
                      <span className="text-[9px] font-bold bg-purple-500/10 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/20 uppercase tracking-wider">
                        {sub.type}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-sans">ফোন: {sub.phone} | ইমেল: {sub.email}</p>
                    {sub.course !== "N/A" && (
                      <p className="text-[11px] text-fuchsia-400 font-medium">কোর্স: {sub.course}</p>
                    )}
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <p className="text-[10px] text-slate-500 font-sans tracking-wide">সময়: {sub.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
