import { ref, onMounted } from 'vue'
import { msgTranslate, loadTranslations } from '~/composables/globalData'

export function useTranslations() {
  const isLoaded = ref(false)
  const isLoading = ref(true)
  const error = ref(null)

  // Default translations for initial render
  const defaultTranslations = {
    home: 'Home',
    promotions: 'Promotions',
    legal: 'Legal',
    all_games: 'All Games',
    popular_games: 'Popular Games',
    slot_games: 'Slot Games',
    casino_games: 'Casino Games',
    jackpot_games: 'Jackpot Games',
    contact: 'Contact',
    login: 'Login',
    sign_up: 'Sign Up'
  }

  onMounted(async () => {
    try {
      isLoading.value = true
      // Set defaults first to avoid hydration mismatch
      msgTranslate.value = { ...defaultTranslations }
      
      await loadTranslations()
      isLoaded.value = true
    } catch (e) {
      error.value = e
      console.error('Translation loading error:', e)
    } finally {
      isLoading.value = false
    }
  })

  return {
    isLoaded,
    isLoading,
    error,
    msgTranslate
  }
}