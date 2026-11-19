import React, {useState} from 'react';
import {Package, RotateCw} from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F1F7F4] to-[#E2ECE7] text-[#0F5132] p-3 text-center ${className}`}
      >
        <Package className="w-7 h-7 mb-1.5 opacity-75" strokeWidth={1.75} />
        {fallbackLabel && (
          <span className="text-xs font-medium text-[#1A241F]/80 line-clamp-2 max-w-[18ch]">
            {fallbackLabel}
          </span>
        )}
        {src && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHasError(false);
              setRetryCount((c) => c + 1);
            }}
            className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#CFE0D6] bg-white px-2.5 py-1 text-[11px] font-medium text-[#0F5132] hover:bg-[#F8FAF9] transition-colors"
          >
            <RotateCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <img
      key={`${src}-${retryCount}`}
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
