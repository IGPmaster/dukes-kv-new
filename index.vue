<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Content -->
    <template v-else>
      <MainBanner />
      <NewGames />

      <!-- Content and Promotions Section -->
      <div class="section px-5 bg-tertiary_dark">
        <!-- Promo Over Section -->
        <div v-if="brandContent?.[0]" 
             class="container py-10 mx-auto text-primary">
          <div v-if="brandContent[0].acf?.promo_over" 
               v-html="brandContent[0].acf.promo_over" 
               class="leading-relaxed">
          </div>
        </div>

        <!-- KV Promotions Grid -->
        <div v-if="promotionsData?.length > 0" class="container mx-auto py-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            <div v-for="promotion in promotionsData" :key="promotion.id">
              <div class="card overflow-hidden rounded-lg leading-relaxed">
                <div class="card-image">
                  <NuxtLink :to="`/promotion/${promotion.slug}`">
                    <img 
                      class="activator w-full h-auto hidden md:block" 
                      :src="promotion.images?.desktop?.url" 
                      loading="lazy"
                      :alt="promotion.images?.desktop?.alt"
                      :title="promotion.title"
                    >
                    <img 
                      class="activator w-full h-auto md:hidden" 
                      :src="promotion.images?.mobile" 
                      loading="lazy"
                      :alt="promotion.title"
                      :title="promotion.title"
                    >
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PP Promotions Grid -->
        <div v-if="pp_promotions?.length > 0" class="container mx-auto py-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
            <div v-for="promo in pp_promotions" :key="promo.code">
              <div class="card overflow-hidden rounded-lg leading-relaxed">
                <div class="card-image">
                  <a :href="regLink">
                    <img 
                      class="activator w-full h-auto" 
                      :src="promo.bigImageUrl" 
                      loading="lazy"
                      :alt="'Image of ' + promo.title + ' promotion.'"
                      :title="promo.title + ', ' + promo.subTitle"
                    >
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Promo Under Section -->
        <div v-if="brandContent?.[0]" class="py-10">
          <div class="container mx-auto py-2 info_content hide_this">
            <div v-if="brandContent[0].acf?.promo_under" 
                 class="text-primary" 
                 v-html="brandContent[0].acf.promo_under">
            </div>
          </div>
        </div>
      </div>

      <PopularGames />
      <SlotGames />
      <CasinoGames />
      <JackpotGames />

      <div class="container mx-auto py-10">
        <div class="px-4">
          <div class="text-sm text-primary">
            <div v-if="brandContent?.[0]?.acf?.main_content" 
                 v-html="brandContent[0].acf.main_content">
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  WHITELABEL_ID,
  brandContent,
  promotionsData,
  pp_promotions,
  regLink, 
  fetchBrandContent,
  fetchPromotions,
  fetchApiPromotions
} from '~/composables/globalData';

const brandId = computed(() => WHITELABEL_ID);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // Fetch all data in parallel
    await Promise.all([
      fetchBrandContent(),
      fetchPromotions(),
      fetchApiPromotions()
    ]);
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.hide_this :deep(h2) {
  display: none;
}
</style>
