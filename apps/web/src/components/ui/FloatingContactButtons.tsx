"use client";

import { usePathname } from 'next/navigation';

export function FloatingContactButtons() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 items-center pointer-events-none">
      
      {/* 1. WhatsApp Button (Stacked Top) - Green Speech Bubble Icon */}
      <a 
        href="https://wa.me/919342922044?text=Hi%20Dr%20Well%20Care%2C%20I%20have%20an%20inquiry%20about%20your%20mattresses." 
        target="_blank" 
        rel="noreferrer"
        className="pointer-events-auto group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.5)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-[#25D366]"
        title="Chat on WhatsApp"
      >
        {/* Pulsing ripple effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />
        
        {/* Official WhatsApp Green Logo SVG */}
        <svg className="w-9 h-9 sm:w-10 sm:h-10 text-[#25D366] fill-current group-hover:rotate-6 transition-transform" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.137 4.155 4.316-1.134z" />
          <path d="M15.556 14.398c-.267-.134-1.583-.78-1.828-.87-.245-.089-.423-.134-.601.134-.178.267-.69.87-.846 1.047-.156.178-.312.201-.579.067-.267-.134-1.127-.416-2.147-1.326-.794-.708-1.33-1.582-1.486-1.85-.156-.267-.017-.411.117-.544.121-.12.267-.312.401-.468.134-.156.178-.267.267-.446.089-.178.045-.335-.022-.468-.067-.134-.601-1.448-.824-1.984-.217-.521-.437-.45-.601-.458l-.512-.009c-.178 0-.468.067-.713.335-.245.267-.936.914-.936 2.229 0 1.315.958 2.585 1.091 2.763.134.178 1.886 2.88 4.57 4.037.639.276 1.138.441 1.528.565.642.204 1.226.175 1.688.106.514-.077 1.583-.646 1.806-1.27.223-.624.223-1.159.156-1.27-.067-.111-.245-.178-.512-.312z" fill="#25D366" />
        </svg>
      </a>

      {/* 2. Call Button (Stacked Bottom) - Blue Gradient Box Matching Reference Image 2 */}
      <a 
        href="tel:9342922044" 
        className="pointer-events-auto group relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#3a93ff] via-[#1a7ae6] to-[#0461ce] text-white flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(6,130,228,0.5)] hover:shadow-[0_12px_35px_rgba(6,130,228,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 border border-white/40"
        title="Call Directly (+91 93429 22044)"
      >
        {/* Phone Handset Icon */}
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
        {/* "Call" Text Underneath inside the Box */}
        <span className="font-extrabold text-[11px] sm:text-xs text-white leading-none tracking-tight mt-0.5">
          Call
        </span>
      </a>
      
    </div>
  );
}

