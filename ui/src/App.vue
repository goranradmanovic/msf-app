<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import TheFooter from './components/TheFooter.vue'
  import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <main>
    <TheHeader />
    
    <RouterView />

    <TheFooter />
  </main>
</template>

