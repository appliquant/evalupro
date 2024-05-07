<template>
  <div class="container mt-3">
    <h1>Rechercher</h1>

    <!-- Recherche de produits -->
    <div class="row row-cols-1 row-cols-md-2 g-4">
      <div class="col">
        <!--          v-model="products.search"-->
        <input
          type="text"
          class="form-control"
          placeholder="Rechercher un produit..."
        />
      </div>

      <!--          @click="products.searchProducts"-->
      <div class="col">
        <button
          class="btn btn-primary"
        >Rechercher
        </button>
      </div>
    </div>

    <!-- Liste des produits -->
    <div class="row row-cols-1 row-cols-md-3 g-4 mt-3">
      <div class="col" v-for="product in products?.data?.products" :key="product.id">
        <div class="card h-100">
          <img
            :src="`${BACKEND_URL}/public/uploads/${product.image}`"
            class="card-img-top"
            alt="Image du produit"
          />

          <div class="card-body">
            <h5 class="card-title
            ">{{ product.name }}</h5>
            <p class="card-text">{{ product.description }}</p>
            <p class="card-text">{{ product.price }} $</p>
            <a
              href="#"
              class="btn btn-primary"
            >Voir le produit
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProducts } from '@/composables/useProducts'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const {
  data: products,
  loading: productsLoading,
  error: productsError
} = useProducts()
</script>