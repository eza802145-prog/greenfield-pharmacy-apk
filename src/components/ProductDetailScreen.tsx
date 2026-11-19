import React, {useState} from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ThermometerSnowflake,
} from 'lucide-react';
import type {PharmacyConfig, PharmacyProduct} from '../types/pharmacy';
import {
  buildProductEnquiryMessage,
  buildWhatsAppUrl,
  formatNairaDemo,
  sanitizeWhatsAppNumber,
} from '../utils/whatsapp';
import {HealthcareDisclaimer} from './HealthcareDisclaimer';
import {ResilientImage} from './ResilientImage';

interface ProductDetailScreenProps {
  product: PharmacyProduct;
  config: PharmacyConfig;
  onBack: () => void;
  onOpenEnquiryForm: (product: PharmacyProduct, quantity: number) => void;
  onTriggerWhatsAppFallback: (message: string) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  config,
  onBack,
  onOpenEnquiryForm,
  onTriggerWhatsAppFallback,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const galleryImages = [
    {
      src: product.imagePath,
      label: product.name,
    },
    {
      src: '/assets/aistudio/image_fa50f416.png',
      label: 'Ask our pharmacist at the Greenfield counter',
    },
    {
      src: '/assets/aistudio/image_5e8bcf53.png',
      label: 'Greenfield Pharmacy prescription & OTC section',
    },
  ];

  const digits = sanitizeWhatsAppNumber(config.whatsappNumber);
  const hasConfiguredNumber = digits.length >= 7;
  const enquiryMessage = buildProductEnquiryMessage({
    productName: product.name,
    quantity,
    prescriptionRequired: product.prescriptionRequired,
  });
  const whatsappUrl = buildWhatsAppUrl(digits, enquiryMessage);

  const statusIcon = product.prescriptionRequired ? (
    <FileCheck2 className="w-4 h-4 text-[#9A3412] shrink-0" />
  ) : product.availability === 'Demo: Sample Stock (Unverified)' ? (
    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
  ) : (
    <AlertCircle className="w-4 h-4 text-[#B45309] shrink-0" />
  );

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 min-h-[44px] px-1 text-sm font-medium text-[#0F5132] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Product Image & Store Context Thumbnails */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-3xl bg-white border border-[#E2ECE7] overflow-hidden shadow-xs">
            <div className="aspect-[4/3] w-full bg-[#F1F7F4]">
              <ResilientImage
                src={galleryImages[activeImageIndex].src}
                alt={galleryImages[activeImageIndex].label}
                fallbackLabel={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {galleryImages.map((img, idx) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View ${img.label}`}
                className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all bg-[#F1F7F4] ${
                  activeImageIndex === idx
                    ? 'border-[#0F5132] ring-2 ring-[#0F5132]/20'
                    : 'border-[#E2ECE7] opacity-80 hover:opacity-100'
                }`}
              >
                <ResilientImage
                  src={img.src}
                  alt={img.label}
                  fallbackLabel={product.name}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info & Enquiry Module */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#4B5E54]">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.packSize}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A241F] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Availability (Demonstration Data) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-[#F8FAF9] border border-[#E2ECE7] p-4">
              <div>
                <span className="block text-xs text-[#4B5E54]">
                  {product.isVerifiedPrice ? 'Verified Price' : 'Demonstration Price Estimate'}
                </span>
                <span className="mt-0.5 block text-xl font-bold text-[#1A241F] tabular-nums">
                  {formatNairaDemo(product.demoPriceNgn)}
                </span>
              </div>

              <div>
                <span className="block text-xs text-[#4B5E54]">Availability Indicator</span>
                <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#1A241F]">
                  {statusIcon}
                  <span>{product.availability}</span>
                </span>
              </div>
            </div>

            {/* Prescription-Only Safeguard */}
            {product.prescriptionRequired && (
              <div
                role="note"
                className="rounded-2xl border border-[#FDBA74] bg-[#FFF7ED] p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-[#9A3412]">
                  <FileCheck2 className="w-4 h-4 shrink-0" />
                  <span>Pharmacist &amp; Prescription Verification Required</span>
                </div>
                <p className="text-xs sm:text-sm text-[#7C2D12] leading-relaxed">
                  This is a prescription-only medicine. The application does not recommend,
                  approve, or reserve prescription medicines. Please consult our qualified
                  pharmacist and present a valid prescription for verification before dispensing.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-[#1A241F]">Product Overview</h2>
              <p className="text-sm sm:text-base text-[#4B5E54] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Important Product Information */}
            <div className="space-y-3 pt-2 border-t border-[#F1F7F4]">
              <h2 className="text-sm font-semibold text-[#1A241F]">
                Important Product Information
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                  <div>
                    <dt className="font-medium text-[#1A241F]">Active Ingredient / Type</dt>
                    <dd className="text-[#4B5E54]">{product.activeInfo}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ThermometerSnowflake className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                  <div>
                    <dt className="font-medium text-[#1A241F]">Storage Guidance</dt>
                    <dd className="text-[#4B5E54]">{product.storageInfo}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                  <div>
                    <dt className="font-medium text-[#1A241F]">General Pharmacy Notice</dt>
                    <dd className="text-[#4B5E54]">{product.generalGuidance}</dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Quantity Stepper + Primary WhatsApp CTA */}
            <div className="pt-4 border-t border-[#F1F7F4] space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center justify-between sm:justify-start gap-2 rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease enquiry quantity"
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#1A241F] hover:bg-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[3ch] text-center text-sm font-semibold text-[#1A241F] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Increase enquiry quantity"
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#1A241F] hover:bg-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {hasConfiguredNumber ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[50px] inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#16A34A] px-6 py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-[#15803D] active:scale-[0.99] transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-2"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>ENQUIRE ON WHATSAPP</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onTriggerWhatsAppFallback(enquiryMessage)}
                    className="flex-1 min-h-[50px] inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#16A34A] px-6 py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-[#15803D] active:scale-[0.99] transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-2"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>ENQUIRE ON WHATSAPP</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenEnquiryForm(product, quantity)}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE0D6] bg-[#F1F7F4] px-4 py-2.5 text-sm font-medium text-[#0F5132] hover:bg-[#E2ECE7] transition-colors whitespace-nowrap"
                >
                  <ClipboardList className="w-4 h-4 shrink-0" />
                  <span>Add Name &amp; Note in Enquiry Form</span>
                </button>

                <button
                  type="button"
                  onClick={() => onTriggerWhatsAppFallback(enquiryMessage)}
                  className="min-h-[44px] inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-medium text-[#4B5E54] hover:text-[#1A241F] hover:bg-[#F1F7F4] transition-colors whitespace-nowrap"
                >
                  Preview / Copy WhatsApp Message
                </button>
              </div>

              <p className="text-xs text-[#4B5E54] leading-relaxed">
                Sending a WhatsApp enquiry opens your messaging app with a draft for review. It
                does not reserve inventory or confirm an order until staff reply.
              </p>
            </div>
          </div>

          <HealthcareDisclaimer compact />
        </div>
      </div>
    </div>
  );
};
