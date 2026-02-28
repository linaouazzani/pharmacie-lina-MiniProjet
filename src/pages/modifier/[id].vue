<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Modifier un médicament</h2>

    <!-- Chargement des infos existantes -->
    <div v-if="enChargement" class="text-center my-10">
      <v-progress-circular indeterminate color="teal" size="50" />
    </div>

    <v-card v-else max-width="480" class="pa-6" elevation="2" rounded="lg">

      <v-text-field
        v-model="denomination"
        label="Nom du médicament"
        variant="outlined"
        class="mb-3"
      />

      <v-text-field
        v-model="formepharmaceutique"
        label="Forme pharmaceutique"
        variant="outlined"
        class="mb-3"
      />

      <v-text-field
        v-model.number="qte"
        label="Quantité"
        variant="outlined"
        type="number"
        min="0"
        class="mb-3"
      />

      <!-- Photo actuelle -->
      <div v-if="photoActuelle" class="mb-4">
        <p class="text-caption text-grey mb-2">Photo actuelle :</p>
        <v-img
          :src="config.imagesUrl + photoActuelle"
          height="120"
          contain
          class="rounded"
        />
      </div>

      <!-- Changer la photo -->
      <v-file-input
        label="Changer la photo (optionnel)"
        variant="outlined"
        accept="image/*"
        prepend-icon="mdi-camera"
        class="mb-3"
        @change="lirePhoto"
      />

      <!-- Aperçu nouvelle photo -->
      <v-img
        v-if="nouvellePhoto"
        :src="nouvellePhoto"
        height="120"
        contain
        class="rounded mb-4"
      />

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
import { recupererTous, mettreAJour } from '@/Services/medicaments.js'
import config from '@/config.js'

const route  = useRoute()
const router = useRouter()

// L'ID vient de l'URL : /modifier/42 → "42"
const idMedicament = route.params.id

const denomination        = ref('')
const formepharmaceutique = ref('')
const qte                 = ref(0)
const photoActuelle       = ref('')
const nouvellePhoto       = ref('')
const enChargement        = ref(true)
const enEnvoi             = ref(false)
const messageErreur       = ref('')
const messageSucces       = ref('')

// Charger les infos du médicament à modifier
function chargerMedicament() {
  recupererTous()
    .then(liste => {
      const trouve = liste.find(m => m.id == idMedicament)
      if (trouve) {
        denomination.value        = trouve.denomination
        formepharmaceutique.value = trouve.formepharmaceutique
        qte.value                 = trouve.qte
        photoActuelle.value       = trouve.photo
      }
      enChargement.value = false
    })
    .catch(err => {
      console.error(err)
      enChargement.value = false
    })
}

// Lire la nouvelle photo en Base64 (méthode FileReader du prof)
function lirePhoto(evenement) {
  const fichier = evenement.target.files[0]
  if (!fichier) return
  const lecteur = new FileReader()
  lecteur.onload = function () {
    nouvellePhoto.value = lecteur.result
  }
  lecteur.readAsDataURL(fichier)
}

function enregistrer() {
  messageErreur.value = ''
  enEnvoi.value       = true

  const donnees = {
    id:                  parseInt(idMedicament),
    denomination:        denomination.value,
    formepharmaceutique: formepharmaceutique.value,
    qte:                 parseInt(qte.value)
  }

  // On envoie la nouvelle photo seulement si une a été choisie
  if (nouvellePhoto.value) {
    donnees.photo = nouvellePhoto.value
  }

  mettreAJour(donnees)
    .then(() => {
      messageSucces.value = 'Modifications enregistrées ! Retour à la liste...'
      enEnvoi.value       = false
      setTimeout(() => { router.push('/') }, 1500)
    })
    .catch(err => {
      console.error(err)
      messageErreur.value = 'Erreur lors de la modification.'
      enEnvoi.value       = false
    })
}

onMounted(() => {
  chargerMedicament()
})
</script>