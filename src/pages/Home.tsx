import React, { useState, useMemo, useRef } from "react";
import { format, parseISO, addMinutes, isBefore, parse } from "date-fns";
import { Calendar as CalendarIcon, Clock, CheckCircle, ChevronDown, NotebookText, Pencil, MapPin, ArrowRight, Star, Zap, Shield, ExternalLink } from "lucide-react";
import { Layout } from "../components/Layout";
import { EXHIBITION_DATES, OPERATING_HOURS, INQUIRY_TYPES, PRODUCT_INTERESTS, COUNTRIES } from "../lib/constants";
import { isSlotAvailable, addBooking } from "../lib/store";
import { sendConfirmationEmail } from "../lib/email";
import { cn } from "../lib/utils";
import banner from "../assets/BG.png";
import whxLogo from "../assets/WHX_logo.png";
import heroProduct from "../assets/hero_product.png";

export function Home() {
  const bookingRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState(EXHIBITION_DATES[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedInquiryType, setSelectedInquiryType] = useState<string>("");
  const [selectedProductInterest, setSelectedProductInterest] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const timeSlots = useMemo(() => {
    const { start, end } = OPERATING_HOURS[selectedDate];
    const slots = [];
    let current = parse(start, "HH:mm", new Date());
    const endTime = parse(end, "HH:mm", new Date());

    while (isBefore(current, endTime)) {
      const timeStr = format(current, "HH:mm");
      slots.push({
        time: timeStr,
        available: isSlotAvailable(selectedDate, timeStr),
      });
      current = addMinutes(current, 30);
    }
    return slots;
  }, [selectedDate, submitted]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTime) return;

    const formData = new FormData(e.currentTarget);
    const booking: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      companyName: formData.get("companyName"),
      country: formData.get("country"),
      productInterest: formData.get("productInterest"),
      inquiryType: formData.get("inquiryType"),
      message: formData.get("message"),
      date: selectedDate,
      time: selectedTime,
    };

    const newBooking = addBooking(booking);
    setBookingId(newBooking.id);
    
    // Send confirmation email (Mock) - Disabled for 1st release
    /*
    sendConfirmationEmail({
      name: booking.name,
      email: booking.email,
      date: booking.date,
      time: booking.time,
      bookingId: newBooking.id
    });
    */

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-md w-full mx-auto text-center p-8 relative z-10 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-cyan-500/30 animate-pulse-glow">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 tracking-tight">Confirmed</h2>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed">
              Your meeting is set for <br/>
              <span className="text-cyan-400 font-bold text-xl">{format(parseISO(selectedDate), "EEEE, MMM d")}</span> at <span className="text-purple-400 font-bold text-xl">{selectedTime}</span>
              <br/><br/>
              <span className="text-sm text-slate-500">Please save this screen or take a screenshot.</span>
            </p>
            <div className="glass p-8 rounded-2xl mb-10 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-xs text-slate-500 uppercase tracking-[0.2em] mb-3">Booking Reference</p>
              <p className="text-3xl font-mono font-bold text-white tracking-widest">{bookingId}</p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedTime(null);
              }}
              className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-white/10 hover:shadow-cyan-500/20"
            >
              Book Another Meeting
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden flex flex-col justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${banner})` }}
        />
        
        {/* Gradient Overlay (Figma: linear-gradient(180deg, rgba(0, 0, 0, 0.42) 37.55%, rgba(17, 53, 119, 0.7) 100%)) */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.42) 37.55%, rgba(17, 53, 119, 0.7) 100%)" 
          }}
        />
        
        {/* Content Container (Matches Frame 1618873511 position) */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-[197px] h-full flex flex-col justify-center">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full">
            
            {/* Left Column: Text Content */}
            <div className="flex flex-col items-start gap-10 max-w-[900px] relative z-20">
              
              {/* Logo (image 2570) */}
              <img 
                src={whxLogo} 
                alt="WHX Logo" 
                className="w-[150px] md:w-[200px] h-auto object-contain mb-[-10px]"
              />

              {/* Headlines (Frame 1618873519) */}
              <div className="flex flex-col items-start gap-6">
                <h1 className="text-white font-[200] text-5xl md:text-7xl lg:text-[100px] leading-[1.12] tracking-tight">
                  Join MEDIANA at <br/>
                  <span className="font-bold">WHX Dubai 2026</span>
                </h1>
                <p className="text-white font-[400] text-xl md:text-2xl leading-[1.2] tracking-wide">
                  Advancing Trust. Connecting Care. Expanding Possibility.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-10">
                {/* CTA Button (Frame 1618873506) */}
                <button
                  onClick={scrollToBooking}
                  className="group box-border flex flex-row justify-center items-center px-6 py-4 gap-2.5 min-w-[255px] h-[64px] rounded-full border border-white hover:bg-white hover:text-[#113577] transition-all duration-300 bg-transparent text-white"
                >
                  <span className="font-[600] text-[20px] leading-[32px]">Book Meetings Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Booth No (Booth No #N27.B58) */}
                <div className="text-white font-[600] text-3xl md:text-[41px] leading-[32px] tracking-tight">Booth No #N27.B58</div>
              </div>
            </div>

            {/* Right Column: Product Image (image 10 1) */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-[10%] xl:translate-x-0 w-[45%] max-w-[700px] z-10 pointer-events-none opacity-90 mix-blend-lighten">
               <img src={heroProduct} alt="Hero Product" className="w-full h-auto object-contain" />
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer animate-float z-20"
          onClick={scrollToBooking}
          style={{ animationDuration: '2s' }}
        >
          <div className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border-white/20">
            <ChevronDown className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>

      {/* Main Content Split View */}
      <div ref={bookingRef} className="min-h-screen bg-[#050505] relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Left Column: Landing Info (5 cols) */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  We Look Forward to <br/>
                  <span className="text-white">Meeting You</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">Our team is ready to discuss your needs and introduce Mediana’s medical solutions.</p>
              </div>

              {/* Inquiry Type Section */}
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <NotebookText className="w-6 h-6 text-[#28CBFF]" />
                  Select Inquiry Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INQUIRY_TYPES.map((t) => (
                    <div
                      key={t.type}
                      onClick={() => setSelectedInquiryType(t.type)}
                      className={cn(
                        "relative rounded-xl transition-all duration-300 cursor-pointer group flex flex-col h-full border border-transparent",
                        selectedInquiryType === t.type
                          ? "bg-white/10 border-white/20 shadow-lg scale-[1.02]"
                          : "bg-black/20 hover:bg-black/40 hover:scale-[1.01]"
                      )}
                    >
                      <div className="p-5 h-full flex flex-col relative overflow-hidden">
                        <div className="space-y-2 z-10">
                          <h4 className={cn("font-bold text-lg leading-tight transition-colors", selectedInquiryType === t.type ? "text-[#28CBFF]" : "text-white")}>
                            {t.type}
                          </h4>
                          <p className="text-slate-400 text-sm leading-relaxed">{t.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Info */}
              <div className="glass rounded-3xl border border-white/10 overflow-hidden bg-white/5">
                <div className="p-6 flex items-start gap-4 border-b border-white/5">
                  <MapPin className="w-6 h-6 text-[#28CBFF] mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">Dubai Exhibition Centre</h3>
                    <div className="text-[#28CBFF] text-2xl font-mono">Booth No #N27.B58</div>
                  </div>
                </div>
                <div className="relative w-full h-[400px] group">
                  <iframe 
                    src="https://www.expocad.com/host/fx/informa/arhe26/exfx.html?zoomto=N27.B58" 
                    className="w-full h-full border-0 bg-white invert-[.9] grayscale-[.5] hover:invert-0 hover:grayscale-0 transition-all duration-500"
                    title="Booth Location Map"
                    loading="lazy"
                  />
                  <a 
                    href="https://www.expocad.com/host/fx/informa/arhe26/exfx.html?zoomto=N27.B58" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-black/80 hover:bg-[#28CBFF] text-white hover:text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  >
                    <span>Open Full Map</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Reservation Action (7 cols) */}
            <div className="lg:col-span-7">
              <div className="glass rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#28CBFF]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <CalendarIcon className="w-6 h-6 text-[#28CBFF]" />
                  Select Date & Time
                </h3>

                {/* Date Selection */}
                <div className="flex gap-3 overflow-x-auto pb-6 mb-6 scrollbar-hide">
                  {EXHIBITION_DATES.map((date) => {
                    const isSelected = selectedDate === date;
                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                        className={cn(
                          "flex-shrink-0 min-w-[100px] p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 group border",
                          isSelected
                            ? "bg-white/10 border-[#28CBFF] text-[#28CBFF] shadow-lg"
                            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
                        )}
                      >
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{format(parseISO(date), "EEE")}</span>
                        <span className="text-2xl font-black">{format(parseISO(date), "d")}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Selection */}
                <div className="mb-10">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                    {timeSlots.map(({ time, available }) => (
                      <button
                        key={time}
                        disabled={!available}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "py-2 px-1 rounded-lg text-sm font-medium transition-all duration-200 border",
                          available
                            ? selectedTime === time
                              ? "bg-white/10 border-[#28CBFF] text-[#28CBFF] shadow-lg"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-[#28CBFF]/50"
                            : "bg-black/20 border-transparent text-slate-700 cursor-not-allowed decoration-slate-700 line-through"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Pencil className="w-6 h-6 text-[#28CBFF]" />
                  Your Details
                </h3>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="relative group">
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#28CBFF]/50 focus:bg-white/5 transition-all peer"
                        placeholder="Full Name"
                        id="name"
                      />
                      <label 
                        htmlFor="name"
                        className="absolute left-4 -top-2.5 bg-[#050505] px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#28CBFF] peer-focus:bg-[#050505] peer-focus:px-1 pointer-events-none"
                      >
                        Full Name
                      </label>
                    </div>

                    {/* Email */}
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#28CBFF]/50 focus:bg-white/5 transition-all peer"
                        placeholder="Work Email"
                        id="email"
                      />
                      <label 
                        htmlFor="email"
                        className="absolute left-4 -top-2.5 bg-[#050505] px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#28CBFF] peer-focus:bg-[#050505] peer-focus:px-1 pointer-events-none"
                      >
                        Work Email
                      </label>
                    </div>

                    {/* Company */}
                    <div className="relative group">
                      <input
                        type="text"
                        name="companyName"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#28CBFF]/50 focus:bg-white/5 transition-all peer"
                        placeholder="Company Name"
                        id="company"
                      />
                      <label 
                        htmlFor="company"
                        className="absolute left-4 -top-2.5 bg-[#050505] px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#28CBFF] peer-focus:bg-[#050505] peer-focus:px-1 pointer-events-none"
                      >
                        Company Name
                      </label>
                    </div>

                    {/* Country */}
                    <div className="relative group">
                      <select
                        name="country"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#28CBFF]/50 focus:bg-white/5 transition-all peer appearance-none"
                        id="country"
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-[#050505] text-slate-500">Select Country</option>
                        {COUNTRIES.map(c => (
                          <option key={c} value={c} className="bg-[#050505] text-white">{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none peer-focus:text-[#28CBFF] transition-colors" />
                      <label 
                        htmlFor="country"
                        className="absolute left-4 -top-2.5 bg-[#050505] px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#28CBFF] peer-focus:bg-[#050505] peer-focus:px-1 pointer-events-none"
                      >
                        Country
                      </label>
                    </div>
                  </div>

                  {/* Selects & Product Interest (Swapped) */}
                  <div className="space-y-6">
                    {/* Inquiry Type Hidden Input (Visuals moved to Left) */}
                    <input type="hidden" name="inquiryType" value={selectedInquiryType} />

                    {/* Main Interested Product (Moved from Left) */}
                    <div className="space-y-4">
                      <label className="text-slate-400 text-sm ml-1 font-medium">Select Main Interested Product</label>
                      <div className="grid grid-cols-2 gap-4">
                        {PRODUCT_INTERESTS.map((p) => (
                          <div
                            key={p}
                            onClick={() => setSelectedProductInterest(p)}
                            className={cn(
                              "relative rounded-xl transition-all duration-300 cursor-pointer group flex flex-col h-full border border-transparent",
                              selectedProductInterest === p
                                ? "bg-white/10 border-white/20 shadow-lg scale-[1.02]"
                                : "bg-white/5 opacity-60 hover:opacity-100 hover:bg-white/10 hover:scale-[1.01]"
                            )}
                          >
                            <div className="rounded-[10px] p-4 h-full flex items-center justify-center text-center relative overflow-hidden transition-colors min-h-[60px]">
                               <span className={cn("font-bold transition-colors", selectedProductInterest === p ? "text-[#28CBFF]" : "text-white")}>
                                 {p}
                               </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <input type="hidden" name="productInterest" value={selectedProductInterest} />
                    </div>
                  </div>

                  {/* Message */}
                    <div className="relative group">
                      <textarea
                        name="message"
                        rows={4}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#28CBFF]/50 focus:bg-white/5 transition-all peer resize-none"
                        placeholder="Additional Message"
                        id="message"
                      />
                      <label 
                        htmlFor="message"
                        className="absolute left-4 -top-2.5 bg-[#050505] px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#28CBFF] peer-focus:bg-[#050505] peer-focus:px-1 pointer-events-none"
                      >
                        Additional Message (Optional)
                      </label>
                    </div>

                  <button
                    type="submit"
                    disabled={!selectedTime || !selectedInquiryType || !selectedProductInterest}
                    className="w-full py-5 bg-gradient-to-r from-[#D8FF51] to-[#28CBFF] text-black font-bold rounded-xl shadow-lg shadow-[#28CBFF]/25 hover:scale-[1.02] hover:shadow-[#D8FF51]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4"
                  >
                    Confirm Booking
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
