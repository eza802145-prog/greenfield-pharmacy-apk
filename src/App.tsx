/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useEffect, useState} from 'react';
import {ClipboardList, FileText, Home, LayoutGrid, Phone} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import {BrandMark} from './components/BrandLogo';
import {CatalogueScreen} from './components/CatalogueScreen';
import {ContactScreen} from './components/ContactScreen';
import {EnquiryScreen} from './components/EnquiryScreen';
import {HomeScreen} from './components/HomeScreen';
import {OfflineBanner} from './components/OfflineBanner';
import {PWAInstallButton} from './components/PWAInstallButton';
import {ProductDetailScreen} from './components/ProductDetailScreen';
import {RoadmapScreen} from './components/RoadmapScreen';
import {WhatsAppFallbackModal} from './components/WhatsAppFallbackModal';
import {DEFAULT_PHARMACY_CONFIG, DEMO_PRODUCTS, DEVELOPER_INFO} from './data/pharmacyData';
import type {
  EnquiryDraft,
  PharmacyConfig,
  PharmacyProduct,
  ProductCategory,
  ScreenRoute,
} from './types/pharmacy';
import {buildGeneralContactMessage, sanitizeWhatsAppNumber} from './utils/whatsapp';

const CONFIG_STORAGE_KEY = 'greenfield_pharmacy_config_v3';
const DRAFT_STORAGE_KEY = 'greenfield_pharmacy_enquiry_draft_v1';

const DEFAULT_DRAFT: EnquiryDraft = {
  customerName: '',
  productId: DEMO_PRODUCTS[0].id,
  quantity: 1,
  optionalMessage: '',
};

function loadSavedConfig(): PharmacyConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_PHARMACY_CONFIG;
    const parsed = JSON.parse(raw) as Partial<PharmacyConfig>;
    return {
      ...DEFAULT_PHARMACY_CONFIG,
      ...parsed,
    };
  } catch {
    return DEFAULT_PHARMACY_CONFIG;
  }
}

function loadSavedDraft(): EnquiryDraft {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return DEFAULT_DRAFT;
    const parsed = JSON.parse(raw) as Partial<EnquiryDraft>;
    return {
      ...DEFAULT_DRAFT,
      ...parsed,
      quantity: typeof parsed.quantity === 'number' && parsed.quantity > 0 ? parsed.quantity : 1,
    };
  } catch {
    return DEFAULT_DRAFT;
  }
}

export default function App() {
  const [routeStack, setRouteStack] = useState<ScreenRoute[]>(['home']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedProductId, setSelectedProductId] = useState<string>(DEMO_PRODUCTS[0].id);

  const [config, setConfig] = useState<PharmacyConfig>(loadSavedConfig);
  const [enquiryDraft, setEnquiryDraft] = useState<EnquiryDraft>(loadSavedDraft);

  const [whatsAppModalMessage, setWhatsAppModalMessage] = useState<string | null>(null);

  const currentScreen = routeStack[routeStack.length - 1];
  const selectedProduct =
    DEMO_PRODUCTS.find((p) => p.id === selectedProductId) ?? DEMO_PRODUCTS[0];

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(enquiryDraft));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [enquiryDraft]);

  const navigateTo = (next: ScreenRoute) => {
    setRouteStack((prev) => {
      if (prev[prev.length - 1] === next) return prev;
      return [...prev, next];
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const switchTopTab = (tab: 'home' | 'catalogue' | 'enquiry' | 'roadmap' | 'contact') => {
    if (tab === 'catalogue') {
      setSearchQuery('');
      setSelectedCategory('All');
    }
    setRouteStack([tab]);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleBack = () => {
    setRouteStack((prev) => {
      if (prev.length <= 1) return ['home'];
      return prev.slice(0, -1);
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleSearchFromHome = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('All');
    navigateTo('catalogue');
  };

  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setSearchQuery('');
    navigateTo('catalogue');
  };

  const handleSelectProduct = (product: PharmacyProduct) => {
    setSelectedProductId(product.id);
    navigateTo('details');
  };

  const handleOpenEnquiryForProduct = (product: PharmacyProduct, quantity = 1) => {
    setEnquiryDraft((prev) => ({
      ...prev,
      productId: product.id,
      quantity,
    }));
    navigateTo('enquiry');
  };

  const handleSaveWhatsAppNumber = (newNumber: string) => {
    setConfig((prev) => ({
      ...prev,
      whatsappNumber: sanitizeWhatsAppNumber(newNumber),
      isCustomConfigured: true,
    }));
  };

  const activeNavTab: 'home' | 'catalogue' | 'enquiry' | 'roadmap' | 'contact' =
    currentScreen === 'details' ? 'catalogue' : currentScreen;

  const navItems: Array<{
    id: 'home' | 'catalogue' | 'enquiry' | 'roadmap' | 'contact';
    label: string;
    mobileLabel: string;
    icon: React.ReactNode;
  }> = [
    {id: 'home', label: 'Home', mobileLabel: 'Home', icon: <Home className="w-5 h-5" />},
    {id: 'catalogue', label: 'Products', mobileLabel: 'Products', icon: <LayoutGrid className="w-5 h-5" />},
    {id: 'enquiry', label: 'Enquiry', mobileLabel: 'Enquiry', icon: <ClipboardList className="w-5 h-5" />},
    {id: 'roadmap', label: 'AI Roadmap', mobileLabel: 'Roadmap', icon: <FileText className="w-5 h-5" />},
    {id: 'contact', label: 'Contact', mobileLabel: 'Contact', icon: <Phone className="w-5 h-5" />},
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#1A241F]">
      {/* Top Bar */}
      <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2ECE7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 md:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => switchTopTab('home')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] rounded-lg"
          >
            <BrandMark size={30} className="shrink-0" />
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-[#1A241F] whitespace-nowrap">
              Greenfield Pharmacy
            </span>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {navItems.map((item) => {
              const active = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchTopTab(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    active
                      ? 'text-[#0F5132] border-[#0F5132] font-semibold'
                      : 'text-[#4B5E54] border-transparent hover:text-[#1A241F]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={() => switchTopTab('enquiry')}
              className="hidden md:inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-xl bg-[#0F5132] text-white text-sm font-medium hover:bg-[#0B3D25] transition-colors whitespace-nowrap shrink-0"
            >
              WhatsApp Enquiry
            </button>
          </div>
        </div>
      </header>

      <div className="no-print">
        <OfflineBanner />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-10 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen + (currentScreen === 'details' ? selectedProduct.id : '')}
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -4}}
            transition={{duration: 0.16, ease: [0.16, 1, 0.3, 1]}}
          >
            {currentScreen === 'home' && (
              <HomeScreen
                products={DEMO_PRODUCTS}
                config={config}
                onSearchSubmit={handleSearchFromHome}
                onSelectCategory={handleSelectCategory}
                onOpenCatalogue={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  navigateTo('catalogue');
                }}
                onSelectProduct={handleSelectProduct}
                onOpenEnquiry={() => navigateTo('enquiry')}
                onOpenContact={() => navigateTo('contact')}
                onQuickWhatsApp={() => setWhatsAppModalMessage(buildGeneralContactMessage())}
              />
            )}

            {currentScreen === 'catalogue' && (
              <CatalogueScreen
                products={DEMO_PRODUCTS}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
                onSelectProduct={handleSelectProduct}
                onReturnHome={() => switchTopTab('home')}
                onOpenEnquiry={() => navigateTo('enquiry')}
              />
            )}

            {currentScreen === 'details' && (
              <ProductDetailScreen
                product={selectedProduct}
                config={config}
                onBack={handleBack}
                onOpenEnquiryForm={handleOpenEnquiryForProduct}
                onTriggerWhatsAppFallback={(msg) => setWhatsAppModalMessage(msg)}
              />
            )}

            {currentScreen === 'enquiry' && (
              <EnquiryScreen
                products={DEMO_PRODUCTS}
                draft={enquiryDraft}
                config={config}
                onUpdateDraft={setEnquiryDraft}
                onResetDraft={() => setEnquiryDraft(DEFAULT_DRAFT)}
                onBack={handleBack}
                onLaunchWhatsApp={(msg) => setWhatsAppModalMessage(msg)}
              />
            )}

            {currentScreen === 'roadmap' && (
              <RoadmapScreen
                config={config}
                onOpenCatalogue={() => switchTopTab('catalogue')}
                onOpenContact={() => switchTopTab('contact')}
              />
            )}

            {currentScreen === 'contact' && (
              <ContactScreen
                config={config}
                onUpdateConfig={setConfig}
                onResetConfig={() => setConfig(DEFAULT_PHARMACY_CONFIG)}
                onTriggerWhatsApp={(msg) => setWhatsAppModalMessage(msg)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-[#E2ECE7] bg-white pt-6 pb-24 md:pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4 text-xs text-[#4B5E54]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-[#1A241F]">
                Greenfield Pharmacy · {config.staffNames}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <a
                  href={`tel:${config.telephone}`}
                  className="hover:text-[#0F5132] font-medium tabular-nums"
                >
                  Tel: {config.telephone}
                </a>
                <a href={`mailto:${config.email}`} className="hover:text-[#0F5132]">
                  Email: {config.email}
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    config.address,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0F5132]"
                >
                  {config.address}
                </a>
              </div>
              <p>{config.openingHours}</p>
            </div>

            <div className="flex flex-wrap items-center gap-5 shrink-0">
              <button
                type="button"
                onClick={() => switchTopTab('catalogue')}
                className="hover:text-[#1A241F] font-medium"
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => switchTopTab('enquiry')}
                className="hover:text-[#1A241F] font-medium"
              >
                Enquiry
              </button>
              <button
                type="button"
                onClick={() => switchTopTab('roadmap')}
                className="hover:text-[#1A241F] font-medium"
              >
                AI Roadmap
              </button>
              <button
                type="button"
                onClick={() => switchTopTab('contact')}
                className="hover:text-[#1A241F] font-medium"
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F1F7F4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              Application Developer: <strong className="text-[#1A241F]">{DEVELOPER_INFO.name}</strong>
            </span>
            <a
              href={DEVELOPER_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0F5132] font-medium hover:underline"
            >
              Developer LinkedIn Profile
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation */}
      <nav
        aria-label="Mobile bottom navigation"
        className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2ECE7] pb-safe"
      >
        <div className="grid grid-cols-5 h-[60px]">
          {navItems.map((item) => {
            const active = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => switchTopTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors ${
                  active ? 'text-[#0F5132] font-semibold' : 'text-[#4B5E54]'
                }`}
              >
                {item.icon}
                <span className="text-[11px] leading-none tracking-tight">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* WhatsApp Review & Fallback Modal */}
      <WhatsAppFallbackModal
        isOpen={whatsAppModalMessage !== null}
        onClose={() => setWhatsAppModalMessage(null)}
        message={whatsAppModalMessage ?? ''}
        config={config}
        onSaveWhatsAppNumber={handleSaveWhatsAppNumber}
      />
    </div>
  );
}
