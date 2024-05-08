<template>
  <div class="container">
    <h1>Gérer les critères</h1>

    <div class="row row-cols-1 row-cols-sm-2 2">
      <div class="col">
        <div class="d-flex justify-content-between w-100 mb-3">
          <h2>Liste des critères</h2>
          <button
            class="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#addCriteriaModal"
          >
            Ajouter
          </button>
        </div>
      </div>

      <div class="col"></div>
    </div>

    <!-- Modal ajout critère -->
    <div
      class="modal fade"
      id="addCriteriaModal"
      tabindex="-1"
      aria-labelledby="addCriteriaModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addCriteriaModalLabel">Ajouter un critère</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body"></div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary">Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
