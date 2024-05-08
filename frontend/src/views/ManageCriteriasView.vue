<template>
  <div class="container">
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
            class="list-group-item d-flex justify-content-between align-items-center"
            style="cursor: pointer; user-select: none;"
          >
            {{ criteria.name }}
          </li>
        </ul>
        <p v-if="criteriasLoading">Chargement</p>
        <p v-if="criteriasError" class="text-danger">{{ criteriasError }}</p>
        <p v-if="criterias?.data?.length === 0">Aucun critère</p>
      </div>

      <div class="col"></div>
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
import type { ApiResponseType, ValidationError } from '@/types'
import { push } from 'notivue'
import { criteriasService } from '@/services/criteriasService'

const authStore = useAuthStore()
const {
  data: criterias,
  loading: criteriasLoading,
  error: criteriasError,
  reload: criteriasReload
} = useCriterias()

const newCriteriaPayload = ref({
  name: '',
  coefficient: 1
})

let newCriteriaNameInput: null | HTMLInputElement
let newCriteriaNameInputInvalidFeedback: null | HTMLDivElement
let newCriteriaCoefficientInput: null | HTMLInputElement
let newCriteriaCoefficientInputInvalidFeedback: null | HTMLDivElement
let newCriteriaSuccessMessage: null | HTMLParagraphElement

onMounted(() => {
  newCriteriaNameInput = document.getElementById('newCriteriaNameInput') as HTMLInputElement
  newCriteriaNameInputInvalidFeedback = document.getElementById('newCriteriaNameInputInvalidFeedback') as HTMLDivElement
  newCriteriaCoefficientInput = document.getElementById('newCriteriaCoefficientInput') as HTMLInputElement
  newCriteriaCoefficientInputInvalidFeedback = document.getElementById('newCriteriaCoefficientInputInvalidFeedback') as HTMLDivElement
  newCriteriaSuccessMessage = document.getElementById('newCriteriaSuccessMessage') as HTMLParagraphElement

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

const validations = (partToValidate: 'createCriteria' | 'updateCriteria'): ValidationError[] => {
  const errors: ValidationError[] = []

  if (partToValidate === 'createCriteria') {
    const newCriteriaName = newCriteriaPayload.value.name.trim()
    if (newCriteriaName.length < dataLengthValidations.criteriaName.minlength || newCriteriaName.length > dataLengthValidations.criteriaName.maxlength) {
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
  }


  return errors
}

const emptyNewCriteriaPayload = () => {
  newCriteriaPayload.value.name = ''
  newCriteriaPayload.value.coefficient = 1
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
  }
}

const removeErrors = (input: 'newCriteriaNameInput' | 'newCriteriaCoefficientInput') => {
  switch (input) {
    case 'newCriteriaNameInput':
      newCriteriaNameInput?.classList.remove('is-invalid')
      if (newCriteriaNameInputInvalidFeedback) newCriteriaNameInputInvalidFeedback.innerText = ''
      break
    case 'newCriteriaCoefficientInput':
      newCriteriaCoefficientInput?.classList.remove('is-invalid')
      if (newCriteriaCoefficientInputInvalidFeedback) newCriteriaCoefficientInputInvalidFeedback.innerText = ''
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