import { RudderAnalytics } from '@rudderstack/analytics-js';

export async function initializeAnalytics() {
  const rudderAnalytics = new RudderAnalytics();
  
  try {
    rudderAnalytics.load(
      import.meta.env.VITE_RUDDERSTACK_WRITE_KEY,
      import.meta.env.VITE_RUDDERSTACK_DATA_PLANE_URL,
      {
        integrations: { All: true },
        configUrl: 'https://api.rudderlabs.com'
      }
    );

    return new Promise((resolve) => {
      rudderAnalytics.ready(() => {
        console.log('RudderStack initialized');
        rudderAnalytics.page('Payment', 'Page View');
        resolve(rudderAnalytics);
      });
    });
  } catch (error) {
    console.error('RudderStack initialization failed:', error);
    throw error;
  }
}