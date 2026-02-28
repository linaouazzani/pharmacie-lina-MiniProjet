// services/medicaments.js
// Toutes les fonctions qui communiquent avec l'API sont ici
// Comme ça mes pages restent propres et lisibles

import config from '@/config.js'

// Récupérer tous les médicaments
export function recupererTous() {
  return fetch(config.apiUrl)
    .then(reponse => reponse.json())
}

// Ajouter un nouveau médicament
export function creerMedicament(donnees) {
  return fetch(config.apiUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(donnees)
  })
    .then(reponse => reponse.json())
}

// Modifier un médicament existant (l'ID est dans le body)
export function mettreAJour(donnees) {
  return fetch(config.apiUrl, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(donnees)
  })
    .then(reponse => reponse.json())
}

// Supprimer un médicament par son ID
export function effacer(id) {
  return fetch(config.apiUrl + '/' + id, {
    method: 'DELETE'
  })
    .then(reponse => reponse.json())
}