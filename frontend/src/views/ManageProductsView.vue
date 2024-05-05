<template>
  <div class="container mt-3">
    <h1>Gérer les produits</h1>

    <div class="row row-cols-1 row-cols-sm-2">
      <div class="col">

        <div class="d-flex justify-content-between w-100 mb-3">
          <h2>Liste des produits</h2>
          <button class="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#addProductModal">Ajouter
          </button>

        </div>

        <ul v-if="products?.data?.products?.length > 0" class="list-group" id="list-container">
          <li v-for="product in products?.data?.products" :key="product.id"
              :class="'list-group-item list-group-item-action'"
          >
            {{ product }}
          </li>
        </ul>
        <p v-else-if="productsLoading">Chargement...</p>
        <p v-else-if="productsError" class="text-center text-danger">{{ productsError }}</p>
        <p v-else-if="products?.data?.products?.length <= 0">Aucun produit trouvé</p>

      </div>

      <div class="col"></div>
    </div>

    <!-- Modal ajout produit -->
    <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="modalAddProductLabel"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modalAddProductLabel">Ajouter produit</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation" novalidate>

              <!-- Titre -->
              <div>
                <label for="newCategoryTitleInput" class="form-label">Titre</label>
                <!--                <input v-model="newCategoryPayload.title"-->
                <!--                       @input="removeErrors('newCategoryTitle')"-->
                <!--                       :minlength="dataLengthValidations?.categoryTitle?.minlength"-->
                <!--                       :maxlength="dataLengthValidations?.categoryTitle?.maxlength"-->
                <!--                       type="text"-->
                <!--                       class="form-control"-->
                <!--                       aria-describedby="newCategoryTitleInvalidFeedback newCategoryTitleHelpBlock"-->
                <!--                       id="newCategoryTitleInput" required>-->
                <!--                <div id="newCategoryTitleInvalidFeedback" class="invalid-feedback">-->
                <!--                </div>-->
                <!--                <div id="newCategoryTitleHelpBlock" class="form-text">-->
                <!--                  Entre 3 et 25 caractères-->
                <!--                </div>-->
              </div>

              <!-- Catégorie parente -->
              <div class="mt-3">
                <!--                <label for="newCategoryParentSelect">Catégorie parente</label>-->
                <!--                <select id="newCategoryParentSelect" class="form-select" v-model="newCategoryPayload.parentCategoryName"-->
                <!--                        aria-describedby="newCategoryParentHelpBlock"-->
                <!--                        aria-label="Sélectionner catégorie parente">-->
                <!--                  <option value="1">One</option>-->
                <!--                  <option value="2">Two</option>-->
                <!--                  <option value="3">Three</option>-->
                <!--                </select>-->
                <!--                <div id="newCategoryParentHelpBlock" class="form-text">-->
                <!--                  Sélectionner une catégorie parente-->
                <!--                </div>-->
              </div>

              <!--              <p class="mt-3 text-success" id="newCategorySuccessMessage"></p>-->
            </form>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-primary" @click.prevent="">Ajouter</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useProducts } from '@/composables/useProducts'

const {
  data: products,
  loading: productsLoading,
  error: productsError,
  reload: productsReload
} = useProducts()
</script>

<style lang="scss">
#list-container {
  max-height: 50dvh;
  overflow-y: auto;
}
</style>