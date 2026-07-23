"use client";

import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { HelpCircle, Shield, Truck, Package } from 'lucide-react';

export default function FAQPage() {
  const trialFAQs = [
    {
      question: "How does the 100-Night Risk-Free Trial work?",
      answer: "We believe you need to sleep on a mattress in your own home to know if it's right for you. Your 100-night trial begins the day your mattress is delivered. We ask that you sleep on it for at least 30 nights to let your body adjust. If you still don't love it, we'll pick it up for free and give you a full refund."
    },
    {
      question: "What is covered under the 10-Year Warranty?",
      answer: "Our 10-year warranty covers manufacturing defects, such as foam indentations deeper than 1 inch that aren't associated with an improper foundation, and physical flaws in the cover zipper. It does not cover normal wear and tear, firmness preferences, or damage caused by improper support."
    },
    {
      question: "Do I need to keep the original box?",
      answer: "No, you do not need to keep the box. If you decide to return the mattress during your 100-night trial, our team will come pick it up as is."
    }
  ];

  const productFAQs = [
    {
      question: "Are your mattresses orthopaedic?",
      answer: "Yes! All Dr. Well Care mattresses are scientifically designed to provide orthopaedic support. They promote proper spinal alignment and relieve pressure points, which helps significantly reduce back pain."
    },
    {
      question: "Does the mattress get hot at night?",
      answer: "No, our mattresses are designed with advanced cooling technology. We use open-cell memory foam and breathable fabric covers that promote airflow and dissipate body heat throughout the night."
    },
    {
      question: "Can I flip the mattress?",
      answer: "Our memory foam and orthopaedic mattresses are designed with a specific top-to-bottom layering system for maximum comfort and support. Because of this, they should not be flipped. However, we do recommend rotating the mattress 180 degrees every 3-6 months to ensure even wear."
    }
  ];

  const shippingFAQs = [
    {
      question: "How long does shipping take?",
      answer: "Standard delivery typically takes 3-7 business days depending on your location. Once your order ships, you will receive a tracking number via email."
    },
    {
      question: "How is the mattress packaged?",
      answer: "Your mattress is compressed, vacuum-sealed, and rolled into a compact box for easy shipping and handling. This makes it easy to maneuver through narrow hallways and staircases."
    },
    {
      question: "Do you offer old mattress removal?",
      answer: "Currently, we offer old mattress removal as an add-on service in select zip codes. You can check availability during the checkout process."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      
      {/* Hero Section */}
      <section className="bg-[#0B1A2A] text-white py-20 lg:py-28 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-[#7cb93e]/10 rounded-full blur-3xl transform rotate-45"></div>
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[100%] bg-blue-500/10 rounded-full blur-3xl transform -rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 mb-6 shadow-xl">
            <HelpCircle className="w-8 h-8 text-[#7cb93e]" />
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Frequently Asked <span className="text-[#7cb93e]">Questions</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 font-medium">
            Everything you need to know about our products, trial, and delivery. 
            Can't find the answer? Our support team is here to help.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto px-4 py-20 max-w-5xl">
        
        {/* Category 1: Trial & Warranty */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-[#0B1A2A]">Trial & Warranty</h2>
              <p className="text-sm text-[#5B6B7B] font-medium">Details about your 100-night trial and 10-year protection.</p>
            </div>
          </div>
          <FAQAccordion items={trialFAQs} />
        </div>

        {/* Category 2: Product Information */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-[#0B1A2A]">Product Information</h2>
              <p className="text-sm text-[#5B6B7B] font-medium">Materials, sizing, and orthopaedic benefits.</p>
            </div>
          </div>
          <FAQAccordion items={productFAQs} />
        </div>

        {/* Category 3: Shipping & Delivery */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-[#0B1A2A]">Shipping & Delivery</h2>
              <p className="text-sm text-[#5B6B7B] font-medium">Timelines, unboxing, and shipping processes.</p>
            </div>
          </div>
          <FAQAccordion items={shippingFAQs} />
        </div>

      </section>

      {/* Still have questions banner */}
      <section className="bg-white border-t border-gray-100 py-16 mt-auto">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h3 className="font-heading text-2xl font-bold text-[#0B1A2A] mb-4">Still have questions?</h3>
          <p className="text-[#5B6B7B] mb-8 font-medium">
            Our sleep experts are available 7 days a week to help you find the perfect mattress.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#0B1A2A] hover:bg-[#16273B] text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5">
              Contact Support
            </button>
            <button className="bg-[#f8f9fa] hover:bg-gray-100 border border-gray-200 text-[#0B1A2A] px-8 py-4 rounded-xl font-bold transition-colors">
              Read Sleep Guide
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
}
