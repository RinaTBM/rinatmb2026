import { useEffect } from 'react';
import { accountRobotsMeta } from '@/lib/auth/customerAccess';

/** Mark all /account/* pages as noindex,nofollow. */
export function useAccountNoIndex(title?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const created = !robots;
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    const prev = robots.content;
    robots.content = accountRobotsMeta();

    return () => {
      if (title) document.title = prevTitle;
      if (robots) {
        if (created) robots.remove();
        else robots.content = prev;
      }
    };
  }, [title]);
}
