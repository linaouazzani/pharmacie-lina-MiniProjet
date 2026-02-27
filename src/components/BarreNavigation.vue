<template>
  <v-app-bar color="teal-darken-1" flat elevation="2">
    <!-- Titre à gauche -->
    <v-app-bar-title class="font-weight-bold">
      Ma propre pharmacie de Lina
    </v-app-bar-title>

    <v-spacer />

    <!-- Liens de navigation -->
    <v-btn to="/" variant="text" color="white" class="mr-1"> Stock </v-btn>

    <v-btn to="/ajouter" variant="text" color="white" class="mr-3">
      Ajouter un médicament
    </v-btn>
  </v-app-bar>
</template>

<script setup>
// Pas de logique ici, ce composant sert uniquement à afficher la barre
</script>
