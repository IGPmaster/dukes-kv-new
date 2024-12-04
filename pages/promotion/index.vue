<template>
  <div class="pt-24 bg-gradient-to-b from-primary_bg to-tertiary_dark min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <h3 class="mt-2 text-lg font-medium text-gray-300">Unable to load promotions</h3>
          <p class="mt-1 text-sm text-gray-400">Please try again later.</p>
        </div>
      </div>

      <!-- Promotions Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Promotion Card -->
        <div v-for="promo in promotions" :key="promo.slug" 
             class="bg-tertiary_dark rounded-lg overflow-hidden shadow-lg flex flex-col">
          <!-- Card Image -->
          <div class="relative aspect-[16/9] overflow-hidden">
            <img 
              :src="getImageUrl(promo.images?.desktop?.url)" 
              :alt="promo.images?.desktop?.alt || promo.title"
              class="w-full h-full object-cover"
            />
            <!-- Status Badge -->
            <div v-if="promo.status" 
                 :class="{
                   'absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold': true,
                   'bg-green-500 text-white': promo.status === 'active',
                   'bg-yellow-500 text-white': promo.status === 'scheduled',
                   'bg-gray-500 text-white': promo.status === 'expired'
                 }">
              {{ promo.status }}
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-6 flex-grow">
            <h3 class="text-xl font-bold text-primary mb-2">{{ promo.title }}</h3>
            <p v-if="promo.content?.short_description" 
               class="text-gray-400 mb-4 line-clamp-3">
              {{ promo.content.short_description }}
            </p>
            
            <!-- Promotion Type -->
            <div v-if="promotionTypeDisplay(promo.type)" 
                 class="mb-4">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                {{ promotionTypeDisplay(promo.type) }}
              </span>
            </div>

            <!-- Validity Period -->
            <div v-if="promo.valid_from" class="text-sm text-gray-400 mb-4">
              Valid from: {{ formatDate(promo.valid_from) }}
              <span v-if="promo.valid_to">
                to {{ formatDate(promo.valid_to) }}
              </span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="p-6 pt-0">
            <NuxtLink 
              :to="`/promotion/${promo.slug}`"
              class="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium rounded-md text-white bg-secondary hover:bg-secondary/90 transition-colors duration-200"
            >
              View Details
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHead } from '#imports';
import { fetchPromotions, promotionsData } from '~/composables/globalData';

const loading = ref(true);
const error = ref(false);
const promotions = ref([]);

const getImageUrl = (url) => {
  if (!url) return '/images/placeholder-promotion.jpg';
  return url;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const promotionTypeDisplay = (type) => {
  const typeKeys = {
    seasonal: 'Seasonal Promotion',
    welcome: 'Welcome Offer',
    loyalty: 'Loyalty Reward'
  };
  return typeKeys[type] || type;
};

onMounted(async () => {
  try {
    await fetchPromotions();
    promotions.value = promotionsData.value.filter(p => p.status === 'active' || p.status === 'scheduled');
  } catch (err) {
    console.error('Error fetching promotions:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
});

useHead({
  title: 'Special Promotions - Dukes Casino',
  meta: [
    {
      name: 'description',
      content: 'Explore our latest casino promotions and special offers. Find the best bonuses and rewards at Dukes Casino.'
    },
    {
      name: 'keywords',
      content: 'casino promotions, bonuses, special offers, casino rewards, Dukes Casino'
    }
  ]
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
