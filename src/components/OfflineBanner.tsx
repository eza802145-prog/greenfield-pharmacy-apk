import React from 'react';
import {WifiOff} from 'lucide-react';
import {useOnlineStatus} from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-[#FEF3C7] border-b border-[#F59E0B]/30 px-4 py-2 text-xs font-medium text-[#92400E]"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
        <WifiOff className="w-3.5 h-3.5 shrink-0" />
        <span>Offline Mode — Browsing cached pharmacy catalogue. WhatsApp requires connectivity.</span>
      </div>
    </div>
  );
};
