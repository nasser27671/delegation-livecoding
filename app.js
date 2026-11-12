const corpsTableau = document.querySelector('#usersTable tbody');
const URL_API = 'https://jsonplaceholder.typicode.com/users';
let utilisateurs = [];

// Affiche la liste des utilisateurs dans le tableau
function renderList() {
  corpsTableau.innerHTML = '';

  for (const user of utilisateurs) {
    const ligne = document.createElement('tr');

    const celluleNom = document.createElement('td');
    celluleNom.textContent = user.name;

    const celluleEmail = document.createElement('td');
    celluleEmail.textContent = user.email;

    const celluleActions = document.createElement('td');

    const boutonEdit = document.createElement('button');
    boutonEdit.textContent = 'Edit';
    boutonEdit.dataset.id = user.id;
    boutonEdit.dataset.action = 'edit';

    const boutonDelete = document.createElement('button');
    boutonDelete.textContent = 'Delete';
    boutonDelete.dataset.id = user.id;
    boutonDelete.dataset.action = 'delete';

    celluleActions.appendChild(boutonEdit);
    celluleActions.appendChild(boutonDelete);
    ligne.appendChild(celluleNom);
    ligne.appendChild(celluleEmail);
    ligne.appendChild(celluleActions);
    corpsTableau.appendChild(ligne);
  }
}

// Fetch GET : récupère les utilisateurs depuis l'API
async function chargerUtilisateurs() {
  try {
    const reponse = await fetch(URL_API);
    if (!reponse.ok) throw new Error('Erreur serveur');
    utilisateurs = await reponse.json();
    renderList();
  } catch (erreur) {
    alert('Chargement impossible : ' + erreur.message);
  }
}

// Écouteur unique sur le tbody (délégation d'événements)

// 1. Ajouter un seul écouteur d'événements sur corpsTableau
// Il permet de gérer les clics sur tous les boutons du tableau
corpsTableau.addEventListener('click', async function (evenement) {

  // 2. Récupérer le bouton qui a été cliqué
  // closest('button') cherche le bouton le plus proche de l'élément cliqué
  const bouton = evenement.target.closest('button');

  // Si aucun bouton n'est trouvé, arrêter l'exécution
  if (!bouton) return;

  // 3. Récupérer l'identifiant de l'utilisateur et l'action du bouton
  // dataset.id récupère data-id
  // dataset.action récupère data-action
  const id = bouton.dataset.id;
  const action = bouton.dataset.action;

  // 4. Vérifier si l'action demandée est la suppression
  if (action === 'delete') {

    // 5. Utiliser try/catch pour gérer les erreurs possibles
    try {

      // Envoyer une requête DELETE à l'API pour supprimer l'utilisateur
      // await attend la réponse du serveur
      const reponse = await fetch(URL_API + '/' + id, {
        method: 'DELETE'
      });

      // Vérifier si la requête a réussi
      // Si ce n'est pas le cas, déclencher une erreur
      if (!reponse.ok) throw new Error('Erreur serveur');

      // 6. Chercher la position de l'utilisateur dans le tableau
      const position = utilisateurs.findIndex(user => user.id == id);

      // 7. Si l'utilisateur existe, le supprimer du tableau
      // splice(position, 1) supprime un seul élément
      if (position > -1) utilisateurs.splice(position, 1);

      renderList();
      alert('Utilisateur supprimé');

    } catch (erreur) {

      alert('Échec de la suppression : ' + erreur.message);
    }
  }

  // n'est pas encore implémentée
});

// 10. Charger les utilisateurs au démarrage
chargerUtilisateurs();
