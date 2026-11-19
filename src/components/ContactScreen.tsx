import React, {useState} from 'react';
import {
  Check,
  Clock,
  Edit3,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  UserCheck,
  Users,
} from 'lucide-react';
import {DEVELOPER_INFO, OPENING_HOURS_SCHEDULE} from '../data/pharmacyData';
import type {PharmacyConfig} from '../types/pharmacy';
import {buildGeneralContactMessage, buildWhatsAppUrl, sanitizeWhatsAppNumber} from '../utils/whatsapp';
import {BrandMark} from './BrandLogo';
import {HealthcareDisclaimer} from './HealthcareDisclaimer';
import {ResilientImage} from './ResilientImage';

interface ContactScreenProps {
  config: PharmacyConfig;
  onUpdateConfig: (next: PharmacyConfig) => void;
  onResetConfig: () => void;
  onTriggerWhatsApp: (message: string) => void;
}

function toDialHref(rawPhone: string): string {
  const digits = sanitizeWhatsAppNumber(rawPhone);
  if (digits.startsWith('0') && digits.length === 11) {
    return `tel:+234${digits.slice(1)}`;
  }
  if (digits.startsWith('234')) {
    return `tel:+${digits}`;
  }
  return `tel:${digits || rawPhone}`;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({
  config,
  onUpdateConfig,
  onResetConfig,
  onTriggerWhatsApp,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<PharmacyConfig>(config);
  const [savedToast, setSavedToast] = useState(false);

  const whatsappDigits = sanitizeWhatsAppNumber(config.whatsappNumber);
  const whatsappDisplay =
    whatsappDigits.startsWith('234') && whatsappDigits.length === 13
      ? `0${whatsappDigits.slice(3)}`
      : config.whatsappNumber;
  const whatsappChatUrl = buildWhatsAppUrl(whatsappDigits, buildGeneralContactMessage());
  const dialHref = toDialHref(config.telephone);
  const mailHref = `mailto:${config.email}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    config.address,
  )}`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedWa = sanitizeWhatsAppNumber(formState.whatsappNumber);
    const normalizedWa =
      cleanedWa.startsWith('0') && cleanedWa.length === 11
        ? `234${cleanedWa.slice(1)}`
        : cleanedWa;

    onUpdateConfig({
      ...formState,
      whatsappNumber: normalizedWa,
      isCustomConfigured: true,
    });
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleReset = () => {
    onResetConfig();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <BrandMark size={48} className="shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A241F]">Contact Us</h1>
            <p className="text-sm text-[#4B5E54]">
              Greenfield Pharmacy · Your Health. Our Priority.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormState(config);
            setIsEditing((prev) => !prev);
          }}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE0D6] bg-white px-4 py-2 text-sm font-medium text-[#0F5132] hover:bg-[#F1F7F4] transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 shrink-0" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Pharmacy Details'}</span>
        </button>
      </div>

      {savedToast && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#166534]"
        >
          <Check className="w-4 h-4 shrink-0" />
          <span>Greenfield Pharmacy contact details updated on this device.</span>
        </div>
      )}

      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-4 shadow-xs"
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#1A241F]">
              Update Greenfield Pharmacy Details
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5E54]">
              Changes saved here update the contact links across the app on this device.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="cfg-staff" className="block text-sm font-medium text-[#1A241F]">
                Pharmacy Staff / Contacts
              </label>
              <input
                id="cfg-staff"
                type="text"
                value={formState.staffNames}
                onChange={(e) => setFormState({...formState, staffNames: e.target.value})}
                className="w-full min-h-[46px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] px-3.5 text-sm text-[#1A241F] focus:border-[#0F5132] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cfg-tel" className="block text-sm font-medium text-[#1A241F]">
                Telephone Number
              </label>
              <input
                id="cfg-tel"
                type="tel"
                value={formState.telephone}
                onChange={(e) => setFormState({...formState, telephone: e.target.value})}
                className="w-full min-h-[46px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] px-3.5 text-sm text-[#1A241F] tabular-nums focus:border-[#0F5132] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cfg-wa" className="block text-sm font-medium text-[#1A241F]">
                WhatsApp Number
              </label>
              <input
                id="cfg-wa"
                type="tel"
                value={formState.whatsappNumber}
                onChange={(e) => setFormState({...formState, whatsappNumber: e.target.value})}
                className="w-full min-h-[46px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] px-3.5 text-sm text-[#1A241F] tabular-nums focus:border-[#0F5132] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cfg-email" className="block text-sm font-medium text-[#1A241F]">
                Email Address
              </label>
              <input
                id="cfg-email"
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({...formState, email: e.target.value})}
                className="w-full min-h-[46px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] px-3.5 text-sm text-[#1A241F] focus:border-[#0F5132] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cfg-hours" className="block text-sm font-medium text-[#1A241F]">
                Opening Hours Summary
              </label>
              <input
                id="cfg-hours"
                type="text"
                value={formState.openingHours}
                onChange={(e) => setFormState({...formState, openingHours: e.target.value})}
                className="w-full min-h-[46px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] px-3.5 text-sm text-[#1A241F] focus:border-[#0F5132] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="cfg-addr" className="block text-sm font-medium text-[#1A241F]">
                Business Address
              </label>
              <input
                id="cfg-addr"
                type="text"
                value={formState.address}
                onChange={(e) => setFormState({...formState, address: e.target.value})}
                className="w-full min-h-[46px] rounded-xl border border-[#CFE0D6] bg-[#F8FAF9] px-3.5 text-sm text-[#1A241F] focus:border-[#0F5132] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0F5132] text-white text-sm font-semibold hover:bg-[#0B3D25] transition-colors whitespace-nowrap"
            >
              Save Contact Details
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[46px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#CFE0D6] bg-white text-sm font-medium text-[#4B5E54] hover:text-[#1A241F] hover:bg-[#F1F7F4] transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Restore Defaults</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pharmacy Business Information */}
          <div className="lg:col-span-7 space-y-6">
            <section
              aria-labelledby="pharmacy-contact-heading"
              className="rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-5 shadow-xs"
            >
              <div>
                <h2 id="pharmacy-contact-heading" className="text-lg sm:text-xl font-bold text-[#1A241F]">
                  Greenfield Pharmacy
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5E54] mt-0.5">
                  Tap any contact item or action button below to call, message on WhatsApp, email,
                  or open directions.
                </p>
              </div>

              <div className="divide-y divide-[#F1F7F4]">
                {/* Pharmacy Staff */}
                <div className="py-3.5 flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F7F4] text-[#0F5132]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-medium text-[#4B5E54]">
                      Pharmacy Team
                    </span>
                    <span className="block text-sm sm:text-base font-semibold text-[#1A241F]">
                      {config.staffNames}
                    </span>
                  </div>
                </div>

                {/* Clickable Telephone */}
                <a
                  href={dialHref}
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-[#F8FAF9] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F7F4] text-[#0F5132] group-hover:bg-[#0F5132] group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-medium text-[#4B5E54]">
                        Telephone Number
                      </span>
                      <span className="block text-sm sm:text-base font-semibold text-[#1A241F] tabular-nums group-hover:text-[#0F5132]">
                        {config.telephone}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#0F5132] whitespace-nowrap shrink-0">
                    Call →
                  </span>
                </a>

                {/* Clickable WhatsApp */}
                <a
                  href={whatsappChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-[#F8FAF9] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-medium text-[#4B5E54]">
                        WhatsApp Number
                      </span>
                      <span className="block text-sm sm:text-base font-semibold text-[#1A241F] tabular-nums group-hover:text-[#15803D]">
                        {whatsappDisplay}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#15803D] whitespace-nowrap shrink-0">
                    Chat →
                  </span>
                </a>

                {/* Clickable Email */}
                <a
                  href={mailHref}
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-[#F8FAF9] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F7F4] text-[#0F5132] group-hover:bg-[#0F5132] group-hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-medium text-[#4B5E54]">
                        Email Address
                      </span>
                      <span className="block text-sm sm:text-base font-semibold text-[#1A241F] break-all group-hover:text-[#0F5132]">
                        {config.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#0F5132] whitespace-nowrap shrink-0">
                    Email →
                  </span>
                </a>

                {/* Clickable Business Address */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-[#F8FAF9] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F7F4] text-[#0F5132] group-hover:bg-[#0F5132] group-hover:text-white transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-medium text-[#4B5E54]">
                        Business Address
                      </span>
                      <span className="block text-sm sm:text-base font-semibold text-[#1A241F] group-hover:text-[#0F5132]">
                        {config.address}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#0F5132] whitespace-nowrap shrink-0">
                    Maps →
                  </span>
                </a>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onTriggerWhatsApp(buildGeneralContactMessage())}
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-3 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#15803D] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={dialHref}
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5132] px-3 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#0B3D25] transition-colors whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Call</span>
                </a>

                <a
                  href={mailHref}
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE0D6] bg-[#F1F7F4] px-3 py-2.5 text-xs sm:text-sm font-medium text-[#0F5132] hover:bg-[#E2ECE7] transition-colors whitespace-nowrap"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Email</span>
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE0D6] bg-white px-3 py-2.5 text-xs sm:text-sm font-medium text-[#1A241F] hover:bg-[#F8FAF9] transition-colors whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 text-[#0F5132] shrink-0" />
                  <span>Directions</span>
                </a>
              </div>
            </section>

            {/* Opening Hours Card */}
            <section
              aria-labelledby="opening-hours-heading"
              className="rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F7F4] text-[#0F5132]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="opening-hours-heading" className="text-lg font-bold text-[#1A241F]">
                    Opening Hours
                  </h2>
                  <p className="text-xs text-[#4B5E54]">Greenfield Pharmacy weekly schedule</p>
                </div>
              </div>

              <dl className="divide-y divide-[#F1F7F4]">
                {OPENING_HOURS_SCHEDULE.map((row) => (
                  <div
                    key={row.day}
                    className="py-2.5 flex items-center justify-between gap-4 text-sm"
                  >
                    <dt className="font-medium text-[#1A241F]">{row.day}</dt>
                    <dd className="text-[#4B5E54] tabular-nums font-medium">{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* Right Column: Separate Developer Profile & Healthcare Disclaimer */}
          <div className="lg:col-span-5 space-y-5">
            <section
              aria-labelledby="developer-section-heading"
              className="rounded-3xl bg-white border border-[#E2ECE7] p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F7F4] text-[#0F5132]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-[#0F5132]">
                    {DEVELOPER_INFO.sectionTitle}
                  </p>
                  <h2 id="developer-section-heading" className="text-lg font-bold text-[#1A241F]">
                    {DEVELOPER_INFO.name}
                  </h2>
                  <p className="text-xs text-[#4B5E54] mt-0.5">
                    App developer profile (separate from Greenfield Pharmacy store operations)
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm border-t border-[#F1F7F4] pt-3">
                <a
                  href={`mailto:${DEVELOPER_INFO.email}`}
                  className="flex items-center gap-2 text-[#4B5E54] hover:text-[#0F5132]"
                >
                  <Mail className="w-4 h-4 text-[#0F5132] shrink-0" />
                  <span className="break-all">{DEVELOPER_INFO.email}</span>
                </a>
                <a
                  href={`tel:${DEVELOPER_INFO.phoneDial}`}
                  className="flex items-center gap-2 text-[#4B5E54] hover:text-[#0F5132] tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#0F5132] shrink-0" />
                  <span>{DEVELOPER_INFO.phoneDisplay}</span>
                </a>
              </div>

              <a
                href={DEVELOPER_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE0D6] bg-[#F1F7F4] px-4 py-2.5 text-sm font-semibold text-[#0F5132] hover:bg-[#0F5132] hover:text-white transition-colors whitespace-nowrap"
              >
                <span>View LinkedIn Profile</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            </section>

            <HealthcareDisclaimer compact />
          </div>
        </div>
      )}

      {/* Pharmacy Gallery */}
      <section aria-labelledby="pharmacy-gallery-heading" className="space-y-3">
        <div>
          <h2 id="pharmacy-gallery-heading" className="text-lg font-semibold text-[#1A241F]">
            Inside a Neighbourhood Community Pharmacy
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5E54]">
            Reference scenes illustrating pharmacist consultation, organized shelves, and customer
            care.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              src: '/assets/aistudio/image_fa50f416.png',
              caption: 'Pharmacist Consultation Counter',
            },
            {
              src: '/assets/aistudio/image_33e7bdd6.png',
              caption: 'Multivitamins, Cough & Cold Shelves',
            },
            {
              src: '/assets/aistudio/image_834bdcb9.png',
              caption: 'Customer Waiting & Service Area',
            },
            {
              src: '/assets/aistudio/image_abd33239.png',
              caption: 'Green-Trimmed Pharmacy Aisles',
            },
          ].map((photo) => (
            <figure
              key={photo.src}
              className="rounded-2xl bg-white border border-[#E2ECE7] overflow-hidden shadow-xs"
            >
              <div className="aspect-[4/3] bg-[#F1F7F4]">
                <ResilientImage
                  src={photo.src}
                  alt={photo.caption}
                  fallbackLabel={photo.caption}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-3 py-2 text-xs font-medium text-[#4B5E54]">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
};
