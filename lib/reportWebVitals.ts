// 🆕 Added: Core Web Vitals Reporting
export function reportWebVitals() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getLCP(console.log);
      getFCP(console.log);
      getTTFB(console.log);
    });
  }
}
