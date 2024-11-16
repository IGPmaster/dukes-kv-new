// pages/promotion/[slug].vue
<template>
  <div v-if="promotion" class="promotion-page">
    <!-- Desktop/Mobile responsive banner -->
    <div class="relative">
      <img 
        :src="promotion.images.desktop" 
        alt="Promotion Banner"
        class="w-full hidden md:block"
      />
      <img 
        :src="promotion.images.mobile" 
        alt="Promotion Banner" 
        class="w-full md:hidden"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        {{ promotion.title }}
      </h1>

      <!-- Promotion validity -->
      <div class="mb-6 text-sm text-gray-500">
        <span v-if="promotion.valid_from">
          Valid from: {{ formatDate(promotion.valid_from) }}
        </span>
        <span v-if="promotion.valid_to">
          - Valid until: {{ formatDate(promotion.valid_to) }}
        </span>
      </div>

      <!-- Description -->
      <div class="prose max-w-none mb-8" v-html="promotion.description"></div>

      <!-- Terms and Conditions -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">Terms & Conditions</h2>
        <div class="prose max-w-none" v-html="promotion.terms"></div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="text-center py-12">
    <p class="text-red-600">{{ error }}</p>
  </div>
  <div v-else class="text-center py-12">
    <div class="animate-spin h-8 w-8 mx-auto mb-4">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';
import { WHITELABEL_ID } from '~/composables/globalData'
const brandId = computed(() => WHITELABEL_ID)

const route = useRoute();
const config = useRuntimeConfig();
const promotion = ref(null);
const error = ref(null);

// Get whitelabel ID and lang from your Nuxt config/state
const whitelabelId = computed(() => config.public.whitelabelId);
const lang = computed(() => config.public.lang);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

onMounted(async () => {
  try {
    const response = await fetch(
      `https://casino-promotions-api.tech1960.workers.dev/promotion?brandId=${whitelabelId.value}&lang=${lang.value}&slug=${route.params.slug}`
    );
    
    if (!response.ok) {
      throw new Error('Promotion not found');
    }
    
    const data = await response.json();
    promotion.value = data;
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<style>
.prose img {
  @apply rounded-lg;
}
</style>