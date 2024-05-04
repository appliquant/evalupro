<template>
  <div class="container mt-3">

    <h1>Gérer les catégories</h1>

    <div class="row row-cols-1 row-cols-sm-2">

      <div class="col">
        <div class="d-flex justify-content-between w-100 mb-3">
          <h2>Liste des catégories</h2>
          <button class="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#addCategoryModal">Ajouter
          </button>

        </div>

        <ul v-if="categories?.data?.categories?.length > 0" class="list-group" id="list-container">
          <li v-for="category in categories?.data?.categories" :key="category.id"
              :class="`list-group-item list-group-item-action ${selectedCategory?.title === category?.title && 'active'}`"
              style="cursor:pointer;user-select: none" @click="selectCategory(category)">
            {{ category.title }}
          </li>
        </ul>
        <p v-else-if="loadingCategories" class="text-center">Chargement...</p>
        <p v-else-if="categoriesError" class="text-center text-danger">{{ categoriesError }}</p>
        <p v-if="categories?.data?.categories?.length <= 0">Aucune catégorie disponible</p>

      </div>

      <div class="col">

        <h2>Catégorie sélectionnée</h2>

        <form>
          <div class="row">
            <div class="col">
              <input type="text" :value="selectedCategory?.title" class="form-control" placeholder="Titre"
                     aria-label="First name" />
            </div>
            <div class="col">
              <select class="form-select" aria-label="Default select example">
                <option selected>Catégorie parente</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>

          <div>
            <button style="margin-right: 0.5rem" class="btn btn-primary mt-2">Modifier</button>
            <button class="btn btn-outline-danger mt-2">Supprimer</button>
          </div>
        </form>

      </div>
    </div>

    <!-- Modal ajout catégorie -->
    <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="modalAddCategoryLabel"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modalAddCategoryLabel">Ajouter catégorie</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation" novalidate>

              <!-- Titre -->
              <div>
                <label for="newCategoryTitleInput" class="form-label">Titre</label>
                <input v-model="newCategoryPayload.title"
                       @input="removeErrors('newCategoryTitle')"
                       :minlength="dataLengthValidations?.categoryTitle?.minlength"
                       :maxlength="dataLengthValidations?.categoryTitle?.maxlength"
                       type="text"
                       class="form-control"
                       aria-describedby="newCategoryTitleInvalidFeedback newCategoryTitleHelpBlock"
                       id="newCategoryTitleInput" required>
                <div id="newCategoryTitleInvalidFeedback" class="invalid-feedback">
                </div>
                <div id="newCategoryTitleHelpBlock" class="form-text">
                  Entre 3 et 25 caractères
                </div>
              </div>

              <!-- Catégorie parente -->
              <div class="mt-3">
                <label for="newCategoryParentSelect">Catégorie parente</label>
                <select id="newCategoryParentSelect" class="form-select" v-model="newCategoryPayload.parentCategoryName"
                        aria-describedby="newCategoryParentHelpBlock"
                        aria-label="Sélectionner catégorie parente">
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
                <div id="newCategoryParentHelpBlock" class="form-text">
                  Sélectionner une catégorie parente
                </div>
              </div>

              <p class="mt-3 text-success" id="newCategorySuccessMessage"></p>
            </form>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-primary" @click.prevent="addCategory">Ajouter</button>
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
  parentCategoryName: ''
})

let newCategoryTitle: null | HTMLElement
let newCategoryTitleInvalidFeedback: null | HTMLElement
let newCategorySuccessMessage: null | HTMLElement

onMounted(() => {
  newCategoryTitle = document.getElementById('newCategoryTitleInput')
  newCategoryTitleInvalidFeedback = document.getElementById('newCategoryTitleInvalidFeedback')
  newCategorySuccessMessage = document.getElementById('newCategorySuccessMessage')

  // Événement de fermeture du modal de bootstrap
  document.addEventListener('hidden.bs.modal', () => {
    emptyNewCategoryData()
    reloadCategories()
  })
})

onUnmounted(() => {
  // Événement de fermeture du modal de bootstrap
  document.removeEventListener('hidden.bs.modal', () => {
    emptyNewCategoryData()
  })
})

const selectCategory = (category: Category) => {
  if (selectedCategory.value === category) {
    return unSelectCategory()
  }

  selectedCategory.value = category
}

const unSelectCategory = () => {
  selectedCategory.value = null
}

const addCategory = async () => {
  if (newCategorySuccessMessage) newCategorySuccessMessage.innerText = ''

  const validationErrors = validations()
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
      newCategoryPayload.value.parentCategoryName
    )

    if (res.errors && res.errors.length > 0) {
      for (const error of res.errors) {
        showErrors(error)
      }
      return
    }

    if (res.status === 201) {
      if (newCategorySuccessMessage) newCategorySuccessMessage.innerText = res.message
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

const validations = (): ValidationError[] => {
  const errors: ValidationError[] = []

  const newCategoryTitle = newCategoryPayload.value.title.trim()
  if (newCategoryTitle.length < dataLengthValidations?.categoryTitle?.minlength) {
    errors.push({ field: 'newCategoryTitle', message: 'Titre de catégorie trop court' })
  }

  if (newCategoryTitle.length > dataLengthValidations?.categoryTitle?.maxlength) {
    errors.push({ field: 'newCategoryTitle', message: 'Titre de catégorie trop long' })
  }

  return errors
}

const emptyNewCategoryData = () => {
  newCategoryPayload.value.title = ''
  newCategoryPayload.value.parentCategoryName = ''
  if (newCategorySuccessMessage) newCategorySuccessMessage.innerText = ''
}

const showErrors = (error: ValidationError) => {
  switch (error.field) {
    case 'newCategoryTitle':
      newCategoryTitle?.classList.add('is-invalid')
      if (newCategoryTitleInvalidFeedback) newCategoryTitleInvalidFeedback.innerText = error.message
      break
    default:
  }
}

const removeErrors = (input: 'newCategoryTitle') => {
  switch (input) {
    case 'newCategoryTitle':
      newCategoryTitle?.classList.remove('is-invalid')
      if (newCategoryTitleInvalidFeedback) newCategoryTitleInvalidFeedback.innerText = ''
  }
}
</script>

<style lang="scss">
#list-container {
  max-height: 50dvh;
  overflow-y: auto;
}
</style>