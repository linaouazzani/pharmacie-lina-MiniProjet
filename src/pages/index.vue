<template>
  <div>
    <h2 class="text-h5 font-weight-bold text-center mb-6">
      Liste des Médicaments
    </h2>

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

    <div v-if="enChargement" class="text-center my-10">
      <v-progress-circular indeterminate color="purple-darken-2" size="50" />
      <p class="text-grey mt-3">Chargement en cours...</p>
    </div>

    <v-row v-if="!enChargement">
      <v-col
        v-for="med in listeFiltrée"
        :key="med._links.self.href"
        cols="12" sm="6" md="4"
      >
        <v-card rounded="lg" elevation="2" class="pa-4 text-center h-100">

          <v-img
            v-if="med.imageURL"
            :src="med.imageURL"
            height="120"
            contain
            class="mb-3"
          />
          <v-icon v-else icon="mdi-pill" size="70" color="grey-lighten-2" class="mb-3" />

          <p class="text-h6 font-weight-bold mb-1">{{ med.nom }}</p>

          <p v-if="med.prixUnitaire" class="text-body-2 text-purple-darken-2 mb-3">
            {{ med.prixUnitaire }} €
          </p>

          <div class="d-flex align-center justify-center ga-4 mb-2">
            <v-btn icon="mdi-minus" variant="tonal" size="small" color="purple-darken-2"
              :disabled="med.unitesEnStock <= 0" @click="enleverUnite(med)" />
            <div>
              <div class="text-h5 font-weight-bold">{{ med.unitesEnStock }}</div>
              <div class="text-caption text-grey">unités</div>
            </div>
            <v-btn icon="mdi-plus" variant="tonal" size="small" color="purple-darken-2"
              @click="ajouterUnite(med)" />
          </div>

          <v-divider class="my-3" />

          <div class="d-flex justify-center ga-2">
            <v-btn :to="'/modifier/' + encoderUrl(med._links.self.href)"
              color="purple-darken-2" size="small" prepend-icon="mdi-pencil">
              Modifier
            </v-btn>
            <v-btn color="purple-darken-2" variant="outlined" size="small" prepend-icon="mdi-delete"
              @click="demanderSuppression(med)">
              Supprimer
            </v-btn>
          </div>

        </v-card>
      </v-col>

      <v-col v-if="listeFiltrée.length === 0" cols="12" class="text-center text-grey py-10">
        Aucun médicament trouvé.
      </v-col>
    </v-row>

    <v-dialog v-model="dialogVisible" max-width="380">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Confirmer la suppression</v-card-title>
        <v-card-text>
          Supprimer <strong>{{ medicamentChoisi?.nom }}</strong> définitivement ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialogVisible = false">Annuler</v-btn>
          <v-btn color="red" variant="flat" @click="validerSuppression">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="notifVisible" :color="notifCouleur" timeout="2200" location="bottom right">
      {{ notifTexte }}
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { recupererTous, mettreAJour, effacer } from '@/Services/medicaments.js'

const listeMedicaments = ref([])
const recherche        = ref('')
const enChargement     = ref(true)
const dialogVisible    = ref(false)
const medicamentChoisi = ref(null)
const notifVisible     = ref(false)
const notifTexte       = ref('')
const notifCouleur     = ref('success')

const listeFiltrée = computed(() => {
  if (!recherche.value) return listeMedicaments.value
  const terme = recherche.value.toLowerCase()
  return listeMedicaments.value.filter(m =>
    (m.nom || '').toLowerCase().includes(terme)
  )
})

function encoderUrl(url) {
  return encodeURIComponent(url)
}

function chargerListe() {
  enChargement.value = true

  function chargerPage(url, accumulateur) {
    return fetch(url)
      .then(r => r.json())
      .then(data => {
        const medicaments = data._embedded?.medicaments ?? []
        const tous = accumulateur.concat(medicaments)
        if (data._links?.next?.href) {
          return chargerPage(data._links.next.href, tous)
        }
        return tous
      })
  }

  chargerPage('https://mini-projetlina.onrender.com/api/medicaments', [])
    .then(data => {
      // Tri alphabétique par nom
      listeMedicaments.value = data.sort((a, b) => a.nom.localeCompare(b.nom))
      enChargement.value     = false
    })
    .catch(err => {
      console.error('Erreur :', err)
      enChargement.value = false
    })
}

function ajouterUnite(med) {
  mettreAJour(med._links.self.href, {
    nom:           med.nom,
    unitesEnStock: med.unitesEnStock + 1,
    imageURL:      med.imageURL,
    prixUnitaire:  med.prixUnitaire
  })
    .then(() => {
      med.unitesEnStock++
      notifier('+1 enregistre', 'success')
    })
    .catch(err => console.error(err))
}

function enleverUnite(med) {
  if (med.unitesEnStock <= 0) return
  mettreAJour(med._links.self.href, {
    nom:           med.nom,
    unitesEnStock: med.unitesEnStock - 1,
    imageURL:      med.imageURL,
    prixUnitaire:  med.prixUnitaire
  })
    .then(() => {
      med.unitesEnStock--
      notifier('-1 enregistre', 'success')
    })
    .catch(err => console.error(err))
}

function demanderSuppression(med) {
  medicamentChoisi.value = med
  dialogVisible.value    = true
}

function validerSuppression() {
  const selfUrl = medicamentChoisi.value._links.self.href
  effacer(selfUrl)
    .then(() => {
      listeMedicaments.value = listeMedicaments.value.filter(
        m => m._links.self.href !== selfUrl
      )
      dialogVisible.value = false
      notifier('Supprime', 'success')
    })
    .catch(err => console.error(err))
}

function notifier(texte, couleur) {
  notifTexte.value   = texte
  notifCouleur.value = couleur
  notifVisible.value = true
}

onMounted(() => { chargerListe() })
</script>