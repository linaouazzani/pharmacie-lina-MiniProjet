<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Ajouter un médicament</h2>

    <v-card max-width="500" class="pa-6" elevation="2" rounded="lg">

      <v-text-field v-model="nom" label="Nom *"
        variant="outlined" class="mb-3" />

      <v-text-field v-model="quantiteParUnite" label="Quantité par unité *"
        variant="outlined" placeholder="Boîte de 16 comprimés" class="mb-3" />

      <v-text-field v-model="unitesEnStock" label="Unités en stock *"
        variant="outlined" type="number" min="0" class="mb-3" />

      <v-text-field v-model="prixUnitaire" label="Prix unitaire (€) *"
        variant="outlined" type="number" step="0.01" class="mb-3" />

      <v-text-field v-model="niveauDeReappro" label="Niveau de réapprovisionnement *"
        variant="outlined" type="number" min="0" class="mb-3" />

      <v-select
        v-model="categorieUrl"
        :items="categories"
        item-title="libelle"
        item-value="url"
        label="Catégorie *"
        variant="outlined"
        class="mb-3"
        :loading="chargementCategories"
        no-data-text="Chargement des catégories..."
      />

      <v-text-field v-model="imageURL" label="URL de l'image (optionnel)"
        variant="outlined" placeholder="https://images.unsplash.com/..."
        class="mb-2" />

      <p class="text-center text-grey text-caption mb-2">— ou sélectionner depuis le PC —</p>

      <v-file-input
        label="Choisir une image depuis le PC"
        variant="outlined"
        accept="image/*"
        prepend-icon="mdi-camera"
        class="mb-3"
        @change="lirePhoto"
      />

      <v-img v-if="imageURL" :src="imageURL" height="140" contain class="rounded mb-4" />

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
        <v-btn to="/" variant="tonal">Annuler</v-btn>
      </div>

    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import config from '@/config.js'

const router               = useRouter()
const nom                  = ref('')
const quantiteParUnite     = ref('')
const unitesEnStock        = ref(0)
const prixUnitaire         = ref(0)
const niveauDeReappro      = ref(10)
const imageURL             = ref('')
const categorieUrl         = ref('')
const categories           = ref([])
const chargementCategories = ref(true)
const chargement           = ref(false)
const erreur               = ref('')
const succes               = ref(false)

function chargerCategories() {
  fetch('https://mini-projetlina.onrender.com/api/categories')
    .then(r => r.json())
    .then(data => {
      categories.value = (data._embedded?.categories ?? []).map(cat => ({
        libelle: cat.libelle,
        url:     cat._links.self.href
      }))
      chargementCategories.value = false
    })
    .catch(() => { chargementCategories.value = false })
}

function lirePhoto(evenement) {
  const fichier = evenement.target.files[0]
  if (!fichier) { imageURL.value = ''; return }
  const lecteur = new FileReader()
  lecteur.onload = (e) => { imageURL.value = e.target.result }
  lecteur.readAsDataURL(fichier)
}

function envoyerFormulaire() {
  if (!nom.value || !quantiteParUnite.value || !categorieUrl.value) {
    erreur.value = 'Veuillez remplir tous les champs obligatoires (*).'
    return
  }
  erreur.value     = ''
  chargement.value = true

  fetch(config.apiUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom:              nom.value,
      quantiteParUnite: quantiteParUnite.value,
      prixUnitaire:     parseFloat(prixUnitaire.value),
      unitesEnStock:    parseInt(unitesEnStock.value),
      unitesCommandees: 0,
      niveauDeReappro:  parseInt(niveauDeReappro.value),
      indisponible:     false,
      imageURL:         imageURL.value || null
    })
  })
    .then(r => {
      if (!r.ok) return r.text().then(t => { throw new Error(t) })
      return r.json()
    })
    .then(medicamentCree => {
      return fetch(medicamentCree._links.self.href + '/categorie', {
        method:  'PUT',
        headers: { 'Content-Type': 'text/uri-list' },
        body:    categorieUrl.value
      })
    })
    .then(r => {
      if (!r.ok) return r.text().then(t => { throw new Error(t) })
      succes.value     = true
      chargement.value = false
      setTimeout(() => { router.push('/') }, 1500)
    })
    .catch(err => {
      console.error('Erreur :', err.message)
      erreur.value     = err.message || "Erreur lors de l'ajout."
      chargement.value = false
    })
}

onMounted(() => { chargerCategories() })
</script>