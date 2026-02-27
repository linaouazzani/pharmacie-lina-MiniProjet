<template>
  <v-app>
    <!-- Barre de navigation verte -->
    <v-app-bar color="teal" flat>
      <v-app-bar-title class="font-weight-bold text-white">
        La pharmacie de Lina
      </v-app-bar-title>

      <v-spacer />

      <v-btn to="/" variant="text" color="white"> Stock </v-btn>

      <v-btn to="/ajouter" variant="text" color="white">
        Ajouter un médicament
      </v-btn>
    </v-app-bar>

    <!-- Page affichée selon la route -->
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-6">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
//TEST pour le git
<script setup></script>
