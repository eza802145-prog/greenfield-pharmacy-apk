import React, {useState} from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';
import type {EnquiryDraft, PharmacyConfig, PharmacyProduct} from '../types/pharmacy';
import {buildProductEnquiryMessage} from '../utils/whatsapp';
import {HealthcareDisclaimer} from './HealthcareDisclaimer';

interface EnquiryScreenProps {
  products: PharmacyProduct[];
  draft: EnquiryDraft;
  config: PharmacyConfig;
  onUpdateDraft: (next: EnquiryDraft) => void;
  onResetDraft: () => void;
  onBack: () => void;
  onLaunchWhatsApp: (message: string) => void;
}

export const EnquiryScreen: React.FC<EnquiryScreenProps> = ({
  products,
  draft,
  onUpdateDraft,
  onResetDraft,
  onBack,
  onLaunchWhatsApp,
}) => {
  const [nameError, setNameError] = useState('');
  const [productError, setProductError] = useState('');

  const selectedProduct = products.find((p) => p.id === draft.productId) ?? products[0];

  const generatedMessage = buildProductEnquiryMessage({
    customerName: draft.customerName.trim() || '[Customer Name]',
    productName: selectedProduct ? selectedProduct.name : '[Selected Product]',
    quantity: draft.quantity,
    optionalMessage: draft.optionalMessage,
    prescriptionRequired: selectedProduct?.prescriptionRequired,
  });

  const handleQuantityChange = (nextQty: number) => {
    const clamped = Math.max(1, Math.min(99, Math.floor(nextQty) || 1));
    onUpdateDraft({...draft, quantity: clamped});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!draft.customerName.trim()) {
      setNameError('Please enter your name so the pharmacy team knows who is enquiring.');
      valid = false;
    } else {
      setNameError('');
    }

    if (!selectedProduct) {
      setProductError('Please select a product from the catalogue.');
      valid = false;
    } else {
      setProductError('');
    }

    if (!valid) return;

    const finalMessage = buildProductEnquiryMessage({
      customerName: draft.customerName.trim(),
      productName: selectedProduct.name,
      quantity: draft.quantity,
      optionalMessage: draft.optionalMessage,
      prescriptionRequired: selectedProduct.prescriptionRequired,
    });

    onLaunchWhatsApp(finalMessage);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 min-h-[40px] text-sm font-medium text-[#0F5132] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A241F] mt-1">
            Customer Product Enquiry
          </h1>
          <p className="text-sm text-[#4B5E54] mt-1">
            Prepare your product enquiry and send it to Greenfield Pharmacy on WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-5 shadow-xs"
        >
          {/* Customer Name */}
          <div className="space-y-1.5">
            <label htmlFor="customer-name" className="block text-sm font-medium text-[#1A241F]">
              Customer Name <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              required
              value={draft.customerName}
              onChange={(e) => {
                onUpdateDraft({...draft, customerName: e.target.value});
                if (nameError && e.target.value.trim()) setNameError('');
              }}
              placeholder="Enter your full name"
              aria-invalid={!!nameError}
              className={`w-full min-h-[48px] rounded-xl border px-4 text-sm text-[#1A241F] placeholder:text-[#4B5E54]/60 focus:outline-none ${
                nameError
                  ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                  : 'border-[#CFE0D6] bg-[#F8FAF9] focus:border-[#0F5132] focus:bg-white'
              }`}
            />
            {nameError && (
              <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                {nameError}
              </p>
            )}
          </div>

          {/* Selected Product */}
          <div className="space-y-1.5">
            <label htmlFor="selected-product" className="block text-sm font-medium text-[#1A241F]">
              Selected Product <span className="text-[#B91C1C]">*</span>
            </label>
            <select
              id="selected-product"
              value={selectedProduct?.id ?? ''}
              onChange={(e) => {
                onUpdateDraft({...draft, productId: e.target.value});
                if (productError) setProductError('');
              }}
              className="w-full min-h-[48px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] px-4 text-sm text-[#1A241F] focus:border-[#0F5132] focus:bg-white focus:outline-none"
            >
              {Array.from(new Set(products.map((p) => p.category))).map((category) => (
                <optgroup key={category} label={category}>
                  {products
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.packSize})
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            {productError && (
              <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                {productError}
              </p>
            )}

            {selectedProduct?.prescriptionRequired && (
              <div className="mt-2 flex items-start gap-2 rounded-xl border border-[#FDBA74] bg-[#FFF7ED] p-3 text-xs text-[#7C2D12]">
                <AlertTriangle className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                <span>
                  Prescription-only item: Our pharmacist must verify a valid prescription before
                  dispensing.
                </span>
              </div>
            )}
          </div>

          {/* Quantity Requested */}
          <div className="space-y-1.5">
            <label htmlFor="enquiry-quantity" className="block text-sm font-medium text-[#1A241F]">
              Quantity Requested
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuantityChange(draft.quantity - 1)}
                aria-label="Decrease quantity"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] text-[#1A241F] hover:bg-[#F1F7F4] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                id="enquiry-quantity"
                type="number"
                min={1}
                max={99}
                value={draft.quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-24 min-h-[44px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] text-center text-sm font-semibold text-[#1A241F] tabular-nums focus:border-[#0F5132] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(draft.quantity + 1)}
                aria-label="Increase quantity"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] text-[#1A241F] hover:bg-[#F1F7F4] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional Message */}
          <div className="space-y-1.5">
            <label htmlFor="optional-message" className="block text-sm font-medium text-[#1A241F]">
              Optional Enquiry Note
            </label>
            <textarea
              id="optional-message"
              rows={3}
              value={draft.optionalMessage}
              onChange={(e) => onUpdateDraft({...draft, optionalMessage: e.target.value})}
              placeholder="e.g. Preferred pickup time or general question for the pharmacist..."
              className="w-full rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] p-3.5 text-sm text-[#1A241F] placeholder:text-[#4B5E54]/60 focus:border-[#0F5132] focus:bg-white focus:outline-none resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 min-h-[50px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5132] px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-[#0B3D25] active:scale-[0.99] transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-2"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>Send Enquiry via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onResetDraft}
              className="min-h-[50px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE0D6] bg-white px-4 py-3 text-sm font-medium text-[#4B5E54] hover:text-[#1A241F] hover:bg-[#F1F7F4] transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Reset</span>
            </button>
          </div>
        </form>

        {/* Live Pre-filled WhatsApp Preview */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-white border border-[#E2ECE7] overflow-hidden shadow-xs">
            <div className="bg-[#0F5132] px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 shrink-0 text-[#86EFAC]" />
                <div>
                  <h2 className="text-sm font-semibold leading-tight">Greenfield Pharmacy</h2>
                  <p className="text-[11px] text-white/80">WhatsApp Enquiry Preview</p>
                </div>
              </div>
              <span className="text-[11px] text-white/80">Draft</span>
            </div>

            <div className="bg-[#EFEAE2] p-4 sm:p-5">
              <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-xs bg-[#DCF8C6] border border-[#C6E5AF] px-4 py-3 shadow-xs">
                <p className="text-sm text-[#1A241F] leading-relaxed whitespace-pre-wrap">
                  {generatedMessage}
                </p>
                <p className="mt-1.5 text-right text-[11px] text-[#4B5E54]">
                  Ready to review &amp; send
                </p>
              </div>
            </div>

            <div className="p-4 sm:px-5 sm:py-4 bg-white">
              <p className="text-xs text-[#4B5E54] leading-relaxed">
                You will review and send this message yourself in WhatsApp. Submitting an enquiry
                requests staff confirmation and does not place or confirm an order.
              </p>
            </div>
          </div>

          <HealthcareDisclaimer compact />
        </div>
      </div>
    </div>
  );
};
