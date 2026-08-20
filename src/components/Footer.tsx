import { Link } from '@/router';
import { Instagram, Mail } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export function Footer() {
  return (
    <footer className="bg-ink-900 text-cream-100">
      <div className="container-lux py-16">
        {/* Official logo — centered above footer content */}
        <div className="flex justify-center mb-12 md:mb-16">
          <Link to="/" className="inline-flex" aria-label="My Bare Method home">
            <BrandLogo className="w-auto max-h-40 md:max-h-[200px] object-contain brightness-0 invert" />
          </Link>
        </div>

        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="text-sm text-cream-100/70 leading-relaxed mb-6">
              Luxury wellness, refined. Premium wellness products and provider-guided care — thoughtfully curated for your journey.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-cream-100/70 hover:text-gold-300 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="mailto:info@thebaremethodmn.com" className="text-cream-100/70 hover:text-gold-300 transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="eyebrow text-gold-300 mb-4">Shop</p>
            <ul className="space-y-2.5 text-sm text-cream-100/70">
              <li><Link to="/shop-all" className="hover:text-gold-300 transition-colors">Shop All</Link></li>
              <li><Link to="/memberships" className="hover:text-gold-300 transition-colors">Memberships</Link></li>
              <li><Link to="/alacarte" className="hover:text-gold-300 transition-colors">Shop Without a Membership</Link></li>
              <li><Link to="/section/accessories" className="hover:text-gold-300 transition-colors">Accessories</Link></li>
              <li><Link to="/best-sellers" className="hover:text-gold-300 transition-colors">Best Sellers</Link></li>
              <li><Link to="/section/weight-management" className="hover:text-gold-300 transition-colors">Weight Management</Link></li>
              <li><Link to="/section/longevity" className="hover:text-gold-300 transition-colors">Longevity</Link></li>
              <li><Link to="/section/hrt-women" className="hover:text-gold-300 transition-colors">HRT for Women</Link></li>
            </ul>
          </div>

          {/* Concerns */}
          <div>
            <p className="eyebrow text-gold-300 mb-4">Shop by Concern</p>
            <ul className="space-y-2.5 text-sm text-cream-100/70">
              <li><Link to="/concern/weight-management" className="hover:text-gold-300 transition-colors">Weight Management</Link></li>
              <li><Link to="/concern/longevity-aging" className="hover:text-gold-300 transition-colors">Longevity & Aging</Link></li>
              <li><Link to="/concern/hormone-balance" className="hover:text-gold-300 transition-colors">Hormone Balance</Link></li>
              <li><Link to="/concern/energy-vitality" className="hover:text-gold-300 transition-colors">Energy & Vitality</Link></li>
              <li><Link to="/concern/cognitive-support" className="hover:text-gold-300 transition-colors">Cognitive Support</Link></li>
              <li><Link to="/concern/recovery-performance" className="hover:text-gold-300 transition-colors">Recovery & Performance</Link></li>
              <li><Link to="/concern/sleep-stress" className="hover:text-gold-300 transition-colors">Sleep & Stress</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="eyebrow text-gold-300 mb-4">Legal & Support</p>
            <ul className="space-y-2.5 text-sm text-cream-100/70">
              <li><Link to="/privacy-policy" className="hover:text-gold-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold-300 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-gold-300 transition-colors">Refund & Replacement Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-gold-300 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/membership-terms" className="hover:text-gold-300 transition-colors">Membership & Cancellation Terms</Link></li>
              <li><Link to="/accessibility" className="hover:text-gold-300 transition-colors">Accessibility Statement</Link></li>
              <li><Link to="/consumer-data" className="hover:text-gold-300 transition-colors">Consumer Health Data Notice</Link></li>
              <li><Link to="/medical-director" className="hover:text-gold-300 transition-colors">Meet Our Medical Director</Link></li>
              <li><Link to="/contact" className="hover:text-gold-300 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-gold-300 transition-colors">FAQs</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclosures */}
        <div className="mt-12 border-t border-cream-100/10 pt-8">
          <p className="text-xs text-cream-100/50 leading-relaxed mb-4">
            These statements have not been evaluated by the Food and Drug Administration. Products are not intended to diagnose, treat, cure, or prevent any disease. Provider Care and other therapy products require a medical intake and review by a licensed provider; fulfillment occurs only after provider approval and is not a guarantee of prescription. If not approved, a full refund is issued.
          </p>
          <p className="text-xs text-cream-100/50 leading-relaxed mb-4">
            Telemedicine services available in all 50 states. Appointments conducted via Zoom and booked on our website. Medical Director: Dr. Jerry J. Cattelane Jr., D.O. Prescription therapies are fulfilled through U.S. compounding pharmacy partners, including Ageless Pharma Rx (503A) and ProCompounding Pharmacy (503A), as applicable. Provider review and a valid prescription are required.
          </p>
          <div className="flex flex-col md:flex-row justify-between gap-4 text-xs text-cream-100/50">
            <p>© {new Date().getFullYear()} My Bare Method. All rights reserved. A brand of The Bare Method.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
