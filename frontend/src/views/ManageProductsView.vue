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
            <h5 class="mb-1">{{ product.name }}</h5>
            <p class="mb-1">{{ product.description }}</p>
            <small>{{ product.brand }}</small>
          </li>
        </ul>
        <p v-else-if="productsLoading">Chargement...</p>
        <p v-else-if="productsError" class="text-center text-danger">{{ productsError }}</p>
        <p v-else-if="products?.data?.products?.length <= 0">Aucun produit trouvé</p>

      </div>

      <div class="col"></div>
    </div>

    <!-- Modal ajout produit -->
    <div class="modal modal-dialog-scrollable fade" id="addProductModal" tabindex="-1"
         aria-labelledby="modalAddProductLabel"
         aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modalAddProductLabel" @click.prevent="createProduct">Ajouter produit</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation" novalidate enctype="multipart/form-data">

              <!-- Nom -->
              <div>
                <label for="newProductNameInput" class="form-label">Nom</label>
                <input type="text"
                       v-model="newProductPayload.name"
                       @input="removeErrors('newProductNameInput')"
                       :minlength="dataLengthValidations?.productName?.minlength"
                       :maxlength="dataLengthValidations?.productName?.maxlength"
                       class="form-control"
                       id="newProductNameInput"
                       aria-describedby="newProductNameHelpBlock newProductNameInputInvalidFeedback"
                       required>

                <div id="newProductNameInputInvalidFeedback" class="invalid-feedback">
                </div>
                <div id="newProductNameHelpBlock" class="form-text">
                  Entre {{ dataLengthValidations?.productName?.minlength }} et
                  {{ dataLengthValidations?.productName?.maxlength }} caractères
                </div>
              </div>

              <!-- Marque -->
              <div class="mt-3">
                <label for="newProductBrandInput" class="form-label">Marque</label>
                <input type="text"
                       v-model="newProductPayload.brand"
                       @input="removeErrors('newProductBrandInput')"
                       :minlength="dataLengthValidations?.productBrand?.minlength"
                       :maxlength="dataLengthValidations?.productBrand?.maxlength"
                       class="form-control"
                       id="newProductBrandInput"
                       aria-describedby="newProductBrandHelpBlock newProductBrandInputInvalidFeedback"
                       required>

                <div id="newProductBrandInputInvalidFeedback" class="invalid-feedback">
                </div>
                <div id="newProductBrandHelpBlock" class="form-text">
                  Entre {{ dataLengthValidations?.productBrand?.minlength }} et
                  {{ dataLengthValidations?.productBrand?.maxlength }} caractères
                </div>
              </div>

              <!-- Catégorie -->
              <div class="mt-3">
                <label for="newProductCategorySelect">Catégorie</label>
                <select id="newProductCategorySelect"
                        @change="removeErrors('newProductCategorySelect')"
                        v-model="newProductPayload.category"
                        class="form-select"
                        aria-describedby="newProductCategorySelectHelpBlock newProductCategorySelectInvalidFeedback"
                        aria-label="Sélectionner catégorie parente"
                >
                  <option
                    v-for="category in categories?.data?.categories"
                    :key="category.id"
                    :value="category.id">{{ category.title }}
                  </option>
                </select>
                <div id="newProductCategorySelectInvalidFeedback" class="invalid-feedback">
                </div>
                <div id="newProductCategorySelectHelpBlock" class="form-text text-info-emphasis">
                  Vous devez toujours sélectionner une catégorie afin de créer un produit
                </div>
                <div class="d-flex flex-column align-items-start" v-if="categories?.data?.categories?.length <= 0">
                  <RouterLink to="/manage-categories" target="_blank">Ajouter une catégorie</RouterLink>
                  <button class="btn btn-link p-0" @click.prevent="categoriesReload">Recharger catégories</button>
                </div>
              </div>

              <div v-if="categoriesError" class="text-danger mt-3">
                {{ categoriesError }}
              </div>

              <!-- Description -->
              <div class="mt-3">
                <label for="newProductDescriptionTextarea" class="form-label">Description</label>
                <textarea class="form-control"
                          v-model="newProductPayload.description"
                          @input="removeErrors('newProductDescriptionTextarea')"
                          :minlength="dataLengthValidations?.productDescription?.minlength"
                          :maxlength="dataLengthValidations?.productDescription?.maxlength"
                          id="newProductDescriptionTextarea"
                          aria-describedby="newProductDescriptionHelpBlock newProductDescriptionTextAreaInvalidFeedback"
                          required></textarea>

                <div id="newProductDescriptionTextAreaInvalidFeedback" class="invalid-feedback">
                </div>
                <div id="newProductDescriptionHelpBlock" class="form-text">
                  Entre {{ dataLengthValidations?.productDescription?.minlength }} et
                  {{ dataLengthValidations?.productDescription?.maxlength }} caractères
                </div>
              </div>

              <!-- Prix -->
              <div class="mt-3">
                <label for="newProductPriceInput" class="form-label">Prix</label>
                <input type="number"
                       v-model="newProductPayload.price"
                       @input="removeErrors('newProductPriceInput')"
                       :min="dataLengthValidations?.productPrice?.minlength"
                       :max="dataLengthValidations?.productPrice?.maxlength"
                       class="form-control"
                       id="newProductPriceInput"
                       aria-describedby="newProductPriceHelpBlock newProductPriceInputInvalidFeedback"
                       required>

                <div id="newProductPriceInputInvalidFeedback" class="invalid-feedback">
                </div>
                <div id="newProductPriceHelpBlock" class="form-text">
                  Prix du produit en dollar (ex : 1200.99)
                </div>
              </div>

              <!-- Image -->
              <div class="mt-3">
                <label for="newProductImageInput" class="form-label">Image</label>
                <input type="file"
                       @change="event => {onImageSelected(event, 'createProduct');removeErrors('newProductImageInput')}"
                       class="form-control"
                       id="newProductImageInput"
                       accept="image/*"
                       capture="environment"
                       aria-describedby="newProductImageHelpBlock newProductImageInputInvalidFeedback"
                       required>

                <div id="newProductImageInputInvalidFeedback" class="invalid-feedback">
                </div>
                <div id="newProductImageHelpBlock" class="form-text">
                  Image du produit
                </div>
              </div>

              <p class="mt-3 text-success" id="newProductSuccessMessage"></p>
            </form>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-primary" @click.prevent="createProduct">Ajouter</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useProducts } from '@/composables/useProducts'
import { dataLengthValidations } from '@/validations'
import { onMounted, onUnmounted, ref } from 'vue'
import type { ApiResponseType, ValidationError } from '@/types'
import { useCategories } from '@/composables/useCategories'
import { push } from 'notivue'
import { productsService } from '@/services/productsService'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const {
  data: products,
  loading: productsLoading,
  error: productsError,
  reload: productsReload
} = useProducts()

const {
  data: categories,
  loading: categoriesLoading,
  error: categoriesError,
  reload: categoriesReload
} = useCategories()

const newProductPayload = ref({
  name: '',
  brand: '',
  category: '',
  description: '',
  price: 0,
  image: null as File | null
})

let newProductNameInput: null | HTMLInputElement
let newProductNameInputInvalidFeedback: null | HTMLDivElement
let newProductBrandInput: null | HTMLInputElement
let newProductBrandInputInvalidFeedback: null | HTMLDivElement
let newProductCategorySelect: null | HTMLSelectElement
let newProductCategorySelectInvalidFeedback: null | HTMLDivElement
let newProductDescriptionTextarea: null | HTMLTextAreaElement
let newProductDescriptionTextAreaInvalidFeedback: null | HTMLDivElement
let newProductPriceInput: null | HTMLInputElement
let newProductPriceInputInvalidFeedback: null | HTMLDivElement
let newProductImageInput: null | HTMLInputElement
let newProductImageInputInvalidFeedback: null | HTMLDivElement
let newProductSuccessMessage: null | HTMLParagraphElement

onMounted(() => {
  newProductNameInput = document.getElementById('newProductNameInput') as HTMLInputElement
  newProductNameInputInvalidFeedback = document.getElementById('newProductNameInputInvalidFeedback') as HTMLDivElement
  newProductBrandInput = document.getElementById('newProductBrandInput') as HTMLInputElement
  newProductBrandInputInvalidFeedback = document.getElementById('newProductBrandInputInvalidFeedback') as HTMLDivElement
  newProductCategorySelect = document.getElementById('newProductCategorySelect') as HTMLSelectElement
  newProductCategorySelectInvalidFeedback = document.getElementById('newProductCategorySelectInvalidFeedback') as HTMLDivElement
  newProductDescriptionTextarea = document.getElementById('newProductDescriptionTextarea') as HTMLTextAreaElement
  newProductDescriptionTextAreaInvalidFeedback = document.getElementById('newProductDescriptionTextAreaInvalidFeedback') as HTMLDivElement
  newProductPriceInput = document.getElementById('newProductPriceInput') as HTMLInputElement
  newProductPriceInputInvalidFeedback = document.getElementById('newProductPriceInputInvalidFeedback') as HTMLDivElement
  newProductImageInput = document.getElementById('newProductImageInput') as HTMLInputElement
  newProductImageInputInvalidFeedback = document.getElementById('newProductImageInputInvalidFeedback') as HTMLDivElement
  newProductSuccessMessage = document.getElementById('newProductSuccessMessage') as HTMLParagraphElement

  document.addEventListener('hidden.bs.modal', () => {
    emptyNewProductData()
  })
})

onUnmounted(() => {
  // Événement de fermeture du modal bootstrap
  document.removeEventListener('hidden.bs.modal', () => {
    emptyNewProductData()
  })
})

const onImageSelected = (event: Event, action: 'createProduct' | 'updateProduct') => {
  if (action === 'createProduct') {
    const file = ((event?.target) as HTMLInputElement)?.files?.[0]
    if (file) {
      newProductPayload.value.image = file
    }
  }
}

const createProduct = async () => {
  if (newProductSuccessMessage) newProductSuccessMessage.innerText = ''

  const validationErrors = validations('createProduct')
  if (validationErrors.length > 0) {
    validationErrors.forEach(error => showErrors(error))
    return
  }

  try {
    const formData: FormData = new FormData()
    formData.append('name', newProductPayload.value.name)
    formData.append('brand', newProductPayload.value.brand)
    formData.append('category', newProductPayload.value.category)
    formData.append('description', newProductPayload.value.description)
    formData.append('price', newProductPayload.value.price.toString())
    formData.append('image', newProductPayload.value.image as Blob)

    const res = await productsService.createProduct(
      authStore.jwt,
      formData)

    if (res.errors && res.errors.length > 0) {
      res.errors.forEach((error: ValidationError) => showErrors(error))
      return
    }

    if (res.status === 201) {
      if (newProductSuccessMessage) newProductSuccessMessage.innerText = res.message
      productsReload()
    }
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: 'Erreur',
      message: err.message,
      duration: 5000
    })
  }
}

const validations = (partToValidate: 'createProduct' | 'updateProduct'): ValidationError[] => {
  const errors: ValidationError[] = []

  if (partToValidate === 'createProduct') {
    const newProductName = newProductPayload.value.name
    if (newProductName.trim().length < dataLengthValidations.productName.minlength || newProductName.length > dataLengthValidations.productName.maxlength) {
      errors.push({
        field: 'newProductNameInput',
        message: `Le nom doit contenir entre ${dataLengthValidations.productName.minlength} et ${dataLengthValidations.productName.maxlength} caractères`
      })
    }

    const newProductBrand = newProductPayload.value.brand
    if (newProductBrand.trim().length < dataLengthValidations.productBrand.minlength || newProductBrand.length > dataLengthValidations.productBrand.maxlength) {
      errors.push({
        field: 'newProductBrandInput',
        message: `La marque doit contenir entre ${dataLengthValidations.productBrand.minlength} et ${dataLengthValidations.productBrand.maxlength} caractères`
      })
    }

    const newProductCategory = newProductPayload.value.category
    if (!newProductCategory) {
      errors.push({
        field: 'newProductCategorySelect',
        message: 'Sélectionner une catégorie parente'
      })
    }

    const newProductDescription = newProductPayload.value.description
    if (newProductDescription.trim().length < dataLengthValidations.productDescription.minlength || newProductDescription.length > dataLengthValidations.productDescription.maxlength) {
      errors.push({
        field: 'newProductDescriptionTextarea',
        message: `La description doit contenir entre ${dataLengthValidations.productDescription.minlength} et ${dataLengthValidations.productDescription.maxlength} caractères`
      })
    }

    const newProductPrice = newProductPayload.value.price
    const parsedProductPrice = parseFloat(newProductPrice.toString())

    if (isNaN(parsedProductPrice)) {
      errors.push({
        field: 'newProductPriceInput',
        message: 'Le prix doit être un nombre'
      })
    }

    if (!isNaN(parsedProductPrice) && (parsedProductPrice < dataLengthValidations.productPrice.minlength || parsedProductPrice > dataLengthValidations.productPrice.maxlength)) {
      errors.push({
        field: 'newProductPriceInput',
        message: `Le prix doit être compris entre ${dataLengthValidations.productPrice.minlength} et ${dataLengthValidations.productPrice.maxlength}`
      })
    }

    const newProductImage = newProductPayload.value.image
    if (newProductImage === null) {
      errors.push({
        field: 'newProductImageInput',
        message: 'Sélectionner une image'
      })
    }
  }

  if (partToValidate === 'updateProduct') {
    // @ts-ignore
  }

  return errors
}

const emptyNewProductData = () => {
  newProductPayload.value.name = ''
  newProductPayload.value.brand = ''
  newProductPayload.value.category = ''
  newProductPayload.value.description = ''
  newProductPayload.value.price = 0
  newProductPayload.value.image = null
  if (newProductImageInput) newProductImageInput.value = ''
  if (newProductSuccessMessage) newProductSuccessMessage.innerText = ''
  removeErrors('newProductNameInput')
  removeErrors('newProductBrandInput')
  removeErrors('newProductCategorySelect')
  removeErrors('newProductDescriptionTextarea')
  removeErrors('newProductPriceInput')
  removeErrors('newProductImageInput')
}

const showErrors = (error: ValidationError) => {
  switch (error.field) {
    case 'newProductNameInput':
      newProductNameInput?.classList.add('is-invalid')
      newProductNameInputInvalidFeedback!.textContent = error.message
      break
    case 'newProductBrandInput':
      newProductBrandInput?.classList.add('is-invalid')
      newProductBrandInputInvalidFeedback!.textContent = error.message
      break
    case 'newProductCategorySelect':
      newProductCategorySelect?.classList.add('is-invalid')
      newProductCategorySelectInvalidFeedback!.textContent = error.message
      break
    case 'newProductDescriptionTextarea':
      newProductDescriptionTextarea?.classList.add('is-invalid')
      newProductDescriptionTextAreaInvalidFeedback!.textContent = error.message
      break
    case 'newProductPriceInput':
      newProductPriceInput?.classList.add('is-invalid')
      newProductPriceInputInvalidFeedback!.textContent = error.message
      break
    case 'newProductImageInput':
      newProductImageInput?.classList.add('is-invalid')
      newProductImageInputInvalidFeedback!.textContent = error.message
      break
  }
}

const removeErrors = (input: 'newProductNameInput' | 'newProductBrandInput' | 'newProductCategorySelect' | 'newProductDescriptionTextarea' | 'newProductPriceInput' | 'newProductImageInput') => {
  switch (input) {
    case 'newProductNameInput':
      newProductNameInput?.classList.remove('is-invalid')
      newProductNameInputInvalidFeedback!.textContent = ''
      break
    case 'newProductBrandInput':
      newProductBrandInput?.classList.remove('is-invalid')
      newProductBrandInputInvalidFeedback!.textContent = ''
      break
    case 'newProductCategorySelect':
      newProductCategorySelect?.classList.remove('is-invalid')
      newProductCategorySelectInvalidFeedback!.textContent = ''
      break
    case 'newProductDescriptionTextarea':
      newProductDescriptionTextarea?.classList.remove('is-invalid')
      newProductDescriptionTextAreaInvalidFeedback!.textContent = ''
      break
    case 'newProductPriceInput':
      newProductPriceInput?.classList.remove('is-invalid')
      newProductPriceInputInvalidFeedback!.textContent = ''
      break
    case 'newProductImageInput':
      newProductImageInput?.classList.remove('is-invalid')
      newProductImageInputInvalidFeedback!.textContent = ''
      break
  }
}

</script>

<style lang="scss">
#list-container {
  max-height: 50dvh;
  overflow-y: auto;
}
</style>