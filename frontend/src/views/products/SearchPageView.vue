<template>
  <div class="container mt-3">
    <div>
      <p>Filtres & Triage</p>

      <!-- Filtres recherche de produits -->
      <div class="row row-cols-1 row-cols-md-2 g-4">
        <div class="col">
          <!-- Filtre par nom de produit -->
          <div>
            <input
              type="text"
              class="form-control"
              placeholder="Rechercher un produit..."
              :value="productNameFilter"
              @input="debounceSearchInput"
              aria-placeholder="Rechercher un produit..."
            />
          </div>
        </div>

        <div class="col">
          <!-- Filtre par catégorie -->
          <div>
            <select
              class="form-select"
              aria-label="Filtrer par catégorie"
              @change="debounceCategorySelect"
            >
              <option selected>Filtrer par catégorie (tous)</option>
              <option
                v-for="category in categories?.data?.categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.title }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Triage des produits -->
      <div class="row row-cols-1 row-cols-md-2 g-4 mt-1">
        <div class="col">
          <div>
            <select class="form-select" aria-label="Trier par" @change="debounceSortSelect">
              <option selected>Trier par</option>
              <option value="name-desc">Par nom</option>
              <option value="averageScore-desc">Pointage</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div v-if="productsLoading">Chargement des produits...</div>
    <div v-if="productsError" class="text-danger">{{ productsError }}</div>
    <div v-if="categoriesError" class="text-danger">{{ categoriesError }}</div>

    <!-- Liste des produits -->
    <div v-if="products?.data?.products.length > 0" class="row row-cols-1 row-cols-md-3 g-4 mt-3">
      <div class="col" v-for="product in products?.data?.products" :key="product.id">
        <div class="card h-100">
          <!-- aligner images -->
          <img
            :src="`${BACKEND_URL}/public/uploads/${product.image}`"
            class="card-img-top"
            style="width: 100%; height: 50%; object-fit: cover"
            alt="Image du produit"
          />

          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description }}</p>
            <p class="card-text">{{ product.price }} $</p>
            <RouterLink :to="`/product/${product.id}`" class="btn btn-primary"
            >Voir le produit
            </RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProducts } from '@/composables/useProducts'
import { ref } from 'vue'
import { useCategories } from '@/composables/useCategories'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const productNameFilter = ref<null | string>(null)
const productCategoryFilterId = ref<null | string>(null)
const productResultSort = ref<null | string>(null)

const { data: categories, error: categoriesError } = useCategories()

const {
  data: products,
  loading: productsLoading,
  error: productsError
} = useProducts({
  productNameFilter,
  productCategoryFilterId,
  productResultSort
})
// } = useProducts(productNameFilter, productCategoryFilterId, productResultsSort)

let timeoutId: number | null = null

const debounceSearchInput = (event: Event) => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    productNameFilter.value = (event.target as HTMLInputElement).value
  }, 300)
}

const debounceCategorySelect = (event: Event) => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    const categoryId = (event.target as HTMLSelectElement).value

    if (Number(categoryId)) {
      productCategoryFilterId.value = categoryId
    } else {
      productCategoryFilterId.value = null
    }
  }, 300)
}

const debounceSortSelect = (event: Event) => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    const sort = (event.target as HTMLSelectElement).value
    if (sort === 'name' || sort === 'averageScore') {
      productResultSort.value = sort
    } else {
      productResultSort.value = null
    }
  }, 300)
}
</script>
