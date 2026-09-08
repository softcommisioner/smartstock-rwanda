/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { SMSService } from './services/smsService';
import { User, Product, ShiftRegister, SaleTransaction, StockAdjustment, FraudAlert, SpotCheckAudit, CashDenominationCount, OnboardingRegistration, BusinessGoals } from './types';
import { Navigation, ActiveTab } from './components/Navigation';
import { LandingPage } from './components/landing/LandingPage';
import { QuickSellView } from './components/pos/QuickSellView';
import { InventoryManager } from './components/inventory/InventoryManager';
import { BlindCashAudit } from './components/reconciliation/BlindCashAudit';
import { FraudDiscrepancyDashboard } from './components/audit/FraudDiscrepancyDashboard';
import { ArchitectureBlueprint } from './components/docs/ArchitectureBlueprint';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { BlindReconciliationModal } from './components/pos/BlindReconciliationModal';
import { LanguageProvider } from './contexts/LanguageContext';
import { Lock, Unlock, X, Banknote, Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(() => db.getCurrentUser());
  const [products, setProducts] = useState<Product[]>([]);
  const [currentShift, setCurrentShift] = useState<ShiftRegister | null>(null);
  const [shiftsHistory, setShiftsHistory] = useState<ShiftRegister[]>([]);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [spotChecks, setSpotChecks] = useState<SpotCheckAudit[]>([]);
  const [smsLogsCount, setSmsLogsCount] = useState<number>(() => SMSService.getLogs().length);
  const [businessGoals, setBusinessGoals] = useState<BusinessGoals>(() => db.getBusinessGoals());
  
  // Offline Simulation State
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncQueue, setPendingSyncQueue] = useState<SaleTransaction[]>([]);
  
  // Open Shift Modal State
  const [isOpenShiftModalOpen, setIsOpenShiftModalOpen] = useState(false);
  const [modalCashFloat, setModalCashFloat] = useState('20000');
  const [modalMomoFloat, setModalMomoFloat] = useState('50000');

  // Blind Cash Reconciliation Modal State
  const [isBlindReconModalOpen, setIsBlindReconModalOpen] = useState(false);

  // Load data on startup
  useEffect(() => {
    refreshAllData();
  }, []);

  // Automated background trigger for Weekly/Daily Performance Report sent to owner
  useEffect(() => {
    const runAutomatedReportCheck = () => {
      try {
        const reports = db.getPerformanceReports();
        const latest = reports[0];
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        
        // If no report or last report was generated > 24 hours ago, auto-generate & dispatch
        if (!latest || (now - new Date(latest.generatedAt).getTime()) > oneDayMs) {
          const owner = users.find(u => u.role === 'owner') || currentUser;
          const recipientEmail = owner?.email || 'jeanclaude.mugabo@kigaliretail.rw';
          const recipientPhone = owner?.phone || '+250 788 123 456';
          db.generateWeeklyPerformanceReport('WEEKLY', recipientEmail, recipientPhone);
          setSmsLogsCount(SMSService.getLogs().length);
        }
      } catch (err) {
        console.warn('Automated report generator check:', err);
      }
    };

    runAutomatedReportCheck();
    // Check periodically every 15 minutes
    const intervalTimer = setInterval(runAutomatedReportCheck, 15 * 60 * 1000);
    return () => clearInterval(intervalTimer);
  }, [users, currentUser]);

  const refreshAllData = () => {
    setUsers(db.getUsers());
    setCurrentUser(db.getCurrentUser());
    setProducts(db.getProducts());
    setCurrentShift(db.getCurrentShift());
    setShiftsHistory(db.getShifts());
    setSales(db.getSales());
    setAlerts(db.getAlerts());
    setAdjustments(db.getAdjustments());
    setSpotChecks(db.getSpotChecks());
    setSmsLogsCount(SMSService.getLogs().length);
    setBusinessGoals(db.getBusinessGoals());
  };

  const handleSwitchUser = (user: User) => {
    db.setCurrentUser(user);
    setCurrentUser(user);
    if (user.role === 'employee') {
      setActiveTab('pos');
    }
  };

  const handleLogout = () => {
    if (currentUser.role === 'employee' && currentShift) {
      setIsBlindReconModalOpen(true);
    } else {
      const ownerUser = users.find(u => u.role === 'owner') || currentUser;
      handleSwitchUser(ownerUser);
      setActiveTab('landing');
    }
  };

  const handleEnterFromLanding = (role: 'owner' | 'employee', tab?: ActiveTab) => {
    const targetUser = users.find(u => u.role === role) || currentUser;
    handleSwitchUser(targetUser);
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab(role === 'owner' ? 'owner_dashboard' : 'pos');
    }
  };

  const handleRegisterShop = (data: Omit<OnboardingRegistration, 'id' | 'createdAt'>): OnboardingRegistration => {
    const reg = db.registerShopOnboarding(data);
    
    // Create new owner user for this registered shop
    const isSubscriberActive = data.status === 'ACTIVE';
    const newOwner: User = {
      id: `usr-owner-${Date.now()}`,
      name: data.ownerFullName,
      role: 'owner',
      phone: data.ownerPhone,
      email: data.ownerEmail,
      shopName: data.shopName,
      pin: '1234',
      active: true,
      isNewUser: !isSubscriberActive,
      isDemo: !isSubscriberActive,
      subscriptionStatus: isSubscriberActive ? 'ACTIVE' : 'PENDING',
      flutterwaveTxRef: data.flutterwaveTxRef,
      flutterwaveTransactionId: data.flutterwaveTransactionId
    };
    db.saveUser(newOwner);
    db.setCurrentUser(newOwner);

    refreshAllData();
    return reg;
  };

  const handleOpenShift = (cashier: User, cashFloat: number, momoFloat: number) => {
    const newShift = db.openShift(cashier, cashFloat, momoFloat);
    setCurrentShift(newShift);
    setShiftsHistory(db.getShifts());
    setIsOpenShiftModalOpen(false);
  };

  const handleCloseShiftBlind = (params: {
    actualCashCountedRwf: number;
    actualMomoCountedRwf: number;
    cashDenominations: CashDenominationCount;
    discrepancyNote?: string;
    closedByAuditorName: string;
  }) => {
    const { shift } = db.closeShiftWithBlindCount(params);
    setCurrentShift(null);
    setShiftsHistory(db.getShifts());
    setAlerts(db.getAlerts());
    setSmsLogsCount(SMSService.getLogs().length);
  };

  const handleRecordSale = (saleData: any): SaleTransaction => {
    if (isOffline) {
      // Simulate queuing offline transaction
      const offlineSale: SaleTransaction = {
        ...saleData,
        id: `tx-offline-${Date.now()}`,
        receiptNumber: `RW-OFFLINE-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        isVoided: false,
        offlineQueued: true
      };
      
      // Deduct local memory stock
      setProducts(prev => prev.map(p => {
        const item = saleData.items.find((i: any) => i.productId === p.id);
        if (item) return { ...p, currentStock: Math.max(0, p.currentStock - item.quantity) };
        return p;
      }));

      setPendingSyncQueue(prev => [offlineSale, ...prev]);
      return offlineSale;
    }

    const recorded = db.recordSale(saleData);
    refreshAllData();
    return recorded;
  };

  const handleSyncOfflineData = () => {
    // Process pending offline items into main database
    for (const item of pendingSyncQueue) {
      db.recordSale({
        cashierId: item.cashierId,
        cashierName: item.cashierName,
        items: item.items.map(i => ({
          product: products.find(p => p.id === i.productId) || {
            id: i.productId,
            name: i.productName,
            category: 'Beverages',
            barcode: i.barcode,
            costPriceRwf: i.costPriceRwf,
            sellingPriceRwf: i.unitPriceRwf,
            currentStock: 10,
            minimumStockThreshold: 2
          },
          quantity: i.quantity,
          unitPriceRwf: i.unitPriceRwf,
          costPriceRwf: i.costPriceRwf,
          totalRwf: i.totalRwf
        })),
        subtotalRwf: item.subtotalRwf,
        discountRwf: item.discountRwf,
        totalRwf: item.totalRwf,
        totalCostRwf: item.totalCostRwf,
        grossProfitRwf: item.grossProfitRwf,
        paymentMethod: item.paymentMethod,
        cashTenderedRwf: item.cashTenderedRwf,
        changeGivenRwf: item.changeGivenRwf,
        momoReference: item.momoReference,
        customerPhone: item.customerPhone
      });
    }
    setPendingSyncQueue([]);
    setIsOffline(false);
    refreshAllData();
    alert('✅ All offline transactions successfully reconciled and synced with central database!');
  };

  const handleSaveProduct = (product: Product) => {
    db.saveProduct(product);
    setProducts(db.getProducts());
    setSmsLogsCount(SMSService.getLogs().length);
  };

  const handleSaveUser = (user: User) => {
    db.saveUser(user);
    setUsers(db.getUsers());
  };

  const handleSaveBusinessGoals = (goals: BusinessGoals) => {
    db.saveBusinessGoals(goals);
    setBusinessGoals(goals);
  };

  const handleResetToZeroData = () => {
    db.resetToZeroData();
    refreshAllData();
  };

  const handleRecordStockAdjustment = (params: any) => {
    db.recordStockAdjustment({
      ...params,
      performedBy: currentUser.name,
      performedByRole: currentUser.role
    });
    setProducts(db.getProducts());
    setAdjustments(db.getAdjustments());
    setSmsLogsCount(SMSService.getLogs().length);
  };

  const handleRaiseAlert = (alertData: any) => {
    const alert: FraudAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };
    db.addAlert(alert);
    setAlerts(db.getAlerts());
  };

  const handleResolveAlert = (alertId: string) => {
    db.resolveAlert(alertId);
    setAlerts(db.getAlerts());
  };

  const handleRecordSpotCheck = (audit: SpotCheckAudit) => {
    db.recordSpotCheck(audit);
    setSpotChecks(db.getSpotChecks());
    setAlerts(db.getAlerts());
  };

  const unreadAlertsCount = alerts.filter(a => a.status === 'PENDING').length;

  const isOwnerRoom = currentUser.role === 'owner' && (activeTab === 'owner_dashboard' || activeTab === 'inventory');

  return (
    <LanguageProvider>
      <div 
        className={`min-h-screen text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-neutral-950 pb-16 lg:pb-0 transition-all duration-300 ${
          isOwnerRoom 
            ? "bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center bg-fixed" 
            : 'bg-neutral-950'
        }`}
      >
      {/* Light dark-tint overlay with blur for Store Owner Dashboard ensuring floating UI remains legible */}
      <div className={`min-h-screen flex flex-col ${isOwnerRoom ? 'bg-slate-950/40 backdrop-blur-sm' : ''}`}>
        {/* Top Header & Navigation - Only shown when logged in or inside the app, NEVER on standalone Landing Page */}
        {activeTab !== 'landing' && (
          <Navigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onSwitchUser={handleSwitchUser}
            allUsers={users}
            currentShift={currentShift}
            isOffline={isOffline}
            setIsOffline={setIsOffline}
            pendingSyncCount={pendingSyncQueue.length}
            onSyncOfflineData={handleSyncOfflineData}
            unreadAlertsCount={unreadAlertsCount}
            onOpenNewShiftModal={() => setIsOpenShiftModalOpen(true)}
            smsCount={smsLogsCount}
            onOpenReconciliation={() => {
              if (currentShift) {
                setIsBlindReconModalOpen(true);
              } else {
                setIsOpenShiftModalOpen(true);
              }
            }}
            onLogout={handleLogout}
          />
        )}

        {/* Main View Container */}
        <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onEnterApp={handleEnterFromLanding}
            onRegisterShop={handleRegisterShop}
          />
        )}

        {activeTab === 'owner_dashboard' && (
          <OwnerDashboard
            products={products}
            currentUser={currentUser}
            allUsers={users}
            businessGoals={businessGoals}
            sales={sales}
            shifts={shiftsHistory}
            onSaveProduct={handleSaveProduct}
            onSaveUser={handleSaveUser}
            onSaveBusinessGoals={handleSaveBusinessGoals}
            onResetToZeroData={handleResetToZeroData}
            onNavigateToPOS={() => setActiveTab('pos')}
            onNavigateToLanding={() => setActiveTab('landing')}
            onNavigateToInventory={() => setActiveTab('inventory')}
            onRefreshData={refreshAllData}
            isNewUser={currentUser.isNewUser}
          />
        )}

        {activeTab === 'pos' && (
          <QuickSellView
            products={products}
            currentUser={currentUser}
            currentShift={currentShift}
            onRecordSale={handleRecordSale}
            onOpenShiftModal={() => setIsOpenShiftModalOpen(true)}
            onRaiseAlert={handleRaiseAlert}
            onOpenReconciliation={() => {
              if (currentShift) {
                setIsBlindReconModalOpen(true);
              } else {
                setIsOpenShiftModalOpen(true);
              }
            }}
            onSeedDefaultProducts={() => {
              db.seedDefaultProducts();
              refreshAllData();
            }}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager
            products={products}
            currentUser={currentUser}
            onSaveProduct={handleSaveProduct}
            onRecordStockAdjustment={handleRecordStockAdjustment}
            adjustmentsHistory={adjustments}
          />
        )}

        {activeTab === 'reconciliation' && (
          <BlindCashAudit
            currentShift={currentShift}
            currentUser={currentUser}
            shiftsHistory={shiftsHistory}
            products={products}
            onOpenShift={handleOpenShift}
            onCloseShiftBlind={handleCloseShiftBlind}
            onRecordSpotCheck={handleRecordSpotCheck}
          />
        )}

        {activeTab === 'fraud_dashboard' && (
          <FraudDiscrepancyDashboard
            shifts={shiftsHistory}
            sales={sales}
            alerts={alerts}
            products={products}
            spotChecks={spotChecks}
            currentUser={currentUser}
            onResolveAlert={handleResolveAlert}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureBlueprint />
        )}
      </main>
      </div>

      {/* Dedicated Blind Cash Reconciliation Modal */}
      {isBlindReconModalOpen && currentShift && (
        <BlindReconciliationModal
          shift={currentShift}
          currentUser={currentUser}
          onClose={() => setIsBlindReconModalOpen(false)}
          onShiftClosed={(closedShift) => {
            // PHOTO 4: Clear active cashier session states & redirect to landscape Login/Landing Page ('/')
            setCurrentShift(null);
            setShiftsHistory(db.getShifts());
            setAlerts(db.getAlerts());
            setSmsLogsCount(SMSService.getLogs().length);
            setIsBlindReconModalOpen(false);

            // Clear cashier active session
            const ownerUser = users.find(u => u.role === 'owner') || users[0];
            db.setCurrentUser(ownerUser);
            setCurrentUser(ownerUser);

            // Immediately redirect view back to the main landscape Login/Landing Page ('/')
            setActiveTab('landing');
            if (typeof window !== 'undefined' && window.history) {
              window.history.pushState(null, '', '/');
            }
          }}
        />
      )}

      {/* Floating Modal: Open Register Shift */}
      {isOpenShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-750 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Open Shift Register</span>
              </div>
              <button
                onClick={() => setIsOpenShiftModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Establish the initial physical change float and MTN MoMo starting balance for <strong className="text-white">{currentUser.name}</strong>.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOpenShift(currentUser, parseFloat(modalCashFloat) || 0, parseFloat(modalMomoFloat) || 0);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Cash Drawer Opening Float (RWF)
                </label>
                <div className="relative">
                  <Banknote className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={modalCashFloat}
                    onChange={(e) => setModalCashFloat(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  MTN Mobile Money Starting Float (RWF)
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={modalMomoFloat}
                    onChange={(e) => setModalMomoFloat(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenShiftModalOpen(false)}
                  className="px-4 py-2.5 bg-neutral-800 text-white font-semibold text-xs rounded-xl flex-1 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl flex-1 transition flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Start Shift</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </LanguageProvider>
  );
}
