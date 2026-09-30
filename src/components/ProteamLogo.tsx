import React from 'react';

interface ProteamLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const ProteamLogo: React.FC<ProteamLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  // Height configurations
  const heightMap = {
    sm: 'h-6',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-14 sm:h-16',
  };

  const textMap = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const tmMap = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Precision Vector Emblem matching the user's Proteam logo */}
      <svg
        viewBox="0 0 100 80"
        className={`${heightMap[size]} w-auto aspect-[1.25/1] shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red Athletic Dynamic Slanted Bars */}
        <g transform="skewX(-16)">
          {/* Left slanted red bar */}
          <rect
            x="28"
            y="10"
            width="10"
            height="60"
            rx="3"
            fill="#E52521"
          />

          {/* Center 3 athletic dashes */}
          <rect
            x="44"
            y="14"
            width="10"
            height="12"
            rx="2.5"
            fill="#E52521"
          />
          <rect
            x="44"
            y="34"
            width="10"
            height="12"
            rx="2.5"
            fill="#E52521"
          />
          <rect
            x="44"
            y="54"
            width="10"
            height="12"
            rx="2.5"
            fill="#E52521"
          />

          {/* Right slanted red bar */}
          <rect
            x="60"
            y="10"
            width="10"
            height="60"
            rx="3"
            fill="#E52521"
          />
        </g>
      </svg>

      {/* Wordmark: Proteam™ in athletic bold italic matching the logo typography */}
      {showText && (
        <div className="flex items-baseline tracking-tight">
          <span
            className={`font-black italic text-white uppercase tracking-wider font-sans ${textMap[size]}`}
            style={{
              fontStyle: 'italic',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            Proteam
          </span>
          <span
            className={`font-bold italic text-white/90 ml-0.5 ${tmMap[size]} select-none`}
            style={{ verticalAlign: 'super' }}
          >
            ™
          </span>
        </div>
      )}
    </div>
  );
};
