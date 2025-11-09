export function reportWebVitals() {
  if (typeof window !== 'undefined') {
    // Import loosely typed to avoid TypeScript mismatches
    import('web-vitals').then((webVitals: any) => {
      const { onCLS, onFID, onLCP, onFCP, onTTFB } = webVitals;
      if (onCLS) onCLS(console.log);
      if (onFID) onFID(console.log);
      if (onLCP) onLCP(console.log);
      if (onFCP) onFCP(console.log);
      if (onTTFB) onTTFB(console.log);
    });
  }
}
