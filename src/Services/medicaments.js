// services/medicaments.js
// Utilise config.apiUrl qui passe par le proxy Vite

import config from '@/config.js'

export function recupererTous() {
  return fetch(config.apiUrl)
    .then(r => r.json())
    .then(data => data._embedded?.medicaments ?? [])
}

export function creerMedicament(donnees) {
  return fetch(config.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donnees)
  }).then(r => r.json())
}

// selfUrl = med._links.self.href (URL complète de Render)
export function mettreAJour(selfUrl, donnees) {
  return fetch(selfUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donnees)
  }).then(r => r.json())
}

export function effacer(selfUrl) {
  return fetch(selfUrl, { method: 'DELETE' })
}