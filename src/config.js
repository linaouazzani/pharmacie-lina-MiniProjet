// config.js
// Fichier de configuration centrale
// Si je veux changer de pharmacie, je modifie juste ici
// Si j'écrivais l'URL directement dans chaque page, je devrais
// la modifier à 4 endroits différents si elle change.
// Ici je la déclare UNE SEULE FOIS → principe DRY (Don't Repeat Yourself) que j ai vu dans le document pour respecter le clean code
export default {
  apiUrl:    'https://apipharmacie.pecatte.fr/api/4/medicaments',
  imagesUrl: 'https://apipharmacie.pecatte.fr/images/'
}