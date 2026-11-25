import React from 'react';

interface LogoProps {
  variant?: 'light-bg' | 'dark-bg' | 'hero';
  className?: string;
}

export const BrandLogo: React.FC<LogoProps> = ({ variant = 'light-bg', className = '' }) => {
  const isHero = variant === 'hero';
  const isDarkBg = variant === 'dark-bg' || isHero;

  if (isHero) {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        {/* Giant Hero SA Monogram */}
        <svg
          viewBox="0 0 210 112"
          className="w-32 sm:w-44 md:w-56 h-auto drop-shadow-[0_10px_28px_rgba(11,132,243,0.45)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="55%" stopColor="#0b84f3" />
              <stop offset="100%" stopColor="#0256c7" />
            </linearGradient>
          </defs>
          {/* Stylized S */}
          <path
            d="M84 14 L38 14 C23 14 14 23 13 35 C12 48 21 56 36 58 L62 61 C69 62 72 66 71 71 C70 76 64 80 55 80 L16 80 L10 98 L58 98 C77 98 90 87 92 71 C94 56 83 47 65 44 L41 41 C34 40 32 37 33 33 C34 29 39 27 46 27 L80 27 Z"
            fill="#FFFFFF"
          />
          {/* Stylized A */}
          <path
            d="M126 14 L80 98 L106 98 L116 78 L148 78 L153 98 L178 98 L154 14 Z M124 62 L137 36 L144 62 Z"
            fill="url(#heroBlue)"
          />
          {/* Dynamic Swoosh */}
          <path
            d="M4 96 C48 112 128 84 198 44 C150 76 76 104 4 96 Z"
            fill="#0b84f3"
          />
        </svg>
        <div className="mt-0.5 flex items-baseline gap-2.5 tracking-tight font-display font-extrabold italic leading-none">
          <span className="text-3xl sm:text-4xl md:text-5xl text-[#1496FF] drop-shadow-[0_2px_12px_rgba(11,132,243,0.5)]">
            S.A
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
            NETWORK
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none shrink-0 ${className}`}>
      <svg
        viewBox="0 0 210 112"
        className={isDarkBg ? 'w-11 h-7 sm:w-12 sm:h-7' : 'w-12 h-8'}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`logoBlue-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#26a0ff" />
            <stop offset="100%" stopColor="#0564d8" />
          </linearGradient>
        </defs>
        <path
          d="M84 14 L38 14 C23 14 14 23 13 35 C12 48 21 56 36 58 L62 61 C69 62 72 66 71 71 C70 76 64 80 55 80 L16 80 L10 98 L58 98 C77 98 90 87 92 71 C94 56 83 47 65 44 L41 41 C34 40 32 37 33 33 C34 29 39 27 46 27 L80 27 Z"
          fill={isDarkBg ? '#FFFFFF' : '#081b4b'}
        />
        <path
          d="M126 14 L80 98 L106 98 L116 78 L148 78 L153 98 L178 98 L154 14 Z M124 62 L137 36 L144 62 Z"
          fill={`url(#logoBlue-${variant})`}
        />
        <path
          d="M4 96 C48 112 128 84 198 44 C150 76 76 104 4 96 Z"
          fill="#0b84f3"
        />
      </svg>
      <div className="flex items-baseline gap-1.5 font-display font-extrabold italic tracking-tight leading-none whitespace-nowrap">
        <span className="text-xl sm:text-2xl text-[#0B84F3]">S.A</span>
        <span className={`text-xl sm:text-2xl ${isDarkBg ? 'text-white' : 'text-[#0B1221]'}`}>
          NETWORK
        </span>
      </div>
    </div>
  );
};
