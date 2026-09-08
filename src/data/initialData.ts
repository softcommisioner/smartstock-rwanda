import { Product, User, ShiftRegister, FraudAlert, SaleTransaction, SMSLog, OnboardingRegistration, PurchaseInvoice, ShopExpense, EmployeeContract, StaffShiftRecord, DebtorRecord } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-owner-1',
    name: 'Jean-Claude Mugabo',
    phone: '+250 788 123 456',
    email: 'mugabo@smartstock.rw',
    role: 'owner',
    pin: '8899',
    systemPassword: 'Password123!',
    shopName: 'Mugabo Supermarket & Boutique (Nyamirambo, Kigali)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    shiftType: 'WHOLE_DAY',
    active: true
  },
  {
    id: 'usr-cashier-1',
    name: 'Eric Nshimiyimana',
    phone: '+250 783 987 654',
    email: 'eric@smartstock.rw',
    role: 'employee',
    pin: '1234',
    systemPassword: 'Password123!',
    shopName: 'Mugabo Supermarket & Boutique (Nyamirambo, Kigali)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    shiftType: 'WHOLE_DAY',
    active: true
  },
  {
    id: 'usr-cashier-2',
    name: 'Aline Umutoni',
    phone: '+250 785 456 789',
    email: 'aline@smartstock.rw',
    role: 'employee',
    pin: '4321',
    systemPassword: 'Password123!',
    shopName: 'Mugabo Supermarket & Boutique (Nyamirambo, Kigali)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    shiftType: 'MORNING_SHIFT',
    active: true
  },
  {
    id: 'usr-cashier-3',
    name: 'Olivier Hakizimana',
    phone: '+250 782 112 233',
    email: 'olivier@smartstock.rw',
    role: 'employee',
    pin: '5678',
    systemPassword: 'Password123!',
    shopName: 'Mugabo Supermarket & Boutique (Nyamirambo, Kigali)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    shiftType: 'AFTERNOON_SHIFT',
    active: true
  }
];

// Fresh Owner initial state: zero items in stock (0 SKUs)
export const INITIAL_PRODUCTS: Product[] = [];

// Quick-load default retail catalog (No barcodes needed, standard Kigali commodities)
export const DEFAULT_RETAIL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Inyange Whole Milk (500ml Tetra)',
    category: 'Beverages & Drinks',
    costPriceRwf: 450,
    sellingPriceRwf: 600,
    minSellingPriceRwf: 550,
    currentStock: 48,
    unit: 'pcs',
    reorderLevel: 10,
    isVatApplicable: true,
    lastRestockedAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Bralirwa Primus Beer (50cl Bottle)',
    category: 'Beverages & Drinks',
    costPriceRwf: 850,
    sellingPriceRwf: 1200,
    minSellingPriceRwf: 1100,
    currentStock: 72,
    unit: 'bottle',
    reorderLevel: 15,
    isVatApplicable: true,
    lastRestockedAt: '2026-09-02T11:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Azam Wheat Flour Super (1kg)',
    category: 'Alimentation & Groceries',
    costPriceRwf: 1100,
    sellingPriceRwf: 1400,
    minSellingPriceRwf: 1300,
    currentStock: 35,
    unit: 'pack',
    reorderLevel: 8,
    isVatApplicable: true,
    lastRestockedAt: '2026-09-01T09:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Savon Gorilla Bar Soap (800g)',
    category: 'Household & Cleaning',
    costPriceRwf: 800,
    sellingPriceRwf: 1100,
    minSellingPriceRwf: 1000,
    currentStock: 25,
    unit: 'pcs',
    reorderLevel: 5,
    isVatApplicable: true,
    lastRestockedAt: '2026-09-01T14:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Skol Malt Lager (50cl)',
    category: 'Beverages & Drinks',
    costPriceRwf: 900,
    sellingPriceRwf: 1300,
    minSellingPriceRwf: 1200,
    currentStock: 40,
    unit: 'bottle',
    reorderLevel: 12,
    isVatApplicable: true,
    lastRestockedAt: '2026-09-02T16:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Kinazi Cassava Flour (2kg Pack)',
    category: 'Alimentation & Groceries',
    costPriceRwf: 1600,
    sellingPriceRwf: 2200,
    minSellingPriceRwf: 2000,
    currentStock: 20,
    unit: 'pack',
    reorderLevel: 6,
    isVatApplicable: true,
    lastRestockedAt: '2026-09-03T08:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Colgate Herbal Toothpaste (100ml)',
    category: 'Personal Care & Beauty',
    costPriceRwf: 1200,
    sellingPriceRwf: 1700,
    minSellingPriceRwf: 1500,
    currentStock: 18,
    unit: 'pcs',
    reorderLevel: 5,
    isVatApplicable: true,
    lastRestockedAt: '2026-09-03T11:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'MTN Airtime Scratch Card (1,000 RWF)',
    category: 'Electronics & Airtime',
    costPriceRwf: 950,
    sellingPriceRwf: 1000,
    minSellingPriceRwf: 1000,
    currentStock: 100,
    unit: 'card',
    reorderLevel: 20,
    isVatApplicable: false,
    lastRestockedAt: '2026-09-04T07:00:00Z'
  }
];

export const INITIAL_SHIFTS: ShiftRegister[] = [
  {
    id: 'shift-yesterday',
    shiftCode: 'SHIFT-2026-09-02-EVENING',
    cashierId: 'usr-cashier-1',
    cashierName: 'Eric Nshimiyimana',
    openedAt: '2026-09-02T08:00:00Z',
    closedAt: '2026-09-02T20:00:00Z',
    openingCashFloatRwf: 20000,
    openingMomoFloatRwf: 50000,
    totalCashSalesRwf: 84500,
    totalMomoSalesRwf: 63000,
    totalSalesCount: 42,
    totalVoidCount: 3,
    totalVoidAmountRwf: 4500,
    expectedCashInDrawerRwf: 104500,
    expectedMomoInAccountRwf: 113000,
    actualCashCountedRwf: 104000, // Blind count shortfall of 500 RWF!
    actualMomoCountedRwf: 113000,
    cashVarianceRwf: -500,        // -500 RWF theft / leakage
    momoVarianceRwf: 0,
    status: 'CLOSED_SHORTAGE',
    discrepancyNote: 'Cashier blind count was 500 RWF short. Repeated 3rd time this week.',
    closedByAuditorName: 'Jean-Claude Mugabo',
    ownerSmsAlertSent: true
  }
];

export const INITIAL_ALERTS: FraudAlert[] = [
  {
    id: 'alert-1',
    timestamp: '2026-09-02T20:05:00Z',
    title: '500 RWF Daily Cash Shortage Detected',
    description: 'Cashier Eric Nshimiyimana finished shift with -500 RWF variance against physical drawer audit. Compounded weekly loss: 3,500 RWF. Automated SMS dispatched to Owner.',
    severity: 'HIGH',
    category: 'CASH_SHORTAGE',
    relatedCashierName: 'Eric Nshimiyimana',
    amountAtRiskRwf: 500,
    suggestedAction: 'Require physical blind count verification & review CCTV/void log.',
    status: 'PENDING'
  },
  {
    id: 'alert-2',
    timestamp: '2026-09-02T17:42:00Z',
    title: 'Suspicious Cart Void After Price Display',
    description: 'Receipt for 2x Bralirwa Mutzig (3,000 RWF) was voided 45 seconds after scanning. Check if customer handed cash and left without printed receipt.',
    severity: 'MEDIUM',
    category: 'PHANTOM_VOID',
    relatedCashierName: 'Eric Nshimiyimana',
    amountAtRiskRwf: 3000,
    suggestedAction: 'Match empty Mutzig bottle crates against recorded sales today.',
    status: 'PENDING'
  },
  {
    id: 'alert-3',
    timestamp: '2026-09-01T14:20:00Z',
    title: 'Price Floor Override Attempt Blocked',
    description: 'Attempt to sell Kitenge Wax Fabric at 14,000 RWF (below floor price 16,500 RWF) without Owner OTP.',
    severity: 'LOW',
    category: 'PRICE_TAMPERING',
    relatedCashierName: 'Aline Umutoni',
    amountAtRiskRwf: 2500,
    suggestedAction: 'Verify if authorized customer promo was verbally requested.',
    status: 'RESOLVED'
  }
];

export const INITIAL_SALES: SaleTransaction[] = [
  {
    id: 'tx-1001',
    receiptNumber: 'RW-20260902-1001',
    cashierId: 'usr-cashier-1',
    cashierName: 'Eric Nshimiyimana',
    items: [
      {
        productId: 'prod-1',
        productName: 'Inyange Whole Milk (500ml Tetra)',
        barcode: '6161100010012',
        quantity: 2,
        unitPriceRwf: 600,
        costPriceRwf: 450,
        totalRwf: 1200,
        isVatApplicable: true
      },
      {
        productId: 'prod-5',
        productName: 'Azam Wheat Flour Super (1kg)',
        barcode: '6162200010055',
        quantity: 1,
        unitPriceRwf: 1400,
        costPriceRwf: 1100,
        totalRwf: 1400,
        isVatApplicable: true
      }
    ],
    subtotalRwf: 2600,
    discountRwf: 0,
    totalRwf: 2600,
    totalCostRwf: 2000,
    grossProfitRwf: 600,
    paymentMethod: 'MOMO_MTN',
    cashTenderedRwf: 2600,
    changeGivenRwf: 0,
    momoReference: 'MP260902.1523.A9812',
    customerPhone: '+250 788 555 123',
    customerReceiptSent: true,
    customerReceiptMedium: 'SMS',
    rraInvoice: {
      tin: '108392019',
      bhfId: '00',
      cisId: 'CIS-SMARTSTOCK-RW-01',
      sdcId: 'SDC-RRA-KGL-0492',
      sdcReceiptNumber: 'SDC/0492/2026/00101',
      globalReceiptCounter: 101,
      taxableAmountA_18: 2203,
      vatAmountA_18: 397,
      taxExemptAmountB: 0,
      totalAmountRwf: 2600,
      receiptSignature: 'RRA-8F2B-91A4-32DE',
      qrVerificationUrl: 'https://ebm.rra.gov.rw/verify?tin=108392019&bhf=00&rc=101&sig=RRA-8F2B-91A4-32DE'
    },
    timestamp: '2026-09-02T15:23:10Z',
    isVoided: false
  },
  {
    id: 'tx-1002',
    receiptNumber: 'RW-20260902-1002',
    cashierId: 'usr-cashier-1',
    cashierName: 'Eric Nshimiyimana',
    items: [
      {
        productId: 'prod-3',
        productName: 'Bralirwa Primus Beer (50cl Bottle)',
        barcode: '6161100030034',
        quantity: 4,
        unitPriceRwf: 1200,
        costPriceRwf: 850,
        totalRwf: 4800,
        isVatApplicable: true
      }
    ],
    subtotalRwf: 4800,
    discountRwf: 0,
    totalRwf: 4800,
    totalCostRwf: 3400,
    grossProfitRwf: 1400,
    paymentMethod: 'CASH',
    cashTenderedRwf: 5000,
    changeGivenRwf: 200,
    customerReceiptSent: false,
    rraInvoice: {
      tin: '108392019',
      bhfId: '00',
      cisId: 'CIS-SMARTSTOCK-RW-01',
      sdcId: 'SDC-RRA-KGL-0492',
      sdcReceiptNumber: 'SDC/0492/2026/00102',
      globalReceiptCounter: 102,
      taxableAmountA_18: 4068,
      vatAmountA_18: 732,
      taxExemptAmountB: 0,
      totalAmountRwf: 4800,
      receiptSignature: 'RRA-7E4A-B821-65FC',
      qrVerificationUrl: 'https://ebm.rra.gov.rw/verify?tin=108392019&bhf=00&rc=102&sig=RRA-7E4A-B821-65FC'
    },
    timestamp: '2026-09-02T16:45:00Z',
    isVoided: false
  }
];

export const INITIAL_SMS_LOGS: SMSLog[] = [
  {
    id: 'sms-init-1',
    recipientPhone: '+250 783 987 654',
    recipientName: 'Eric Nshimiyimana',
    recipientRole: 'STAFF',
    message: '[SmartStock Alert] Jean-Claude Mugabo updated stock for "Inyange Whole Milk (500ml Tetra)". New Stock: 48 pcs (+24). Selling Price: 600 RWF.',
    type: 'STAFF_RESTOCK_ALERT',
    status: 'DELIVERED',
    timestamp: '2026-09-02T14:15:00Z',
    referenceId: 'prod-1',
    costRwf: 15
  },
  {
    id: 'sms-init-2',
    recipientPhone: '+250 788 123 456',
    recipientName: 'Jean-Claude Mugabo',
    recipientRole: 'OWNER',
    message: '[SmartStock Anti-Theft Alert] ⚠️ DISCREPANCY DETECTED! Cashier Eric Nshimiyimana closed SHIFT-2026-09-02-EVENING with a shortage of 500 RWF. Expected: 104,500 RWF | Counted: 104,000 RWF.',
    type: 'OWNER_DISCREPANCY_ALERT',
    status: 'DELIVERED',
    timestamp: '2026-09-02T20:00:10Z',
    referenceId: 'shift-yesterday',
    costRwf: 15
  },
  {
    id: 'sms-init-3',
    recipientPhone: '+250 788 555 123',
    recipientName: 'Customer',
    recipientRole: 'CUSTOMER',
    message: '[SmartStock e-Receipt] Mugabo Supermarket. Receipt: RW-20260902-1001. Total: 2,600 RWF (18% RRA VAT: 397 RWF). EBM SDC: SDC/0492/2026/00101. Verify RRA: https://ebm.rra.gov.rw/verify?tin=108392019&bhf=00&rc=101&sig=RRA-8F2B-91A4-32DE. Murakoze cyane!',
    type: 'CUSTOMER_RECEIPT',
    status: 'DELIVERED',
    timestamp: '2026-09-02T15:23:15Z',
    referenceId: 'tx-1001',
    costRwf: 15
  }
];

export const INITIAL_ONBOARDING: OnboardingRegistration[] = [
  {
    id: 'onb-1',
    shopName: 'Mugabo Supermarket & Boutique',
    ownerFullName: 'Jean-Claude Mugabo',
    ownerPhone: '+250 788 123 456',
    ownerEmail: 'jeanclaude.mugabo@kigaliretail.rw',
    districtLocation: 'Nyarugenge (Nyamirambo), Kigali',
    shopType: 'Supermarket',
    staffCount: 3,
    setupFeePaidRwf: 30000,
    monthlyPlanRwf: 8000,
    paymentMethod: 'MTN_MOMO',
    paymentReference: 'MOMO-SETUP-98124',
    trainingScheduledDate: '2026-09-05',
    status: 'ACTIVE',
    createdAt: '2026-09-01T10:00:00Z'
  }
];

export const INITIAL_INVOICES: PurchaseInvoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'FACT-BRAL-2026-0901',
    supplierName: 'Bralirwa Ltd (Kicukiro Depot)',
    date: '2026-09-01',
    totalAmountRwf: 184000,
    paymentStatus: 'PAID',
    paymentMethod: 'MOMO_MTN',
    itemsSummary: '10 Crates Primus (500ml), 8 Crates Mutzig (500ml), 5 Crates Amstel',
    notes: 'Direct depot delivery via Truck #RAC 452X',
    attachmentName: 'Facture_Bralirwa_Sept01.pdf',
    createdAt: '2026-09-01T09:30:00Z'
  },
  {
    id: 'inv-102',
    invoiceNumber: 'FACT-INY-2026-0903',
    supplierName: 'Inyange Industries Ltd (Masaka)',
    date: '2026-09-03',
    totalAmountRwf: 96000,
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER',
    itemsSummary: '8 Cartons Inyange Milk 500ml, 5 Cartons Inyange Apple & Mango Juice 300ml',
    notes: 'Paid via Bank of Kigali App transfer',
    attachmentName: 'Inyange_Restock_Receipt_0903.pdf',
    createdAt: '2026-09-03T11:15:00Z'
  },
  {
    id: 'inv-103',
    invoiceNumber: 'DEP-NYAB-2026-0904',
    supplierName: 'Nyabugogo Wholesale Grain & Oil Depot',
    date: '2026-09-04',
    totalAmountRwf: 145000,
    paymentStatus: 'PARTIALLY_PAID',
    paymentMethod: 'CASH',
    itemsSummary: '5 Sacks Gorilla Rice (25kg), 3 Jerrycans Sunseed Cooking Oil (20L)',
    notes: 'Balance of 35,000 RWF to be settled on next delivery Friday',
    attachmentName: 'Nyabugogo_Invoice_Receipt.pdf',
    createdAt: '2026-09-04T14:00:00Z'
  }
];

export const INITIAL_EXPENSES: ShopExpense[] = [
  {
    id: 'exp-201',
    category: 'SALARIES_PAYROLL',
    amountRwf: 75000,
    date: '2026-09-01',
    paidTo: 'Eric Nshimiyimana (Cashier)',
    description: 'Umuhembo w\'ukwezi gushize (August salary) - MoMo Code #9812',
    quoteRef: 'PAY-AUG-2026-01',
    paymentMethod: 'MOMO_MTN',
    approvedBy: 'Jean-Claude Mugabo',
    createdAt: '2026-09-01T17:00:00Z'
  },
  {
    id: 'exp-202',
    category: 'SHOP_RENT',
    amountRwf: 120000,
    date: '2026-09-01',
    paidTo: 'Proprietor Gasana Alexis',
    description: 'Ubukode bw\'inzu y\'iduka ukwezi kwa Nzeri (September 2026 Store Rent - Nyamirambo Commercial Arcade)',
    quoteRef: 'RENT-REC-0926',
    paymentMethod: 'BANK',
    approvedBy: 'Jean-Claude Mugabo',
    createdAt: '2026-09-01T14:30:00Z'
  },
  {
    id: 'exp-203',
    category: 'ELECTRICITY_REG',
    amountRwf: 15000,
    date: '2026-09-03',
    paidTo: 'REG Rwanda Energy Group (EUCL)',
    description: 'Token y\'umuriro w\'amashanyarazi y\'iduka na firigo (Cashpower Meter #04128934521 - 78.4 kWh)',
    quoteRef: 'REG-TK-5491',
    paymentMethod: 'MOMO_MTN',
    approvedBy: 'Jean-Claude Mugabo',
    createdAt: '2026-09-03T10:00:00Z'
  },
  {
    id: 'exp-204',
    category: 'PACKAGING_BAGS',
    amountRwf: 8000,
    date: '2026-09-04',
    paidTo: 'EcoPlast Kigali (Biodegradable bags supplier)',
    description: 'Amashashi yemewe n\'amategeko ya REMA yo guha abakiriya (2 Cartons REMA approved bio bags)',
    quoteRef: 'ECO-BAG-102',
    paymentMethod: 'CASH',
    approvedBy: 'Jean-Claude Mugabo',
    createdAt: '2026-09-04T16:20:00Z'
  }
];

export const INITIAL_CONTRACTS: EmployeeContract[] = [
  {
    id: 'cont-301',
    userId: 'usr-cashier-1',
    employeeName: 'Eric Nshimiyimana',
    nationalIdOrPassport: '1 1996 8 0034291 0 45',
    role: 'employee',
    monthlySalaryRwf: 75000,
    shiftType: 'WHOLE_DAY',
    startDate: '2025-10-01',
    contractType: 'PERMANENT',
    status: 'ACTIVE',
    pdfFileName: 'Contract_Eric_Nshimiyimana_SmartStock.pdf',
    notes: 'Senior Cashier & Stock Controller. RSSB Registered.',
    createdAt: '2025-09-28T10:00:00Z'
  },
  {
    id: 'cont-302',
    userId: 'usr-cashier-2',
    employeeName: 'Aline Umutoni',
    nationalIdOrPassport: '1 1999 7 0048123 0 12',
    role: 'employee',
    monthlySalaryRwf: 65000,
    shiftType: 'MORNING_SHIFT',
    startDate: '2026-02-15',
    contractType: 'FIXED_TERM',
    status: 'ACTIVE',
    pdfFileName: 'Contract_Aline_Umutoni_2026.pdf',
    notes: 'Morning shift cashier (07:00 - 15:00).',
    createdAt: '2026-02-10T11:00:00Z'
  },
  {
    id: 'cont-303',
    userId: 'usr-cashier-3',
    employeeName: 'Olivier Hakizimana',
    nationalIdOrPassport: '1 1997 8 0055412 0 88',
    role: 'employee',
    monthlySalaryRwf: 65000,
    shiftType: 'AFTERNOON_SHIFT',
    startDate: '2026-04-01',
    contractType: 'FIXED_TERM',
    status: 'ACTIVE',
    pdfFileName: 'Contract_Olivier_Hakizimana_2026.pdf',
    notes: 'Afternoon & Evening cashier (14:30 - 22:30).',
    createdAt: '2026-03-28T09:00:00Z'
  }
];

export const INITIAL_STAFF_SHIFTS: StaffShiftRecord[] = [
  {
    id: 'shift-rec-401',
    userId: 'usr-cashier-1',
    employeeName: 'Eric Nshimiyimana',
    shiftType: 'WHOLE_DAY',
    date: '2026-09-06',
    clockInTime: '07:45 AM',
    status: 'ON_DUTY',
    hoursLogged: 6.5
  },
  {
    id: 'shift-rec-402',
    userId: 'usr-cashier-2',
    employeeName: 'Aline Umutoni',
    shiftType: 'MORNING_SHIFT',
    date: '2026-09-06',
    clockInTime: '06:55 AM',
    clockOutTime: '03:00 PM',
    status: 'COMPLETED',
    hoursLogged: 8.0
  },
  {
    id: 'shift-rec-403',
    userId: 'usr-cashier-3',
    employeeName: 'Olivier Hakizimana',
    shiftType: 'AFTERNOON_SHIFT',
    date: '2026-09-06',
    clockInTime: '02:30 PM',
    status: 'ON_DUTY',
    hoursLogged: 2.0
  }
];

export const INITIAL_DEBTORS: DebtorRecord[] = [
  {
    id: 'debt-101',
    saleId: 'tx-1001',
    receiptNumber: 'RW-20260901-8412',
    customerName: 'Emmanuel Habimana',
    customerPhone: '+250 788 412 890',
    totalAmountRwf: 18000,
    paidAmountRwf: 8000,
    remainingBalanceRwf: 10000,
    dueDate: '2026-09-15',
    status: 'PARTIALLY_PAID',
    createdAt: '2026-09-01T14:20:00Z',
    notes: 'Akaranguzo k\'amavuta n\'isukari yafashe ku ikarita',
    settlements: [
      {
        id: 'set-001',
        amountRwf: 8000,
        paymentMethod: 'MOMO_MTN',
        timestamp: '2026-09-04T10:15:00Z',
        receivedBy: 'Eric Nshimiyimana',
        note: 'Yatanze 8,000 RWF kuri MoMo'
      }
    ]
  },
  {
    id: 'debt-102',
    saleId: 'tx-1002',
    receiptNumber: 'RW-20260903-5129',
    customerName: 'Solange Mukamana',
    customerPhone: '+250 782 301 445',
    totalAmountRwf: 15000,
    paidAmountRwf: 0,
    remainingBalanceRwf: 15000,
    dueDate: '2026-09-12',
    status: 'UNPAID',
    createdAt: '2026-09-03T16:45:00Z',
    notes: 'Amata ya Inyange n\'ifu ya Azam ku ikirambirize',
    settlements: []
  },
  {
    id: 'debt-103',
    saleId: 'tx-1003',
    receiptNumber: 'RW-20260905-3211',
    customerName: 'Pascal Ndayisaba',
    customerPhone: '+250 789 654 112',
    totalAmountRwf: 10000,
    paidAmountRwf: 0,
    remainingBalanceRwf: 10000,
    dueDate: '2026-09-20',
    status: 'UNPAID',
    createdAt: '2026-09-05T11:10:00Z',
    notes: 'Ibicuruzwa by\'isuku n\'amavuta ya elayo',
    settlements: []
  }
];
