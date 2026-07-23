import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary-blue-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
        <div className="lg:col-span-2 lg:pr-12">
          <Link href="/" className="font-heading font-bold text-2xl flex items-center gap-2 mb-4">
            Dr Well Care<span className="text-brand-green text-3xl leading-none">.</span>
          </Link>
          <p className="text-primary-blue-light text-sm mb-6">
            Orthopaedic & Wellness Mattress D2C Platform. Say No To Back Pain.
          </p>
          <div className="text-primary-blue-light text-sm leading-relaxed">
            <strong className="text-white">VKS ENTERPRISES</strong><br/>
            No.551, Sivapragasam Nagar,<br/>
            Surapet, Chennai-600066.
          </div>
          <div className="text-primary-blue-light text-sm mt-4 space-y-2">
            <a href="tel:9342922044" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4" /> +91 93429 22044
            </a>
            <a href="mailto:drwellcaremattress@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> drwellcaremattress@gmail.com
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-heading font-semibold text-lg mb-4 text-brand-green-light">Shop</h3>
          <ul className="space-y-2 text-primary-blue-light text-sm font-body">
            <li><Link href="/collections/orthopaedic" className="hover:text-white transition-colors">Orthopaedic Range</Link></li>
            <li><Link href="/collections/memory-foam" className="hover:text-white transition-colors">Memory Foam</Link></li>
            <li><Link href="/collections/hybrid" className="hover:text-white transition-colors">Hybrid Series</Link></li>
            <li><Link href="/quiz" className="hover:text-brand-green transition-colors">Firmness Quiz</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-lg mb-4 text-brand-green-light">Support</h3>
          <ul className="space-y-2 text-primary-blue-light text-sm font-body">
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/returns" className="hover:text-white transition-colors">100-Night Trial & Returns</Link></li>
            <li><Link href="/warranty" className="hover:text-white transition-colors">Warranty Registration</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 pt-8 border-t border-white/10 text-center text-primary-blue-light text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Dr Well Care. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
