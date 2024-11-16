<template>
  <div class="pt-24 bg-gradient-to-b from-primary_bg to-tertiary_dark min-h-screen pb-48">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-primary mb-4">Casino Blog</h1>
        <p class="text-gray-400 max-w-2xl mx-auto">
          Latest casino news, guides, and expert tips
        </p>
      </div>

      <!-- Featured Post -->
      <div v-if="!loading && featuredPost" class="mb-16">
        <div class="relative bg-tertiary rounded-xl overflow-hidden shadow-lg">
          <img 
            :src="featuredPost.images?.banner?.url" 
            :alt="featuredPost.title" 
            class="w-full h-[400px] object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
            <div class="absolute bottom-0 p-8">
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="tag in (featuredPost.tags || []).slice(0, 3)"
                      :key="tag"
                      class="px-3 py-1 text-sm bg-secondary/90 text-white rounded-full">
                  #{{ tag }}
                </span>
              </div>
              <h2 class="text-3xl font-bold text-white mb-4">
                {{ featuredPost.title }}
              </h2>
              <p class="text-gray-200 mb-4 line-clamp-2">
                {{ cleanText(featuredPost.content?.excerpt || truncateText(featuredPost.content?.main, 150)) }}
              </p>
              <NuxtLink 
                :to="`/blog/${featuredPost.slug}`"
                class="inline-flex items-center px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90"
              >
                Read Article
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Row -->
      <div v-if="topCategories.length || topTags.length" class="flex flex-wrap gap-4 justify-between items-center p-4 bg-tertiary_dark rounded-lg mb-12 shadow-md">
        <!-- Category Filter -->
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold text-primary">Categories:</h3>
          <button 
            v-for="category in topCategories"
            :key="category"
            @click="toggleCategory(category)"
            :class="[
              'px-3 py-1 rounded-full text-sm transition-colors',
              selectedCategory === category
                ? 'bg-secondary text-white'
                : 'bg-tertiary text-gray-400 hover:bg-tertiary_dark'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Tag Filter -->
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold text-primary">Tags:</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="tag in topTags"
              :key="tag"
              @click="toggleTag(tag)"
              :class="[
                'px-3 py-1 rounded-full text-sm transition-colors',
                selectedTags.includes(tag)
                  ? 'bg-secondary text-white'
                  : 'bg-tertiary text-gray-400 hover:bg-tertiary_dark'
              ]"
            >
              #{{ tag }}
            </button>
          </div>
        </div>
      </div>

      <!-- Blog Posts Grid -->
      <div v-if="!loading && filteredPosts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article v-for="post in filteredPosts" 
                 :key="post.id"
                 class="bg-tertiary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex flex-col"
                 style="height:100%;">
          <!-- Post Image -->
          <div class="relative">
            <img 
              :src="post.images?.featured?.url" 
              :alt="post.images?.featured?.alt || post.title"
              class="w-full h-48 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <!-- Post Content -->
          <div class="flex flex-col justify-between flex-grow p-6 bg-tertiary_dark/40">
            <div>
              <div class="flex items-center text-sm text-gray-400 mb-2">
                <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
                <span class="mx-2">·</span>
                <span>{{ calculateReadingTime(post.content.main) }} min read</span>
              </div>

              <h3 class="text-xl font-bold text-primary mb-3 line-clamp-2">
                {{ post.title }}
              </h3>

              <p class="text-gray-400 mb-4 line-clamp-3">
                {{ cleanText(post.content.excerpt || truncateText(post.content.main, 150)) }}
              </p>
            </div>

            <!-- Read More Button -->
            <NuxtLink 
              :to="`/blog/${post.slug}`"
              class="inline-flex items-center text-primary/70 hover:text-primary text-primary/70 mt-auto pt-4"
              aria-label="Read more about {{ post.title }}"
            >
              Read More
              <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </article>
      </div>

      <!-- No Posts State -->
      <div v-else-if="!loading" class="text-center py-12">
        <h3 class="text-lg text-gray-400">No blog posts found</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { blogPosts, fetchBlogPosts } from '~/composables/globalData'

// State
const loading = ref(true)
const selectedCategory = ref(null)
const selectedTags = ref([])
const filteredPosts = ref([])
const featuredPost = computed(() => blogPosts.value.length ? blogPosts.value[0] : null)

// Dynamic Tags and Categories
const topTags = ref([])
const topCategories = ref([])

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateReadingTime = (text) => {
  const wordsPerMinute = 200 // Average reading speed
  const textLength = text.split(' ').length // Split by spaces for word count
  return Math.ceil(textLength / wordsPerMinute)
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const cleanText = (text) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')
  return doc.body.textContent || ''
}

// Aggregate Tags and Categories
const aggregateTagsAndCategories = () => {
  const tagCounts = {}
  const categoryCounts = {}

  blogPosts.value.forEach(post => {
    post.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
    post.categories?.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })
  })

  topTags.value = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 5)
  topCategories.value = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]).slice(0, 5)
}

// Toggle Category Filter
const toggleCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? null : category
  filterPosts()
}

// Toggle Tag Filter
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
  filterPosts()
}

// Filter Posts
const filterPosts = () => {
  filteredPosts.value = blogPosts.value.filter(post => {
    const matchesCategory = !selectedCategory.value || post.categories?.includes(selectedCategory.value)
    const matchesTags = selectedTags.value.length === 0 || post.tags?.some(tag => selectedTags.value.includes(tag))
    return post !== featuredPost.value && matchesCategory && matchesTags
  })
}

// Fetch posts on mount
onMounted(async () => {
  try {
    await fetchBlogPosts()
    aggregateTagsAndCategories() // Calculate top tags and categories
    filterPosts() // Apply filters to loaded posts
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
