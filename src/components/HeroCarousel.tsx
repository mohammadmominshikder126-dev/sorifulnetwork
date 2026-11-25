import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { BrandLogo } from './Logo';
import { CategoryId, HeroSlide } from '../types';

interface HeroCarouselProps {
  slides: HeroSlide[];
  onShopCategory: (category: CategoryId) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides, onShopCategory }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const safeIndex = slides.length > 0 ? activeIndex % slides.length : 0;

  useEffect(() => {
    if (isPaused || slides.length <= 1 || isDragging) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length, isDragging]);

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleHeroTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      e.stopPropagation();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setDragOffset(dx * 0.65);
      });
    }
  };

  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsDragging(false);
    if (touchStartX.current !== null) {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 36) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }
    }
    setDragOffset(0);
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (slides.length === 0) return null;

  return (
    <section
      aria-label="Promotional Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleHeroTouchStart}
      onTouchMove={handleHeroTouchMove}
      onTouchEnd={handleHeroTouchEnd}
      className="relative w-full overflow-hidden bg-[#071126] swipe-surface"
    >
      {/* 120Hz Continuous GPU Slide Track */}
      <div
        className={`flex gpu-slide-track ${
          isDragging ? '' : 'transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]'
        }`}
        style={{
          transform: `translate3d(calc(-${safeIndex * 100}% + ${dragOffset}px), 0, 0)`,
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`w-full shrink-0 relative ${slide.accentGradient}`}
          >
            {slide.bannerImage ? (
              <div
                onClick={() => onShopCategory(slide.targetCategory)}
                className="relative w-full max-w-[1440px] mx-auto cursor-pointer bg-[#12042b] flex items-center justify-center"
              >
                <img
                  src={slide.bannerImage}
                  alt="S.A Network Official Store Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[480px] object-contain mx-auto select-none block"
                />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 hero-dot-matrix opacity-50 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.22)_0%,transparent_65%)] pointer-events-none" />

                <div className="relative max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-14 pt-5 pb-9 sm:py-9 lg:pt-8 lg:pb-16 min-h-[215px] sm:min-h-[290px] lg:min-h-[370px] flex items-center justify-between gap-2 sm:gap-6">
                  {/* Left Visual Showcase */}
                  <div className="w-[26%] sm:w-[27%] lg:w-[28%] flex items-center justify-center shrink-0">
                    <div className="relative w-full max-w-[110px] sm:max-w-[200px] lg:max-w-[280px] aspect-square rounded-2xl overflow-hidden shadow-[0_0_45px_rgba(14,165,233,0.28)] border border-sky-400/20">
                      <img
                        src={slide.leftImage}
                        alt="Featured Smartphones and Earbuds"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#021033]/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Center Brand & CTA */}
                  <div className="flex-1 text-center flex flex-col items-center justify-center z-10 px-1">
                    {slide.isBrandSlide ? (
                      <>
                        <BrandLogo variant="hero" />
                        <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 w-full max-w-[440px] justify-center">
                          <span className="hidden sm:block h-px flex-1 bg-sky-300/45" />
                          <p className="text-[8px] sm:text-xs lg:text-sm font-semibold tracking-[0.14em] sm:tracking-[0.22em] text-white/95 uppercase whitespace-nowrap">
                            {slide.eyebrow}
                          </p>
                          <span className="hidden sm:block h-px flex-1 bg-sky-300/45" />
                        </div>
                        <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
                          <span className="hidden sm:block h-0.5 w-8 bg-[#38bdf8] rounded-full" />
                          <button
                            type="button"
                            onClick={() => onShopCategory(slide.targetCategory)}
                            className="bg-[#0B84F3] hover:bg-[#1994ff] text-white font-semibold text-xs sm:text-sm lg:text-base px-4 sm:px-7 py-2 sm:py-2.5 rounded-full shadow-[0_6px_22px_rgba(11,132,243,0.55)] transition-transform active:scale-95 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <span className="hidden sm:inline">{slide.ctaLabel}</span>
                            <span className="sm:hidden inline-flex items-center gap-1">
                              {slide.ctaMobileLabel} <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </button>
                          <span className="hidden sm:block h-0.5 w-8 bg-[#38bdf8] rounded-full" />
                        </div>
                      </>
                    ) : (
                      <div className="max-w-lg mx-auto">
                        <p className="text-[9px] sm:text-xs font-bold tracking-[0.16em] text-sky-300 uppercase mb-1.5">
                          {slide.eyebrow}
                        </p>
                        <h1 className="font-display font-extrabold italic tracking-tight leading-tight text-2xl sm:text-4xl lg:text-5xl text-white">
                          <span className="text-[#2aa0ff]">{slide.titleBlue} </span>
                          <span>{slide.titleWhite}</span>
                        </h1>
                        <p className="mt-1.5 sm:mt-2.5 text-[11px] sm:text-sm lg:text-base text-slate-200 max-w-md mx-auto line-clamp-2">
                          {slide.subtitle}
                        </p>
                        <button
                          type="button"
                          onClick={() => onShopCategory(slide.targetCategory)}
                          className="mt-3 sm:mt-5 bg-[#0B84F3] hover:bg-[#1994ff] text-white font-semibold text-xs sm:text-sm lg:text-base px-5 sm:px-7 py-2 sm:py-2.5 rounded-full shadow-[0_6px_22px_rgba(11,132,243,0.55)] transition-transform active:scale-95 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">{slide.ctaLabel}</span>
                          <span className="sm:hidden">{slide.ctaMobileLabel}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Visual Showcase */}
                  <div className="w-[26%] sm:w-[27%] lg:w-[28%] flex items-center justify-center shrink-0">
                    <div className="relative w-full max-w-[110px] sm:max-w-[200px] lg:max-w-[280px] aspect-square rounded-2xl overflow-hidden shadow-[0_0_45px_rgba(14,165,233,0.28)] border border-sky-400/20">
                      <img
                        src={slide.rightImage}
                        alt="Featured Smart Watch, Headphones and Fast Chargers"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#021033]/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2.5 sm:bottom-4 lg:bottom-11 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-20 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === safeIndex
                  ? 'w-5 bg-[#0B84F3] ring-2 ring-sky-300/70'
                  : 'w-2.5 bg-white/40 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Desktop Prev / Next Arrow Buttons */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous promotional slide"
            className="hidden sm:flex absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-black/45 hover:bg-[#0B84F3] border border-white/30 text-white items-center justify-center transition-colors z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next promotional slide"
            className="hidden sm:flex absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-black/45 hover:bg-[#0B84F3] border border-white/30 text-white items-center justify-center transition-colors z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </section>
  );
};
