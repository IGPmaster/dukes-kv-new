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
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-300">Promotion Not Found</h3>
          <p class="mt-1 text-sm text-gray-400">The promotion you're looking for might be expired or unavailable.</p>
          <div class="mt-6">
            <NuxtLink to="/promotions" class="text-secondary hover:text-secondary/90">
              Return to Promotions
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Promotion Content -->
      <div v-else class="max-w-4xl mx-auto">
        <!-- Full-Width Desktop Banner at Top -->
        <div class="relative rounded-lg overflow-hidden mb-8 bg-tertiary shadow-xl bg-tertiary_dark px-10">
          <img 
            :src="getImageUrl(promotion.images?.desktop?.url)" 
            :alt="promotion.images?.desktop?.alt || promotion.title"
            class="w-full h-auto"
          />
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-primary mb-4">{{ promotion.title }}</h1>
          <p v-if="promotion.content?.short_description" class="text-gray-400 text-lg">{{ promotion.content.short_description }}</p>
        </div>

        <!-- Status, Type, and Dates -->
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center space-x-4">
            <span 
              :class="{
                'px-3 py-1 rounded-full text-sm font-semibold': true,
                'bg-green-500 text-white': promotion.status === 'active',
                'bg-yellow-500 text-white': promotion.status === 'scheduled',
                'bg-gray-500 text-white': promotion.status === 'expired'
              }"
            >
              {{ promotion.status }}
            </span>
            <span v-if="promotionTypeDisplay(promotion.type)" 
                  class="px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
              {{ promotionTypeDisplay(promotion.type) }}
            </span>
          </div>
          <div v-if="promotion.valid_from" class="text-sm text-gray-400">
            Valid from: {{ formatDate(promotion.valid_from) }}
            <span v-if="promotion.valid_to">
              to {{ formatDate(promotion.valid_to) }}
            </span>
          </div>
        </div>

        <!-- Inline Mobile Banner and Description -->
        <div class="flex flex-col md:flex-row gap-6 mb-8 items-center">
          <img 
            :src="getImageUrl(promotion.images?.mobile?.url)" 
            :alt="promotion.images?.mobile?.alt || promotion.title"
            class="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-md"
          />
          <div class="prose prose-lg max-w-none prose-invert text-gray-50">
            <div v-html="promotion.content?.description"></div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div v-if="promotion.content?.terms" class="bg-tertiary rounded-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-primary mb-4">Terms & Conditions</h2>
          <div class="prose prose-sm max-w-none prose-invert text-gray-50" 
               v-html="promotion.content.terms">
          </div>
        </div>

        <!-- Back and Claim Offer Buttons -->
        <div class="flex justify-between mt-12">
          <!-- Back to Promotions Button -->
          <NuxtLink 
            to="/promotion"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-300 bg-secondary hover:bg-secondary/90 transition-colors duration-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Promotions
          </NuxtLink>

          <!-- Claim Offer CTA Button -->
          <button
            @click="claimOffer(promotion)"
            class="px-6 py-3 bg-orange-500 text-white text-base font-semibold rounded-md shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
          >
            Claim Offer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['promotion']
});
import { ref, onMounted } from 'vue';
import { useRoute, useHead } from '#imports';
import { WHITELABEL_ID, PROMOTIONS_WORKER_URL, API_URL, lang } from '~/composables/globalData';

const route = useRoute();
const slug = route.params.slug;
const promotion = ref(null);
const loading = ref(true);
const error = ref(false);

// Your existing helper functions stay the same
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

// Updated fetch function to use new API structure
async function fetchPromotion(slug) {
  try {
    console.log('Current URL:', window.location.href);
    console.log('PROMOTIONS_WORKER_URL:', PROMOTIONS_WORKER_URL);
    console.log('API_URL:', API_URL);
    
    const fullUrl = `https://casino-promotions-api.tech1960.workers.dev/api/promotion/${slug}?brandId=${WHITELABEL_ID}&lang=${lang.value || 'IE'}`;
    console.log('Attempting to fetch from:', fullUrl);

    // Add error check for required params
    if (!slug || !WHITELABEL_ID) {
      throw new Error('Missing required parameters');
    }

    const response = await fetch(fullUrl);  // Use the constructed URL
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Promotion fetch failed:', response.status, errorData);
      
      if (response.status === 404) {
        throw new Error('Promotion not found');
      }
      throw new Error(errorData.error || 'Failed to fetch promotion');
    }
    
    const data = await response.json();
    
    // Validate required promotion data
    if (!data || !data.title) {
      throw new Error('Invalid promotion data received');
    }
    
    console.log('Promotion data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    throw error;
  }
}

// Updated mounted hook with better error handling
onMounted(async () => {
  try {
    loading.value = true;
    promotion.value = await fetchPromotion(slug);
    
    // Update SEO meta after data is loaded
    useHead({
      title: promotion.value?.title || 'Promotion',
      meta: [
        {
          name: 'description',
          content: promotion.value?.content?.short_description || 'View our latest casino promotion'
        }
      ]
    });
  } catch (err) {
    error.value = true;
    console.error('Failed to load promotion:', err);
  } finally {
    loading.value = false;
  }
});

// Claim Offer function with type safety
const claimOffer = (promo) => {
  if (!promo || !promo.title) return;
  console.log(`Claiming offer for promotion: ${promo.title}`);
  // Implement additional logic for claim offer action
};
</script>

<style scoped>
.prose :deep(a) {
  @apply text-secondary hover:text-secondary/90;
}

.prose :deep(ul) {
  @apply list-disc pl-6;
}

.prose :deep(ol) {
  @apply list-decimal
  pl-6;
}

p {
  color: white;
}

/* CTA Button Style */
.bg-orange-500 {
  background-color: #FF7F50; /* Bright color for high visibility */
}

.bg-orange-600:hover {
  background-color: #FF6347; /* Slightly darker on hover */
}
</style>
