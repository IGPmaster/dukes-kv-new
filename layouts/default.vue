<!-- layouts/default.vue -->
<template>
  <div>
    <Header />
    <main>
      <slot /> <!-- This is where page content goes -->
    </main>
    <Footer />
    <CookieConsent />
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue'
</script>