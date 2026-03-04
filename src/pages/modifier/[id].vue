<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Modifier un médicament</h2>

    <div v-if="enChargement" class="text-center my-10">
      <v-progress-circular indeterminate color="teal" size="50" />
    </div>

    <v-card v-else max-width="500" class="pa-6" elevation="2" rounded="lg">

      <v-text-field v-model="nom" label="Nom du médicament"
        variant="outlined" class="mb-3" />

      <v-text-field v-model="quantiteParUnite" label="Quantité par unité"
        variant="outlined" class="mb-3" />

      <v-text-field v-model="unitesEnStock" label="Unités en stock"
        variant="outlined" type="number" min="0" class="mb-3" />

      <v-text-field v-model="prixUnitaire" label="Prix unitaire (€)"
        variant="outlined" type="number" step="0.01" class="mb-3" />

      <v-text-field v-model="niveauDeReappro" label="Niveau de réapprovisionnement"
        variant="outlined" type="number" min="0" class="mb-3" />

      <!-- Image actuelle ou URL manuelle -->
      <v-text-field v-model="imageURL" label="URL de l'image"
        variant="outlined" class="mb-2" />

      <p class="text-center text-grey text-caption mb-2">— ou sélectionner depuis le PC —</p>

      <!-- Zone sélection image depuis le PC -->
      <v-file-input
        label="Choisir une image depuis le PC"
        variant="outlined"
        accept="image/*"
        prepend-icon="mdi-camera"
        class="mb-3"
        @change="lirePhoto"
      />

      <!-- Aperçu image actuelle -->
      <v-img v-if="imageURL" :src="imageURL" height="120" contain class="rounded mb-3" />

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

const route  = useRoute()
const router = useRouter()

const selfUrl = decodeURIComponent(route.params.id)

const nom              = ref('')
const quantiteParUnite = ref('')
const unitesEnStock    = ref(0)
const prixUnitaire     = ref(0)
const niveauDeReappro  = ref(0)
const unitesCommandees = ref(0)
const indisponible     = ref(false)
const imageURL         = ref('')
const enChargement     = ref(true)
const enEnvoi          = ref(false)
const messageErreur    = ref('')
const messageSucces    = ref('')

// Charger directement le médicament via son URL self → pas besoin de chercher dans la liste
function chargerMedicament() {
  fetch(selfUrl)
    .then(r => r.json())
    .then(med => {
      nom.value              = med.nom              || ''
      quantiteParUnite.value = med.quantiteParUnite || ''
      unitesEnStock.value    = med.unitesEnStock    ?? 0
      prixUnitaire.value     = med.prixUnitaire     ?? 0
      niveauDeReappro.value  = med.niveauDeReappro  ?? 0
      unitesCommandees.value = med.unitesCommandees ?? 0
      indisponible.value     = med.indisponible     ?? false
      imageURL.value         = med.imageURL         || ''
      enChargement.value     = false
    })
    .catch(err => {
      console.error(err)
      enChargement.value = false
    })
}

// Convertit la photo locale en Base64
function lirePhoto(evenement) {
  const fichier = evenement.target.files[0]
  if (!fichier) return
  const lecteur = new FileReader()
  lecteur.onload = (e) => { imageURL.value = e.target.result }
  lecteur.readAsDataURL(fichier)
}

function enregistrer() {
  messageErreur.value = ''
  enEnvoi.value       = true

  // On envoie TOUTES les infos pour ne rien perdre
  fetch(selfUrl, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom:              nom.value,
      quantiteParUnite: quantiteParUnite.value,
      unitesEnStock:    parseInt(unitesEnStock.value),
      prixUnitaire:     parseFloat(prixUnitaire.value),
      niveauDeReappro:  parseInt(niveauDeReappro.value),
      unitesCommandees: parseInt(unitesCommandees.value),
      indisponible:     indisponible.value,
      imageURL:         imageURL.value || null
    })
  })
    .then(r => {
      if (!r.ok) return r.text().then(t => { throw new Error(t) })
      return r.json()
    })
    .then(() => {
      messageSucces.value = 'Modifications enregistrées ! Retour...'
      enEnvoi.value       = false
      setTimeout(() => { router.push('/') }, 1500)
    })
    .catch(err => {
      console.error(err)
      messageErreur.value = 'Erreur lors de la modification.'
      enEnvoi.value       = false
    })
}

onMounted(() => { chargerMedicament() })
</script>