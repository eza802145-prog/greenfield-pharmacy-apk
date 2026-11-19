import React, {useState} from 'react';
import {
  ArrowRight,
  Baby,
  Clock,
  MapPin,
  MessageCircle,
  Pill,
  Search,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import {DEMO_DATA_NOTICE, PRODUCT_CATEGORIES, QUICK_SEARCH_TERMS} from '../data/pharmacyData';
import type {PharmacyConfig, PharmacyProduct, ProductCategory} from '../types/pharmacy';
import {formatNairaDemo} from '../utils/whatsapp';
import {BrandMark} from './BrandLogo';
import {HealthcareDisclaimer} from './HealthcareDisclaimer';
import {ProductCard} from './ProductCard';
import {ResilientImage} from './ResilientImage';

interface HomeScreenProps {
  products: PharmacyProduct[];
  config: PharmacyConfig;
  onSearchSubmit: (query: string) => void;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenCatalogue: () => void;
  onSelectProduct: (product: PharmacyProduct) => void;
  onOpenEnquiry: () => void;
  onOpenContact: () => void;
  onQuickWhatsApp: () => void;
}

const CATEGORY_ICONS: Record<ProductCategory, React.ReactNode> = {
  'Personal Care Products': <Sparkles className="w-4 h-4" />,
  'Baby Care Products': <Baby className="w-4 h-4" />,
  'Health Equipment Products': <Stethoscope className="w-4 h-4" />,
  'OTC Products': <Pill className="w-4 h-4" />,
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  config,
  onSearchSubmit,
  onSelectCategory,
  onOpenCatalogue,
  onSelectProduct,
  onOpenEnquiry,
  onOpenContact,
  onQuickWhatsApp,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [quickTab, setQuickTab] = useState<ProductCategory | 'Featured'>('Featured');

  const trimmedTerms = searchInput
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const liveMatches =
    trimmedTerms.length > 0
      ? products.filter((p) => {
          const text = [
            p.name,
            p.category,
            p.shortDescription,
            p.activeInfo,
            ...p.keywords,
          ]
            .join(' ')
            .toLowerCase();
          return trimmedTerms.every((t) => text.includes(t));
        })
      : [];

  const showcasedProducts =
    quickTab === 'Featured'
      ? products.filter((p) => p.featured).slice(0, 6)
      : products.filter((p) => p.category === quickTab).slice(0, 6);
  const popularProducts = products.filter((p) => p.popular).slice(0, 6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchInput.trim());
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero Section */}
      <section className="rounded-3xl bg-white border border-[#E2ECE7] overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <BrandMark size={44} className="shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#0F5132]">
                    Lagos Neighbourhood Pharmacy · Demonstration App
                  </p>
                  <p className="text-sm font-semibold text-[#1A241F]">
                    Your Health. Our Priority.
                  </p>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A241F] tracking-tight leading-tight text-balance">
                Greenfield Pharmacy Product Catalogue
              </h1>

              <p className="text-sm sm:text-base text-[#4B5E54] leading-relaxed max-w-2xl">
                Welcome to Greenfield Pharmacy. Explore our health and personal care products and
                contact our pharmacy team for assistance.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#4B5E54] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search e.g. Panadol, Vitamin, Baby, Dettol, ORS..."
                      aria-label="Search pharmacy products"
                      className="w-full min-h-[48px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] pl-10 pr-10 text-sm text-[#1A241F] placeholder:text-[#4B5E54]/70 focus:border-[#0F5132] focus:bg-white focus:outline-none"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => setSearchInput('')}
                        aria-label="Clear search"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-[#4B5E54] hover:bg-[#E2ECE7]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="min-h-[48px] px-5 py-3 rounded-xl bg-[#0F5132] text-white text-sm font-semibold hover:bg-[#0B3D25] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-2"
                  >
                    Search
                  </button>
                </form>

                {/* Instant Live Search Results */}
                {trimmedTerms.length > 0 && (
                  <div
                    role="region"
                    aria-label="Matching products"
                    className="mt-2 rounded-2xl border border-[#CFE0D6] bg-white shadow-lg overflow-hidden divide-y divide-[#F1F7F4]"
                  >
                    {liveMatches.length > 0 ? (
                      <>
                        {liveMatches.slice(0, 6).map((match) => (
                          <button
                            key={match.id}
                            type="button"
                            onClick={() => onSelectProduct(match)}
                            className="w-full min-h-[58px] px-3.5 py-2 flex items-center justify-between gap-3 text-left hover:bg-[#F1F7F4] transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <ResilientImage
                                src={match.imagePath}
                                alt={match.name}
                                fallbackLabel={match.name}
                                className="w-11 h-11 rounded-lg object-cover shrink-0 border border-[#E2ECE7]"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#1A241F] truncate">
                                  {match.name}
                                </p>
                                <p className="text-xs text-[#4B5E54] truncate">
                                  {match.category} · {match.packSize}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-[#0F5132] tabular-nums whitespace-nowrap shrink-0">
                              {formatNairaDemo(match.demoPriceNgn)}
                            </span>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => onSearchSubmit(searchInput.trim())}
                          className="w-full min-h-[44px] px-4 py-2.5 bg-[#F8FAF9] text-xs font-semibold text-[#0F5132] hover:bg-[#F1F7F4] text-center transition-colors"
                        >
                          See all {liveMatches.length} matching results in Catalogue →
                        </button>
                      </>
                    ) : (
                      <div className="px-4 py-3 text-xs text-[#4B5E54] flex items-center justify-between gap-3">
                        <span>No exact match for &ldquo;{searchInput.trim()}&rdquo;.</span>
                        <button
                          type="button"
                          onClick={onOpenEnquiry}
                          className="font-semibold text-[#0F5132] hover:underline whitespace-nowrap"
                        >
                          Ask on WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Searchable Product Names */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-[#4B5E54] mr-1">Popular searches:</span>
                {QUICK_SEARCH_TERMS.slice(0, 6).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onSearchSubmit(term)}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg border border-[#DCE8E1] bg-[#F8FAF9] text-xs font-medium text-[#0F5132] hover:bg-[#F1F7F4] hover:border-[#0F5132]/40 transition-colors whitespace-nowrap"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenCatalogue}
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-[#CFE0D6] bg-[#F1F7F4] px-4 py-2.5 text-sm font-medium text-[#0F5132] hover:bg-[#E2ECE7] transition-colors whitespace-nowrap"
                >
                  <span>Browse All {products.length} Products</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={onQuickWhatsApp}
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-[#CFE0D6] bg-white px-4 py-2.5 text-sm font-medium text-[#1A241F] hover:bg-[#F8FAF9] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>WhatsApp Pharmacy</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 min-h-[220px] sm:min-h-[280px] lg:min-h-full bg-[#F1F7F4]">
            <ResilientImage
              src="/assets/aistudio/image_fa50f416.png"
              alt="Greenfield Pharmacy pharmacist assisting a customer at the counter"
              fallbackLabel="Greenfield Pharmacy"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section aria-labelledby="categories-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="categories-heading" className="text-xl sm:text-2xl font-bold text-[#1A241F]">
              Product Categories
            </h2>
            <p className="text-sm text-[#4B5E54] mt-0.5">
              Tap a category to filter the catalogue immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCatalogue}
            className="text-sm font-semibold text-[#0F5132] hover:underline whitespace-nowrap shrink-0 min-h-[40px] flex items-center"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PRODUCT_CATEGORIES.map((category) => {
            const categoryCount = products.filter((p) => p.category === category.name).length;
            return (
              <button
                key={category.name}
                type="button"
                onClick={() => onSelectCategory(category.name)}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-[#E2ECE7] text-left hover:border-[#0F5132]/40 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132]"
              >
                <div className="relative aspect-[4/3] w-full bg-[#F1F7F4] overflow-hidden border-b border-[#E2ECE7]">
                  <ResilientImage
                    src={category.imagePath}
                    alt={category.name}
                    fallbackLabel={category.name}
                    className="h-full w-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 sm:p-4 flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F1F7F4] text-[#0F5132] group-hover:bg-[#0F5132] group-hover:text-white transition-colors">
                      {CATEGORY_ICONS[category.name]}
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-[#1A241F] leading-snug">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#4B5E54] line-clamp-2">
                    {category.summary}
                  </p>
                  <span className="mt-auto pt-1 text-[11px] font-medium text-[#0F5132]">
                    {categoryCount} products · View category →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products with Quick Category Tabs */}
      <section aria-labelledby="featured-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 id="featured-heading" className="text-xl sm:text-2xl font-bold text-[#1A241F]">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5E54] mt-0.5">{DEMO_DATA_NOTICE}</p>
          </div>
          <button
            type="button"
            onClick={onOpenCatalogue}
            className="text-sm font-semibold text-[#0F5132] hover:underline whitespace-nowrap shrink-0 self-start sm:self-auto min-h-[40px] flex items-center"
          >
            See All
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Quick category filter"
          className="flex items-center gap-5 overflow-x-auto border-b border-[#E2ECE7] pb-px"
        >
          <button
            type="button"
            role="tab"
            aria-selected={quickTab === 'Featured'}
            onClick={() => setQuickTab('Featured')}
            className={`min-h-[40px] pb-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              quickTab === 'Featured'
                ? 'border-[#0F5132] text-[#0F5132] font-semibold'
                : 'border-transparent text-[#4B5E54] hover:text-[#1A241F]'
            }`}
          >
            Featured
          </button>
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category.name}
              type="button"
              role="tab"
              aria-selected={quickTab === category.name}
              onClick={() => setQuickTab(category.name)}
              className={`min-h-[40px] pb-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                quickTab === category.name
                  ? 'border-[#0F5132] text-[#0F5132] font-semibold'
                  : 'border-transparent text-[#4B5E54] hover:text-[#1A241F]'
              }`}
            >
              {category.shortLabel}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {showcasedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section aria-labelledby="popular-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="popular-heading" className="text-xl sm:text-2xl font-bold text-[#1A241F]">
              Popular Enquiries
            </h2>
            <p className="text-sm text-[#4B5E54] mt-0.5">
              Frequently requested everyday essentials before visiting the pharmacy.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenEnquiry}
            className="text-sm font-semibold text-[#0F5132] hover:underline whitespace-nowrap shrink-0 min-h-[40px] flex items-center"
          >
            Enquiry Form
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {popularProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* Contact & WhatsApp Shortcut Card */}
      <section className="rounded-2xl bg-white border border-[#E2ECE7] p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#1A241F]">
              Need to Confirm Availability Before Visiting?
            </h2>
            <p className="text-sm text-[#4B5E54] max-w-2xl">
              Send a pre-filled WhatsApp enquiry directly to our pharmacy staff or check our
              address, opening hours, and contact options.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-[#4B5E54]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0F5132] shrink-0" />
                <span>{config.address}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0F5132] shrink-0" />
                <span>{config.openingHours}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5132] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0B3D25] transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Start WhatsApp Enquiry</span>
            </button>
            <button
              type="button"
              onClick={onOpenContact}
              className="min-h-[44px] inline-flex items-center justify-center rounded-xl border border-[#CFE0D6] bg-white px-4 py-2.5 text-sm font-medium text-[#1A241F] hover:bg-[#F1F7F4] transition-colors whitespace-nowrap"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <HealthcareDisclaimer />
    </div>
  );
};
