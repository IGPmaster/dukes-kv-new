<template>
  <div class="section-even lg:py-10">
    <div class="row bg-primary_bg lg:mb-4 pt-20">
      <div class="container grid grid-cols-1 lg:grid-cols-8 lg:gap-10 items-center mx-auto p-4">
        <div class="col-span-full lg:col-span-6">
          <p class="gamesSectionHead text-center lg:text-left text-3xl text-primary py-4 px-4">
            {{ msgTranslate.scratchcards_games }}
          </p>
          <!-- Single info block instead of v-for -->
          <div class="info_content text-primary font-extralight py-5 px-4">
            {{ brandContent?.[0]?.acf?.scratch_games_info }}
          </div>
        </div>
        <div class="lg:block lg:col-span-2 p-4">
          <div class="flex justify-between items-center">
            <a :href="regLink" 
               class="bg-secondary_bg w-full rounded-md py-3 flex text-secondary hover:text-primary hover:bg-tertiary_dark uppercase cursor-pointer transition ease-in-out duration-500 hover:scale-110">
              <span class="text-center w-full">{{ msgTranslate.sign_up }}</span>
              <i class="material-icons items-center pr-2 font-extralight">arrow_forward</i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Games Grid -->
    <div class="px-4 sm:px-6 lg:px-0 py-10">
      <div class="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="game in scratchGames" :key="game.id" :class="'item ' + game.id">
          <div class="show show-first first-content-border">
            <a :href="regLink" target="_blank">
              <img 
                style="min-width: 100%;"
                class="responsive-img item-qqq" 
                :src="game.image"
                loading="lazy"
                @error="game.image = 'newGameImg.jpg'"
                :alt="'Image of ' + game.gameName + ' online slot. ' + game.description"
                :title="game.gameName + ' - ' + game.id" 
              />
            </a>
            <div class="mask">
              <a :href="regLink" target="_blank">
                <div class="gameDescr">
                  <div v-if="game?.description">{{ game.description }}</div>
                  <i v-else class="large material-icons">play_arrow</i>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useHead } from '#imports';
import { 
  scratchGames, 
  msgTranslate, 
  regLink, 
  loginLink,
  brandContent,
  fetchBrandContent,
  fetchGames,
  loadTranslations, 
  loadLang 
} from '~/composables/globalData';
import { WHITELABEL_ID } from '~/composables/globalData'
const brandId = computed(() => WHITELABEL_ID)

// Loading state
const loading = ref(true);

// Add watcher for debugging
watch(brandContent, (newVal) => {
  console.log('brandContent updated:', newVal);
  console.log('scratch_games_info:', newVal?.[0]?.acf?.scratch_games_info);
}, { deep: true });

// Handle data fetching
onMounted(async () => {
  console.log('Component mounted');
  try {
    loading.value = true;
    await Promise.all([
      fetchGames(),
      fetchBrandContent(),
      loadTranslations(loadLang())
    ]);
    console.log('Data fetched:', {
      brandContent: brandContent.value,
      games: scratchGames.value
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
});

useHead(() => ({
  title: brandContent.value?.[0]?.yoast_head_json?.title || 'Scratchcards - Hippozino',
  meta: [
    { 
      hid: 'description', 
      name: 'description', 
      content: brandContent.value?.[0]?.yoast_head_json?.description || 
               'Explore the best scratchcard games available!'
    },
    { 
      name: 'keywords', 
      content: brandContent.value?.[0]?.yoast_head_json?.focus_keywords || 
               'scratchcards, games, casino'
    }
  ]
}));
</script>
```

<style scoped>

</style>