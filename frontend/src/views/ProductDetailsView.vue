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
        <h1>{{ product.data.product.name }}</h1>

        <div class="d-flex align-items-baseline flex-wrap gap-2">
          <p>Par
            <strong>{{ product.data.product.brand }}</strong>
          </p>
          <span class="badge rounded-pill text-bg-light">{{ product.data.category.title }}</span>
          <button class="btn btn-link my-0 py-0" @click.prevent="addFavorite">&hearts; Ajouter aux favoris</button>
        </div>


        <div class="d-flex gap-2 align-items-start">
          <p class="fw-bolder">{{ product.data.product.price }} $</p>
          <p>pointage : {{ product.data.product.averageScore }}</p>
        </div>

        <p>{{ product.data.product.description }}</p>

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
import { favoritesService } from '@/services/favoritesService'
import type { ApiResponseType } from '@/types'
import { push } from 'notivue'
import { useAuthStore } from '@/stores/authStore'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const route = useRoute()
const authStore = useAuthStore()
const productId = ref<null | string>(null)
const {
  data: product,
  loading: productLoading,
  error: productError
} = useProduct(productId)

watchEffect(() => {
  const id = route.params.id
  if (id) {
    productId.value = id instanceof Array ? id[0] : id
  }
})

const addFavorite = async () => {
  try {
    if (!productId.value) return

    const res = await favoritesService.addFavorite(
      authStore.jwt,
      productId.value
    )

    if (res.status !== 200) {
      return push.error({
        title: 'Erreur',
        message: res.message,
        duration: 5000
      })
    }

    push.success({
      title: 'Succès',
      message: 'Produit ajouté aux favoris',
      duration: 5000
    })
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: 'Erreur',
      message: err.message,
      duration: 5000
    })
  }
}

</script>
