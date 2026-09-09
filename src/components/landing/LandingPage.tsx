import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Receipt, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  X, 
  PhoneCall, 
  Calculator, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Globe,
  ChevronDown,
  Bell
} from 'lucide-react';
import { OnboardingRegistration } from '../../types';
import { Language, TRANSLATIONS } from './translations';
import { RegisterShopFlow } from './RegisterShopFlow';

interface LandingPageProps {
  onEnterApp: (role: 'owner' | 'employee', tab?: 'pos' | 'inventory' | 'reconciliation' | 'fraud_dashboard' | 'architecture') => void;
  onRegisterShop: (data: Omit<OnboardingRegistration, 'id' | 'createdAt'>) => OnboardingRegistration;
}

interface HeroSlide {
  id: number;
  title: string;
  tag: string;
  badge: string;
  description: string;
  imageUrl: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "Kugurisha Byihuse kuri POS",
    tag: "🛒 Supermarket & Retail",
    badge: "18% RRA VAT EBM",
    description: "Scan barcodes, akira MTN MoMo mu masegonda, kandi uhe umukiriya fagitire yemewe n'amategeko.",
    imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Igenzura ry'Imiti & Stock POS",
    tag: "💊 Pharmacie & Ubuzima",
    badge: "SMS Alert ku Bakozi",
    description: "Genzura amatariki y'imiti (expiry dates), ibiciro bihinduka, n'ububiko bwo muri pharmacie muri ako kanya.",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Ibicuruzwa By'Imodoka & Ibyuma",
    tag: "🔧 Pièces de Rechange",
    badge: "Real-Time Stock Alerts",
    description: "Kora inventory ya pièces de rechange zitabarika, barcode scanning, no kubika inyandiko z'igurisha.",
    imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Ibicuruzwa by'Ibyobwa & Resto",
    tag: "🍺 Utubari & Stock y'Ibyobwa",
    badge: "Blind Shift Audit",
    description: "Kora reconciliation y'amacupa, ibinyobwa bisohoka, n'amafaranga yishyuwe kuri MoMo mu kabari.",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1920&auto=format&fit=crop"
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onRegisterShop }) => {
  // Trilingual Language State
  const [language, setLanguage] = useState<Language>('rw');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const t = TRANSLATIONS[language];

  // Carousel State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'cashier'>('login');
  
  // Phone + SMS OTP Authentication State
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [ownerPhone, setOwnerPhone] = useState('0788123456');
  const [ownerPassword, setOwnerPassword] = useState('Password123!');
  const [cashierPhone, setCashierPhone] = useState('0788999000');
  const [cashierPassword, setCashierPassword] = useState('Password123!');
  const [loginError, setLoginError] = useState('');

  // SMS OTP Verification State
  const [pendingRole, setPendingRole] = useState<'owner' | 'employee'>('owner');
  const [pendingPhone, setPendingPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpResent, setOtpResent] = useState(false);

  // Daily Leakage Calculator State
  const [dailyLeakage, setDailyLeakage] = useState<number>(500);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // OTP Countdown Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (authStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authStep, otpTimer]);

  const monthlyLeakage = dailyLeakage * 30;
  const annualLeakage = dailyLeakage * 365;

  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpInput('');
    setOtpTimer(60);
    setOtpResent(true);
    setTimeout(() => setOtpResent(false), 4000);
    return code;
  };

  // Step 1: Owner Credentials Submit
  const handleOwnerCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!ownerPhone.trim() || ownerPhone.length < 8) {
      setLoginError('Nyamuneka shyiramo Nimero ya Telefone nyayo (e.g. 0788123456).');
      return;
    }
    if (!ownerPassword.trim() || ownerPassword.length < 4) {
      setLoginError('Ijambobanga (Password) rigomba kuba rifite nibura inyuguti 4.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPendingRole('owner');
    setPendingPhone(ownerPhone.trim());
    setOtpInput('');
    setOtpTimer(60);
    setAuthStep('otp');
  };

  // Step 1: Cashier Credentials Submit
  const handleCashierCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!cashierPhone.trim() || cashierPhone.length < 8) {
      setLoginError('Nyamuneka shyiramo Nimero ya Telefone nyayo.');
      return;
    }
    if (!cashierPassword.trim() || cashierPassword.length < 4) {
      setLoginError('Ijambobanga (Password) rigomba kuba rifite nibura inyuguti 4.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPendingRole('employee');
    setPendingPhone(cashierPhone.trim());
    setOtpInput('');
    setOtpTimer(60);
    setAuthStep('otp');
  };

  // Step 2: Validate SMS OTP & Grant Access
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanInput = otpInput.trim();
    if (!cleanInput || cleanInput.length !== 6) {
      setLoginError('Shyiramo imibare 6 y\'ikode ya OTP yoherejwe kuri telefone yawe.');
      return;
    }

    if (cleanInput === generatedOtp || cleanInput === '123456') {
      setIsAuthModalOpen(false);
      setAuthStep('credentials');
      setOtpInput('');
      setLoginError('');
      if (pendingRole === 'owner') {
        onEnterApp('owner', 'fraud_dashboard');
      } else {
        onEnterApp('employee', 'pos');
      }
    } else {
      setLoginError(`Kodi ya OTP yanditse siyo. Gerageza 123456 cyangwa ikode: ${generatedOtp}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
              <ShieldCheck className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">SmartStock</span>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                RWANDA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-sm leading-none">{t.flag}</span>
                <span className="hidden sm:inline text-xs font-mono font-bold uppercase text-slate-700">{language}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Ururimi / Language
                    </div>
                    {(['rw', 'en', 'fr'] as Language[]).map((langKey) => {
                      const item = TRANSLATIONS[langKey];
                      const isSelected = language === langKey;
                      return (
                        <button
                          key={langKey}
                          onClick={() => {
                            setLanguage(langKey);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition cursor-pointer ${
                            isSelected 
                              ? 'bg-emerald-50 text-emerald-800 font-bold' 
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base leading-none">{item.flag}</span>
                            <span>{item.label}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                setAuthTab('cashier');
                setAuthStep('credentials');
                setIsAuthModalOpen(true);
              }}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition cursor-pointer"
            >
              {t.nav.cashierLogin}
            </button>
            <button
              onClick={() => {
                setAuthTab('login');
                setAuthStep('credentials');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 sm:px-4.5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.nav.ownerLogin}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO CAROUSEL */}
      <section 
        className="relative w-full min-h-[620px] sm:min-h-[680px] lg:min-h-[740px] flex items-end overflow-hidden bg-slate-950"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = currentSlideIndex === index;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transition-transform duration-[4000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}

        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
          <div className="max-w-2xl space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-xs font-semibold text-emerald-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {t.hero.headline}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl font-normal">
              {t.hero.subtitle}
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setAuthTab('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-7 py-4 text-sm sm:text-base font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition flex items-center gap-2.5 shadow-xl shadow-emerald-500/30 group cursor-pointer"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>

          <div className="lg:self-end flex items-center gap-3 bg-slate-950/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg">
            <div className="flex items-center gap-1.5">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlideIndex === index ? 'w-6 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/75'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="w-px h-3.5 bg-white/20 mx-0.5" />

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                className="w-6 h-6 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-6 h-6 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SOLVERS */}
      <section id="ibibazo-dukemura" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.problems.eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {t.problems.title}
            </h2>
            <p className="text-sm sm:text-base text-[#334155] max-w-2xl mx-auto leading-relaxed">
              {t.problems.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 sm:p-8 bg-white border border-slate-200/90 hover:border-emerald-500 rounded-3xl space-y-4 transition shadow-xs hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 group-hover:bg-emerald-100/70 transition-all shadow-xs">
                  <Bell className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">{t.problems.card1.title}</h3>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">{t.problems.card1.desc}</p>
              </div>
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono font-medium">{t.problems.card1.tag}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  {t.problems.card1.footer} <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-8 bg-white border border-slate-200/90 hover:border-emerald-500 rounded-3xl space-y-4 transition shadow-xs hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 group-hover:bg-emerald-100/70 transition-all shadow-xs">
                  <Bell className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">{t.problems.card2.title}</h3>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">{t.problems.card2.desc}</p>
              </div>
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono font-medium">{t.problems.card2.tag}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  {t.problems.card2.footer} <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-8 bg-white border border-slate-200/90 hover:border-emerald-500 rounded-3xl space-y-4 transition shadow-xs hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 group-hover:bg-emerald-100/70 transition-all shadow-xs">
                  <Receipt className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">{t.problems.card3.title}</h3>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">{t.problems.card3.desc}</p>
              </div>
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono font-medium">{t.problems.card3.tag}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  {t.problems.card3.footer} <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING & LEAKAGE CALCULATOR */}
      <section id="igiciro" className="py-16 bg-slate-50 border-y border-slate-200 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/70 border border-emerald-200 text-emerald-900 rounded-full text-xs font-bold">
              <span>{t.pricing.eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{t.pricing.title}</h2>
            <p className="text-sm text-[#334155] max-w-lg mx-auto">{t.pricing.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-7 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.pricing.setupTitle}</span>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono font-bold rounded-md">{t.pricing.setupBadge}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono text-[#0F172A]">{t.pricing.setupPrice}</span>
                  <span className="text-sm font-bold text-slate-500 font-sans">{t.pricing.setupPriceSub}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">{t.pricing.setupDesc}</p>
              </div>

              <button
                onClick={() => {
                  setAuthTab('register');
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.pricing.setupCta}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-7 sm:p-8 bg-white border-2 border-emerald-500 rounded-3xl space-y-5 flex flex-col justify-between relative shadow-lg shadow-emerald-600/10">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-bl-2xl">
                {t.pricing.monthlyPopular}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t.pricing.monthlyTitle}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded-md border border-emerald-200">{t.pricing.monthlyBadge}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono text-emerald-700">{t.pricing.monthlyPrice}</span>
                  <span className="text-sm font-bold text-slate-500 font-sans">{t.pricing.monthlyPriceSub}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">{t.pricing.monthlyDesc}</p>
              </div>

              <button
                onClick={() => {
                  setAuthTab('register');
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <span>{t.pricing.monthlyCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-500" />
                <span className="text-base font-bold text-[#0F172A]">{t.pricing.calcHeader}</span>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {t.pricing.calcLossPerDay}: {dailyLeakage.toLocaleString()} RWF
              </span>
            </div>

            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={dailyLeakage}
              onChange={(e) => setDailyLeakage(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Igihombo mu Kwezi</div>
                <div className="text-xl font-extrabold font-mono text-amber-600 mt-1">{monthlyLeakage.toLocaleString()} RWF</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Igihombo mu Umwaka</div>
                <div className="text-xl font-extrabold font-mono text-rose-600 mt-1">{annualLeakage.toLocaleString()} RWF</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => {
                  setAuthTab('login');
                  setAuthStep('credentials');
                }}
                className={`pb-3 text-xs sm:text-sm font-bold flex-1 text-center transition border-b-2 ${
                  authTab === 'login' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Nyir'Ubucuruzi (Owner)
              </button>
              <button
                onClick={() => {
                  setAuthTab('cashier');
                  setAuthStep('credentials');
                }}
                className={`pb-3 text-xs sm:text-sm font-bold flex-1 text-center transition border-b-2 ${
                  authTab === 'cashier' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Umusore/Umukobwa wa POS
              </button>
              <button
                onClick={() => {
                  setAuthTab('register');
                }}
                className={`pb-3 text-xs sm:text-sm font-bold flex-1 text-center transition border-b-2 ${
                  authTab === 'register' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Iyandikishe
              </button>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {loginError}
              </div>
            )}

            {authTab === 'register' ? (
              <RegisterShopFlow
                onComplete={(data) => {
                  onRegisterShop(data);
                  setIsAuthModalOpen(false);
                  onEnterApp('owner', 'fraud_dashboard');
                }}
              />
            ) : authStep === 'credentials' ? (
              authTab === 'login' ? (
                <form onSubmit={handleOwnerCredentialsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Phone Number (Nimero ya Telefone)
                    </label>
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                      placeholder="0788123456"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Password (Ijambobanga)
                    </label>
                    <input
                      type="password"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                      required
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <p>Demo Phone: <strong className="text-emerald-700 font-mono">0788123456</strong></p>
                    <p>Demo Password: <strong className="text-emerald-700 font-mono">Password123!</strong></p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <span>Komeza kuri SMS OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCashierCredentialsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Phone Number (Nimero ya Telefone)
                    </label>
                    <input
                      type="tel"
                      value={cashierPhone}
                      onChange={(e) => setCashierPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                      placeholder="0788999000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Password (Ijambobanga)
                    </label>
                    <input
                      type="password"
                      value={cashierPassword}
                      onChange={(e) => setCashierPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <span>Komeza kuri SMS OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">SMS ya OTP yoherejwe kuri <strong>{pendingPhone}</strong></p>
                  <p className="text-[11px] text-emerald-800 font-mono font-bold mt-1">Demo OTP Code: {generatedOtp}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Shyiramo Ikode ya OTP (6 digits)
                  </label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-center text-xl font-bold tracking-widest outline-none"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition"
                >
                  Emeza Kwinjira →
                </button>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
                  <span>{otpTimer > 0 ? `Resend mu: ${otpTimer}s` : 'Ushobora kuyoherereza cyaha'}</span>
                  <button
                    type="button"
                    disabled={otpTimer > 0}
                    onClick={generateNewOtp}
                    className="text-emerald-700 font-bold disabled:opacity-40"
                  >
                    Resend SMS OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>SmartStock Rwanda © 2026</span>
          </div>
          <div>Kigali, Rwanda | Helpline: +250 788 123 456</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;