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
          <div v-if="isUserLoggedIn">
            <button v-if="!isFavorite" class="btn btn-link" @click.prevent="addFavorite">&hearts; Ajouter aux
              favoris
            </button>
            <button v-else class="btn btn-link my-0 py-0" @click.prevent="removeFavorite">
              &#10006; Retirer des favoris
            </button>
          </div>
        </div>


        <div>
          <h6>Critères d'évaluations</h6>
          <div class="d-flex gap-2 mb-2">
            <span v-for="criteria in product?.data?.criterias" :key="criteria.id" class="badge bg-primary rounded-pill">
            {{ criteria.name }}
          </span>
          </div>
        </div>

        <!-- Aller vers page de l'évaluation -->
        <div v-show="canCreateEvaluation" class="my-3">
          <RouterLink
            :to="`/create-evaluation-tester/${product.data.product.id}`"
            class="btn btn-outline-dark btn-sm"
          >★ Évaluer ce produit
          </RouterLink>
        </div>

        <div class="d-flex gap-2 align-items-start">
          <p class="fw-bolder">{{ product.data.product.price }} $</p>
          <div v-if="isUserLoggedIn">
            <p v-if="product.data?.averageScore">
              Pointage moyen : {{ product.data?.averageScore + '%' }}
            </p>
          </div>
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
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { favoritesService } from '@/services/favoritesService'
import { type ApiResponseType, UserRoles } from '@/types'
import { push } from 'notivue'
import { useAuthStore } from '@/stores/authStore'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const route = useRoute()
const authStore = useAuthStore()

const isFavorite = ref(false)
const isUserLoggedIn = computed(() => {
  return authStore.jwt !== ''
})

const canCreateEvaluation = computed(() => {
  return isUserLoggedIn.value && authStore.role === UserRoles.TESTER && product.value?.data?.product
})

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

  if (isUserLoggedIn.value && productId.value) {
    checkIfProductIsFavorite()
  }
})


async function checkIfProductIsFavorite() {
  if (!product.value) return false

  try {
    const res = await favoritesService.checkIfProductIsFavorite(
      authStore.jwt,
      product.value?.data?.product.id
    )

    return res?.data?.isFavorite ? isFavorite.value = true : isFavorite.value = false
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: 'Erreur',
      message: err.message,
      duration: 5000
    })
  }
}

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

    checkIfProductIsFavorite()
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: 'Erreur',
      message: err.message,
      duration: 5000
    })
  }
}

const removeFavorite = async () => {
  try {
    if (!productId.value) return

    const res = await favoritesService.removeFavorite(
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
      message: 'Produit retiré des favoris',
      duration: 3000
    })

    checkIfProductIsFavorite()

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
