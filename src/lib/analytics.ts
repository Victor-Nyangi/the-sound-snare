// Simple analytics utility
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    // Send to analytics service (replace with your preferred service)
    console.log('Page view:', url);
    
    // Example: Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  }
};

export const trackEvent = (action: string, category: string, label?: string) => {
  if (typeof window !== 'undefined') {
    console.log('Event:', { action, category, label });
    
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  }
};

// Performance monitoring
export const measurePageLoad = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      console.log('Page load time:', loadTime);
      trackEvent('page_load', 'performance', `${loadTime}ms`);
    });
  }
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
} 