<template>
  <div class="container mt-3">
    <h1>Gérer les produits</h1>

    <div class="row row-cols-1 row-cols-sm-2">
      <div class="col">
        <div class="d-flex justify-content-between w-100 mb-3">
          <h2>Liste des produits</h2>
          <button
            class="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#addProductModal"
          >
            Ajouter
          </button>
        </div>

        <ul v-if="products?.data?.products?.length > 0" class="list-group" id="list-container">
          <li
            v-for="product in products?.data?.products"
            :key="product.id"
            style="cursor: pointer; user-select: none"
            :class="`list-group-item list-group-item-action ${selectedProduct?.id === product.id && 'active'}`"
            @click="selectProduct(product)"
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

      <div class="col">
        <h2>Produit sélectionné</h2>

        <form novalidate class="needs-validation">
          <fieldset :disabled="selectedProduct === null">
            <div class="row row-cols-1 row-cols-sm-2">
              <div class="col">
                <!-- Name -->
                <div>
                  <label for="selectedProductNameInput" class="form-label">Nom</label>
                  <input
                    type="text"
                    :value="selectedProduct?.name"
                    v-on:input="
                      (e) => {
                        if (selectedProduct)
                          selectedProduct.name = (e.target as HTMLInputElement).value
                        removeErrors('selectedProductNameInput')
                      }
                    "
                    :minlength="dataLengthValidations?.productName?.minlength"
                    :maxlength="dataLengthValidations?.productName?.maxlength"
                    class="form-control"
                    id="selectedProductNameInput"
                    aria-describedby="selectedProductNameHelpBlock selectedProductNameInputInvalidFeedback"
                    required
                  />

                  <div id="selectedProductNameInputInvalidFeedback" class="invalid-feedback"></div>
                  <div id="selectedProductNameHelpBlock" class="form-text">
                    Entre {{ dataLengthValidations?.productName?.minlength }} et
                    {{ dataLengthValidations?.productName?.maxlength }} caractères
                  </div>
                </div>

                <!-- Category -->
                <div>
                  <label for="selectedProductCategorySelect">Catégorie</label>
                  <select
                    id="selectedProductCategorySelect"
                    :value="selectedProduct?.categoryId"
                    class="form-select"
                    aria-describedby="selectedProductCategorySelectHelpBlock selectedProductCategorySelectInvalidFeedback"
                    aria-label="Sélectionner catégorie parente"
                    disabled
                  >
                    <option
                      v-for="category in categories?.data?.categories"
                      :key="category.id"
                      :value="category.id"
                      :selected="category.id === selectedProduct?.categoryId"
                    >
                      {{ category.title }}
                    </option>
                  </select>
                  <div
                    id="selectedProductCategorySelectHelpBlock"
                    class="form-text text-warning-emphasis"
                  >
                    La catégorie ne peut pas être modifiée
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label for="selectedProductDescriptionTextarea" class="form-label"
                    >Description</label
                  >
                  <textarea
                    class="form-control"
                    :value="selectedProduct?.description"
                    v-on:input="
                      (e) => {
                        if (selectedProduct)
                          selectedProduct.description = (e.target as HTMLTextAreaElement).value
                        removeErrors('selectedProductDescriptionTextarea')
                      }
                    "
                    :minlength="dataLengthValidations?.productDescription?.minlength"
                    :maxlength="dataLengthValidations?.productDescription?.maxlength"
                    id="selectedProductDescriptionTextarea"
                    aria-describedby="selectedProductDescriptionHelpBlock selectedProductDescriptionTextAreaInvalidFeedback"
                    required
                  ></textarea>

                  <div
                    id="selectedProductDescriptionTextAreaInvalidFeedback"
                    class="invalid-feedback"
                  ></div>
                  <div id="selectedProductDescriptionHelpBlock" class="form-text">
                    Entre {{ dataLengthValidations?.productDescription?.minlength }} et
                    {{ dataLengthValidations?.productDescription?.maxlength }} caractères
                  </div>
                </div>
              </div>
              <div class="col">
                <!-- Brand -->
                <div>
                  <label for="selectedProductBrandInput" class="form-label">Marque</label>
                  <input
                    type="text"
                    :value="selectedProduct?.brand"
                    v-on:input="
                      (e) => {
                        if (selectedProduct)
                          selectedProduct.brand = (e.target as HTMLInputElement).value
                        removeErrors('selectedProductBrandInput')
                      }
                    "
                    :minlength="dataLengthValidations?.productBrand?.minlength"
                    :maxlength="dataLengthValidations?.productBrand?.maxlength"
                    class="form-control"
                    id="selectedProductBrandInput"
                    aria-describedby="selectedProductBrandHelpBlock selectedProductBrandInputInvalidFeedback"
                    required
                  />

                  <div id="selectedProductBrandInputInvalidFeedback" class="invalid-feedback"></div>
                  <div id="selectedProductBrandHelpBlock" class="form-text">
                    Entre {{ dataLengthValidations?.productBrand?.minlength }} et
                    {{ dataLengthValidations?.productBrand?.maxlength }} caractères
                  </div>
                </div>

                <!-- Price -->
                <div>
                  <label for="selectedProductPriceInput" class="form-label">Prix</label>
                  <input
                    type="number"
                    :value="selectedProduct?.price"
                    v-on:input="
                      (e) => {
                        if (selectedProduct)
                          selectedProduct.price = parseFloat((e.target as HTMLInputElement).value)
                        removeErrors('selectedProductPriceInput')
                      }
                    "
                    :min="dataLengthValidations?.productPrice?.minlength"
                    :max="dataLengthValidations?.productPrice?.maxlength"
                    class="form-control"
                    id="selectedProductPriceInput"
                    aria-describedby="selectedProductPriceHelpBlock selectedProductPriceInputInvalidFeedback"
                    required
                  />

                  <div id="selectedProductPriceInputInvalidFeedback" class="invalid-feedback"></div>
                  <div id="selectedProductPriceHelpBlock" class="form-text">
                    Prix du produit en dollar (ex : 1200.99)
                  </div>
                </div>

                <!-- Image -->
                <div>
                  <label for="selectedProductImageInput" class="form-label">Image</label>
                  <input
                    type="file"
                    @change="
                      (event) => {
                        onImageSelected(event, 'updateProduct')
                        removeErrors('selectedProductImageInput')
                      }
                    "
                    class="form-control"
                    id="selectedProductImageInput"
                    accept="image/*"
                    capture="environment"
                    aria-describedby="selectedProductImageHelpBlock selectedProductImageInputInvalidFeedback"
                  />

                  <div id="selectedProductImageInputInvalidFeedback" class="invalid-feedback"></div>
                  <div id="selectedProductImageHelpBlock" class="form-text">Image du produit</div>
                </div>
              </div>
            </div>

            <div class="d-flex align-items-start gap-2">
              <button class="btn btn-primary mt-2" @click.prevent="updateProduct">Modifier</button>
              <button class="btn btn-outline-danger mt-2" @click.prevent="deleteProduct">
                Supprimer
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>

    <!-- Modal ajout produit -->
    <div
      class="modal modal-dialog-scrollable fade"
      id="addProductModal"
      tabindex="-1"
      aria-labelledby="modalAddProductLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modalAddProductLabel" @click.prevent="createProduct">
              Ajouter produit
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation" novalidate enctype="multipart/form-data">
              <!-- Nom -->
              <div>
                <label for="newProductNameInput" class="form-label">Nom</label>
                <input
                  type="text"
                  v-model="newProductPayload.name"
                  @input="removeErrors('newProductNameInput')"
                  :minlength="dataLengthValidations?.productName?.minlength"
                  :maxlength="dataLengthValidations?.productName?.maxlength"
                  class="form-control"
                  id="newProductNameInput"
                  aria-describedby="newProductNameHelpBlock newProductNameInputInvalidFeedback"
                  required
                />

                <div id="newProductNameInputInvalidFeedback" class="invalid-feedback"></div>
                <div id="newProductNameHelpBlock" class="form-text">
                  Entre {{ dataLengthValidations?.productName?.minlength }} et
                  {{ dataLengthValidations?.productName?.maxlength }} caractères
                </div>
              </div>

              <!-- Marque -->
              <div class="mt-3">
                <label for="newProductBrandInput" class="form-label">Marque</label>
                <input
                  type="text"
                  v-model="newProductPayload.brand"
                  @input="removeErrors('newProductBrandInput')"
                  :minlength="dataLengthValidations?.productBrand?.minlength"
                  :maxlength="dataLengthValidations?.productBrand?.maxlength"
                  class="form-control"
                  id="newProductBrandInput"
                  aria-describedby="newProductBrandHelpBlock newProductBrandInputInvalidFeedback"
                  required
                />

                <div id="newProductBrandInputInvalidFeedback" class="invalid-feedback"></div>
                <div id="newProductBrandHelpBlock" class="form-text">
                  Entre {{ dataLengthValidations?.productBrand?.minlength }} et
                  {{ dataLengthValidations?.productBrand?.maxlength }} caractères
                </div>
              </div>

              <!-- Catégorie -->
              <div class="mt-3">
                <label for="newProductCategorySelect">Catégorie</label>
                <select
                  id="newProductCategorySelect"
                  @change="removeErrors('newProductCategorySelect')"
                  v-model="newProductPayload.category"
                  class="form-select"
                  aria-describedby="newProductCategorySelectHelpBlock newProductCategorySelectInvalidFeedback"
                  aria-label="Sélectionner catégorie parente"
                >
                  <option
                    v-for="category in categories?.data?.categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.title }}
                  </option>
                </select>
                <div id="newProductCategorySelectInvalidFeedback" class="invalid-feedback"></div>
                <div id="newProductCategorySelectHelpBlock" class="form-text text-info-emphasis">
                  Vous devez toujours sélectionner une catégorie afin de créer un produit
                </div>
                <div
                  class="d-flex flex-column align-items-start"
                  v-if="categories?.data?.categories?.length <= 0"
                >
                  <RouterLink to="/manage-categories" target="_blank"
                    >Ajouter une catégorie
                  </RouterLink>
                  <button class="btn btn-link p-0" @click.prevent="categoriesReload">
                    Recharger catégories
                  </button>
                </div>
              </div>

              <div v-if="categoriesError" class="text-danger mt-3">
                {{ categoriesError }}
              </div>

              <!-- Description -->
              <div class="mt-3">
                <label for="newProductDescriptionTextarea" class="form-label">Description</label>
                <textarea
                  class="form-control"
                  v-model="newProductPayload.description"
                  @input="removeErrors('newProductDescriptionTextarea')"
                  :minlength="dataLengthValidations?.productDescription?.minlength"
                  :maxlength="dataLengthValidations?.productDescription?.maxlength"
                  id="newProductDescriptionTextarea"
                  aria-describedby="newProductDescriptionHelpBlock newProductDescriptionTextAreaInvalidFeedback"
                  required
                ></textarea>

                <div
                  id="newProductDescriptionTextAreaInvalidFeedback"
                  class="invalid-feedback"
                ></div>
                <div id="newProductDescriptionHelpBlock" class="form-text">
                  Entre {{ dataLengthValidations?.productDescription?.minlength }} et
                  {{ dataLengthValidations?.productDescription?.maxlength }} caractères
                </div>
              </div>

              <!-- Prix -->
              <div class="mt-3">
                <label for="newProductPriceInput" class="form-label">Prix</label>
                <input
                  type="number"
                  v-model="newProductPayload.price"
                  @input="removeErrors('newProductPriceInput')"
                  :min="dataLengthValidations?.productPrice?.minlength"
                  :max="dataLengthValidations?.productPrice?.maxlength"
                  class="form-control"
                  id="newProductPriceInput"
                  aria-describedby="newProductPriceHelpBlock newProductPriceInputInvalidFeedback"
                  required
                />

                <div id="newProductPriceInputInvalidFeedback" class="invalid-feedback"></div>
                <div id="newProductPriceHelpBlock" class="form-text">
                  Prix du produit en dollar (ex : 1200.99)
                </div>
              </div>

              <!-- Image -->
              <div class="mt-3">
                <label for="newProductImageInput" class="form-label">Image</label>
                <input
                  type="file"
                  @change="
                    (event) => {
                      onImageSelected(event, 'createProduct')
                      removeErrors('newProductImageInput')
                    }
                  "
                  class="form-control"
                  id="newProductImageInput"
                  accept="image/*"
                  capture="environment"
                  aria-describedby="newProductImageHelpBlock newProductImageInputInvalidFeedback"
                  required
                />

                <div id="newProductImageInputInvalidFeedback" class="invalid-feedback"></div>
                <div id="newProductImageHelpBlock" class="form-text">Image du produit</div>
              </div>

              <p class="mt-3 text-success" id="newProductSuccessMessage"></p>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click.prevent="createProduct">
              Ajouter
            </button>
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
import type { ApiResponseType, Product, ValidationError } from '@/types'
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

const { data: categories, error: categoriesError, reload: categoriesReload } = useCategories()

const selectedProduct = ref<Product | null>(null)
const selectedImageFile = ref<null | File>(null)

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

let selectedProductNameInput: null | HTMLInputElement
let selectedProductNameInputInvalidFeedback: null | HTMLDivElement
let selectedProductBrandInput: null | HTMLInputElement
let selectedProductBrandInputInvalidFeedback: null | HTMLDivElement
let selectedProductDescriptionTextarea: null | HTMLTextAreaElement
let selectedProductDescriptionTextAreaInvalidFeedback: null | HTMLDivElement
let selectedProductPriceInput: null | HTMLInputElement
let selectedProductPriceInputInvalidFeedback: null | HTMLDivElement
let selectedProductImageInput: null | HTMLInputElement
let selectedProductImageInputInvalidFeedback: null | HTMLDivElement

onMounted(() => {
  newProductNameInput = document.getElementById('newProductNameInput') as HTMLInputElement
  newProductNameInputInvalidFeedback = document.getElementById(
    'newProductNameInputInvalidFeedback'
  ) as HTMLDivElement
  newProductBrandInput = document.getElementById('newProductBrandInput') as HTMLInputElement
  newProductBrandInputInvalidFeedback = document.getElementById(
    'newProductBrandInputInvalidFeedback'
  ) as HTMLDivElement
  newProductCategorySelect = document.getElementById(
    'newProductCategorySelect'
  ) as HTMLSelectElement
  newProductCategorySelectInvalidFeedback = document.getElementById(
    'newProductCategorySelectInvalidFeedback'
  ) as HTMLDivElement
  newProductDescriptionTextarea = document.getElementById(
    'newProductDescriptionTextarea'
  ) as HTMLTextAreaElement
  newProductDescriptionTextAreaInvalidFeedback = document.getElementById(
    'newProductDescriptionTextAreaInvalidFeedback'
  ) as HTMLDivElement
  newProductPriceInput = document.getElementById('newProductPriceInput') as HTMLInputElement
  newProductPriceInputInvalidFeedback = document.getElementById(
    'newProductPriceInputInvalidFeedback'
  ) as HTMLDivElement
  newProductImageInput = document.getElementById('newProductImageInput') as HTMLInputElement
  newProductImageInputInvalidFeedback = document.getElementById(
    'newProductImageInputInvalidFeedback'
  ) as HTMLDivElement
  newProductSuccessMessage = document.getElementById(
    'newProductSuccessMessage'
  ) as HTMLParagraphElement

  selectedProductNameInput = document.getElementById('selectedProductNameInput') as HTMLInputElement
  selectedProductNameInputInvalidFeedback = document.getElementById(
    'selectedProductNameInputInvalidFeedback'
  ) as HTMLDivElement
  selectedProductBrandInput = document.getElementById(
    'selectedProductBrandInput'
  ) as HTMLInputElement
  selectedProductBrandInputInvalidFeedback = document.getElementById(
    'selectedProductBrandInputInvalidFeedback'
  ) as HTMLDivElement
  selectedProductDescriptionTextarea = document.getElementById(
    'selectedProductDescriptionTextarea'
  ) as HTMLTextAreaElement
  selectedProductDescriptionTextAreaInvalidFeedback = document.getElementById(
    'selectedProductDescriptionTextAreaInvalidFeedback'
  ) as HTMLDivElement
  selectedProductPriceInput = document.getElementById(
    'selectedProductPriceInput'
  ) as HTMLInputElement
  selectedProductPriceInputInvalidFeedback = document.getElementById(
    'selectedProductPriceInputInvalidFeedback'
  ) as HTMLDivElement
  selectedProductImageInput = document.getElementById(
    'selectedProductImageInput'
  ) as HTMLInputElement
  selectedProductImageInputInvalidFeedback = document.getElementById(
    'selectedProductImageInputInvalidFeedback'
  ) as HTMLDivElement

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

const selectProduct = (product: Product) => {
  if (selectedProduct.value?.id === product.id) {
    return unSelectProduct()
  }

  // On clone le produit pour éviter de modifier directement le produit
  selectedProduct.value = { ...product }
}

const unSelectProduct = () => {
  selectedProduct.value = null
}

const onImageSelected = (event: Event, action: 'createProduct' | 'updateProduct') => {
  if (action === 'createProduct') {
    const file = (event?.target as HTMLInputElement)?.files?.[0]
    if (file) {
      newProductPayload.value.image = file
    }
  } else {
    const file = (event?.target as HTMLInputElement)?.files?.[0]
    if (file) {
      selectedImageFile.value = file
    }
  }
}

const createProduct = async () => {
  if (newProductSuccessMessage) newProductSuccessMessage.innerText = ''

  const validationErrors = validations('createProduct')
  if (validationErrors.length > 0) {
    validationErrors.forEach((error) => showErrors(error))
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

    const res = await productsService.createProduct(authStore.jwt, formData)

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

const updateProduct = async () => {
  if (!selectedProduct.value) return

  const validationErrors = validations('updateProduct')
  if (validationErrors.length > 0) {
    validationErrors.forEach((error) => showErrors(error))
    return
  }

  try {
    const formData: FormData = new FormData()
    formData.append('id', selectedProduct.value.id)
    formData.append('name', selectedProduct.value.name)
    formData.append('brand', selectedProduct.value.brand)
    formData.append('description', selectedProduct.value.description)
    formData.append('price', selectedProduct.value.price.toString())
    if (selectedImageFile.value) {
      formData.append('image', selectedImageFile.value)
    }

    const res = await productsService.updateProduct(authStore.jwt, formData)

    if (res.errors && res.errors.length > 0) {
      res.errors.forEach((error: ValidationError) => showErrors(error))
      return
    }

    if (res.status === 200) {
      push.success({
        title: 'Succès',
        message: res.message,
        duration: 3000
      })

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

const deleteProduct = async () => {
  if (!selectedProduct.value) {
    return
  }

  const confirmDelete = confirm('Voulez-vous vraiment supprimer ce produit ?')
  if (!confirmDelete) {
    return
  }

  try {
    const res = await productsService.deleteProduct(authStore.jwt, selectedProduct.value.id)

    if (res.errors && res.errors.length > 0) {
      res.errors.forEach((error: ValidationError) => showErrors(error))
      return
    }

    if (res.status === 200) {
      push.success({
        title: 'Succès',
        message: res.message,
        duration: 3000
      })

      productsReload()
      unSelectProduct()
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
    if (
      newProductName.trim().length < dataLengthValidations.productName.minlength ||
      newProductName.length > dataLengthValidations.productName.maxlength
    ) {
      errors.push({
        field: 'newProductNameInput',
        message: `Le nom doit contenir entre ${dataLengthValidations.productName.minlength} et ${dataLengthValidations.productName.maxlength} caractères`
      })
    }

    const newProductBrand = newProductPayload.value.brand
    if (
      newProductBrand.trim().length < dataLengthValidations.productBrand.minlength ||
      newProductBrand.length > dataLengthValidations.productBrand.maxlength
    ) {
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
    if (
      newProductDescription.trim().length < dataLengthValidations.productDescription.minlength ||
      newProductDescription.length > dataLengthValidations.productDescription.maxlength
    ) {
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

    if (
      !isNaN(parsedProductPrice) &&
      (parsedProductPrice < dataLengthValidations.productPrice.minlength ||
        parsedProductPrice > dataLengthValidations.productPrice.maxlength)
    ) {
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
    const selectedProductName = selectedProduct.value?.name
    if (
      selectedProductName &&
      (selectedProductName.trim().length < dataLengthValidations.productName.minlength ||
        selectedProductName.length > dataLengthValidations.productName.maxlength)
    ) {
      errors.push({
        field: 'selectedProductNameInput',
        message: `Le nom doit contenir entre ${dataLengthValidations.productName.minlength} et ${dataLengthValidations.productName.maxlength} caractères`
      })
    }

    const selectedProductBrand = selectedProduct.value?.brand
    if (
      selectedProductBrand &&
      (selectedProductBrand.trim().length < dataLengthValidations.productBrand.minlength ||
        selectedProductBrand.length > dataLengthValidations.productBrand.maxlength)
    ) {
      errors.push({
        field: 'selectedProductBrandInput',
        message: `La marque doit contenir entre ${dataLengthValidations.productBrand.minlength} et ${dataLengthValidations.productBrand.maxlength} caractères`
      })
    }

    const selectedProductDescription = selectedProduct.value?.description
    if (
      selectedProductDescription &&
      (selectedProductDescription.trim().length <
        dataLengthValidations.productDescription.minlength ||
        selectedProductDescription.length > dataLengthValidations.productDescription.maxlength)
    ) {
      errors.push({
        field: 'selectedProductDescriptionTextarea',
        message: `La description doit contenir entre ${dataLengthValidations.productDescription.minlength} et ${dataLengthValidations.productDescription.maxlength} caractères`
      })
    }

    const selectedProductPrice = selectedProduct.value?.price
    if (selectedProductPrice && isNaN(parseFloat(selectedProductPrice.toString()))) {
      errors.push({
        field: 'selectedProductPriceInput',
        message: 'Le prix doit être un nombre'
      })
    }

    if (
      selectedProductPrice &&
      !isNaN(parseFloat(selectedProductPrice.toString())) &&
      (parseFloat(selectedProductPrice.toString()) < dataLengthValidations.productPrice.minlength ||
        parseFloat(selectedProductPrice.toString()) > dataLengthValidations.productPrice.maxlength)
    ) {
      errors.push({
        field: 'selectedProductPriceInput',
        message: `Le prix doit être compris entre ${dataLengthValidations.productPrice.minlength} et ${dataLengthValidations.productPrice.maxlength}`
      })
    }
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
  removeErrors('selectedProductNameInput')
  removeErrors('selectedProductBrandInput')
  removeErrors('selectedProductDescriptionTextarea')
  removeErrors('selectedProductPriceInput')
  removeErrors('selectedProductImageInput')
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
    case 'selectedProductNameInput':
      selectedProductNameInput?.classList.add('is-invalid')
      selectedProductNameInputInvalidFeedback!.textContent = error.message
      break
    case 'selectedProductBrandInput':
      selectedProductBrandInput?.classList.add('is-invalid')
      selectedProductBrandInputInvalidFeedback!.textContent = error.message
      break
    case 'selectedProductDescriptionTextarea':
      selectedProductDescriptionTextarea?.classList.add('is-invalid')
      selectedProductDescriptionTextAreaInvalidFeedback!.textContent = error.message
      break
    case 'selectedProductPriceInput':
      selectedProductPriceInput?.classList.add('is-invalid')
      selectedProductPriceInputInvalidFeedback!.textContent = error.message
      break
    case 'selectedProductImageInput':
      selectedProductImageInput?.classList.add('is-invalid')
      selectedProductImageInputInvalidFeedback!.textContent = error.message
      break
    case 'deleteProduct':
      push.error({
        title: 'Erreur',
        message: error.message,
        duration: 5000
      })
  }
}

const removeErrors = (
  input:
    | 'newProductNameInput'
    | 'newProductBrandInput'
    | 'newProductCategorySelect'
    | 'newProductDescriptionTextarea'
    | 'newProductPriceInput'
    | 'newProductImageInput'
    | 'selectedProductNameInput'
    | 'selectedProductBrandInput'
    | 'selectedProductDescriptionTextarea'
    | 'selectedProductPriceInput'
    | 'selectedProductImageInput'
) => {
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
    case 'selectedProductNameInput':
      selectedProductNameInput?.classList.remove('is-invalid')
      selectedProductNameInputInvalidFeedback!.textContent = ''
      break
    case 'selectedProductBrandInput':
      selectedProductBrandInput?.classList.remove('is-invalid')
      selectedProductBrandInputInvalidFeedback!.textContent = ''
      break
    case 'selectedProductDescriptionTextarea':
      selectedProductDescriptionTextarea?.classList.remove('is-invalid')
      selectedProductDescriptionTextAreaInvalidFeedback!.textContent = ''
      break
    case 'selectedProductPriceInput':
      selectedProductPriceInput?.classList.remove('is-invalid')
      selectedProductPriceInputInvalidFeedback!.textContent = ''
      break
    case 'selectedProductImageInput':
      selectedProductImageInput?.classList.remove('is-invalid')
      selectedProductImageInputInvalidFeedback!.textContent = ''
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
