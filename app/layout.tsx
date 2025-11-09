import './globals.css';
import { Suspense } from 'react';
import ClientLayout from '@/components/ClientLayout'; // 🆕 move client logic here

export const metadata = {
  title: 'Performance Dashboard',
  description: 'Real-time data visualization with 10,000+ points at 60fps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Performance Dashboard</h1>
          <p>Real-time data visualization with 10,000+ points at 60fps</p>
        </header>

        {/* 🆕 Suspense for streaming UI */}
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading Dashboard...</div>}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
