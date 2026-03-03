<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Modifier un médicament</h2>

    <div v-if="enChargement" class="text-center my-10">
      <v-progress-circular indeterminate color="teal" size="50" />
    </div>

    <v-card v-else max-width="480" class="pa-6" elevation="2" rounded="lg">

      <v-text-field v-model="nom" label="Nom du médicament"
        variant="outlined" class="mb-3" />

      <v-text-field v-model="unitesEnStock" label="Unités en stock"
        variant="outlined" type="number" min="0" class="mb-3" />

      <v-text-field v-model="prixUnitaire" label="Prix unitaire (€)"
        variant="outlined" type="number" step="0.01" class="mb-3" />

      <v-text-field v-model="imageURL" label="URL de l'image"
        variant="outlined" class="mb-3" />

      <v-img v-if="imageURL" :src="imageURL" height="120" contain class="rounded mb-3" />

      <v-file-input label="Changer la photo (optionnel)" variant="outlined"
        accept="image/*" prepend-icon="mdi-camera" class="mb-3" @change="lirePhoto" />

      <v-alert v-if="messageErreur" type="error" variant="tonal" class="mb-3">
        {{ messageErreur }}
      </v-alert>
      <v-alert v-if="messageSucces" type="success" variant="tonal" class="mb-3">
        {{ messageSucces }}
      </v-alert>

      <div class="d-flex ga-3">
        <v-btn color="teal" variant="flat" :loading="enEnvoi" @click="enregistrer">
          Enregistrer
        </v-btn>
        <v-btn to="/" variant="tonal">Annuler</v-btn>
      </div>

    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { recupererTous, mettreAJour } from '@/services/medicaments.js'

const route  = useRoute()
const router = useRouter()

// On décode l'URL self passée en paramètre de route
// /modifier/https%3A%2F%2F... → decodeURIComponent → URL complète
const selfUrl = decodeURIComponent(route.params.id)

const nom           = ref('')
const unitesEnStock = ref(0)
const prixUnitaire  = ref(0)
const imageURL      = ref('')
const enChargement  = ref(true)
const enEnvoi       = ref(false)
const messageErreur = ref('')
const messageSucces = ref('')

function chargerMedicament() {
  recupererTous()
    .then(liste => {
      // On trouve le médicament dont l'URL self correspond
      const trouve = liste.find(m => m._links.self.href === selfUrl)
      if (trouve) {
        nom.value           = trouve.nom
        unitesEnStock.value = trouve.unitesEnStock
        prixUnitaire.value  = trouve.prixUnitaire
        imageURL.value      = trouve.imageURL
      }
      enChargement.value = false
    })
    .catch(err => {
      console.error(err)
      enChargement.value = false
    })
}

function lirePhoto(evenement) {
  const fichier = evenement.target.files[0]
  if (!fichier) return
  const lecteur = new FileReader()
  lecteur.onload = function () { imageURL.value = lecteur.result }
  lecteur.readAsDataURL(fichier)
}

function enregistrer() {
  messageErreur.value = ''; enEnvoi.value = true
  mettreAJour(selfUrl, {
    nom:           nom.value,
    unitesEnStock: parseInt(unitesEnStock.value),
    prixUnitaire:  parseFloat(prixUnitaire.value),
    imageURL:      imageURL.value
  })
    .then(() => {
      messageSucces.value = 'Modifications enregistrées ! Retour...'
      enEnvoi.value = false
      setTimeout(() => { router.push('/') }, 1500)
    })
    .catch(err => {
      console.error(err)
      messageErreur.value = 'Erreur lors de la modification.'
      enEnvoi.value = false
    })
}

onMounted(() => { chargerMedicament() })
</script>