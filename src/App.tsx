import { useEffect } from 'react';
import { CartProvider } from '@/context/CartContext';
import { PrescriptionBasketProvider } from '@/context/PrescriptionBasketContext';
import { MemberProvider } from '@/context/MemberContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import { useRouter } from '@/router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { PrescriptionBasketDrawer } from '@/components/PrescriptionBasketDrawer';
import { HomePage } from '@/pages/HomePage';
import { GoalsPage } from '@/pages/GoalsPage';
import { GoalPage } from '@/pages/GoalPage';
import { SectionPage } from '@/pages/SectionPage';
import { BestSellersPage } from '@/pages/BestSellersPage';
import { ProductPage } from '@/pages/ProductPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderPaymentInstructionsPage } from '@/pages/OrderPaymentInstructionsPage';
import { KashuCardResultPage } from '@/pages/KashuCardResultPage';
import { SuccessPage } from '@/pages/SuccessPage';
import { CancelPage } from '@/pages/CancelPage';
import { TrackPage } from '@/pages/TrackPage';
import { AboutPage } from '@/pages/AboutPage';
import { FaqPage } from '@/pages/FaqPage';
import { SubscriptionsPage } from '@/pages/SubscriptionsPage';
import { AlaCartePage } from '@/pages/AlaCartePage';
import { RefundPolicyPage } from '@/pages/RefundPolicyPage';
import { ContactPage } from '@/pages/ContactPage';
import { ShopAllPage } from '@/pages/ShopAllPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { TermsPage } from '@/pages/TermsPage';
import { ConcernPage } from '@/pages/ConcernPage';
import { ShippingPolicyPage } from '@/pages/ShippingPolicyPage';
import { BUILD_VERSION } from '@/buildVersion';

// Keep the deploy marker in the customer bundle for staging sync verification (not rendered).
(globalThis as typeof globalThis & { __MBM_BUILD_VERSION__?: string }).__MBM_BUILD_VERSION__ =
  BUILD_VERSION;
import { AccessibilityPage } from '@/pages/AccessibilityPage';
import { ConsumerDataPage } from '@/pages/ConsumerDataPage';
import { SubscriptionTermsPage } from '@/pages/SubscriptionTermsPage';
import { MedicalDirectorPage } from '@/pages/MedicalDirectorPage';
import { OrderLabsPage } from '@/pages/OrderLabsPage';
import { AdminApp } from '@/admin/AdminApp';
import { AccountGate } from '@/pages/account/AccountGate';
import { AccountLoginPage } from '@/pages/account/AccountLoginPage';
import { AccountSignupPage } from '@/pages/account/AccountSignupPage';
import { AccountAuthCallbackPage } from '@/pages/account/AccountAuthCallbackPage';
import { AccountResetPasswordPage } from '@/pages/account/AccountResetPasswordPage';
import { AccountOverviewPage } from '@/pages/account/AccountOverviewPage';
import { AccountProfilePage } from '@/pages/account/AccountProfilePage';
import { AccountComingSoonPage } from '@/pages/account/AccountComingSoonPage';
import { AccountOrdersPage } from '@/pages/account/AccountOrdersPage';
import { AccountOrderDetailPage } from '@/pages/account/AccountOrderDetailPage';
import { CherryFinancingWidget } from '@/components/CherryFinancingWidget';

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

  // Legacy /shop alias → canonical /shop-all
  useEffect(() => {
    if (path === '/shop') {
      window.history.replaceState({}, '', '/shop-all');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [path]);

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
    if (path.startsWith('/order/payment/')) {
      const orderNumber = path.replace('/order/payment/', '').split('/')[0];
      return <OrderPaymentInstructionsPage publicOrderNumber={orderNumber} />;
    }
    if (path.startsWith('/order/card-result/')) {
      return <KashuCardResultPage />;
    }
    if (path === '/success') return <SuccessPage />;
    if (path === '/cancel') return <CancelPage />;

    if (path === '/account/login') {
      return (
        <AccountGate publicOnly>
          <AccountLoginPage />
        </AccountGate>
      );
    }
    if (path === '/account/signup') {
      return (
        <AccountGate publicOnly>
          <AccountSignupPage />
        </AccountGate>
      );
    }
    if (path === '/account/auth/callback') {
      return (
        <AccountGate publicOnly>
          <AccountAuthCallbackPage />
        </AccountGate>
      );
    }
    if (path === '/account/reset-password') {
      return (
        <AccountGate publicOnly>
          <AccountResetPasswordPage />
        </AccountGate>
      );
    }
    if (path === '/account') {
      return (
        <AccountGate>
          <AccountOverviewPage />
        </AccountGate>
      );
    }
    if (path === '/account/profile') {
      return (
        <AccountGate>
          <AccountProfilePage />
        </AccountGate>
      );
    }
    if (path === '/account/orders') {
      return (
        <AccountGate>
          <AccountOrdersPage />
        </AccountGate>
      );
    }
    if (path.startsWith('/account/orders/')) {
      const orderId = path.replace('/account/orders/', '').split('/')[0];
      return (
        <AccountGate>
          <AccountOrderDetailPage orderId={orderId} />
        </AccountGate>
      );
    }
    if (path === '/account/subscriptions' || path === '/account/membership' || path === '/account/auto-refill') {
      return (
        <AccountGate>
          <AccountComingSoonPage
            active="membership"
            title="Subscriptions"
            description="Recurring prescription subscription details will appear here in a future update."
          />
        </AccountGate>
      );
    }
    if (path === '/account/requests') {
      return (
        <AccountGate>
          <AccountComingSoonPage
            active="requests"
            title="Requests"
            description="Refill, pause, and cancellation requests will appear here in a future update."
          />
        </AccountGate>
      );
    }

    if (path === '/track') return <TrackPage />;
    if (path === '/about') return <AboutPage />;
    if (path === '/medical-director') return <MedicalDirectorPage />;
    if (path === '/order-labs') return <OrderLabsPage />;
    if (path === '/faq') return <FaqPage />;
    if (path === '/memberships' || path === '/subscriptions') return <SubscriptionsPage />;
    if (path === '/alacarte') return <AlaCartePage />;
    if (path === '/refund-policy') return <RefundPolicyPage />;
    if (path === '/shipping-policy') return <ShippingPolicyPage />;
    if (path === '/membership-terms' || path === '/subscription-terms') return <SubscriptionTermsPage />;
    if (path === '/accessibility') return <AccessibilityPage />;
    if (path === '/consumer-data') return <ConsumerDataPage />;
    if (path === '/contact') return <ContactPage />;
    if (path === '/shop' || path === '/shop-all') return <ShopAllPage />;
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
    <CustomerAuthProvider>
      <MemberProvider>
        <PrescriptionBasketProvider>
          <CartProvider>
            <div className="min-h-screen bg-cream-50">
              <Header />
              <main>{renderPage()}</main>
              <Footer />
              <CartDrawer />
              <PrescriptionBasketDrawer />
              {/* Financing discovery only — does not replace Tagada card checkout */}
              <CherryFinancingWidget />
            </div>
          </CartProvider>
        </PrescriptionBasketProvider>
      </MemberProvider>
    </CustomerAuthProvider>
  );
}

export default App;
