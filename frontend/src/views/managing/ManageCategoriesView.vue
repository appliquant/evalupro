<template>
  <div class="container mt-3">
    <h1>Gérer les catégories</h1>

    <div class="row row-cols-1 row-cols-sm-2">
      <div class="col">
        <div class="d-flex justify-content-between w-100 mb-3">
          <h2>Liste des catégories</h2>
          <button
            class="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#addCategoryModal"
          >
            Ajouter
          </button>
        </div>

        <ul v-if="categories?.data?.categories?.length > 0" class="list-group" id="list-container">
          <li
            v-for="category in categories?.data?.categories"
            :key="category.id"
            :class="`list-group-item list-group-item-action ${selectedCategory?.id === category?.id && 'active'}`"
            style="cursor: pointer; user-select: none"
            @click="selectCategory(category)"
          >
            {{ category.title }}
          </li>
        </ul>
        <p v-else-if="loadingCategories" class="text-center">Chargement...</p>
        <p v-else-if="categoriesError" class="text-center text-danger">{{ categoriesError }}</p>
        <p v-if="categories?.data?.categories?.length <= 0">Aucune catégorie disponible</p>
      </div>

      <div class="col">
        <h2>Catégorie sélectionnée</h2>

        <form novalidate class="needs-validation">
          <fieldset :disabled="selectedCategory === null">
            <div class="row">
              <div class="col">
                <label for="selectedCategoryTitleInput">Titre</label>
                <!-- Pas possible d'utiliser 'v-model' car 'selectedCategory' peut-être null -->
                <input
                  type="text"
                  id="selectedCategoryTitleInput"
                  :value="selectedCategory?.title"
                  v-on:input="
                    (e) => {
                      if (selectedCategory)
                        selectedCategory.title = (e.target as HTMLInputElement).value
                      removeErrors('selectedCategoryTitle')
                    }
                  "
                  :minlength="dataLengthValidations?.categoryTitle?.minlength"
                  :maxlength="dataLengthValidations?.categoryTitle?.maxlength"
                  class="form-control"
                  placeholder="Titre de la catégorie"
                  aria-describedby="selectedCategoryTitleInvalidFeedback selectedCategoryTitleHelpBlock"
                  aria-label="First name"
                />
                <div id="selectedCategoryTitleInvalidFeedback" class="invalid-feedback"></div>
                <div id="selectedCategoryTitleHelpBlock" class="form-text">
                  Entre 3 et 25 caractères
                </div>
              </div>
              <div class="col">
                <!-- Catégorie parente -->
                <label for="selectedCategoryParentId">Catégorie parente</label>
                <select
                  class="form-select"
                  id="selectedCategoryParentId"
                  :value="selectedCategory?.parentId"
                  v-on:change="
                    (e) => {
                      if (selectedCategory)
                        selectedCategory.parentId = (e.target as HTMLSelectElement).value
                      removeErrors('selectedCategoryParentId')
                    }
                  "
                >
                  <option value=""></option>
                  <option
                    v-for="category in categories?.data?.categories"
                    :key="category.id"
                    :value="category.id"
                    :selected="category.id === selectedCategory?.parentId"
                  >
                    {{ category.title }}
                  </option>
                </select>

                <div id="selectedCategoryParentIdInvalidFeedback" class="invalid-feedback"></div>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-primary" @click.prevent="updateCategory">Modifier</button>
              <button class="btn btn-outline-danger mt-2" @click.prevent="deleteCategory">
                Supprimer
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>

    <!-- Modal ajout catégorie -->
    <div
      class="modal fade"
      id="addCategoryModal"
      tabindex="-1"
      aria-labelledby="modalAddCategoryLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modalAddCategoryLabel">Ajouter catégorie</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation" novalidate>
              <!-- Titre -->
              <div>
                <label for="newCategoryTitleInput" class="form-label">Titre</label>
                <input
                  v-model="newCategoryPayload.title"
                  @input="removeErrors('newCategoryTitle')"
                  :minlength="dataLengthValidations?.categoryTitle?.minlength"
                  :maxlength="dataLengthValidations?.categoryTitle?.maxlength"
                  type="text"
                  class="form-control"
                  aria-describedby="newCategoryTitleInputInvalidFeedback newCategoryTitleInputHelpBlock"
                  id="newCategoryTitleInput"
                  required
                />
                <div id="newCategoryTitleInputInvalidFeedback" class="invalid-feedback"></div>
                <div id="newCategoryTitleInputHelpBlock" class="form-text">
                  Entre 3 et 25 caractères
                </div>
              </div>

              <!-- Catégorie parente -->
              <div class="mt-3">
                <label for="newCategoryParentSelect">Catégorie parente</label>
                <select
                  id="newCategoryParentSelect"
                  class="form-select"
                  v-model="newCategoryPayload.parentCategoryId"
                  aria-describedby="newCategoryParentHelpBlock"
                  aria-label="Sélectionner catégorie parente"
                >
                  <option value=""></option>
                  <option
                    v-for="category in categories?.data?.categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.title }}
                  </option>
                </select>
                <div id="newCategoryParentHelpBlock" class="form-text">
                  Sélectionner une catégorie parente (non obligatoire)
                </div>
              </div>

              <p class="mt-3 text-success" id="newCategorySuccessMessage"></p>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click.prevent="createCategory">
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { dataLengthValidations } from '@/validations'
import type { ApiResponseType, Category, ValidationError } from '@/types'
import { categoriesService } from '@/services/categoriesService'
import { useAuthStore } from '@/stores/authStore'
import { push } from 'notivue'
import { useCategories } from '@/composables/useCategories'

const {
  data: categories,
  loading: loadingCategories,
  error: categoriesError,
  reload: reloadCategories
} = useCategories()

const authStore = useAuthStore()

const selectedCategory = ref<Category | null>(null)

const newCategoryPayload = ref({
  title: '',
  parentCategoryId: ''
})

let newCategoryTitleInput: null | HTMLElement
let newCategoryTitleInputInvalidFeedback: null | HTMLElement
let selectedCategoryTitleInput: null | HTMLElement
let selectedCategoryTitleInputInvalidFeedback: null | HTMLElement
let selectedCategoryParentId: null | HTMLSelectElement
let selectedCategoryParentIdInvalidFeedback: null | HTMLElement
let newCategorySuccessMessage: null | HTMLElement

onMounted(() => {
  newCategoryTitleInput = document.getElementById('newCategoryTitleInput')
  newCategoryTitleInputInvalidFeedback = document.getElementById(
    'newCategoryTitleInputInvalidFeedback'
  )
  selectedCategoryTitleInput = document.getElementById('selectedCategoryTitleInput')
  selectedCategoryTitleInputInvalidFeedback = document.getElementById(
    'selectedCategoryTitleInvalidFeedback'
  )
  selectedCategoryParentId = document.getElementById(
    'selectedCategoryParentId'
  ) as HTMLSelectElement
  selectedCategoryParentIdInvalidFeedback = document.getElementById(
    'selectedCategoryParentIdInvalidFeedback'
  )
  newCategorySuccessMessage = document.getElementById('newCategorySuccessMessage')

  // Événement de fermeture du modal de bootstrap
  document.addEventListener('hidden.bs.modal', () => {
    emptyNewCategoryData()
  })
})

onUnmounted(() => {
  // Événement de fermeture du modal de bootstrap
  document.removeEventListener('hidden.bs.modal', () => {
    emptyNewCategoryData()
  })
})

const selectCategory = (category: Category) => {
  if (selectedCategory.value?.id === category.id) {
    return unSelectCategory()
  }

  // On clone la catégorie pour éviter de modifier la catégorie directement
  selectedCategory.value = { ...category }
}

const unSelectCategory = () => {
  selectedCategory.value = null
}

const createCategory = async () => {
  if (newCategorySuccessMessage) newCategorySuccessMessage.innerText = ''

  const validationErrors = validations('createCategory')
  if (validationErrors.length > 0) {
    for (const validationError of validationErrors) {
      showErrors(validationError)
    }
    return
  }

  try {
    const res = await categoriesService.createCategory(
      authStore.jwt,
      newCategoryPayload.value.title,
      newCategoryPayload.value.parentCategoryId
    )

    if (res.errors && res.errors.length > 0) {
      for (const error of res.errors) {
        showErrors(error)
      }
      return
    }

    if (res.status === 201) {
      if (newCategorySuccessMessage) newCategorySuccessMessage.innerText = res.message
      reloadCategories()
    }
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: 'Erreur',
      message: err.message,
      duration: 13000
    })
  }
}

const updateCategory = async () => {
  if (!selectedCategory.value) {
    return
  }

  const validationErrors = validations('updateCategory')
  if (validationErrors.length > 0) {
    for (const validationError of validationErrors) {
      showErrors(validationError)
    }
    return
  }

  try {
    const res = await categoriesService.updateCategory(authStore.jwt, selectedCategory.value)

    if (res.errors && res.errors.length > 0) {
      res.errors.forEach((error) => showErrors(error))
      return
    }

    if (res.status === 200) {
      push.success({
        title: 'Succès',
        message: res.message,
        duration: 3000
      })

      reloadCategories()
    }
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: 'Erreur',
      message: err.message,
      duration: 13000
    })
  }
}

const deleteCategory = async () => {
  if (!selectedCategory.value) {
    return
  }

  const confirmation = confirm('Voulez-vous vraiment supprimer cette catégorie ?')
  if (!confirmation) {
    return
  }

  try {
    const res = await categoriesService.deleteCategory(authStore.jwt, selectedCategory.value.id)

    if (res.errors && res.errors.length > 0) {
      for (const error of res.errors) {
        showErrors(error)
      }
      return
    }
    

    if (res.status === 200) {
      push.success({
        title: 'Succès',
        message: res.message,
        duration: 3000
      })

      reloadCategories()
      unSelectCategory()
    } else {
      push.error({
        title: 'Erreur',
        message: res.message,
        duration: 13000
      })
    }
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: 'Erreur',
      message: err.message,
      duration: 13000
    })
  }
}

const validations = (partToValidate: 'createCategory' | 'updateCategory'): ValidationError[] => {
  const errors: ValidationError[] = []

  if (partToValidate === 'createCategory') {
    const newCategoryTitle = newCategoryPayload.value.title.trim()

    if (
      newCategoryTitle.length < dataLengthValidations.categoryTitle.minlength ||
      newCategoryTitle.length > dataLengthValidations.categoryTitle.maxlength
    ) {
      errors.push({
        field: 'newCategoryTitle',
        message: `Titre de catégorie doit être entre ${dataLengthValidations.categoryTitle.minlength} et ${dataLengthValidations.categoryTitle.maxlength} caractères`
      })
    }
  }

  if (partToValidate === 'updateCategory') {
    const selectedCategoryTitle = selectedCategory?.value?.title
    if (!selectedCategoryTitle) {
      errors.push({ field: 'selectedCategoryTitle', message: 'Titre de catégorie est obligatoire' })
    }

    if (
      selectedCategoryTitle &&
      (selectedCategoryTitle.trim().length < dataLengthValidations?.categoryTitle?.minlength ||
        selectedCategoryTitle.trim().length > dataLengthValidations?.categoryTitle?.maxlength)
    ) {
      errors.push({
        field: 'selectedCategoryTitle',
        message: `Titre de catégorie doit être entre ${dataLengthValidations.categoryTitle.minlength} et ${dataLengthValidations.categoryTitle.maxlength} caractères`
      })
    }
  }

  return errors
}

const emptyNewCategoryData = () => {
  newCategoryPayload.value.title = ''
  newCategoryPayload.value.parentCategoryId = ''
  if (newCategorySuccessMessage) newCategorySuccessMessage.innerText = ''
  removeErrors('newCategoryTitle')
}

const showErrors = (error: ValidationError) => {
  switch (error.field) {
    case 'newCategoryTitle':
      newCategoryTitleInput?.classList.add('is-invalid')
      if (newCategoryTitleInputInvalidFeedback)
        newCategoryTitleInputInvalidFeedback.innerText = error.message
      break
    case 'selectedCategoryTitle':
      selectedCategoryTitleInput?.classList.add('is-invalid')
      if (selectedCategoryTitleInputInvalidFeedback)
        selectedCategoryTitleInputInvalidFeedback.innerText = error.message
      break
    case 'selectedCategoryParentId':
      selectedCategoryParentId?.classList.add('is-invalid')
      if (selectedCategoryParentIdInvalidFeedback)
        selectedCategoryParentIdInvalidFeedback.innerText = error.message
      break
    case 'deleteCategory':
      push.error({
        title: 'Erreur',
        message: error.message,
        duration: 13000
      })
      break
    default:
  }
}

const removeErrors = (
  input: 'newCategoryTitle' | 'selectedCategoryTitle' | 'selectedCategoryParentId'
) => {
  switch (input) {
    case 'newCategoryTitle':
      newCategoryTitleInput?.classList.remove('is-invalid')
      if (newCategoryTitleInputInvalidFeedback) newCategoryTitleInputInvalidFeedback.innerText = ''
      break
    case 'selectedCategoryTitle':
      selectedCategoryTitleInput?.classList.remove('is-invalid')
      if (selectedCategoryTitleInputInvalidFeedback)
        selectedCategoryTitleInputInvalidFeedback.innerText = ''
      break
    case 'selectedCategoryParentId':
      selectedCategoryParentId?.classList.remove('is-invalid')
      if (selectedCategoryParentIdInvalidFeedback)
        selectedCategoryParentIdInvalidFeedback.innerText = ''
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
