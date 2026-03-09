import { useState, useEffect } from 'react';

/**
 * Returns true when the install button should be shown:
 * - Device is mobile (iOS or Android)
 * - App is NOT already installed (not running in standalone / fullscreen PWA mode)
 */
export function useShowInstallButton(): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only runs in browser
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod/.test(ua) || 
      (navigator.maxTouchPoints > 1 && /macintosh/.test(ua)); // iPad with desktop UA

    // Check if already installed (standalone PWA or added to home screen)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true);

    setShow(isMobile && !isStandalone);
  }, []);

  return show;
}
