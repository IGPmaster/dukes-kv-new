<template>
  <footer class="!bg-neutral-50 pt-10">
    <div class="row">
      <div class="container mx-auto">
        <ul class="flex flex-wrap justify-center pb-16 gap-8">
          <li>
            <NuxtLink to="/" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="home" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/promotions" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="promotions" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="legal" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/all-games" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="all_games" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/casino-games" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="casino_games" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/jackpot-games" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="jackpot_games" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/live-games" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="live_games" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/popular-games" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="popular_games" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/scratchcards" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="scratchcards_games" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/slot-games" class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
              <TranslatedText translation-key="slot_games" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="row !bg-neutral-50 pb-10">
      <div class="container mx-auto footerContainer">
        <ul class="container mx-auto flex list-none flex-wrap text-lg justify-center gap-6 py-8 text-gray-800">
          <li>
            <NuxtLink to="/compliance/aboutus" class="compliance-btn">
              <TranslatedText translation-key="aboutus" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/withdrawals" class="compliance-btn">
              <TranslatedText translation-key="withdrawals" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/deposits" class="compliance-btn">
              <TranslatedText translation-key="deposits" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/contact" class="compliance-btn">
              <TranslatedText translation-key="contact" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/privacy" class="compliance-btn">
              <TranslatedText translation-key="privacy" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/responsible" class="compliance-btn">
              <TranslatedText translation-key="responsible" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/faq" class="compliance-btn">
              <TranslatedText translation-key="faq" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/payouts" class="compliance-btn">
              <TranslatedText translation-key="payouts" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/terms" class="compliance-btn">
              <TranslatedText translation-key="terms" />
            </NuxtLink>
          </li>
        </ul>

        <div v-for="icon in footerIcons" :key="icon.Name" class="flex justify-center">
          <div v-html="icon.Html"></div>
        </div>

        <div v-for="text in footerText" :key="text.Name" class="py-5 text-center">
          <p v-html="text.Html"></p>
        </div>

        <div class="flex items-center justify-center">
          <img 
            src="../static/dukescasino-logo-new.png" 
            loading="lazy" 
            alt="Dukes Casino footer Logo"
            class="footer_logo p-5 shadow-md rounded-lg" 
            height="100" 
            width="200" 
          />
        </div>
      </div>
    </div>

    <div class="w-full fixed bottom-0 lg:hidden">
      <div class="grid grid-cols-2">
        <div class="w-full bg-[#91D342] flex justify-center py-3">
          <a :href="loginLink" class="flex items-center gap-4 text-[#313131] font-semibold">
            <TranslatedText translation-key="login" /> <i class="material-icons">arrow_forward</i>
          </a>
        </div>
        <div class="w-full bg-[#3598FB] flex justify-center">
          <a :href="regLink" class="flex items-center gap-4 text-[#313131] font-semibold">
            <TranslatedText translation-key="sign_up" /> <i class="material-icons">security</i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { WHITELABEL_ID } from '~/composables/globalData';
import { fetchFooterIcons, fetchFooterText, footerIcons, footerText } from '~/composables/globalData';
import { useCookieConsent } from '~/composables/useCookieConsent';

const brandId = computed(() => WHITELABEL_ID);
const { regLink, loginLink } = useCookieConsent();

// Fetch footer data on mount
onMounted(async () => {
  try {
    await Promise.all([
      fetchFooterIcons(lang.value),
      fetchFooterText(lang.value)
    ]);
  } catch (error) {
    console.error('Error fetching footer data:', error);
  }
});
</script>

<style scoped>
.footer_logo {
  background-color: #212121;
  max-width: 150px;
}

.router-link-active {
  @apply text-secondary bg-secondary_bg;
}

.compliance-btn {
  @apply text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200;
}
</style>