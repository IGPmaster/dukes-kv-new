import { 
  loadLang, 
  loadTranslations, 
  fetchBrandContent,
  fetchFooterIcons,
  fetchFooterText,
  lang,
  fetchPromotions
} from '~/composables/globalData';

// Add loading state refs if they don't exist in globalData
import { ref } from 'vue';
export const isLoading = ref(true);
export const contentLoaded = ref(false);

export default defineNuxtPlugin(async () => {
  isLoading.value = true;

  try {
    // Load language and translations first
    await loadLang();
    await loadTranslations();

    // Then load other content in parallel
    await Promise.all([
      fetchBrandContent(),
      fetchPromotions(),
      fetchFooterIcons(lang.value),
      fetchFooterText(lang.value)
    ]);

  } catch (error) {
    console.error('Initialization error:', error);
    // You might want to handle errors differently
  } finally {
    isLoading.value = false;
    contentLoaded.value = true;
  }
}); 