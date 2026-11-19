import React from 'react';
import {ShieldAlert} from 'lucide-react';
import {HEALTHCARE_DISCLAIMER} from '../data/pharmacyData';

interface HealthcareDisclaimerProps {
  compact?: boolean;
}

export const HealthcareDisclaimer: React.FC<HealthcareDisclaimerProps> = ({compact = false}) => (
  <aside
    aria-label="Healthcare safety notice"
    className={`rounded-2xl border border-[#DCE8E1] bg-[#F1F7F4] ${
      compact ? 'p-4' : 'p-5 sm:p-6'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-[#DCE8E1] text-[#0F5132]">
        <ShieldAlert className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[#1A241F]">
          Important Healthcare Safety Notice
        </h3>
        <p className="text-xs sm:text-sm text-[#4B5E54] leading-relaxed">
          {HEALTHCARE_DISCLAIMER}
        </p>
      </div>
    </div>
  </aside>
);
