import { ref, onMounted } from 'vue';
import { PP_LOBBY_LINK } from './globalData';

export function useCookieConsent() {
  const showBanner = ref(false);
  const isPreferencesOpen = ref(false);
  const pendingTracker = ref(null);
  
  const regLink = ref('');
  const loginLink = ref('');
  const playLink = ref('');
  
  const preferences = ref({
    necessary: true,
    analytics: false,
    affiliate: true
  });

  const cookieCategories = [
    {
      id: 'necessary',
      label: 'Necessary Cookies',
      description: 'Essential for website functionality. These cookies are required and cannot be disabled.',
      required: true
    },
    {
      id: 'analytics',
      label: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website. These cookies collect anonymous information.',
      required: false
    },
    {
      id: 'affiliate',
      label: 'Affiliate Tracking',
      description: 'Essential for our business operations. We use a unique identifier stored for 30 days to credit our partners when you visit gaming sites. No personal data is collected.',
      required: true
    }
  ];

  const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getTrackerFromURL = () => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tracker');
  };

  const setAffiliateTracking = (tracker) => {
    if (!tracker || !preferences.value.affiliate) return;
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    const formattedDate = expiryDate.toISOString().split('T')[0];
    
    document.cookie = `affiliateTracker=${tracker}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; max-age=${30*24*60*60}`;
    
    updateLobbyLinks(tracker);
  };

  const updateLobbyLinks = (tracker) => {
    console.log('Updating lobby links with tracker:', tracker);
    
    if (!tracker) {
      tracker = getTrackerFromURL() || getCookie('affiliateTracker');
    }
    
    const queryString = tracker ? `?tracker=${tracker}` : '';
    
    regLink.value = `${PP_LOBBY_LINK}${queryString}#registration`;
    loginLink.value = `${PP_LOBBY_LINK}${queryString}#login`;
    playLink.value = `${PP_LOBBY_LINK}${queryString}#play/`;
  };

  const clearNonEssentialCookies = () => {
    if (typeof document === 'undefined') return;
    
    const cookiesToKeep = ['PHPSESSID'];
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!cookiesToKeep.includes(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      }
    });
  };

  const saveToLocalStorage = (prefs) => {
    clearNonEssentialCookies();

    localStorage.setItem('cookieConsent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));

    if (prefs.affiliate) {
      const urlTracker = getTrackerFromURL();
      const trackerToUse = urlTracker || pendingTracker.value;
      if (trackerToUse) {
        setAffiliateTracking(trackerToUse);
      } else {
        const existingTracker = getCookie('affiliateTracker');
        updateLobbyLinks(existingTracker);
      }
    } else {
      updateLobbyLinks(null);
    }

    if (prefs.analytics) {
      const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
      if (dnt !== "1" && dnt !== "yes") {
        // Initialize analytics
      }
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

  const clearAllStorage = () => {
    if (typeof window === 'undefined') return;
    
    // Clear cookies
    const cookiesToKeep = ['PHPSESSID'];
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!cookiesToKeep.includes(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      }
    });

    // Clear localStorage except for essential items
    const localStorageKeep = ['cookieConsent'];
    Object.keys(localStorage).forEach(key => {
      if (!localStorageKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage completely
    sessionStorage.clear();
  };

  const handleDeclineAll = () => {
    const allDeclined = {
      necessary: true,
      analytics: false,
      affiliate: false
    };
    preferences.value = allDeclined;
    clearAllStorage();
    saveToLocalStorage(allDeclined);
    showBanner.value = false;
  };

  const savePreferences = () => {
    const finalPreferences = {
      ...preferences.value,
      necessary: true
    };
    preferences.value = finalPreferences;
    saveToLocalStorage(finalPreferences);
    showBanner.value = false;
    isPreferencesOpen.value = false;
  };

  const handleOpenPreferences = () => {
    if (!localStorage.getItem('cookieConsent')) {
      preferences.value = {
        necessary: true,
        analytics: true,
        affiliate: true
      };
    }
    isPreferencesOpen.value = true;
  };

  const getConsentStatus = () => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) return null;
    
    try {
      return JSON.parse(savedConsent);
    } catch (e) {
      return null;
    }
  };

  const withdrawConsent = () => {
    clearAllStorage();
    localStorage.removeItem('cookieConsent');
    preferences.value = {
      necessary: true,
      analytics: false,
      affiliate: false
    };
    updateLobbyLinks(null);
    showBanner.value = true;
  };

  onMounted(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    
    if (savedConsent) {
      try {
        const { preferences: savedPreferences } = JSON.parse(savedConsent);
        preferences.value = {
          ...savedPreferences,
          necessary: true
        };
        
        if (savedPreferences.affiliate) {
          const urlTracker = getTrackerFromURL();
          if (urlTracker) {
            setAffiliateTracking(urlTracker);
          } else {
            const existingTracker = getCookie('affiliateTracker');
            if (existingTracker) {
              updateLobbyLinks(existingTracker);
            } else {
              updateLobbyLinks(null);
            }
          }
        } else {
          clearNonEssentialCookies();
          updateLobbyLinks(null);
        }
        
        showBanner.value = false;
      } catch (e) {
        console.error('Error parsing saved consent:', e);
        clearNonEssentialCookies();
        localStorage.removeItem('cookieConsent');
        showBanner.value = true;
        updateLobbyLinks(null);
      }
    } else {
      const tracker = getTrackerFromURL();
      if (tracker) {
        pendingTracker.value = tracker;
      }
      updateLobbyLinks(null);
      showBanner.value = true;
    }
  });

  return {
    showBanner,
    isPreferencesOpen,
    preferences,
    cookieCategories,
    handleAcceptAll,
    handleDeclineAll,
    savePreferences,
    handleOpenPreferences,
    withdrawConsent,
    getConsentStatus,
    regLink,
    loginLink,
    playLink
  };
} 