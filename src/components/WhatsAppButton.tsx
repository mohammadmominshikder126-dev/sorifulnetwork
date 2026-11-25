import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  shopName: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, shopName }) => {
  const digits = phoneNumber.replace(/\D/g, '');
  const formattedWa = digits.startsWith('88')
    ? digits
    : digits.startsWith('0')
      ? `88${digits}`
      : `880${digits}`;
  const message = encodeURIComponent(
    `Assalamu Alaikum ${shopName}, I would like to inquire about your products.`
  );
  const waUrl = `https://wa.me/${formattedWa}?text=${message}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp (${phoneNumber})`}
      title={`WhatsApp: ${phoneNumber}`}
      className="fixed bottom-[76px] right-3.5 lg:bottom-6 lg:right-6 z-40 group flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full p-3 sm:px-4 sm:py-3 shadow-[0_8px_24px_rgba(37,211,102,0.42)] ring-2 ring-white transition-transform duration-150 hover:scale-105 active:scale-95"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-6 h-6 fill-current shrink-0"
        aria-hidden="true"
      >
        <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16.004c0 2.348.613 4.642 1.777 6.663L2.667 29.333l6.83-1.744a13.28 13.28 0 0 0 6.507 1.7c7.364 0 13.337-5.973 13.337-13.337S23.368 2.667 16.004 2.667zm7.767 18.88c-.324.912-1.884 1.744-2.61 1.855-.664.1-1.503.142-2.426-.152-.56-.178-1.28-.416-2.203-.814-3.876-1.674-6.408-5.573-6.601-5.83-.193-.257-1.574-2.095-1.574-3.997 0-1.902.996-2.838 1.35-3.224.354-.387.772-.483 1.03-.483.257 0 .515.002.74.013.237.011.555-.09.869.664.322.773 1.095 2.676 1.191 2.869.097.193.161.419.032.676-.129.258-.193.419-.386.645-.193.226-.406.504-.58.676-.193.193-.394.402-.169.789.225.387 1.002 1.653 2.151 2.678 1.477 1.318 2.723 1.727 3.11 1.92.387.194.612.161.838-.097.225-.257.966-1.127 1.224-1.514.257-.387.515-.322.869-.193.354.129 2.253 1.063 2.64 1.256.386.193.644.29.74.451.097.161.097.934-.227 1.846z" />
      </svg>
      <span className="hidden sm:inline text-xs font-bold whitespace-nowrap tracking-tight">
        WhatsApp
      </span>
    </a>
  );
};
