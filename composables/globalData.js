import { ref } from 'vue';

export const lang = ref('');
export const tracker = ref('');
export const jurisdictionCode = ref('');
export const footerIcons = ref([]);
export const footerText = ref([]);
export const globalContent = ref({
  'About Us': 'aboutus',
  'Terms and conditions': 'terms',
  'Privacy Policy': 'privacy',
  'Bonus Policy': 'bonus',
  'Responsible Gaming': 'responsible',
  'Licence': 'license',
  'Payouts': 'payouts',
  'Depositing': 'deposits',
  'Cashing Out': 'withdrawals',
  'FAQ': 'faq',
  'Contact Us': 'contact',
});



// ProgressPlay data:
export const WHITELABEL_ID = 30;
export const PP_API_URL = 'https://prd-api.casino-pp.net/CmSHelper/';
const PP_PROMOTIONS_API = `${PP_API_URL}GetPromotionsInfo?whitelabelId=${WHITELABEL_ID}&country=`;
const PP_LOBBY_LINK = 'https://dukescasino.casino-pp.net/';
//const KV_GAMES = `https://content.progressplay.net/api23/api/game?whitelabelId=${WHITELABEL_ID}`; // Test API


// WP-REST-API:
const WP_API = 'https://headless.betdukes.com/wp-json/wp/v2/';

//CloudFlare Workers KV data:
const KV_WORKER_URL = 'https://worker-casino-brands.tech1960.workers.dev/';
const PROMOTIONS_WORKER_URL = 'https://casino-promotions-api.tech1960.workers.dev';
const PAGES_WORKER_URL = 'https://casino-pages-api.tech1960.workers.dev';
export const KV_GAMES = 'https://access-ppgames.tech1960.workers.dev/';
export const FILTERED_BY_NAME_KV = 'https://access-filterbyname.tech1960.workers.dev/';
const CF_GEO_WORKER = 'https://cf-geo-lookup.tech1960.workers.dev/';
const KV_SUPPORTED_COUNTRIES = "https://access-supportedcountries.tech1960.workers.dev/";
const IGP_SUPPORTED_COUNTRIES = "https://igp-supported-countries.tech1960.workers.dev/";
const KV_TRANSLATIONS ="https://access-translations.tech1960.workers.dev/";

const brandContent = ref([]); // renamed from promotionsPosts
const promotionsData = ref([]); // new ref for KV promotions
const games = ref([]);
const newGames = ref([]);
const filterByName = ref([]);
const popularGames = ref([]);
const casinoGames = ref([]);
const jackpotGames = ref([]);
const slotGames = ref([]);
const liveGames = ref([]);
const scratchGames = ref([]);
const blackjackGames = ref([]);
const rouletteGames = ref([]);
const regLink = ref([null]);
const loginLink = ref([null]);
const playLink = ref([null]);
const msgTranslate = ref({});
const pp_promotions = ref([]);
const promotionsPosts = ref([]);
const countryCode = ref('');
const countryName = ref('');
const countries = ref('');
const country = ref('');
const countryNotSupported = ref(false);
const countriesData = ref([]);
const blogPosts = ref([]);
const editorialContent = ref([]);

export async function checkCountry() {
  try {
    const workerResponse = await fetch(CF_GEO_WORKER);
    const workerData = await workerResponse.json();
    const countryCodeValue = workerData.countryCode;

    if (!countryCode.value.includes(countryCodeValue)) {
      countryName.value = workerData.countryName;
      countryNotSupported.value = true;
    }
  } catch (error) {
    console.error('Error checking country:', error);
  }
}

export async function loadLang() {
  if (typeof window !== 'undefined') {
    try {
      // 1. Get user's country from CF_GEO_WORKER
      const workerResponse = await fetch(CF_GEO_WORKER);
      const workerData = await workerResponse.json();
      const userCountry = workerData.countryCode;
      
      // 2. Get IGP language mappings
      const igpResponse = await fetch(IGP_SUPPORTED_COUNTRIES);
      const IGP_SUPPORTED_COUNTRIES_KV = await igpResponse.json();

      // 3. Simple language resolution
      let langValue = 'CA'; // Default fallback
      let foundGroup = null;

      // Find which group the country belongs to
      for (const [group, countries] of Object.entries(IGP_SUPPORTED_COUNTRIES_KV)) {
        if (countries.includes(userCountry)) {
          foundGroup = group;
          // Special handling for different groups
          switch(group) {
            case 'ES':  // Spanish group - use ES for all
            case 'FI':  // Finnish - use FI
            case 'JP':  // Japanese - use JP
            case 'PT':  // Portuguese - use PT
              langValue = group;
              break;
            case 'EU':  // EU countries - use IE as content source
              langValue = 'IE';
              break;
            case 'EN':  // English group - use their specific country code
              langValue = userCountry;
              break;
            default:
              langValue = userCountry;
          }
          break;
        }
      }

      // Set language and cookie
      lang.value = langValue;
      setCookie('lang', langValue, 30, 'None', true);

      await fetchCountry();

    } catch (error) {
      console.error('❌ Error in loadLang:', error);
      lang.value = 'CA';  // Ultimate fallback
      setCookie('lang', 'CA', 30, 'None', true);
      await fetchCountry();
    }
  }
}

export async function fetchBlogPosts() {
  try {
    const response = await fetch(
      `${PAGES_WORKER_URL}/api/pages?brandId=${WHITELABEL_ID}&lang=${lang.value}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    // Filter for blog template and published status
    blogPosts.value = posts.filter(post => 
      post.template === 'blog' && 
      post.status === 'published'
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    blogPosts.value = [];
  }
}

export async function fetchEditorialContent() {
  try {
    const response = await fetch(
      `${PROMOTIONS_WORKER_URL}/pages?brandId=${WHITELABEL_ID}&lang=${lang.value}&template=editorial`
    );
    if (!response.ok) throw new Error('Failed to fetch editorial content');
    
    const content = await response.json();
    editorialContent.value = content.filter(post => post.status === 'published');
  } catch (error) {
    console.error('Error fetching editorial content:', error);
    editorialContent.value = [];
  }
}

export async function loadTranslations() {
  try {
    // Special handling for direct language codes
    if (['ES', 'JP', 'FI', 'PT'].includes(lang.value)) {
      const langCode = lang.value.toLowerCase();
      const translationsResponse = await fetch(`${KV_TRANSLATIONS}?lang=${langCode}`);
      const allTranslations = await translationsResponse.json();
      msgTranslate.value = allTranslations;
      return;
    }

    // For country codes and EU countries
    const response = await fetch(IGP_SUPPORTED_COUNTRIES);
    const IGP_SUPPORTED_COUNTRIES_KV = await response.json();
    let langCode = 'en'; // Default to English

    // Check if country is in a language group
    let foundInGroup = false;
    for (const [group, countries] of Object.entries(IGP_SUPPORTED_COUNTRIES_KV)) {
      if (countries.includes(lang.value)) {
        switch(group) {
          case 'EU':
            langCode = 'en';  // EU countries use English translations
            break;
          case 'EN':
            langCode = 'en';  // English-speaking countries
            break;
          default:
            langCode = group.toLowerCase();
        }
        foundInGroup = true;
        break;
      }
    }

    const translationsResponse = await fetch(`${KV_TRANSLATIONS}?lang=${langCode}`);
    const allTranslations = await translationsResponse.json();
    msgTranslate.value = allTranslations;

  } catch (error) {
    // Fallback to English
    try {
      const fallbackResponse = await fetch(`${KV_TRANSLATIONS}?lang=en`);
      const fallbackTranslations = await fallbackResponse.json();
      msgTranslate.value = fallbackTranslations;
    } catch (fallbackError) {
      // Set some basic translations as ultimate fallback
      msgTranslate.value = {
        login: 'Login',
        sign_up: 'Sign Up',
      };
    }
  }
}

async function fetchCountry() {
  try {
    const response = await fetch(KV_SUPPORTED_COUNTRIES);
    if (!response.ok) {
      throw new Error(`Failed to fetch country data (status ${response.status})`);
    }
    const data = await response.json();
    const country = data.find(c => c.countryIntlCode === lang.value);
    if (country) {
      jurisdictionCode.value = country.jurisdictionCode;
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
  await loadTranslations();
}



async function fetchApiPromotions() {
  try {
    const response = await fetch(`${PP_API_URL}GetPromotionsInfo?whitelabelId=${WHITELABEL_ID}&country=${lang.value}`);
    const data = await response.json();
    pp_promotions.value = data;
  } catch (error) {
    console.error(error);
  }
}

// Rename this to reflect what it actually does
export async function fetchBrandContent() {
  try {
    // Try current language first
    let response = await fetch(`${KV_WORKER_URL}content/${WHITELABEL_ID}/${lang.value}`);
    let data = null;

    if (response.ok) {
      data = await response.json();
    } else {
      // Modified fallback order - IE first for EU countries
      const fallbackLangs = ['IE', 'EN', 'CA'];
      
      for (const fallbackLang of fallbackLangs) {
        if (fallbackLang === lang.value) continue;
        
        response = await fetch(`${KV_WORKER_URL}content/${WHITELABEL_ID}/${fallbackLang}`);
        
        if (response.ok) {
          data = await response.json();
          break;
        }
      }
    }

    if (data && (data.acf || data.brand_info)) {
      brandContent.value = [{
        id: `${WHITELABEL_ID}-${lang.value}`,
        acf: {
          ...data.acf,
          image_full: data.acf.image_full || '',
          image_small: data.acf.image_small || '',
        },
        brand_info: data.brand_info || {},
        yoast_head_json: data.yoast_head_json || {}
      }];
    } else {
      brandContent.value = [];
    }

  } catch (error) {
    brandContent.value = [];
  }
}

// Add new function for actual promotions
export async function fetchPromotions() {
  try {

    
    const response = await fetch(
      `${PROMOTIONS_WORKER_URL}/promotions?brandId=${WHITELABEL_ID}&lang=${lang.value}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch promotions');
    }

    const promotions = await response.json();
    promotionsData.value = promotions.filter(promo => promo.status === 'active');
    

    
  } catch (error) {
    console.error('Error fetching promotions:', error);
    promotionsData.value = [];
  }
}

// Function to get a single promotion
export async function fetchPromotion(slug) {
  try {
    // First check if we already have the promotion in our state
    const found = promotionsData.value.find(p => p.slug === slug);
    if (found) return found;

    // If not, fetch all promotions (they might have been updated)
    await fetchPromotions();
    
    return promotionsData.value.find(p => p.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching single promotion:', error);
    return null;
  }
}

export async function fetchFilterByName() {
  try {
    const response = await fetch(FILTERED_BY_NAME_KV);
    const data = await response.json();
    filterByName.value = data;
  } catch (error) {
    console.error('Error fetching filterByName:', error);
  }
}

async function fetchGames() {
  try {
    await fetchFilterByName();
    const response = await fetch(KV_GAMES);
    const data = await response.json();

    // Add your logic for processing the games data here
    const filteredGames = data.filter(game => {
      const hasName = filterByName.value.some(name => game.gameName.toLowerCase().includes(name.toLowerCase()));
      const hasId = filterByName.value.some(id => game.gameId == id);

      // Check for jurisdictionCode and excluded countries
      const isExcludedJurisdiction = game.excludedJurisdictions?.includes(jurisdictionCode.value);
      const isExcludedCountry = game.excludedCountries?.includes(lang.value);

      return !(hasName || hasId || isExcludedJurisdiction || isExcludedCountry);
    });

    games.value = filteredGames;
    newGames.value = filteredGames.filter(game => game.gameFilters?.includes('New'));
    popularGames.value = filteredGames.filter(game => game.gameFilters?.includes('Featured'));
	  casinoGames.value = filteredGames.filter(game => game.gameType?.includes('Casino'));
	  slotGames.value = filteredGames.filter(game => game.gameType?.includes('Slots'));
	  jackpotGames.value = filteredGames.filter(game => game.gameType?.includes('Jackpots'));
	  liveGames.value = filteredGames.filter(game => game.gameType?.includes('Live'));
	  scratchGames.value = filteredGames.filter(game => game.gameName?.toLowerCase().includes('scratch'));
    blackjackGames.value = filteredGames.filter(game => game.gameFilters?.includes('Blackjack'));
	  rouletteGames.value = filteredGames.filter(game => game.gameFilters?.includes('Roulette'));

      async function updateLinks() {
  const tracker = await handleParameter('tracker');
  const btag = await handleParameter('btag');
  const affid = await handleParameter('affid');
  const lang = getCookie('lang');

  const queryStringParams = [
    tracker ? `tracker=${tracker}` : '',
    btag ? `btag=${btag}` : '',
    affid ? `affid=${affid}` : '',
  ].filter(param => param !== '').join('&'); // Join only the non-empty parameters

  regLink.value = `${PP_LOBBY_LINK}${queryStringParams ? '?' + queryStringParams : ''}#registration`;
  loginLink.value = `${PP_LOBBY_LINK}${queryStringParams ? '?' + queryStringParams : ''}#login`;
  playLink.value = `${PP_LOBBY_LINK}${queryStringParams ? '?' + queryStringParams : ''}#play/`;
}

    await updateLinks();

  } catch (error) {
    console.error('Error fetching games:', error);
  }
}

export async function handleParameter(parameterName) {
  const params = new URLSearchParams(window.location.search);
  const parameterFromURL = params.get(parameterName);
  const parameterFromCookie = getCookie(parameterName);

  if (parameterFromURL) {
    setCookie(parameterName, parameterFromURL, 30, 'None', true);
    return parameterFromURL;
  } else if (parameterFromCookie) {
    return parameterFromCookie;
  } else {
    return ''; // Return an empty string if the parameter is not found in the URL or cookies
  }
}

export async function fetchSupportedCountries() {
  const response = await fetch(IGP_SUPPORTED_COUNTRIES);
  return await response.json();
}



// globalData.js
const footerIconsCache = new Map();
const footerTextCache = new Map();

export async function fetchFooterIcons(lang) {
  if (footerIconsCache.has(lang)) {
    footerIcons.value = footerIconsCache.get(lang);
  } else {
    const response = await fetch(`${PP_API_URL}GetInfoContentByCode?whitelabelId=${WHITELABEL_ID}&country=${lang}&code=footericon`);
    const data = await response.json();
    footerIcons.value = data;
    footerIconsCache.set(lang, data);
  }
}

export async function fetchFooterText(lang) {
  if (footerTextCache.has(lang)) {
    footerText.value = footerTextCache.get(lang);
  } else {
    const response = await fetch(`${PP_API_URL}GetInfoContentByCode?whitelabelId=${WHITELABEL_ID}&country=${lang}&code=footertext`);
    const data = await response.json();
    footerText.value = data;
    footerTextCache.set(lang, data);
  }
}



function setCookie(name, value, days, sameSite, secure) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  const sameSiteAttribute = sameSite ? '; SameSite=' + sameSite : '';
  const secureAttribute = secure ? '; Secure' : '';
  document.cookie = name + '=' + (value || '') + expires + sameSiteAttribute + secureAttribute + '; path=/';
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export async function fetchCountriesData() {
  try {
    const IGP_SUPPORTED_COUNTRIES_KV = await fetchSupportedCountries();
    const countries = [];

    for (const [language, countryCodes] of Object.entries(IGP_SUPPORTED_COUNTRIES_KV)) {
      for (const countryCode of countryCodes) {
        try {
          countries.push({
            name: countryCode,
            code: countryCode,
            language: language,
            // Since REST_COUNTRY_KV is commented out, we'll use simple flags
            flagUrl: `/flags/${countryCode.toLowerCase()}.svg`
          });
        } catch (error) {
          console.error(`Error processing country ${countryCode}:`, error);
          continue;
        }
      }
    }

    return countries.filter(country => country.language !== '');
  } catch (error) {
    console.error('Error in fetchCountriesData:', error);
    return [];
  }
}


export { 
    brandContent,
    promotionsData,
    games,
    blogPosts, 
    fetchApiPromotions, 
    newGames, 
    popularGames, 
    jackpotGames, 
    casinoGames, 
    slotGames, 
    scratchGames, 
    liveGames,
    blackjackGames,
    rouletteGames,
    regLink,
    loginLink,
    playLink,
    msgTranslate,
    pp_promotions,
    promotionsPosts,
    countryCode,
    countryName,
    countries,
    country,
    countriesData,
    countryNotSupported,
    fetchGames,
    getCookie, 
    setCookie, 
};