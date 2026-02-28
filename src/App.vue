

  //c le Squelette principal de l'application
  //Contient : barre de navigation + contenu + pied de page
 

<template>
  <v-app>

    <!-- Barre de navigation en haut -->
    <BarreNavigation />

    <!-- Zone de contenu principale -->
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-6">
        <RouterView />
      </v-container>
    </v-main>

    <!-- Pied de page personnalisé -->
    <AppFooter />

  </v-app>
</template>

<script setup>
import BarreNavigation from '@/components/BarreNavigation.vue'
import AppFooter       from '@/components/AppFooter.vue'
</script>