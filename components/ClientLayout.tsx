'use client';

import { useEffect, ReactNode } from 'react';
import { reportWebVitals } from '@/lib/reportWebVitals';

export default function ClientLayout({ children }: { children: ReactNode }) {
  // 🧠 Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('🆕 Service Worker registered'))
        .catch((err) => console.error('SW registration failed:', err));
    }
  }, []);

  // 🧠 Core Web Vitals reporting
  useEffect(() => {
    reportWebVitals();
  }, []);

  return <>{children}</>;
}
