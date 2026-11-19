import React, {useState} from 'react';
import {Download, X} from 'lucide-react';
import {usePWAInstall} from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-[#0F5132] text-white text-xs sm:text-sm font-medium hover:bg-[#0B3D25] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-2"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center justify-center gap-2 min-h-[40px] px-3.5 py-2 rounded-xl border border-[#CFE0D6] bg-white text-[#0F5132] text-xs font-medium hover:bg-[#F1F7F4] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132]"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Install</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-xs p-4"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E2ECE7] p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <h3 id="ios-install-title" className="text-lg font-semibold text-[#1A241F]">
                  Install Greenfield Pharmacy
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close install instructions"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#4B5E54] hover:bg-[#F1F7F4]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="mt-3 space-y-2 text-sm text-[#4B5E54] list-decimal list-inside leading-relaxed">
                <li>
                  Tap the <strong className="text-[#1A241F]">Share</strong> icon in your Safari
                  toolbar.
                </li>
                <li>
                  Scroll down and tap <strong className="text-[#1A241F]">Add to Home Screen</strong>.
                </li>
                <li>
                  Tap <strong className="text-[#1A241F]">Add</strong> to launch it like a mobile app.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-[#0F5132] text-white text-sm font-medium hover:bg-[#0B3D25] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
