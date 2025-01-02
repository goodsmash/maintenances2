import mixpanel from 'mixpanel-browser';

if (typeof window !== 'undefined' && import.meta.env.VITE_MIXPANEL_TOKEN) {
  mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
    debug: import.meta.env.MODE === 'development',
    track_pageview: true,
  });
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    mixpanel.track(eventName, properties);
    return { success: true };
  } catch (error) {
    console.error('Error tracking event:', error);
    return { success: false, error };
  }
};

export const setUserProfile = (userId: string, properties?: Record<string, any>) => {
  try {
    mixpanel.identify(userId);
    if (properties) {
      mixpanel.people.set(properties);
    }
    return { success: true };
  } catch (error) {
    console.error('Error setting user profile:', error);
    return { success: false, error };
  }
};
