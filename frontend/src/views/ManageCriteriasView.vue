<template>
  <div class="container mt-3">
    <h1>Gérer les critères</h1>

    <div class="row row-cols-1 row-cols-sm-2 2">
      <div class="col">
        <div class="d-flex justify-content-between w-100 mb-3">
          <h2>Liste des critères</h2>
          <button
            class="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#addCriteriaModal"
          >
            Ajouter
          </button>
        </div>

        <ul v-if="criterias?.data?.length > 0" class="list-group" id="list-container">
          <li
            v-for="criteria in criterias?.data"
            :key="criteria.id"
            :class="`list-group-item d-flex justify-content-between align-items-center ${selectedCriteria?.id === criteria.id && 'active'}`"
            style="cursor: pointer; user-select: none;"
            @click="selectCriteria(criteria)"
          >
            {{ criteria.name }} - c.f {{ criteria.coefficient }}
          </li>
        </ul>
        <p v-if="criteriasLoading">Chargement</p>
        <p v-if="criteriasError" class="text-danger">{{ criteriasError }}</p>
        <p v-if="criterias?.data?.length === 0">Aucun critère</p>
      </div>

      <div class="col">

        <h2>Critère sélectionné</h2>

        <form class="needs-validation" novalidate>
          <fieldset :disabled="selectedCriteria === null">
            <div class="row row-cols-1 row-cols-sm-2">
              <div class="col">

                <!-- Nom -->
                <div>
                  <label for="selectedCriteriaNameInput">Nom</label>
                  <input
                    type="text"
                    :value="selectedCriteria?.name"
                    v-on:input="(e) => {
                     if (selectedCriteria) {
                        selectedCriteria.name = ((e.target as HTMLInputElement).value);
                        removeErrors('selectedCriteriaNameInput');
                     }
                    }"
                    :minlength="dataLengthValidations.criteriaName.minlength"
                    :maxlength="dataLengthValidations.criteriaName.maxlength"
                    class="form-control"
                    id="selectedCriteriaNameInput"
                    placeholder="Nom du critère"
                    aria-describedby="selectedCriteriaNameInputHelpBlock selectedCriteriaNameInputInvalidFeedback"
                    required
                  />

                  <div id="selectedCriteriaNameInputInvalidFeedback" class="invalid-feedback"></div>
                  <div id="selectedCriteriaNameInputHelpBlock" class="form-text">
                    Le nom du critère doit contenir entre
                    {{ dataLengthValidations.criteriaName.minlength }} et
                    {{ dataLengthValidations.criteriaName.maxlength }} caractères.
                  </div>
                </div>
              </div>

              <!-- Coefficient -->
              <div class="col">

                <div>
                  <label for="selectedCriteriaCoefficientInput">Coefficient</label>
                  <input
                    type="number"
                    :value="selectedCriteria?.coefficient"
                    v-on:input="(e) => {
                     if (selectedCriteria) {
                        selectedCriteria.coefficient = parseInt((e.target as HTMLInputElement).value);
                        removeErrors('selectedCriteriaCoefficientInput');
                     }
                    }"
                    :min="dataLengthValidations.criteriaCoefficient.minlength"
                    :max="dataLengthValidations.criteriaCoefficient.maxlength"
                    class="form-control"
                    id="selectedCriteriaCoefficientInput"
                    placeholder="Coefficient du critère"
                    aria-describedby="selectedCriteriaCoefficientInputHelpBlock selectedCriteriaCoefficientInputInvalidFeedback"
                    required
                  />

                  <div id="selectedCriteriaCoefficientInputInvalidFeedback" class="invalid-feedback">
                  </div>

                  <div id="selectedCriteriaCoefficientInputHelpBlock" class="form-text">
                    Le coefficient du critère doit être compris entre
                    {{ dataLengthValidations.criteriaCoefficient.minlength }} et
                    {{ dataLengthValidations.criteriaCoefficient.maxlength }} (incluant les bornes).
                  </div>
                </div>
              </div>


            </div>

            <div class="d-flex gap-2 mt-2">
              <button class="btn btn-primary" @click.prevent="updateCriteria">Modifier</button>
              <button class="btn btn-outline-danger" @click.prevent="deleteCriteria">Supprimer</button>
            </div>
          </fieldset>
        </form>

      </div>
    </div>

    <!-- Modal ajout critère -->
    <div
      class="modal fade"
      id="addCriteriaModal"
      tabindex="-1"
      aria-labelledby="addCriteriaModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addCriteriaModalLabel">Ajouter un critère</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">

            <form class="needs-validation" novalidate>
              <!-- Nom -->
              <div>
                <label for="newCriteriaNameInput">Nom</label>
                <input
                  v-model="newCriteriaPayload.name"
                  @input="removeErrors('newCriteriaNameInput')"
                  :minlength="dataLengthValidations.criteriaName.minlength"
                  :maxlength="dataLengthValidations.criteriaName.maxlength"
                  type="text"
                  class="form-control"
                  id="newCriteriaNameInput"
                  placeholder="Nom du critère"
                  required
                />
                <div id="newCriteriaNameInputInvalidFeedback" class="invalid-feedback"></div>
                <div id="newCriteriaNameInputHelpBlock" class="form-text">
                  Le nom du critère doit contenir entre
                  {{ dataLengthValidations.criteriaName.minlength }} et
                  {{ dataLengthValidations.criteriaName.maxlength }} caractères.
                </div>
              </div>

              <!-- Coefficient -->
              <div>
                <label for="newCriteriaCoefficientInput">Coefficient</label>
                <input
                  v-model="newCriteriaPayload.coefficient"
                  @input="removeErrors('newCriteriaCoefficientInput')"
                  :min="dataLengthValidations.criteriaCoefficient.minlength"
                  :max="dataLengthValidations.criteriaCoefficient.maxlength"
                  step="1"
                  type="number"
                  class="form-control"
                  id="newCriteriaCoefficientInput"
                  placeholder="Coefficient du critère"
                  required
                />
                <div id="newCriteriaCoefficientInputInvalidFeedback" class="invalid-feedback"></div>
                <div id="newCriteriaCoefficientInputHelpBlock" class="form-text">
                  Le coefficient du critère doit être compris entre
                  {{ dataLengthValidations.criteriaCoefficient.minlength }} et
                  {{ dataLengthValidations.criteriaCoefficient.maxlength }} (incluant les bornes).
                </div>
              </div>

              <!-- Catégorie -->
              <div>
                <label for="newCriteriaCategoryInput">Catégorie</label>
                <select
                  v-model="newCriteriaPayload.categoryId"
                  @input="removeErrors('newCriteriaCategoryInput')"
                  class="form-select"
                  id="newCriteriaCategoryInput"
                  required
                >
                  <option value="" disabled selected>Choisir une catégorie</option>
                  <option
                    v-for="category in categories?.data?.categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.title }}
                  </option>
                </select>
                <div id="newCriteriaCategoryInputInvalidFeedback" class="invalid-feedback"></div>
              </div>

              <p id="newCriteriaSuccessMessage" class="mt-3 text-success"></p>
            </form>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" @click.prevent="createCriteria">Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { dataLengthValidations } from '@/validations.js'
import { onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useCriterias } from '@/composables/useCriterias'
import type { ApiResponseType, Criteria, ValidationError } from '@/types'
import { push } from 'notivue'
import { criteriasService } from '@/services/criteriasService'
import { useCategories } from '@/composables/useCategories'

const authStore = useAuthStore()
const {
  data: criterias,
  loading: criteriasLoading,
  error: criteriasError,
  reload: criteriasReload
} = useCriterias()

const {
  data: categories,
  loading: categoriesLoading,
  error: categoriesError,
  reload: categoriesReload
} = useCategories()

const selectedCriteria = ref<Criteria | null>(null)
const newCriteriaPayload = ref({
  name: '',
  coefficient: 1,
  categoryId: ''
})

let newCriteriaNameInput: null | HTMLInputElement
let newCriteriaNameInputInvalidFeedback: null | HTMLDivElement
let newCriteriaCoefficientInput: null | HTMLInputElement
let newCriteriaCoefficientInputInvalidFeedback: null | HTMLDivElement
let newCriteriaCategoryInput: null | HTMLSelectElement
let newCriteriaCategoryInputInvalidFeedback: null | HTMLDivElement
let newCriteriaSuccessMessage: null | HTMLParagraphElement
let selectedCriteriaNameInput: null | HTMLInputElement
let selectedCriteriaNameInputInvalidFeedback: null | HTMLDivElement
let selectedCriteriaCoefficientInput: null | HTMLInputElement
let selectedCriteriaCoefficientInputInvalidFeedback: null | HTMLDivElement

onMounted(() => {
  newCriteriaNameInput = document.getElementById('newCriteriaNameInput') as HTMLInputElement
  newCriteriaNameInputInvalidFeedback = document.getElementById('newCriteriaNameInputInvalidFeedback') as HTMLDivElement
  newCriteriaCoefficientInput = document.getElementById('newCriteriaCoefficientInput') as HTMLInputElement
  newCriteriaCoefficientInputInvalidFeedback = document.getElementById('newCriteriaCoefficientInputInvalidFeedback') as HTMLDivElement
  newCriteriaCategoryInput = document.getElementById('newCriteriaCategoryInput') as HTMLSelectElement
  newCriteriaCategoryInputInvalidFeedback = document.getElementById('newCriteriaCategoryInputInvalidFeedback') as HTMLDivElement
  newCriteriaSuccessMessage = document.getElementById('newCriteriaSuccessMessage') as HTMLParagraphElement
  selectedCriteriaNameInput = document.getElementById('selectedCriteriaNameInput') as HTMLInputElement
  selectedCriteriaNameInputInvalidFeedback = document.getElementById('selectedCriteriaNameInputInvalidFeedback') as HTMLDivElement
  selectedCriteriaCoefficientInput = document.getElementById('selectedCriteriaCoefficientInput') as HTMLInputElement
  selectedCriteriaCoefficientInputInvalidFeedback = document.getElementById('selectedCriteriaCoefficientInputInvalidFeedback') as HTMLDivElement

  // Événement de fermeture du modal bootstrap
  document.addEventListener('hidden.bs.modal', () => {
    emptyNewCriteriaPayload()
  })
})

onUnmounted(() => {
  // Événement de fermeture du modal bootstrap
  document.removeEventListener('hidden.bs.modal', () => {
    emptyNewCriteriaPayload()
  })
})

const createCriteria = async () => {
  if (newCriteriaSuccessMessage) newCriteriaSuccessMessage.innerText = ''

  const validationErrors = validations('createCriteria')
  if (validationErrors.length > 0) {
    validationErrors.forEach((error) => showErrors(error))
    return
  }

  try {

    const res = await criteriasService.createCriteria(
      authStore.jwt,
      newCriteriaPayload.value
    )

    if (res.errors && res.errors.length > 0) {
      res.errors.forEach((error: ValidationError) => showErrors(error))
      return
    }

    if (res.status === 201) {
      if (newCriteriaSuccessMessage) newCriteriaSuccessMessage.innerText = 'Critère ajouté avec succès.'
      criteriasReload()
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

const updateCriteria = async () => {
  if (!selectedCriteria.value) return

  const validationErrors = validations('updateCriteria')
  if (validationErrors.length > 0) {
    validationErrors.forEach((error) => showErrors(error))
    return
  }

  try {
    const res = await criteriasService.updateCriteria(
      authStore.jwt,
      selectedCriteria.value
    )

    if (res.errors && res.errors.length > 0) {
      res.errors.forEach((error: ValidationError) => showErrors(error))
      return
    }

    if (res.status === 200) {
      push.success({
        title: 'Succès',
        message: res.message,
        duration: 5000
      })
      criteriasReload()
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

const deleteCriteria = async () => {
  if (!selectedCriteria.value) return

  const confirmDelete = confirm('Voulez-vous vraiment supprimer ce critère ?')
  if (!confirmDelete) return

  try {
    const res = await criteriasService.deleteCriteria(
      authStore.jwt,
      selectedCriteria.value.id
    )

    if (res.errors && res.errors.length > 0) {
      res.errors.forEach((error: ValidationError) => showErrors(error))
      return
    }

    if (res.status === 200) {
      push.success({
        title: 'Succès',
        message: res.message,
        duration: 5000
      })

      criteriasReload()
      unSelectCriteria()
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

const selectCriteria = (criteria: Criteria) => {
  if (selectedCriteria.value?.id === criteria.id) {
    return unSelectCriteria()
  }

  // On clone le critère pour éviter les modifications directes
  selectedCriteria.value = { ...criteria }
}

const unSelectCriteria = () => {
  selectedCriteria.value = null
}

const validations = (partToValidate: 'createCriteria' | 'updateCriteria'): ValidationError[] => {
  const errors: ValidationError[] = []

  if (partToValidate === 'createCriteria') {
    const newCriteriaName = newCriteriaPayload.value.name.trim()
    if (newCriteriaName.trim().length < dataLengthValidations.criteriaName.minlength || newCriteriaName.length > dataLengthValidations.criteriaName.maxlength) {
      errors.push({
        field: 'newCriteriaNameInput',
        message: `Le nom du critère doit contenir entre ${dataLengthValidations.criteriaName.minlength} et ${dataLengthValidations.criteriaName.maxlength} caractères.`
      })
    }

    const newCriteriaCoefficient = newCriteriaPayload.value.coefficient
    const parsedCoefficient = parseFloat(newCriteriaCoefficient.toString())

    if (isNaN(parsedCoefficient)) {
      errors.push(({ field: 'newCriteriaCoefficientInput', message: 'Le coefficient du critère doit être un nombre.' }))
    }

    if (!isNaN(parsedCoefficient) && (
      parsedCoefficient < dataLengthValidations.criteriaCoefficient.minlength ||
      parsedCoefficient > dataLengthValidations.criteriaCoefficient.maxlength
    )
    ) {
      errors.push({
        field: 'newCriteriaCoefficientInput',
        message: `Le coefficient du critère doit être compris entre ${dataLengthValidations.criteriaCoefficient.minlength} et ${dataLengthValidations.criteriaCoefficient.maxlength} (incluant les bornes).`
      })
    }

    const newCriteriaCategory = newCriteriaPayload.value.categoryId.toString()
    if (newCriteriaCategory.trim().length <= 0) {
      errors.push({
        field: 'newCriteriaCategoryInput',
        message: 'Veuillez choisir une catégorie.'
      })
    }
  }

  if (partToValidate === 'updateCriteria') {
    const selectedCriteriaName = selectedCriteria.value?.name.trim()
    if (
      selectedCriteriaName &&
      (selectedCriteriaName.trim().length < dataLengthValidations.criteriaName.minlength ||
        selectedCriteriaName.trim().length > dataLengthValidations.criteriaName.maxlength)) {
      errors.push({
        field: 'selectedCriteriaNameInput',
        message: `Le nom du critère doit contenir entre ${dataLengthValidations.criteriaName.minlength} et ${dataLengthValidations.criteriaName.maxlength} caractères.`
      })
    }

    const selectedCriteriaCoefficient = selectedCriteria.value?.coefficient

    if (selectedCriteriaCoefficient && isNaN(parseInt(selectedCriteriaCoefficient.toString()))) {
      errors.push(({
        field: 'selectedCriteriaCoefficientInput',
        message: 'Le coefficient du critère doit être un nombre.'
      }))
    }

    if (
      selectedCriteriaCoefficient &&
      !isNaN(parseInt(selectedCriteriaCoefficient.toString())) &&
      (parseInt(selectedCriteriaCoefficient.toString()) < dataLengthValidations.criteriaCoefficient.minlength ||
        parseInt(selectedCriteriaCoefficient.toString()) > dataLengthValidations.criteriaCoefficient.maxlength
      )
    ) {
      errors.push({
        field: 'selectedCriteriaCoefficientInput',
        message: `Le coefficient du critère doit être compris entre ${dataLengthValidations.criteriaCoefficient.minlength} et ${dataLengthValidations.criteriaCoefficient.maxlength} (incluant les bornes).`
      })
    }
  }


  return errors
}

const emptyNewCriteriaPayload = () => {
  newCriteriaPayload.value.name = ''
  newCriteriaPayload.value.coefficient = 1
  newCriteriaPayload.value.categoryId = ''
  if (newCriteriaSuccessMessage) newCriteriaSuccessMessage.innerText = ''
  removeErrors('newCriteriaNameInput')
  removeErrors('newCriteriaCoefficientInput')
}

const showErrors = (error: ValidationError) => {
  switch (error.field) {
    case 'newCriteriaNameInput':
      newCriteriaNameInput?.classList.add('is-invalid')
      if (newCriteriaNameInputInvalidFeedback) newCriteriaNameInputInvalidFeedback.innerText = error.message
      break
    case 'newCriteriaCoefficientInput':
      newCriteriaCoefficientInput?.classList.add('is-invalid')
      if (newCriteriaCoefficientInputInvalidFeedback) newCriteriaCoefficientInputInvalidFeedback.innerText = error.message
      break
    case 'newCriteriaCategoryInput':
      newCriteriaCategoryInput?.classList.add('is-invalid')
      if (newCriteriaCategoryInputInvalidFeedback) newCriteriaCategoryInputInvalidFeedback.innerText = error.message
      break
    case 'selectedCriteriaNameInput':
      selectedCriteriaNameInput?.classList.add('is-invalid')
      if (selectedCriteriaNameInputInvalidFeedback) selectedCriteriaNameInputInvalidFeedback.innerText = error.message
      break
    case 'selectedCriteriaCoefficientInput':
      selectedCriteriaCoefficientInput?.classList.add('is-invalid')
      if (selectedCriteriaCoefficientInputInvalidFeedback) selectedCriteriaCoefficientInputInvalidFeedback.innerText = error.message
      break
    case 'deleteCriteria':
      push.error({
        title: 'Erreur',
        message: error.message,
        duration: 5000
      })
  }
}

const removeErrors = (input: 'newCriteriaNameInput' | 'newCriteriaCoefficientInput' | 'newCriteriaCategoryInput' | 'selectedCriteriaNameInput' | 'selectedCriteriaCoefficientInput') => {
  switch (input) {
    case 'newCriteriaNameInput':
      newCriteriaNameInput?.classList.remove('is-invalid')
      if (newCriteriaNameInputInvalidFeedback) newCriteriaNameInputInvalidFeedback.innerText = ''
      break
    case 'newCriteriaCoefficientInput':
      newCriteriaCoefficientInput?.classList.remove('is-invalid')
      if (newCriteriaCoefficientInputInvalidFeedback) newCriteriaCoefficientInputInvalidFeedback.innerText = ''
      break
    case 'selectedCriteriaNameInput':
      selectedCriteriaNameInput?.classList.remove('is-invalid')
      if (selectedCriteriaNameInputInvalidFeedback) selectedCriteriaNameInputInvalidFeedback.innerText = ''
      break
    case 'selectedCriteriaCoefficientInput':
      selectedCriteriaCoefficientInput?.classList.remove('is-invalid')
      if (selectedCriteriaCoefficientInputInvalidFeedback) selectedCriteriaCoefficientInputInvalidFeedback.innerText = ''
      break
    case 'newCriteriaCategoryInput':
      newCriteriaCategoryInput?.classList.remove('is-invalid')
      if (newCriteriaCategoryInputInvalidFeedback) newCriteriaCategoryInputInvalidFeedback.innerText = ''
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