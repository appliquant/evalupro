<template>
  <div class="container mt-3">
    <p v-if="productLoading" class="text-info">Chargement...</p>
    <p v-if="productError" class="text-danger">{{ productError }}</p>

    <div v-if="product?.data?.product" class="row row-cols-1 row-cols-sm-2">
      <div class="col">
        <img
          :src="`${BACKEND_URL}/public/uploads/${product.data.product.image}`"
          style="width: 100%"
          class="card-img-top"
          alt="Image du produit"
        />
      </div>

      <div class="col h-100">
        <h1 class="">{{ product.data.product.name }}</h1>
        <p>
          <span class="badge rounded-pill text-bg-light">{{ product.data.category.title }}</span>
          Par
          <strong>{{ product.data.product.brand }}</strong>
        </p>

        <div class="d-flex gap-2 align-items-start">
          <p class="fw-bolder">{{ product.data.product.price }} $</p>
          <p>pointage : {{ product.data.product.averageScore }}</p>
        </div>

        <p class="">{{ product.data.product.description }}</p>

        <p>todo: commentaires des testeurs</p>
        <p>todo: pointages des criteres</p>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { useProduct } from '@/composables/useProduct'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const route = useRoute()
const productId = ref<null | string>(null)
const {
  data: product,
  loading: productLoading,
  error: productError
} = useProduct(productId)

watchEffect(() => {
  console.log('route id ', route.params.id)
  const id = route.params.id
  if (id) {
    productId.value = id instanceof Array ? id[0] : id
  }
})

</script>
