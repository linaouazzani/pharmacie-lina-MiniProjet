<template>
  <div>
    <!-- Le titre change selon si on ajoute ou modifie -->
    <h2 class="text-h5 font-weight-bold mb-6">
      {{ modeModification ? 'Modifier un médicament' : 'Ajouter un médicament' }}
    </h2>

    <div v-if="enChargement" class="text-center my-10">
      <v-progress-circular indeterminate color="teal" size="50" />
    </div>

    <v-card v-else max-width="480" class="pa-6" elevation="2" rounded="lg">

      <v-text-field
        v-model="formulaire.denomination"
        label="Nom du médicament *"
        variant="outlined"
        class="mb-3"
      />

      <v-text-field
        v-model="formulaire.formepharmaceutique"
        label="Forme pharmaceutique *"
        variant="outlined"
        placeholder="comprimé, gélule, sirop..."
        class="mb-3"
      />

      <v-text-field
        v-model.number="formulaire.qte"
        label="Quantité *"
        variant="outlined"
        type="number"
        min="0"
        class="mb-3"
      />

      <!-- Champ photo -->
      <v-file-input
        label="Photo (optionnelle)"
        variant="outlined"
        accept="image/*"
        prepend-icon="mdi-camera"
        class="mb-3"
        @change="lirePhoto"
      />

      <!-- Aperçu de la photo sélectionnée -->
      <v-img
        v-if="formulaire.photo"
        :src="formulaire.photo"
        height="140"
        contain
        class="rounded mb-4"
      />

      <!-- Messages -->
      <v-alert v-if="messageErreur" type="error" variant="tonal" class="mb-3">
        {{ messageErreur }}
      </v-alert>
      <v-alert v-if="messageSucces" type="success" variant="tonal" class="mb-3">
        {{ messageSucces }}
      </v-alert>

      <!-- Boutons -->
      <div class="d-flex ga-3 mt-2">
        <v-btn
          color="teal"
          variant="flat"
          :loading="enEnvoi"
          @click="sauvegarder"
        >
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { recupererTous, creerMedicament, mettreAJour } from '@/services/medicaments.js'
import config from '@/config.js'

const route  = useRoute()
const router = useRouter()

// Le formulaire — même structure pour ajout et modification
const formulaire = ref({
  denomination:        '',
  formepharmaceutique: '',
  qte:                 0,
  photo:               ''
})

const modeModification = ref(false)
const enChargement     = ref(false)
const enEnvoi          = ref(false)
const messageErreur    = ref('')
const messageSucces    = ref('')

// Si on arrive sur /modifier/:id, on pré-remplit le formulaire
onMounted(() => {
  if (route.params.id) {
    modeModification.value = true
    enChargement.value     = true

    recupererTous()
      .then(liste => {
        // On cherche le médicament dans la liste
        const trouve = liste.find(m => m.id == route.params.id)
        if (trouve) {
          formulaire.value = {
            id:                  trouve.id,
            denomination:        trouve.denomination,
            formepharmaceutique: trouve.formepharmaceutique,
            qte:                 trouve.qte,
            photo:               trouve.photo ? config.imagesUrl + trouve.photo : ''
          }
        }
        enChargement.value = false
      })
      .catch(err => {
        console.error(err)
        enChargement.value = false
      })
  }
})

// Lire la photo et la convertir en Base64 avec FileReader (vu dans le TP du prof)
function lirePhoto(evenement) {
  const fichier = evenement.target.files[0]
  if (!fichier) return
  const lecteur = new FileReader()
  lecteur.onload = function () {
    formulaire.value.photo = lecteur.result
  }
  lecteur.readAsDataURL(fichier)
}

// Sauvegarder : appelle creer ou mettreAJour selon le mode
function sauvegarder() {
  if (!formulaire.value.denomination || !formulaire.value.formepharmaceutique) {
    messageErreur.value = 'Veuillez remplir les champs obligatoires.'
    return
  }

  messageErreur.value = ''
  enEnvoi.value       = true

  const action = modeModification.value
    ? mettreAJour(formulaire.value)
    : creerMedicament(formulaire.value)

  action
    .then(() => {
      messageSucces.value = modeModification.value
        ? 'Modifications enregistrées ! Retour à la liste...'
        : 'Médicament ajouté ! Retour à la liste...'
      enEnvoi.value = false
      setTimeout(() => { router.push('/') }, 1500)
    })
    .catch(err => {
      console.error(err)
      messageErreur.value = 'Une erreur est survenue.'
      enEnvoi.value       = false
    })
}
</script>