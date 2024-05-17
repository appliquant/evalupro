<template>
  <div class="container mt-3">


    <!-- Erreurs -->
    <p v-if="productsError" class="text-danger">{{ productsError }}</p>
    <p v-if="categoriesError" class="text-danger">{{ categoriesError }}</p>

    <section>
      <h1>Comparer deux produits</h1>
      <p>Sélectionnez deux produits de la même catégorie à comparer.</p>

      <select class="form-select form-select-sm mb-2"
              aria-label="Filter par catégories"
              @change="onCategoryChange">
        <option selected>Sélectionnez une catégorie</option>
        <option v-for="category in categories?.data?.categories"
                :key="category.id"
                :value="category.id">
          {{ category.title }}
        </option>
      </select>


      <select :disabled="selectedCategoryId === null"
              class="form-select form-select-sm mb-2"
              aria-label="Sélectionnez le premier produit à comparer"
              @change="onFirstProductChange">
        <option selected>Sélectionnez un produit</option>
        <option
          v-for="product in products?.data?.products"
          :key="product.id"
          :value="product.id"
        >{{ product.name }}
        </option>
      </select>


      <select :disabled="selectedFirstProductId === null"
              class="form-select form-select-sm mb-2"
              aria-label="Sélectionnez le deuxième produit à comparer"
              @change="onSecondProductChange">
        <option selected>Sélectionnez un autre produit</option>
        <option
          v-for="product in filteredProductsWithoutSelectedFirstProduct"
          :key="product.id"
          :value="product.id"
        >{{ product.name }}
        </option>
      </select>

    </section>

    <!-- Tableau de comparaison -->
    <section class="mt-3">
      <table class="table">
        <thead>
        <tr>
          <th scope="col">Caractéristique</th>
          <th scope="col">Produit A</th>
          <th scope="col">Produit B</th>
        </tr>
        </thead>

        <tbody>

        <!-- Marque -->
        <tr>
          <td>Marque</td>
          <td>{{ firstProduct?.data?.product.brand }}</td>
          <td>{{ secondProduct?.data?.product.brand }}</td>
        </tr>

        <!-- Nom -->
        <tr>
          <td>Nom</td>
          <td>{{ firstProduct?.data?.product.name }}</td>
          <td>{{ secondProduct?.data?.product.name }}</td>
        </tr>

        <!-- Catégorie -->
        <tr>
          <td>Catégorie</td>
          <td>{{ firstProduct?.data?.category.title }}</td>
          <td>{{ secondProduct?.data?.category.title }}</td>
        </tr>

        <!-- Critères d'évaluations -->
        <tr>
          <td style="max-width: 30pt">Critères d'évaluations (avec moyennes des notes par les testeurs)</td>
          <td>
            <ul>
              <li v-for="criteria in firstProduct?.data?.criterias"
                  :key="criteria.id"
              >
                {{ criteria.name }}
                {{ firstProduct?.data?.criteriasScores?.find((elm: any) => elm.criteriaId === criteria.id)?.averageScore
                }}
              </li>
            </ul>
          </td>

          <td>
            <ul>
              <li v-for="criteria in secondProduct?.data?.criterias"
                  :key="criteria.id"
              >
                {{ criteria.name }}
                {{ secondProduct?.data?.criteriasScores?.find((elm: any) => elm.criteriaId === criteria.id)?.averageScore
                }}
              </li>
            </ul>
          </td>
        </tr>

        <!-- Description -->
        <tr>
          <td>Description</td>
          <td>{{ firstProduct?.data?.product.description }}</td>
          <td>{{ secondProduct?.data?.product.description }}</td>
        </tr>

        <!-- Prix -->
        <tr>
          <td>Prix</td>
          <td>{{ formatPrice(firstProduct?.data?.product.price) }}</td>
          <td>{{ formatPrice(secondProduct?.data?.product.price) }}</td>
        </tr>

        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useProducts } from '@/composables/useProducts'
import { useCategories } from '@/composables/useCategories'
import { computed, ref, watchEffect } from 'vue'
import type { Product } from '@/types'
import { useProduct } from '@/composables/useProduct'

const selectedCategoryId = ref<string | null>(null)
const selectedFirstProductId = ref<string | null>(null)
const selectedSecondProductId = ref<string | null>(null)

const formatPrice = (price: any) => {
  if (isNaN(price)) {
    return ''
  }

  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(price)
}

const filteredProductsWithoutSelectedFirstProduct = computed(() => {
  if (!selectedFirstProductId.value) {
    return []
  }

  return products?.value?.data?.products.filter((product: Product) => {
    return product.id.toString() !== selectedFirstProductId?.value
  })
})

const {
  data: products,
  error: productsError
} = useProducts({
  productCategoryFilterId: selectedCategoryId
})

const {
  data: categories,
  error: categoriesError
} = useCategories()

const {
  data: firstProduct
} = useProduct(selectedFirstProductId)

const {
  data: secondProduct
} = useProduct(selectedSecondProductId)

watchEffect(() => {
  if (!selectedCategoryId.value) {
    selectedFirstProductId.value = null
    selectedSecondProductId.value = null
  }
})

const onCategoryChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value

  if (Number(value)) {
    selectedCategoryId.value = value
  } else {
    selectedCategoryId.value = null
  }
}

const onFirstProductChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value

  if (Number(value)) {
    selectedFirstProductId.value = value
  } else {
    selectedFirstProductId.value = null
  }
}


const onSecondProductChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value

  if (Number(value)) {
    selectedSecondProductId.value = value
  } else {
    selectedSecondProductId.value = null
  }
}
</script>