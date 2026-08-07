import { useEffect } from 'react';
import { CartProvider } from '@/context/CartContext';
import { MemberProvider } from '@/context/MemberContext';
import { useRouter } from '@/router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { HomePage } from '@/pages/HomePage';
import { GoalsPage } from '@/pages/GoalsPage';
import { GoalPage } from '@/pages/GoalPage';
import { SectionPage } from '@/pages/SectionPage';
import { BestSellersPage } from '@/pages/BestSellersPage';
import { ProductPage } from '@/pages/ProductPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { SuccessPage } from '@/pages/SuccessPage';
import { CancelPage } from '@/pages/CancelPage';
import { AccountPage } from '@/pages/AccountPage';
import { TrackPage } from '@/pages/TrackPage';
import { AboutPage } from '@/pages/AboutPage';
import { FaqPage } from '@/pages/FaqPage';
import { MembershipsPage } from '@/pages/MembershipsPage';
import { AlaCartePage } from '@/pages/AlaCartePage';
import { RefundPolicyPage } from '@/pages/RefundPolicyPage';
import { ContactPage } from '@/pages/ContactPage';
import { ShopAllPage } from '@/pages/ShopAllPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { TermsPage } from '@/pages/TermsPage';
import { ConcernPage } from '@/pages/ConcernPage';
import { ShippingPolicyPage } from '@/pages/ShippingPolicyPage';
import { AccessibilityPage } from '@/pages/AccessibilityPage';
import { ConsumerDataPage } from '@/pages/ConsumerDataPage';
import { MembershipTermsPage } from '@/pages/MembershipTermsPage';
import { MedicalDirectorPage } from '@/pages/MedicalDirectorPage';
import { AdminApp } from '@/admin/AdminApp';

function App() {
  const route = useRouter();
  const { path } = route;

  // Redirect legacy hash URLs to clean path URLs on initial load
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const cleanPath = window.location.hash.slice(1);
      window.history.replaceState({}, '', cleanPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, []);

  // Admin area renders with its own chrome (no storefront header/footer/cart).
  if (path === '/admin' || path.startsWith('/admin/')) {
    return <AdminApp route={route} />;
  }

  const renderPage = () => {
    if (path === '/' || path === '') return <HomePage />;
    if (path === '/goals') return <GoalsPage />;
    if (path.startsWith('/goal/')) return <GoalPage goalId={path.replace('/goal/', '')} />;
    if (path.startsWith('/concern/')) return <ConcernPage concernId={path.replace('/concern/', '')} />;
    if (path.startsWith('/section/')) return <SectionPage sectionId={path.replace('/section/', '')} subFilter={route.query.sub} />;
    if (path === '/best-sellers') return <BestSellersPage />;
    if (path.startsWith('/product/')) return <ProductPage slug={path.replace('/product/', '')} />;
    if (path === '/checkout') return <CheckoutPage />;
    if (path === '/success') return <SuccessPage />;
    if (path === '/cancel') return <CancelPage />;
    if (path === '/account') return <AccountPage />;
    if (path === '/track') return <TrackPage />;
    if (path === '/about') return <AboutPage />;
    if (path === '/medical-director') return <MedicalDirectorPage />;
    if (path === '/faq') return <FaqPage />;
  if (path === '/memberships') return <MembershipsPage />;
  if (path === '/alacarte') return <AlaCartePage />;
  if (path === '/refund-policy') return <RefundPolicyPage />;
  if (path === '/shipping-policy') return <ShippingPolicyPage />;
  if (path === '/membership-terms') return <MembershipTermsPage />;
  if (path === '/accessibility') return <AccessibilityPage />;
  if (path === '/consumer-data') return <ConsumerDataPage />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/shop-all') return <ShopAllPage />;
  if (path === '/privacy-policy') return <PrivacyPolicyPage />;
  if (path === '/terms') return <TermsPage />;

    return (
      <div className="pt-32 pb-20 text-center">
        <p className="font-serif text-3xl text-ink-900 mb-3">Page not found</p>
        <p className="text-ink-500 mb-6">The page you are looking for does not exist.</p>
        <a href="/" className="btn-primary">Back to Home</a>
      </div>
    );
  };

  return (
    <MemberProvider>
      <CartProvider>
        <div className="min-h-screen bg-cream-50">
          <Header />
          <main>{renderPage()}</main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </MemberProvider>
  );
}

export default App;
