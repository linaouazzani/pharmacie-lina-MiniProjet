<template>
  <div>
    <h2 class="text-h5 font-weight-bold text-center mb-6">
      Liste des Médicaments
    </h2>

    <!-- Recherche -->
    <div class="d-flex justify-center mb-8">
      <v-text-field
        v-model="recherche"
        placeholder="Rechercher un médicament..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        density="compact"
        clearable
        bg-color="white"
        style="max-width: 450px"
      />
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="enChargement" class="text-center my-10">
      <v-progress-circular indeterminate color="teal" size="50" />
      <p class="text-grey mt-3">Chargement en cours...</p>
    </div>

    <!-- Grille de cartes -->
    <v-row v-else>
      <v-col
        v-for="med in listeFiltrée"
        :key="med.id"
        cols="12" sm="6" md="4"
      >
        <v-card rounded="lg" elevation="2" class="pa-4 text-center h-100">

          <!-- Photo -->
          <v-img
            v-if="med.photo"
            :src="config.imagesUrl + med.photo"
            height="120"
            contain
            class="mb-3"
          />
          <v-icon v-else icon="mdi-pill" size="70" color="grey-lighten-2" class="mb-3" />

          <!-- Nom et forme -->
          <p class="text-h6 font-weight-bold mb-1">{{ med.denomination }}</p>
          <p class="text-body-2 text-grey mb-4">{{ med.formepharmaceutique }} 💊</p>

          <!-- Compteur quantité -->
          <div class="d-flex align-center justify-center ga-4 mb-2">
            <v-btn
              icon="mdi-minus"
              variant="tonal"
              size="small"
              color="teal"
              :disabled="med.qte <= 0"
              @click="enleverUnite(med)"
            />
            <div>
              <div class="text-h5 font-weight-bold">{{ med.qte }}</div>
              <div class="text-caption text-grey">unités</div>
            </div>
            <v-btn
              icon="mdi-plus"
              variant="tonal"
              size="small"
              color="teal"
              @click="ajouterUnite(med)"
            />
          </div>

          <v-divider class="my-3" />

          <!-- Actions -->
          <div class="d-flex justify-center ga-2">
            <v-btn
              :to="'/modifier/' + med.id"
              color="teal"
              size="small"
              prepend-icon="mdi-pencil"
            >
              Modifier
            </v-btn>
            <v-btn
              color="teal"
              variant="outlined"
              size="small"
              prepend-icon="mdi-delete"
              @click="demanderSuppression(med)"
            >
              Supprimer
            </v-btn>
          </div>

        </v-card>
      </v-col>

      <!-- Aucun résultat -->
      <v-col v-if="listeFiltrée.length === 0" cols="12" class="text-center text-grey py-10">
        Aucun médicament trouvé.
      </v-col>
    </v-row>

    <!-- Boîte de confirmation avant suppression -->
    <v-dialog v-model="dialogVisible" max-width="380">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Confirmer la suppression</v-card-title>
        <v-card-text>
          Supprimer <strong>{{ medicamentChoisi?.denomination }}</strong> définitivement ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialogVisible = false">Annuler</v-btn>
          <v-btn color="red" variant="flat" @click="validerSuppression">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification -->
    <v-snackbar v-model="notifVisible" :color="notifCouleur" timeout="2200" location="bottom right">
      {{ notifTexte }}
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { recupererTous, mettreAJour, effacer } from '@/services/medicaments.js'
import config from '@/config.js'

const listeMedicaments  = ref([])
const recherche         = ref('')
const enChargement      = ref(true)
const dialogVisible     = ref(false)
const medicamentChoisi  = ref(null)
const notifVisible      = ref(false)
const notifTexte        = ref('')
const notifCouleur      = ref('success')

// Filtre les médicaments selon la barre de recherche
const listeFiltrée = computed(() => {
  if (!recherche.value) return listeMedicaments.value
  const terme = recherche.value.toLowerCase()
  return listeMedicaments.value.filter(m =>
    (m.denomination || '').toLowerCase().includes(terme) ||
    (m.formepharmaceutique || '').toLowerCase().includes(terme)
  )
})

// Charger la liste depuis l'API
function chargerListe() {
  enChargement.value = true
  recupererTous()
    .then(data => {
      listeMedicaments.value = data
      enChargement.value     = false
    })
    .catch(err => {
      console.error('Erreur chargement :', err)
      enChargement.value = false
    })
}

// +1 au stock
function ajouterUnite(med) {
  mettreAJour({ id: med.id, qte: med.qte + 1 })
    .then(() => {
      med.qte++
      notifier('+1 enregistré ✓', 'success')
    })
    .catch(err => console.error(err))
}

// -1 au stock
function enleverUnite(med) {
  if (med.qte <= 0) return
  mettreAJour({ id: med.id, qte: med.qte - 1 })
    .then(() => {
      med.qte--
      notifier('-1 enregistré ✓', 'success')
    })
    .catch(err => console.error(err))
}

// Ouvrir le dialog de confirmation
function demanderSuppression(med) {
  medicamentChoisi.value = med
  dialogVisible.value    = true
}

// Supprimer après confirmation
function validerSuppression() {
  const id = medicamentChoisi.value.id
  effacer(id)
    .then(() => {
      listeMedicaments.value = listeMedicaments.value.filter(m => m.id !== id)
      dialogVisible.value    = false
      notifier('Médicament supprimé ✓', 'success')
    })
    .catch(err => console.error(err))
}

function notifier(texte, couleur) {
  notifTexte.value   = texte
  notifCouleur.value = couleur
  notifVisible.value = true
}

onMounted(() => {
  chargerListe()
})
</script>
