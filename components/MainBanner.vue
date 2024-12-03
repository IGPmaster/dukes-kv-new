<template>
  <div v-if="loading" class="loading-placeholder">
    <svg class="spinner" viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
    </svg>
  </div>
  <div class="headWrap bg-tertiary_dark">
    <div v-for="content in brandContent" :key="content.id">
      <div class="w-full">
        <a :href="regLink" 
           style="margin-bottom: -5px;" 
           v-if="content.acf && content.yoast_head_json">
          <picture>
            <source 
              media="(min-width: 992px)" 
              :srcset="content.acf.image_full" 
              :alt="content.acf.image_small_alt"
              :title="content.yoast_head_json.og_title"
              @error="onImageError('desktop', content.acf.image_full)"
              width="1920"
              height="400"
            >
            <img 
              :src="content.acf.image_small" 
              class="w-full banner-image" 
              :alt="content.acf.image_full_alt"
              :title="content.yoast_head_json.og_title"
              style="min-width: 100vw; padding-top:6rem;" 
              width="1920"
              height="400"
              @error="onImageError('mobile', content.acf.image_small)"
              @load="onImageLoad(content.acf.image_small)"
              loading="eager"
            >
          </picture>
        </a>
      </div>
    </div>
    <div v-for="content in brandContent" :key="content.id">
      <!-- Significant Terms -->
      <div class="container mx-auto text-center text-primary sig_terms lg:py-5 lg:w-3/4">
        <div class="px-5 font-light text-xs" v-html="content.acf.sig_terms"></div>
      </div>

      <!-- Site Heading -->
      <main class="container mx-auto text-center py-4">
        <h1 class="site_heading text-primary text-lg md:text-2xl lg:text-4xl font-bold">
          Dukes Casino - Your Casino!
        </h1>
      </main>

      <!-- Trust Icons -->
      <div class="container mx-auto">
        <div class="flex justify-center lg:pb-5 py-3">
          <img 
            class="lg:w-2/5 w-7/8 place-items-center" 
            src="/images/PP-EN_red.svg"
            alt="100% Licensed and fast payouts" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineEmits } from 'vue';
import { 
    WHITELABEL_ID,
    brandContent,
    fetchBrandContent,
    lang,
} from '~/composables/globalData';

// Import cache functions from useCache instead
import { 
    getCacheKey, 
    getCache, 
    setCache, 
    preloadImage 
} from '~/composables/useCache';

import { useCookieConsent } from '~/composables/useCookieConsent'

const { regLink } = useCookieConsent()

const brandId = computed(() => WHITELABEL_ID);
const loading = ref(true);
const imageLoaded = ref(false);
const imageError = ref(null);

// Define emit
const emit = defineEmits(['loaded']);

// Cache key for banner content
const bannerCacheKey = computed(() => 
  getCacheKey('banner', { brandId: brandId.value, lang: lang.value })
);


// Image handlers
const onImageError = (type, url) => {
    imageError.value = { type, url };
};

const onImageLoad = (url) => {
    imageLoaded.value = true;
};

// Preload images function
const preloadBannerImages = async (content) => {
  if (!content?.acf) return;
  
  const imagesToPreload = [
    content.acf.image_full,
    content.acf.image_small
  ].filter(Boolean); // Only include URLs that exist

  // Only add trust_icons if it exists
  if (content.acf.trust_icons) {
    imagesToPreload.push(content.acf.trust_icons);
  }
  
  try {
    await Promise.allSettled(
      imagesToPreload.map(url => 
        preloadImage(url).catch(err => {
          console.warn(`Failed to preload image: ${url}`, err);
          return null;
        })
      )
    );
  } catch (error) {
    console.warn('Banner image preloading failed:', error);
  }
};

onMounted(async () => {
    try {
        // Check cache first
        const cachedContent = getCache(bannerCacheKey.value);
        if (cachedContent) {
            brandContent.value = cachedContent;
            loading.value = false;
            emit('loaded');
            // Preload images in background
            preloadBannerImages(cachedContent[0]);
            return;
        }

        // Fetch fresh content if not cached
        await fetchBrandContent();
        
        // Cache the content
        if (brandContent.value) {
            setCache(bannerCacheKey.value, brandContent.value, 15); // Cache for 15 minutes
            // Preload images in background
            preloadBannerImages(brandContent.value[0]);
        }

    } catch (error) {
        console.error('Error in MainBanner:', error);
    } finally {
        loading.value = false;
        emit('loaded');
    }
});
</script>

<style scoped>
.banner-container {
  aspect-ratio: 1920/400;
  /* Match your image dimensions */
  width: 100%;
  position: relative;
  overflow: hidden;
}
.banner-image {
  width: 100%;
  height: auto;
  display: block;
  /* Remove default img spacing */
}
.loading-placeholder {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  /* Light grey or your theme color */
}
.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  margin-top: 100px !important;
  left: 50%;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;
}
.spinner .path {
  stroke: white;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
.sig_terms :deep(p) {
  @apply font-light text-xs text-primary;
}
.sig_terms :deep(p a) {
  @apply text-primary hover:text-primary/90;
}
.sig_terms :deep(p strong) {
  @apply font-medium;
}

</style>