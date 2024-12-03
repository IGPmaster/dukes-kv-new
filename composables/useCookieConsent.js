import { ref, onMounted } from 'vue';

export function useCookieConsent() {
  const showBanner = ref(true);
  const isPreferencesOpen = ref(false);
  const pendingTracker = ref(null);
  
  const preferences = ref({
    necessary: true,
    analytics: true,
    affiliate: true
  });

  const cookieCategories = [
    {
      id: 'necessary',
      label: 'Necessary Cookies',
      description: 'Essential for website functionality.',
      required: true
    },
    {
      id: 'analytics',
      label: 'Analytics Cookies',
      description: 'Help us improve our website performance',
      required: false
    },
    {
      id: 'affiliate',
      label: 'Affiliate Tracking',
      description: 'Required for crediting our partners when you visit gaming sites. This tracking is essential for our business operations and partner payments.',
      required: true
    }
  ];

  const getTrackerFromURL = () => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tracker');
  };

  const setAffiliateTracking = (tracker) => {
    if (tracker) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `affiliateTracker=${tracker}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    }
  };

  const saveToLocalStorage = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString()
    }));

    if (prefs.affiliate && pendingTracker.value) {
      setAffiliateTracking(pendingTracker.value);
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      affiliate: true
    };
    preferences.value = allAccepted;
    saveToLocalStorage(allAccepted);
    showBanner.value = false;
  };

  const handleDeclineAll = () => {
    const allDeclined = {
      necessary: true,
      analytics: false,
      affiliate: true
    };
    preferences.value = allDeclined;
    saveToLocalStorage(allDeclined);
    showBanner.value = false;
  };

  const savePreferences = () => {
    saveToLocalStorage(preferences.value);
    showBanner.value = false;
    isPreferencesOpen.value = false;
  };

  onMounted(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      const { preferences: savedPreferences } = JSON.parse(savedConsent);
      preferences.value = savedPreferences;
      showBanner.value = false;

      if (savedPreferences.affiliate) {
        const tracker = getTrackerFromURL();
        if (tracker) {
          setAffiliateTracking(tracker);
        }
      }
    } else {
      const tracker = getTrackerFromURL();
      if (tracker) {
        pendingTracker.value = tracker;
      }
    }
  });

  return {
    showBanner,
    isPreferencesOpen,
    preferences,
    cookieCategories,
    handleAcceptAll,
    handleDeclineAll,
    savePreferences
  };
} 