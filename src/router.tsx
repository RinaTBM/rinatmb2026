import { useEffect, useState, useCallback } from 'react';

export interface Route {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

function parseLocation(): Route {
  const hash = window.location.hash.slice(1);
  // Support legacy hash URLs: #/product/foo -> /product/foo
  let full = hash || window.location.pathname;
  if (full.startsWith('#')) full = full.slice(1);
  if (!full.startsWith('/')) full = '/' + full;

  const [path, queryString] = full.split('?');
  const query: Record<string, string> = {};
  if (queryString) {
    new URLSearchParams(queryString).forEach((v, k) => { query[k] = v; });
  }
  return { path: path || '/', params: {}, query };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseLocation);

  useEffect(() => {
    const onChange = () => {
      setRoute(parseLocation());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onChange);
    window.addEventListener('hashchange', onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener('hashchange', onChange);
    };
  }, []);

  return route;
}

export function navigate(path: string) {
  if (path.startsWith('#')) {
    window.location.hash = path;
  } else {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  // Ensure new account/storefront views start at the top (some browsers ignore
  // scroll on synthetic popstate when navigate is called during render).
  window.scrollTo(0, 0);
}

export function Link({
  to,
  children,
  className,
  onClick,
  style,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow modifier-clicks / middle-click to open in new tab naturally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.();
    navigate(to);
  }, [onClick, to]);

  return (
    <a
      href={to}
      className={className}
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
