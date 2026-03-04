<template>
  <v-footer color="purple-darken-2" class="footer-lina">

    <!-- Partie gauche : nom et slogan -->
    <div class="footer-gauche">
      <span class="footer-nom"> La Pharmacie Virtuelle de Lina</span>
      <span class="footer-slogan">Votre santé, notre priorité 🌸</span>
    </div>

    <!-- Partie centrale : icônes décoratifs -->
    <div class="footer-centre">
      <v-icon icon="mdi-heart" color="pink-lighten-3" size="16" class="mx-1" />
      <v-icon icon="mdi-pill"  color="white"          size="16" class="mx-1" />
      <v-icon icon="mdi-heart" color="pink-lighten-3" size="16" class="mx-1" />
    </div>

    <!-- Partie droite : bouton contact + copyright -->
    <div class="footer-droite">
      <v-btn
        variant="outlined"
        color="white"
        size="small"
        prepend-icon="mdi-email"
        class="mb-2"
        @click="dialogContact = true"
      >
        Nous contacter
      </v-btn>
      <br/>
      <span class="text-caption">
        &copy; {{ annee }} — Lina · ISIS FIE3
      </span>
    </div>

  </v-footer>

  <!-- Dialog formulaire de contact -->
  <v-dialog v-model="dialogContact" max-width="450">
    <v-card rounded="lg">
      <v-card-title class="pt-5 px-5 text-purple-darken-2 font-weight-bold">
        <v-icon icon="mdi-email" class="mr-2" />
        Nous contacter
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="emailExpediteur"
          label="Votre email *"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          class="mb-3"
        />
        <v-text-field
          v-model="sujet"
          label="Sujet *"
          variant="outlined"
          prepend-inner-icon="mdi-text-short"
          class="mb-3"
        />
        <v-textarea
          v-model="message"
          label="Votre message *"
          variant="outlined"
          rows="4"
          prepend-inner-icon="mdi-message"
        />
        <v-alert v-if="erreurContact" type="error" variant="tonal" class="mt-2">
          {{ erreurContact }}
        </v-alert>
        <v-alert v-if="succesContact" type="success" variant="tonal" class="mt-2">
          Message envoyé avec succès ! ✓
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialogContact = false">Annuler</v-btn>
        <v-btn
          color="purple-darken-2"
          variant="flat"
          :loading="envoi"
          prepend-icon="mdi-send"
          @click="envoyerMessage"
        >
          Envoyer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref } from 'vue'

const annee          = new Date().getFullYear()
const dialogContact  = ref(false)
const emailExpediteur = ref('')
const sujet          = ref('')
const message        = ref('')
const envoi          = ref(false)
const erreurContact  = ref('')
const succesContact  = ref(false)

function envoyerMessage() {
  if (!emailExpediteur.value || !sujet.value || !message.value) {
    erreurContact.value = 'Veuillez remplir tous les champs.'
    return
  }
  erreurContact.value = ''
  envoi.value = true

  fetch('https://mini-projetlina.onrender.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      expediteur: emailExpediteur.value,
      sujet:      sujet.value,
      message:    message.value
    })
  })
    .then(r => {
      if (!r.ok) throw new Error('Erreur envoi')
      succesContact.value = true
      emailExpediteur.value = ''
      sujet.value = ''
      message.value = ''
      setTimeout(() => {
        dialogContact.value = false
        succesContact.value = false
      }, 2000)
    })
    .catch(() => {
      erreurContact.value = "Erreur lors de l'envoi. Réessayez."
    })
    .finally(() => { envoi.value = false })
}
</script>

<style scoped>
.footer-lina {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  min-height: 50px;
  flex-wrap: wrap;
  gap: 8px;
}

.footer-gauche {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-nom {
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.footer-slogan {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.75rem;
  font-style: italic;
}

.footer-centre {
  display: flex;
  align-items: center;
}

.footer-droite {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
</style>
```

---

## 3. Changer `teal` en `purple` partout dans `index.vue`

Dans ton `index.vue`, remplace toutes les occurrences de `teal` par `purple` — il y en a environ 6 :
```
color="teal"  →  color="purple-darken-2"
text-teal     →  text-purple-darken-2