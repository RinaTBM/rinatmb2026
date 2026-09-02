import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

import { CartProvider } from '@/context/CartContext';
import { PrescriptionBasketProvider } from '@/context/PrescriptionBasketContext';
import { MemberProvider } from '@/context/MemberContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { PrescriptionBasketDrawer } from '@/components/PrescriptionBasketDrawer';
import { HomePage } from '@/pages/HomePage';
import { GoalsPage } from '@/pages/GoalsPage';
import { ShopAllPage } from '@/pages/ShopAllPage';
import { BestSellersPage } from '@/pages/BestSellersPage';
import { SubscriptionsPage } from '@/pages/SubscriptionsPage';
import { AlaCartePage } from '@/pages/AlaCartePage';
import { AboutPage } from '@/pages/AboutPage';
import { MedicalDirectorPage } from '@/pages/MedicalDirectorPage';
import { FaqPage } from '@/pages/FaqPage';
import { ContactPage } from '@/pages/ContactPage';
import { SuccessPage } from '@/pages/SuccessPage';
import { CancelPage } from '@/pages/CancelPage';
import { SectionPage } from '@/pages/SectionPage';
import { ConcernPage } from '@/pages/ConcernPage';
import { ProductPage } from '@/pages/ProductPage';
import { RefundPolicyPage } from '@/pages/RefundPolicyPage';
import { ShippingPolicyPage } from '@/pages/ShippingPolicyPage';
import { SubscriptionTermsPage } from '@/pages/SubscriptionTermsPage';
import { AccessibilityPage } from '@/pages/AccessibilityPage';
import { ConsumerDataPage } from '@/pages/ConsumerDataPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { TermsPage } from '@/pages/TermsPage';
import { OrderLabsPage } from '@/pages/OrderLabsPage';
import { visibleProducts as products, sections, concerns, goals, type Product } from '@/data/products';

const BASE_URL = 'https://mybaremethod.com';

function renderPage(component: React.ReactElement) {
  return renderToString(
    createElement(CustomerAuthProvider, null,
      createElement(MemberProvider, null,
        createElement(PrescriptionBasketProvider, null,
          createElement(CartProvider, null,
            createElement('div', { className: 'min-h-screen bg-cream-50' },
              createElement(Header),
              createElement('main', null, component),
              createElement(Footer),
              createElement(CartDrawer),
              createElement(PrescriptionBasketDrawer),
            ),
          ),
        ),
      ),
    ),
  );
}

function buildProductJsonLd(product: Product) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.displayName,
    description: product.shortDescription,
    image: `${BASE_URL}${product.image}`,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'My Bare Method' },
    offers: {
      '@type': 'Offer',
      price: product.startingPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/product/${product.slug}`,
    },
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function buildRoutes() {
  const routes: { path: string; component: React.ReactElement; title: string; description: string; jsonLd?: string }[] = [
    {
      path: '/',
      component: createElement(HomePage),
      title: 'My Bare Method — Wellness, Elevated. Beautifully Personalized.',
      description: 'Premium wellness products and provider-guided care with optional Subscribe & Save pricing on eligible prescriptions.',
    },
    {
      path: '/shop-all',
      component: createElement(ShopAllPage),
      title: 'Shop All — My Bare Method',
      description: 'Browse our complete catalog of prescription wellness products, provider care, and accessories.',
    },
    {
      path: '/best-sellers',
      component: createElement(BestSellersPage),
      title: 'Best Sellers — My Bare Method',
      description: 'Our most loved wellness products, curated by thousands of happy customers.',
    },
    {
      path: '/subscriptions',
      component: createElement(SubscriptionsPage),
      title: 'Subscribe & Save — My Bare Method',
      description: 'Save 15% on eligible monthly prescription renewals. Selected Two-Day or Next-Day shipping recurs with every renewal. Provider review required.',
    },
    {
      path: '/alacarte',
      component: createElement(AlaCartePage),
      title: 'À La Carte — My Bare Method',
      description: 'Purchase wellness products on your terms with no commitment required.',
    },
    {
      path: '/about',
      component: createElement(AboutPage),
      title: 'About — My Bare Method',
      description: 'Learn about My Bare Method — premium wellness products and provider-guided care.',
    },
    {
      path: '/medical-director',
      component: createElement(MedicalDirectorPage),
      title: 'Meet Our Medical Director | My Bare Method',
      description:
        'Meet Dr. Jerry J. Cattelane Jr., D.O., Medical Director for My Bare Method, and learn about the clinical leadership supporting our provider-directed wellness programs.',
    },
    {
      path: '/faq',
      component: createElement(FaqPage),
      title: 'FAQs — My Bare Method',
      description: 'Frequently asked questions about My Bare Method products, memberships, and shipping.',
    },
    {
      path: '/contact',
      component: createElement(ContactPage),
      title: 'Contact Us — My Bare Method',
      description: 'Get in touch with the My Bare Method team for questions about your order or wellness journey.',
    },
    {
      path: '/success',
      component: createElement(SuccessPage),
      title: 'Order Confirmed — My Bare Method',
      description: 'Your payment was successful. Thank you for your order.',
    },
    {
      path: '/cancel',
      component: createElement(CancelPage),
      title: 'Checkout Cancelled — My Bare Method',
      description: 'Your payment was not completed. No charge has been made.',
    },
    {
      path: '/goals',
      component: createElement(GoalsPage),
      title: 'Shop by Goal — My Bare Method',
      description: 'Browse wellness products by your health and wellness goals.',
    },
    {
      path: '/refund-policy',
      component: createElement(RefundPolicyPage),
      title: 'Refund & Replacement Policy — My Bare Method',
      description: 'Read our refund and replacement policy for all products and memberships.',
    },
    {
      path: '/shipping-policy',
      component: createElement(ShippingPolicyPage),
      title: 'Shipping Policy — My Bare Method',
      description: 'Learn about our shipping methods, timelines, and discreet packaging.',
    },
    {
      path: '/membership-terms',
      component: createElement(SubscriptionTermsPage),
      title: 'Subscription & Cancellation Terms — My Bare Method',
      description: 'Recurring billing, shipping, and cancellation terms for My Bare Method prescription subscriptions.',
    },
    {
      path: '/accessibility',
      component: createElement(AccessibilityPage),
      title: 'Accessibility Statement — My Bare Method',
      description: 'Our commitment to accessibility for all users.',
    },
    {
      path: '/consumer-data',
      component: createElement(ConsumerDataPage),
      title: 'Consumer Health Data Notice — My Bare Method',
      description: 'How we handle and protect your consumer health data.',
    },
    {
      path: '/privacy-policy',
      component: createElement(PrivacyPolicyPage),
      title: 'Privacy Policy — My Bare Method',
      description: 'How My Bare Method collects, uses, and protects your personal information.',
    },
    {
      path: '/terms',
      component: createElement(TermsPage),
      title: 'Terms & Conditions — My Bare Method',
      description: 'Terms and conditions for using My Bare Method.',
    },
    {
      path: '/order-labs',
      component: createElement(OrderLabsPage),
      title: 'Order Labs — My Bare Method',
      description: 'Browse in-home and walk-in lab options for hormone therapy and wellness. Lab orders, payment, intake, and results are handled through GEN Health.',
    },
  ];

  for (const s of sections) {
    routes.push({
      path: `/section/${s.id}`,
      component: createElement(SectionPage, { sectionId: s.id, subFilter: undefined }),
      title: `${s.label} — My Bare Method`,
      description: s.description,
    });
  }

  for (const c of concerns) {
    routes.push({
      path: `/concern/${c.id}`,
      component: createElement(ConcernPage, { concernId: c.id }),
      title: `${c.label} — My Bare Method`,
      description: c.description,
    });
  }

  for (const g of goals) {
    routes.push({
      path: `/goal/${g.id}`,
      component: createElement(GoalsPage),
      title: `${g.label} — My Bare Method`,
      description: g.description,
    });
  }

  for (const p of products) {
    routes.push({
      path: `/product/${p.slug}`,
      component: createElement(ProductPage, { slug: p.slug }),
      title: `${p.displayName} — My Bare Method`,
      description: p.shortDescription,
      jsonLd: buildProductJsonLd(p),
    });
  }

  return routes;
}

function main() {
  const outDir = join(process.cwd(), 'dist');
  const templatePath = join(outDir, 'index.html');
  const template = readFileSync(templatePath, 'utf-8');
  const routes = buildRoutes();

  console.log(`Prerendering ${routes.length} routes...`);

  for (const route of routes) {
    try {
      const innerHtml = renderPage(route.component);
      const canonical = `${BASE_URL}${route.path === '/' ? '/' : route.path}`;
      const ogUrl = canonical;

      let html = template
        .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
        .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${route.description}"`)
        .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`)
        .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${route.title}"`)
        .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${route.description}"`)
        .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${ogUrl}"`);

      if (route.jsonLd) {
        html = html.replace('</head>', `${route.jsonLd}\n</head>`);
      }

      html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${innerHtml}</div>`
      );

      const filePath = route.path === '/' ? templatePath : join(outDir, route.path, 'index.html');
      const dir = dirname(filePath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(filePath, html);
      console.log(`  prerendered: ${route.path}`);
    } catch (err) {
      console.error(`  ERROR prerendering ${route.path}:`, err instanceof Error ? err.message : err);
    }
  }

  // Generate sitemap.xml (never include private /account/* portal routes)
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const route of routes) {
    if (route.path === '/account' || route.path.startsWith('/account/')) continue;
    const priority = route.path === '/' ? '1.0'
      : route.path.startsWith('/product/') ? '0.8'
      : (route.path.startsWith('/section/') || route.path.startsWith('/concern/') || route.path.startsWith('/goal/')) ? '0.7'
      : route.path.match(/\/(privacy|terms|refund|shipping|membership-terms|accessibility|consumer-data)/) ? '0.3'
      : '0.6';
    sitemap += `  <url><loc>${BASE_URL}${route.path}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>\n`;
  }
  sitemap += '</urlset>\n';
  writeFileSync(join(outDir, 'sitemap.xml'), sitemap);
  console.log(`  generated: sitemap.xml (${routes.length} URLs)`);

  console.log('Prerendering complete.');
}

main();
