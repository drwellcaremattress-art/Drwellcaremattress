"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div 
            key={index} 
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen 
                ? 'bg-white border-[#7cb93e]/30 shadow-[0_8px_30px_rgb(124,185,62,0.12)]' 
                : 'bg-white/50 border-gray-100 hover:border-gray-200'
            }`}
          >
            <button
              className="flex justify-between items-center w-full p-5 sm:p-6 text-left focus:outline-none"
              onClick={() => toggleItem(index)}
            >
              <h3 className={`font-bold text-base sm:text-lg pr-8 transition-colors ${
                isOpen ? 'text-[#0B1A2A]' : 'text-[#0B1A2A]/80'
              }`}>
                {item.question}
              </h3>
              
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isOpen ? 'bg-[#0B1A2A] text-white' : 'bg-gray-100 text-[#0B1A2A]'
              }`}>
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 sm:px-6 pb-6 text-[#5B6B7B] font-medium leading-relaxed">
                    <div className="h-px w-full bg-gray-100 mb-5"></div>
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
