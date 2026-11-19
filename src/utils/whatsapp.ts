export function sanitizeWhatsAppNumber(raw: string): string {
  return raw.replace(/[^\d]/g, '');
}

export function formatNairaDemo(amount: number | null): string {
  if (amount === null) {
    return 'Price unverified — ask pharmacist';
  }
  return `Demo est. ₦${amount.toLocaleString('en-NG')}`;
}

export interface ProductEnquiryMessageParams {
  customerName?: string;
  productName: string;
  quantity?: number;
  optionalMessage?: string;
  prescriptionRequired?: boolean;
}

export function buildProductEnquiryMessage({
  customerName,
  productName,
  quantity,
  optionalMessage,
  prescriptionRequired,
}: ProductEnquiryMessageParams): string {
  const trimmedName = customerName?.trim();
  const safeQty = quantity && quantity > 0 ? quantity : 1;
  const trimmedNote = optionalMessage?.trim();

  if (trimmedName) {
    const lines = [
      'Hello Greenfield Pharmacy,',
      '',
      `My name is ${trimmedName}. I would like to enquire about ${productName}.`,
      `Quantity requested: ${safeQty}.`,
      'Please confirm its current availability and price.',
    ];
    if (prescriptionRequired) {
      lines.push('I understand pharmacist prescription verification is required.');
    }
    if (trimmedNote) {
      lines.push(`Note: ${trimmedNote}`);
    }
    lines.push('', 'Thank you.');
    return lines.join('\n');
  }

  const quickLines = [
    'Hello Greenfield Pharmacy,',
    '',
    `I would like to enquire about ${productName}${safeQty > 1 ? ` (Quantity: ${safeQty})` : ''}.`,
    '',
    'Please confirm its current availability and price.',
    '',
    'Thank you.',
  ];
  return quickLines.join('\n');
}

export function buildGeneralContactMessage(): string {
  return 'Hello Greenfield Pharmacy,\n\nI would like to speak with the pharmacy team regarding product availability and pricing.\n\nThank you.';
}

export function buildWhatsAppUrl(phoneDigits: string, message: string): string {
  const encoded = encodeURIComponent(message);
  if (!phoneDigits) {
    return `https://wa.me/?text=${encoded}`;
  }
  return `https://wa.me/${phoneDigits}?text=${encoded}`;
}
