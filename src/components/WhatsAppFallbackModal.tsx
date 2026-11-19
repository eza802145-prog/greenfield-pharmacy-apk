import React, {useState} from 'react';
import {Check, Copy, ExternalLink, MessageCircle, Phone, X} from 'lucide-react';
import type {PharmacyConfig} from '../types/pharmacy';
import {buildWhatsAppUrl, sanitizeWhatsAppNumber} from '../utils/whatsapp';

interface WhatsAppFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  config: PharmacyConfig;
  onSaveWhatsAppNumber: (newNumber: string) => void;
}

export const WhatsAppFallbackModal: React.FC<WhatsAppFallbackModalProps> = ({
  isOpen,
  onClose,
  message,
  config,
  onSaveWhatsAppNumber,
}) => {
  const [copied, setCopied] = useState(false);
  const [numberInput, setNumberInput] = useState(config.whatsappNumber);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const digits = sanitizeWhatsAppNumber(numberInput || config.whatsappNumber);
  const hasNumber = digits.length >= 7;
  const whatsappUrl = buildWhatsAppUrl(digits, message);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSaveNumber = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = sanitizeWhatsAppNumber(numberInput);
    onSaveWhatsAppNumber(cleaned);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl bg-white border border-[#E2ECE7] p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-[#DCE8E1] rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F7F4] text-[#0F5132]">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="whatsapp-modal-title" className="text-lg font-semibold text-[#1A241F]">
                Review &amp; Send WhatsApp Enquiry
              </h2>
              <p className="text-xs text-[#4B5E54]">
                Sending a message asks the pharmacist to confirm stock and price.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close WhatsApp options"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#4B5E54] hover:bg-[#F1F7F4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl overflow-hidden border border-[#E2ECE7]">
          <div className="bg-[#0F5132] px-4 py-2.5 flex items-center justify-between gap-2 text-white">
            <span className="text-xs font-medium">Pre-filled WhatsApp Message</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 min-h-[30px] px-2.5 py-1 rounded-lg bg-white/15 text-xs font-medium text-white hover:bg-white/25 transition-colors whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
          <div className="bg-[#EFEAE2] p-3.5 sm:p-4">
            <div className="ml-auto max-w-[94%] rounded-2xl rounded-tr-xs bg-[#DCF8C6] border border-[#C6E5AF] px-3.5 py-2.5 shadow-xs">
              <p className="text-sm text-[#1A241F] leading-relaxed whitespace-pre-wrap">
                {message}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveNumber} className="mt-4 rounded-xl border border-[#E2ECE7] p-4 bg-white space-y-2.5">
          <label htmlFor="modal-wa-number" className="block text-xs font-medium text-[#1A241F]">
            PHARMACY_WHATSAPP_NUMBER (Editable for testing or store setup)
          </label>
          <div className="flex gap-2">
            <input
              id="modal-wa-number"
              type="tel"
              inputMode="tel"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              placeholder="e.g. 2348012345678 (international digits)"
              className="flex-1 min-h-[44px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] px-3 text-sm text-[#1A241F] placeholder:text-[#4B5E54]/60 focus:border-[#0F5132] focus:bg-white focus:outline-none tabular-nums"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 rounded-xl border border-[#CFE0D6] bg-[#F1F7F4] text-sm font-medium text-[#0F5132] hover:bg-[#E2ECE7] transition-colors whitespace-nowrap shrink-0"
            >
              {savedNotice ? 'Saved' : 'Save'}
            </button>
          </div>
          {!hasNumber && (
            <p className="text-xs text-[#4B5E54]">
              No WhatsApp number is configured yet. Enter a number above to target a specific chat, or
              open WhatsApp to choose a recipient manually.
            </p>
          )}
        </form>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5132] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B3D25] transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>{hasNumber ? 'Open in WhatsApp' : 'Open WhatsApp Web'}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE0D6] bg-white px-4 py-3 text-sm font-medium text-[#1A241F] hover:bg-[#F1F7F4] transition-colors whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-[#15803D]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Message Copied' : 'Copy Message'}</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F1F7F4] flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B5E54]">
          <a
            href={`tel:${config.telephone}`}
            className="inline-flex items-center gap-1.5 hover:text-[#0F5132] font-medium"
          >
            <Phone className="w-3.5 h-3.5 shrink-0 text-[#0F5132]" />
            <span className="tabular-nums">{config.telephone}</span>
          </a>
          <a href={`mailto:${config.email}`} className="hover:text-[#0F5132] truncate">
            {config.email}
          </a>
        </div>
      </div>
    </div>
  );
};
