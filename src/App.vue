<template>
  <v-app>

    <!-- Barre de navigation (composant séparé) -->
    <BarreNavigation />

    <!-- La page courante s'affiche ici -->
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-6">
        <RouterView />
      </v-container>
    </v-main>

  </v-app>
</template>

<script setup>
import BarreNavigation from '@/components/BarreNavigation.vue'
</script>