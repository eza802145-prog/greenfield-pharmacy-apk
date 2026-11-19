import React from 'react';
import {AlertCircle, ArrowRight, CheckCircle2, FileCheck2} from 'lucide-react';
import type {PharmacyProduct} from '../types/pharmacy';
import {formatNairaDemo} from '../utils/whatsapp';
import {ResilientImage} from './ResilientImage';

interface ProductCardProps {
  product: PharmacyProduct;
  onSelect: (product: PharmacyProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({product, onSelect}) => {
  const isTypicallyCarried = product.availability === 'Demo: Sample Stock (Unverified)';

  const statusIcon = product.prescriptionRequired ? (
    <FileCheck2 className="w-3.5 h-3.5 text-[#9A3412] shrink-0" />
  ) : isTypicallyCarried ? (
    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
  ) : (
    <AlertCircle className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
  );

  const statusColor = product.prescriptionRequired
    ? 'text-[#9A3412]'
    : isTypicallyCarried
      ? 'text-[#15803D]'
      : 'text-[#B45309]';

  return (
    <article className="group flex flex-col rounded-2xl bg-white border border-[#E2ECE7] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <button
        type="button"
        onClick={() => onSelect(product)}
        aria-label={`View picture and details for ${product.name}`}
        className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0F5132]"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-[#F1F7F4]">
          <ResilientImage
            src={product.imagePath}
            alt={product.name}
            fallbackLabel={product.name}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      </button>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#4B5E54]">
          <span className="truncate">{product.category}</span>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span className="hidden sm:inline shrink-0">{product.packSize}</span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(product)}
          className="mt-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] rounded-md"
        >
          <h3 className="text-sm sm:text-base font-semibold text-[#1A241F] group-hover:text-[#0F5132] transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </button>

        <p className="mt-1 hidden sm:line-clamp-2 text-sm text-[#4B5E54] leading-relaxed">
          {product.shortDescription}
        </p>

        <div className="mt-auto pt-3 space-y-2.5 border-t border-[#F1F7F4]">
          <div className="pt-1.5">
            <span className="block text-[10px] sm:text-[11px] text-[#4B5E54]">
              {product.isVerifiedPrice ? 'Verified price' : 'Sample price (unverified)'}
            </span>
            <span className="text-xs sm:text-base font-semibold text-[#1A241F] tabular-nums">
              {formatNairaDemo(product.demoPriceNgn)}
            </span>
          </div>

          <div className={`flex items-center gap-1 text-[11px] sm:text-xs font-medium ${statusColor}`}>
            {statusIcon}
            <span className="truncate">{product.availability}</span>
          </div>

          <button
            type="button"
            onClick={() => onSelect(product)}
            className="w-full min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F1F7F4] px-3 py-2 text-xs sm:text-sm font-medium text-[#0F5132] hover:bg-[#0F5132] hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132]"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </button>
        </div>
      </div>
    </article>
  );
};
