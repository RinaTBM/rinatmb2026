import { useEffect, useState } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, navigate } from '@/router';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { BrandLogo } from '@/components/BrandLogo';
import { SHOP_CATEGORIES } from '@/lib/browse/productBrowse';

const categoryItems = SHOP_CATEGORIES.map(c => ({
  label: c.label,
  to: `/section/${c.id}`,
}));

export function Header() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopOpen, setShopOpen] = useState(false);
  const [shopSubmenu, setShopSubmenu] = useState<'category' | null>(null);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const searchResults = searchQuery.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.goals.some(g => g.includes(searchQuery.toLowerCase())) ||
        p.subcategory.includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const closeAll = () => {
    setMobileOpen(false);
    setShopOpen(false);
    setShopSubmenu(null);
    setMobileShopOpen(false);
    setMobileCategoryOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-cream-50/80 backdrop-blur-sm'
        }`}
      >
        <div className="container-lux">
          <div className="flex h-28 items-center justify-between md:h-32">
            <button
              className="lg:hidden text-ink-900 p-2 -ml-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <Link to="/" className="flex items-center group shrink-0" aria-label="My Bare Method home">
              <BrandLogo
                priority
                className="w-auto max-h-24 md:max-h-[120px] object-contain"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-7">
              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => { setShopOpen(false); setShopSubmenu(null); }}
              >
                <button
                  className="flex items-center gap-1 text-sm font-medium text-ink-800 hover:text-gold-600 transition-colors py-2"
                  onClick={() => setShopOpen(o => !o)}
                  aria-expanded={shopOpen}
                >
                  Shop
                  <ChevronDown size={14} className={`transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
                </button>
                {shopOpen && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                    <div className="w-56 rounded-2xl border border-cream-300 bg-white p-2 shadow-xl animate-scale-in">
                      <Link
                        to="/shop-all"
                        onClick={() => { setShopOpen(false); setShopSubmenu(null); }}
                        className="block rounded-lg px-4 py-2.5 text-sm font-medium text-ink-800 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                      >
                        Shop All
                      </Link>
                      <div
                        className="relative"
                        onMouseEnter={() => setShopSubmenu('category')}
                        onMouseLeave={() => setShopSubmenu(null)}
                      >
                        <button className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-ink-800 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                          Shop by Category
                          <ChevronRight size={14} />
                        </button>
                        {shopSubmenu === 'category' && (
                          <div className="absolute left-full top-0 ml-1">
                            <div className="w-64 rounded-2xl border border-cream-300 bg-white p-2 shadow-xl animate-scale-in">
                              {categoryItems.map(item => (
                                <Link
                                  key={item.to}
                                  to={item.to}
                                  onClick={() => { setShopOpen(false); setShopSubmenu(null); }}
                                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-ink-800 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/section/provider-care" className="text-sm font-medium text-ink-800 hover:text-gold-600 transition-colors">
                Provider Care
              </Link>
              <Link to="/section/accessories" className="text-sm font-medium text-ink-800 hover:text-gold-600 transition-colors">
                Accessories
              </Link>
              <Link to="/memberships" className="text-sm font-medium text-ink-800 hover:text-gold-600 transition-colors">
                Memberships
              </Link>
              <Link to="/contact" className="text-sm font-medium text-ink-800 hover:text-gold-600 transition-colors">
                Contact
              </Link>
              <Link to="/faq" className="text-sm font-medium text-ink-800 hover:text-gold-600 transition-colors">
                FAQs
              </Link>
            </nav>

            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-ink-800 hover:text-gold-600 transition-colors p-1"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                onClick={openCart}
                className="relative text-ink-800 hover:text-gold-600 transition-colors p-1"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex items-center justify-center rounded-full bg-gold-400 text-[10px] font-semibold text-ink-900" style={{ height: 18, width: 18 }}>
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-ink-950/40 backdrop-blur-sm animate-fade-in" onClick={() => setSearchOpen(false)}>
          <div className="bg-cream-50 px-5 py-6 md:py-8" onClick={e => e.stopPropagation()}>
            <div className="container-lux">
              <div className="flex items-center gap-3">
                <Search size={22} className="text-ink-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-lg text-ink-900 placeholder-ink-400 focus:outline-none"
                />
                <button onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X size={22} className="text-ink-500 hover:text-ink-900" />
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-6 space-y-2">
                  {searchResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); navigate(`/product/${p.slug}`); }}
                      className="flex w-full items-center gap-4 rounded-xl p-2 text-left hover:bg-cream-200 transition-colors"
                    >
                      <img src={p.image} alt={p.name} className="h-14 w-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-ink-900">{p.name}</p>
                        <p className="text-sm text-ink-500">{p.tagline}</p>
                      </div>
                      <span className="ml-auto font-medium text-ink-900">${p.price}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery.length > 1 && searchResults.length === 0 && (
                <p className="mt-6 text-ink-500">No products found. Try a different search.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={closeAll} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-cream-50 animate-slide-in overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-cream-300">
              <span className="font-serif text-lg font-medium">Menu</span>
              <button onClick={closeAll} aria-label="Close menu" className="p-2 -mr-2">
                <X size={22} />
              </button>
            </div>
            <nav className="p-5 space-y-1">
              <div>
                <button
                  onClick={() => setMobileShopOpen(o => !o)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-base font-medium text-ink-900 hover:bg-cream-200 transition-colors"
                  aria-expanded={mobileShopOpen}
                >
                  Shop
                  <ChevronDown size={18} className={`transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileShopOpen && (
                  <div className="ml-2 mt-1 space-y-0.5 border-l border-cream-300 pl-3">
                    <Link
                      to="/shop-all"
                      onClick={closeAll}
                      className="block rounded-lg px-4 py-3 text-sm font-medium text-ink-800 hover:bg-cream-200 hover:text-gold-700 transition-colors"
                    >
                      Shop All
                    </Link>
                    <div>
                      <button
                        onClick={() => setMobileCategoryOpen(o => !o)}
                        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-ink-800 hover:bg-cream-200 transition-colors"
                        aria-expanded={mobileCategoryOpen}
                      >
                        Shop by Category
                        <ChevronDown size={16} className={`transition-transform ${mobileCategoryOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileCategoryOpen && (
                        <div className="ml-2 mt-1 space-y-0.5 border-l border-cream-200 pl-3">
                          {categoryItems.map(item => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={closeAll}
                              className="block rounded-lg px-4 py-2.5 text-sm text-ink-700 hover:bg-cream-200 hover:text-gold-700 transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/section/provider-care"
                onClick={closeAll}
                className="block rounded-lg px-4 py-3.5 text-base font-medium text-ink-900 hover:bg-cream-200 transition-colors"
              >
                Provider Care
              </Link>
              <Link
                to="/section/accessories"
                onClick={closeAll}
                className="block rounded-lg px-4 py-3.5 text-base font-medium text-ink-900 hover:bg-cream-200 transition-colors"
              >
                Accessories
              </Link>
              <Link
                to="/memberships"
                onClick={closeAll}
                className="block rounded-lg px-4 py-3.5 text-base font-medium text-ink-900 hover:bg-cream-200 transition-colors"
              >
                Memberships
              </Link>
              <Link
                to="/contact"
                onClick={closeAll}
                className="block rounded-lg px-4 py-3.5 text-base font-medium text-ink-900 hover:bg-cream-200 transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/faq"
                onClick={closeAll}
                className="block rounded-lg px-4 py-3.5 text-base font-medium text-ink-900 hover:bg-cream-200 transition-colors"
              >
                FAQs
              </Link>

              <div className="space-y-1 border-t border-cream-300 pt-4 mt-4">
                <Link to="/best-sellers" onClick={closeAll} className="block rounded-lg px-4 py-3 text-sm text-ink-600 hover:bg-cream-200 transition-colors">
                  Best Sellers
                </Link>
                <Link to="/alacarte" onClick={closeAll} className="block rounded-lg px-4 py-3 text-sm text-ink-600 hover:bg-cream-200 transition-colors">
                  One-Time Purchase
                </Link>
                <Link to="/about" onClick={closeAll} className="block rounded-lg px-4 py-3 text-sm text-ink-600 hover:bg-cream-200 transition-colors">
                  About
                </Link>
                <Link to="/refund-policy" onClick={closeAll} className="block rounded-lg px-4 py-3 text-sm text-ink-600 hover:bg-cream-200 transition-colors">
                  Refund Policy
                </Link>
                <Link to="/track" onClick={closeAll} className="block rounded-lg px-4 py-3 text-sm text-ink-600 hover:bg-cream-200 transition-colors">
                  Track Order
                </Link>
                <Link to="/account" onClick={closeAll} className="block rounded-lg px-4 py-3 text-sm text-ink-600 hover:bg-cream-200 transition-colors">
                  Account
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
