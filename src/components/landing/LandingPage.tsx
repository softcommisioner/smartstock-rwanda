import React, { useState } from 'react';

interface LandingPageProps {
  onEnterApp?: () => void;
  onRegisterShop?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onEnterApp = () => {}, 
  onRegisterShop = () => {} 
}) => {
  // Trilingual Language State
  const [language, setLanguage] = useState<'rw' | 'en' | 'fr'>('rw');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'cashier' | 'register'>('login');

  // Form inputs state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');

  const handleOpenModal = (tab: 'login' | 'cashier' | 'register') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authTab === 'register') {
      onRegisterShop();
    } else {
      onEnterApp();
    }
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-slate-800/60 max-w-7xl w-full mx-auto z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-xl text-slate-950 shadow-lg shadow-emerald-500/20">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">SmartStock AI</h1>
            <p className="text-xs text-slate-400">Rwanda Inventory Engine</p>
          </div>
        </div>

        {/* Language Selector & CTA */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium hover:border-slate-700 transition-all flex items-center gap-2"
            >
              <span>🌐 {language.toUpperCase()}</span>
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-20 text-xs">
                <button
                  onClick={() => { setLanguage('rw'); setIsLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300"
                >
                  Kinyarwanda
                </button>
                <button
                  onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300"
                >
                  English
                </button>
                <button
                  onClick={() => { setLanguage('fr'); setIsLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300"
                >
                  Français
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleOpenModal('login')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-emerald-600/20"
          >
            Kwinjira
          </button>
        </div>
      </header>

      {/* Hero Body */}
      <main className="max-w-4xl mx-auto text-center px-6 py-20 z-10">
        <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full mb-6">
          ✨ Ubucuruzi Bwikora na AI
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Cunga Ubucuruzi Bwawe <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
            Kuri Email OTP Bworoshye
          </span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          SmartStock AI igufasha gucunga stock, gukora fagitire, no kumenya inyungu n'igombo mu bucuruzi bwawe buri munsi utabangamiwe.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => handleOpenModal('login')}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all text-sm"
          >
            Nyir'Ubucuruzi (Owner Login) &rarr;
          </button>
          <button
            onClick={() => handleOpenModal('cashier')}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all text-sm"
          >
            Umusore/Umukobwa wa POS &rarr;
          </button>
          <button
            onClick={() => handleOpenModal('register')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition-all text-sm"
          >
            Iyandikishe Upya
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500 z-10">
        © 2026 SmartStock AI Rwanda. Integrated Email OTP System.
      </footer>

      {/* AUTHENTICATION MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-xl font-bold"
            >
              &times;
            </button>

            {/* Modal Header Tabs */}
            <div className="flex border-b border-slate-800 mb-6 font-medium text-xs">
              <button
                onClick={() => setAuthTab('login')}
                className={`pb-3 px-2 border-b-2 transition-all ${
                  authTab === 'login'
                    ? 'border-emerald-500 text-emerald-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Nyir'Ubucuruzi (Owner)
              </button>
              <button
                onClick={() => setAuthTab('cashier')}
                className={`pb-3 px-2 border-b-2 transition-all ${
                  authTab === 'cashier'
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Umusore/Umukobwa wa POS
              </button>
              <button
                onClick={() => setAuthTab('register')}
                className={`pb-3 px-2 border-b-2 transition-all ${
                  authTab === 'register'
                    ? 'border-blue-500 text-blue-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Iyandikishe
              </button>
            </div>

            {/* TAB 1: OWNER LOGIN */}
            {authTab === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@smartstock.rw"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Password (Ijambobanga)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-400 space-y-1">
                  <p>Demo Owner Email: <span className="font-bold text-emerald-400">owner@smartstock.rw</span></p>
                  <p>Demo Password: <span className="font-bold text-emerald-400">Password123!</span></p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Komeza kuri Email OTP &rarr;</span>
                </button>
              </form>
            )}

            {/* TAB 2: CASHIER LOGIN */}
            {authTab === 'cashier' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eric@smartstock.rw"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Password (Ijambobanga)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-400 space-y-1">
                  <p>Demo Cashier Email: <span className="font-bold text-amber-400">eric@smartstock.rw</span></p>
                  <p>Demo Password: <span className="font-bold text-amber-400">Password123!</span></p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Komeza kuri Email OTP &rarr;</span>
                </button>
              </form>
            )}

            {/* TAB 3: REGISTER SHOP */}
            {authTab === 'register' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Izina ry'Ubucuruzi (Shop Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Smart Supermarket"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Email Address (Yo kwakira OTP)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yours@gmail.com"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Ijambobanga (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Ohereza Email OTP yo kwiyandikisha &rarr;</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};