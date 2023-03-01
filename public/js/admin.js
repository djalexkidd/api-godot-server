function deleteLeaderboard(name) {
    confirm('⚠️ Voulez-vous vraiment supprimer ce jeu ?')

    fetch('/admin/delete/' + name,  {
      method: 'DELETE'
    }).then(() => location.reload());
};