import React from 'react';
import {
  IMG_IPHONE,
  IMG_HEADPHONES,
  IMG_WATCH,
  IMG_CHARGER,
  IMG_CABLES,
  IMG_SPEAKER,
  IMG_GAMING,
} from '../data/catalog';
import { CategoryId } from '../types';

interface CategoryIconProps {
  id: CategoryId | 'more';
  image?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const DEFAULT_DEVICE_IMAGES: Record<string, string> = {
  smartphones: IMG_IPHONE,
  'headphones-earbuds': IMG_HEADPHONES,
  'smart-watch': IMG_WATCH,
  'charger-power-bank': IMG_CHARGER,
  'cables-accessories': IMG_CABLES,
  'bluetooth-speakers': IMG_SPEAKER,
  'gaming-accessories': IMG_GAMING,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  id,
  image,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 rounded-lg p-0.5',
    sm: 'w-8 h-8 rounded-lg p-0.5',
    md: 'w-11 h-11 rounded-full p-1',
    lg: 'w-12 h-12 rounded-2xl p-1',
  }[size];

  if (id === 'more' || id === 'all') {
    return (
      <div
        className={`${sizeClasses} bg-gradient-to-br from-[#e0f2fe] via-white to-[#bfdbfe] border border-[#0B84F3]/30 shadow-xs grid grid-cols-2 gap-0.5 overflow-hidden shrink-0 ${className}`}
      >
        <img
          src={IMG_IPHONE}
          alt="Smartphones"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[3px]"
        />
        <img
          src={IMG_HEADPHONES}
          alt="Headphones"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[3px]"
        />
        <img
          src={IMG_WATCH}
          alt="Smart Watch"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[3px]"
        />
        <img
          src={IMG_SPEAKER}
          alt="Speakers"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[3px]"
        />
      </div>
    );
  }

  const src = image || DEFAULT_DEVICE_IMAGES[id] || IMG_IPHONE;

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-[#e0f2fe] via-white to-[#dbeafe] border border-[#0B84F3]/25 shadow-xs flex items-center justify-center overflow-hidden shrink-0 ${className}`}
    >
      <img
        src={src}
        alt={id}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-[inherit]"
      />
    </div>
  );
};
