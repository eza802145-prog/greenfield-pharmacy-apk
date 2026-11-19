import React from 'react';
import {ArrowLeft, Info, Search, SearchX, X} from 'lucide-react';
import {DEMO_DATA_NOTICE, PRODUCT_CATEGORIES, QUICK_SEARCH_TERMS} from '../data/pharmacyData';
import type {PharmacyProduct, ProductCategory} from '../types/pharmacy';
import {HealthcareDisclaimer} from './HealthcareDisclaimer';
import {ProductCard} from './ProductCard';

interface CatalogueScreenProps {
  products: PharmacyProduct[];
  searchQuery: string;
  selectedCategory: ProductCategory | 'All';
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: ProductCategory | 'All') => void;
  onSelectProduct: (product: PharmacyProduct) => void;
  onReturnHome: () => void;
  onOpenEnquiry: () => void;
}

export const CatalogueScreen: React.FC<CatalogueScreenProps> = ({
  products,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onSelectProduct,
  onReturnHome,
  onOpenEnquiry,
}) => {
  const normalizedTerms = searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    if (!matchesCategory) return false;
    if (normalizedTerms.length === 0) return true;

    const searchableText = [
      product.name,
      product.category,
      product.shortDescription,
      product.description,
      product.activeInfo,
      product.packSize,
      ...product.keywords,
    ]
      .join(' ')
      .toLowerCase();

    return normalizedTerms.every((term) => searchableText.includes(term));
  });

  const handleResetFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
  };

  const handleCategoryTabClick = (category: ProductCategory | 'All') => {
    onCategoryChange(category);
    if (searchQuery) {
      onSearchChange('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onReturnHome}
            className="inline-flex items-center gap-1.5 min-h-[40px] text-sm font-medium text-[#0F5132] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A241F] mt-1">
            Product Catalogue
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-[#4B5E54] tabular-nums">
          Showing {filteredProducts.length} of {products.length} demonstration products
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="rounded-2xl bg-white border border-[#E2ECE7] p-4 sm:p-5 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#4B5E54] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search e.g. Panadol, Vitamin, Baby, First Aid, Dettol..."
              aria-label="Search product catalogue"
              className="w-full min-h-[46px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] pl-10 pr-10 text-sm text-[#1A241F] placeholder:text-[#4B5E54]/70 focus:border-[#0F5132] focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-[#4B5E54] hover:bg-[#E2ECE7]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="min-h-[46px] px-4 rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] text-xs sm:text-sm font-medium text-[#1A241F] hover:bg-[#F1F7F4] transition-colors whitespace-nowrap shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-[#4B5E54] mr-1">Quick search:</span>
          {QUICK_SEARCH_TERMS.map((term) => {
            const isSelected = searchQuery.trim().toLowerCase() === term.toLowerCase();
            return (
              <button
                key={term}
                type="button"
                onClick={() => {
                  onCategoryChange('All');
                  onSearchChange(isSelected ? '' : term);
                }}
                className={`min-h-[34px] px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'border-[#0F5132] bg-[#0F5132] text-white'
                    : 'border-[#DCE8E1] bg-[#F8FAF9] text-[#0F5132] hover:bg-[#F1F7F4]'
                }`}
              >
                {term}
              </button>
            );
          })}
        </div>

        <div
          role="tablist"
          aria-label="Filter products by category"
          className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F1F7F4]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'All'}
            onClick={() => handleCategoryTabClick('All')}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'bg-[#F1F7F4] text-[#4B5E54] hover:text-[#1A241F] hover:bg-[#E2ECE7]'
            }`}
          >
            All Products ({products.length})
          </button>
          {PRODUCT_CATEGORIES.map((category) => {
            const active = selectedCategory === category.name;
            const count = products.filter((p) => p.category === category.name).length;
            return (
              <button
                key={category.name}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleCategoryTabClick(category.name)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'bg-[#F1F7F4] text-[#4B5E54] hover:text-[#1A241F] hover:bg-[#E2ECE7]'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Demonstration Inventory Notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[#DCE8E1] bg-white px-4 py-3 text-xs text-[#4B5E54]">
        <Info className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
        <p className="leading-relaxed">{DEMO_DATA_NOTICE}</p>
      </div>

      {/* 2-Column Mobile / 3-Column Desktop Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-[#E2ECE7] p-8 sm:p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F7F4] text-[#0F5132]">
            <SearchX className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-[#1A241F]">No matching products found</h2>
            <p className="text-sm text-[#4B5E54]">
              We couldn&apos;t find any products matching &ldquo;{searchQuery || selectedCategory}
              &rdquo;. Clear filters to restore all {products.length} products or ask our pharmacy
              team on WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0F5132] text-white text-sm font-semibold hover:bg-[#0B3D25] transition-colors whitespace-nowrap"
            >
              Show All Products
            </button>
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#CFE0D6] bg-[#F1F7F4] text-sm font-medium text-[#0F5132] hover:bg-[#E2ECE7] transition-colors whitespace-nowrap"
            >
              Enquire on WhatsApp
            </button>
            <button
              type="button"
              onClick={onReturnHome}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#CFE0D6] bg-white text-sm font-medium text-[#1A241F] hover:bg-[#F8FAF9] transition-colors whitespace-nowrap"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}

      <HealthcareDisclaimer compact />
    </div>
  );
};
