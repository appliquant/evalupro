<template>
  <div class="container mt-3">
    <h1>Gérer les catégories</h1>

    <div class="row mt-5">
      <div class="col">
        <h2>Liste des catégories</h2>
        <ul class="list-group">
          <li class="list-group-item">Catégorie 1</li>
          <li class="list-group-item">Catégorie 2</li>
          <li class="list-group-item">Catégorie 3</li>
          <li class="list-group-item">Catégorie 4</li>
        </ul>

        <button class="btn btn-primary mt-2">Ajouter</button>
      </div>
      <div class="col align-items-start align-content-start justify-content-start">
        <h2>Catégorie séléctionnée</h2>

        <form>
          <div class="row">
            <div class="col">
              <input type="text" class="form-control" placeholder="Titre" aria-label="First name">
            </div>
            <div class="col">
              <select class="form-select" aria-label="Default select example">
                <option selected>Catégorie parente</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>

          <div>
            <button style="margin-right: .5rem;" class="btn btn-primary mt-2">Modifier</button>
            <button class="btn btn-outline-danger mt-2">Supprimer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>