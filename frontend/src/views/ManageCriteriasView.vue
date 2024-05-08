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
        <p v-if="criteriasLoading" class="text-center">Chargement</p>
        <p v-if="criteriasError" class="text-center text-danger">{{ criteriasError }}</p>
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
            <button type="button" class="btn btn-primary">Ajouter</button>
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

const authStore = useAuthStore()
const {
  data: criterias,
  loading: criteriasLoading,
  error: criteriasError
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
  document.removeEventListener('hidden.bs.modal', () => {
    emptyNewCriteriaPayload()
  })
})

const emptyNewCriteriaPayload = () => {
  newCriteriaPayload.value.name = ''
  newCriteriaPayload.value.coefficient = 1
  if (newCriteriaSuccessMessage) newCriteriaSuccessMessage.innerText = ''
  removeErrors('newCriteriaNameInput')
  removeErrors('newCriteriaCoefficientInput')
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