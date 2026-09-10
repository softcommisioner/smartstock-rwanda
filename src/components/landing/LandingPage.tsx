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

// Complete Auth Modal Code update for Email OTP
{isAuthModalOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
      
      {/* Close Button */}
      <button 
        onClick={() => setIsAuthModalOpen(false)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <span className="text-xl">&times;</span>
      </button>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-100 mb-6 font-medium text-sm">
        <button
          onClick={() => setAuthTab('login')}
          className={`pb-3 px-3 border-b-2 transition-all ${
            authTab === 'login'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Nyir'Ubucuruzi (Owner)
        </button>
        <button
          onClick={() => setAuthTab('cashier')}
          className={`pb-3 px-3 border-b-2 transition-all ${
            authTab === 'cashier'
              ? 'border-amber-500 text-amber-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Umusore/Umukobwa wa POS
        </button>
        <button
          onClick={() => setAuthTab('register')}
          className={`pb-3 px-3 border-b-2 transition-all ${
            authTab === 'register'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Iyandikishe
        </button>
      </div>

      {/* TAB 1: OWNER LOGIN */}
      {authTab === 'login' && (
        <form onSubmit={(e) => { e.preventDefault(); onEnterApp(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="owner@smartstock.rw"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Password (Ijambobanga)
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
            <p>Demo Owner Email: <span className="font-bold text-emerald-700">owner@smartstock.rw</span></p>
            <p>Demo Password: <span className="font-bold text-emerald-700">Password123!</span></p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Komeza kuri Email OTP</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
        </form>
      )}

      {/* TAB 2: CASHIER LOGIN */}
      {authTab === 'cashier' && (
        <form onSubmit={(e) => { e.preventDefault(); onEnterApp(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="eric@smartstock.rw"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Password (Ijambobanga)
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
            <p>Demo Cashier Email: <span className="font-bold text-amber-700">eric@smartstock.rw</span></p>
            <p>Demo Password: <span className="font-bold text-amber-700">Password123!</span></p>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Komeza kuri Email OTP</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
        </form>
      )}

      {/* TAB 3: REGISTER SHOP */}
      {authTab === 'register' && (
        <form onSubmit={(e) => { e.preventDefault(); onEnterApp(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Izina ry'Ubucuruzi (Shop Name)
            </label>
            <input
              type="text"
              required
              placeholder="Smart Supermarket"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Email Address (Yo kwakira OTP)
            </label>
            <input
              type="email"
              required
              placeholder="yours@gmail.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Ijambobanga (Password)
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Ohereza Email OTP yo kwiyandikisha</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
        </form>
      )}

    </div>
  </div>
)}