<template>
  <v-footer color="teal-darken-1" class="footer-lina">

    <!-- Partie gauche : nom et slogan -->
    <div class="footer-gauche">
      <span class="footer-nom"> Ma propre pharmacie de Lina</span>
      <span class="footer-slogan">Votre santé, notre priorité 🌸</span>
    </div>

    <!-- Partie centrale : petits icônes décoratifs -->
    <div class="footer-centre">
      <v-icon icon="mdi-heart" color="pink-lighten-3" size="16" class="mx-1" />
      <v-icon icon="mdi-pill"  color="white"          size="16" class="mx-1" />
      <v-icon icon="mdi-heart" color="pink-lighten-3" size="16" class="mx-1" />
    </div>

    <!-- Partie droite : copyright avec l'année courante -->
    <div class="footer-droite">
      <span class="text-caption">
        &copy; {{ annee }} — Lina · ISIS FIE3
      </span>
    </div>

  </v-footer>
</template>

<script setup>
// Année courante calculée automatiquement (pas besoin de la mettre à jour chaque année)
const annee = new Date().getFullYear()
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
}
</style>