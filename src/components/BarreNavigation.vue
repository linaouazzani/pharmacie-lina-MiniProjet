<template>
  <v-app-bar color="teal-darken-1" flat elevation="2">
    <v-app-bar-title class="font-weight-bold">
      Ma propre pharmacie de Lina
    </v-app-bar-title>

    <v-spacer />

    <v-btn to="/" variant="text" color="white" class="mr-1"> Stock </v-btn>

    <v-btn to="/ajouter" variant="text" color="white" class="mr-3">
      Ajouter un médicament
    </v-btn>

    <v-btn 
      @click="lancerCommande" 
      variant="elevated" 
      color="orange-darken-2" 
      class="mr-2"
      density="compact"
    >
      Réapprovisionner
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { declencherEmailApprovisionnement } from '@/services/medicaments.js'

async function lancerCommande() {
  try {
    const message = await declencherEmailApprovisionnement()
    alert(message) // Affiche "Réapprovisionnement déclenché avec succès !"
  } catch (error) {
    alert("Erreur lors de l'envoi de la commande")
    console.error(error)
  }
}
</script>