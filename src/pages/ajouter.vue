<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Ajouter un médicament</h2>

    <v-card max-width="480" class="pa-6" elevation="2" rounded="lg">

      <v-text-field
        v-model="denomination"
        label="Nom du médicament *"
        variant="outlined"
        class="mb-3"
      />

      <v-text-field
        v-model="formepharmaceutique"
        label="Forme pharmaceutique *"
        variant="outlined"
        placeholder="comprimé, gélule, sirop..."
        class="mb-3"
      />

      <v-text-field
        v-model="qte"
        label="Quantité *"
        variant="outlined"
        type="number"
        min="0"
        class="mb-3"
      />

      <!-- Sélection de la photo -->
      <v-file-input
        label="Photo (optionnelle)"
        variant="outlined"
        accept="image/*"
        prepend-icon="mdi-camera"
        class="mb-3"
        @change="lirePhoto"
      />

      <!-- Aperçu de la photo choisie -->
      <v-img
        v-if="photoBase64"
        :src="photoBase64"
        height="140"
        contain
        class="rounded mb-4"
      />

      <!-- Messages -->
      <v-alert v-if="erreur" type="error" variant="tonal" class="mb-3">
        {{ erreur }}
      </v-alert>
      <v-alert v-if="succes" type="success" variant="tonal" class="mb-3">
        Médicament ajouté ! Retour à la liste...
      </v-alert>

      <div class="d-flex ga-3">
        <v-btn color="teal" variant="flat" :loading="chargement" @click="envoyerFormulaire">
          Enregistrer
        </v-btn>
        <v-btn to="/" variant="tonal">
          Annuler
        </v-btn>
      </div>

    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import config from '@/config.js'

const router = useRouter()

const denomination        = ref('')
const formepharmaceutique = ref('')
const qte                 = ref(0)
const photoBase64         = ref('')
const chargement          = ref(false)
const erreur              = ref('')
const succes              = ref(false)

// Méthode FileReader pour convertir la photo en Base64
function lirePhoto(evenement) {
  const fichier = evenement.target.files[0]
  if (!fichier) return
  const lecteur = new FileReader()
  lecteur.onload = function () {
    photoBase64.value = lecteur.result
  }
  lecteur.readAsDataURL(fichier)
}

function envoyerFormulaire() {
  if (!denomination.value || !formepharmaceutique.value) {
    erreur.value = 'Veuillez remplir les champs obligatoires.'
    return
  }

  erreur.value     = ''
  chargement.value = true

  fetch(config.apiUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      denomination:        denomination.value,
      formepharmaceutique: formepharmaceutique.value,
      qte:                 parseInt(qte.value),
      photo:               photoBase64.value
    })
  })
    .then(r => r.json())
    .then(() => {
      succes.value     = true
      chargement.value = false
      // Retour automatique à la liste après 1.5 secondes
      setTimeout(() => { router.push('/') }, 1500)
    })
    .catch(err => {
      console.error(err)
      erreur.value     = "Erreur lors de l'ajout."
      chargement.value = false
    })
}
</script>