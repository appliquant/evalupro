<template>
  <div class="container mt-3">
    <h1>Gérer les produits</h1>

    <div class="row mt-5">
      <div class="col">
        <h2>Liste des produits</h2>
        <ul class="list-group">
          <li class="list-group-item">Produit 1</li>
          <li class="list-group-item">Produit 2</li>
          <li class="list-group-item">Produit 3</li>
          <li class="list-group-item">Produit 4</li>
        </ul>

        <button class="btn btn-primary mt-2">Ajouter</button>
      </div>
      <div class="col align-items-start align-content-start justify-content-start">
        <h2>Produit séléctionné</h2>

        <form>
          <div class="row mb-2">
            <div class="col">
              <input type="text" class="form-control" placeholder="Nom" aria-label="First name">
            </div>
            <div class="col">
              <select class="form-select" aria-label="Default select example">
                <option selected>Catégorie</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>

         <div class="row mb-2">
            <div class="col">
              <input type="text" class="form-control" placeholder="Marque" aria-label="First name">
            </div>
           
             <div class="col">
              <input type="text" class="form-control" placeholder="Description" aria-label="First name">
            </div>
          </div> 
          
          <div class="row">
            <div class="col">
              <input type="text" class="form-control" placeholder="Prix" aria-label="First name">
            </div>
           
             <div class="col">
               <input class="form-control" type="file" id="formFile">
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