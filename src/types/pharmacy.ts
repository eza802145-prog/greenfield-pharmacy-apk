export type ProductCategory =
  | 'Personal Care Products'
  | 'Baby Care Products'
  | 'Health Equipment Products'
  | 'OTC Products';

export type AvailabilityStatus =
  | 'Demo: Sample Stock (Unverified)'
  | 'Demo: Confirm with Pharmacist';

export interface PharmacyProduct {
  id: string;
  catalogNumber: number;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  packSize: string;
  activeInfo: string;
  keywords: string[];
  demoPriceNgn: number | null;
  isVerifiedPrice: boolean;
  availability: AvailabilityStatus;
  prescriptionRequired: boolean;
  storageInfo: string;
  generalGuidance: string;
  imagePath: string;
  featured: boolean;
  popular: boolean;
}

export interface PharmacyConfig {
  staffNames: string;
  whatsappNumber: string;
  telephone: string;
  email: string;
  address: string;
  openingHours: string;
  isCustomConfigured: boolean;
}

export interface EnquiryDraft {
  customerName: string;
  productId: string;
  quantity: number;
  optionalMessage: string;
}

export type ScreenRoute = 'home' | 'catalogue' | 'details' | 'enquiry' | 'roadmap' | 'contact';
