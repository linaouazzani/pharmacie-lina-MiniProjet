<template>
  <v-app-bar color="purple-darken-2" flat elevation="2">

    <v-app-bar-title class="font-weight-bold">
      La Pharmacie Virtuelle de Lina
    </v-app-bar-title>

    <v-spacer />

    <v-btn to="/" variant="text" color="white" class="mr-1">
      Stock
    </v-btn>

    <v-btn to="/ajouter" variant="text" color="white" class="mr-1">
      Ajouter un médicament
    </v-btn>

    <!-- Bouton qui envoie les mails de réapprovisionnement aux fournisseurs -->
    <v-btn
      variant="outlined"
      color="white"
      class="mr-3"
      prepend-icon="mdi-truck-delivery"
      :loading="envoi"
      @click="declencherReappro"
    >
      Réapprovisionner
    </v-btn>

  </v-app-bar>

  <!-- Affiche le résultat de l'appel (succès ou erreur) -->
  <v-snackbar v-model="notifVisible" :color="notifCouleur" timeout="3000" location="top">
    {{ notifTexte }}
  </v-snackbar>

</template>

<script setup>
import { ref } from 'vue'

const envoi        = ref(false)
const notifVisible = ref(false)
const notifTexte   = ref('')
const notifCouleur = ref('success')

// Appelle le backend pour envoyer les mails aux fournisseurs
function declencherReappro() {
  envoi.value = true
  fetch('https://mini-projetlina.onrender.com/api/approvisionnement/declencher', {
    method: 'POST'
  })
    .then(r => r.text())
    .then(msg => {
      notifTexte.value   = msg
      notifCouleur.value = 'success'
      notifVisible.value = true
    })
    .catch(() => {
      notifTexte.value   = 'Erreur lors du réapprovisionnement'
      notifCouleur.value = 'error'
      notifVisible.value = true
    })
    .finally(() => { envoi.value = false })
}
</script>