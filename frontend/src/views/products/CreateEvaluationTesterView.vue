<template>
  <div class="container mt-3">
    <h1>Créer une évaluation</h1>

    <div v-if="product?.data.product">
      <h2>{{ product?.data.product.name }}</h2>
      <RouterLink :to="`/product/${product?.data.product.id}`">Voir le produit</RouterLink>
    </div>

    <p v-if="productLoading" class="text-info">Chargement...</p>
    <p v-if="productError" class="text-danger">{{ productError }}</p>

    <!-- Formulaire de création d'évaluation -->
    <form v-if="product?.data?.product" novalidate>
      <!-- Liste des critères d'évaluation avec un champ pour donner une note -->
      <div v-if="product?.data?.criterias" class="mb-3">
        <fieldset class="border rounded p-2">
          <legend class="float-none w-auto p-2">Critères</legend>
          <label for="criteria" class="form-label">Critères d'évaluation</label>

          <!-- Critères d'évaluation -->
          <div v-for="criteria in product?.data?.criterias" :key="criteria.id" class="mb-3">
            <label :for="`criteria-${criteria.id}`" class="form-label
            d-block">{{ criteria.name }} - Coefficient : {{ criteria.coefficient }}</label>

            <select :id="`criteria-${criteria.id}`"
                    class="form-select"
                    v-model="criteria.value"
                    v-on:input="(e) => {
                      onCriteriaChange(criteria.id, (e.target as HTMLSelectElement).value);
                      removeErrors('fieldset');
                    }"
            >
              <option value="1">Excellent</option>
              <option value="0.8">Très bon</option>
              <option value="0.6">Acceptable</option>
              <option value="0.4">Mauvais</option>
              <option value="0.2">Très mauvais</option>
            </select>
          </div>
        </fieldset>
      </div>

      <!-- Champ pour donner un commentaire général -->
      <div class="mb-3">
        <label for="comment" class="form-label">(Facultatif) Commentaire</label>
        <textarea id="commentTextArea"
                  class="form-control"
                  v-model="evaluationPayload.comment"
                  @input="removeErrors('comment')"
                  aria-describedby="commentInvalidFeedback commentHelpBlock"></textarea>

        <div id="commentInvalidFeedback" class="invalid-feedback"></div>
        <div id="commentHelpBlock" class="form-text">
          Le commentaire doit comprendre entre
          {{ dataLengthValidations.optional_evaluationComment.minlength }}
          et {{ dataLengthValidations.optional_evaluationComment.maxlength }} caractères.
        </div>
      </div>

      <!-- Bouton pour soumettre l'évaluation -->
      <button type="submit" class="btn btn-primary" @click.prevent="createEvaluation">Soumettre l'évaluation</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useProduct } from '@/composables/useProduct'
import { useRoute } from 'vue-router'
import { dataLengthValidations } from '@/validations'
import type { ApiResponseType, ValidationError } from '@/types'
import { push } from 'notivue'
import { evaluationsService } from '@/services/evaluationsService'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

const evaluationPayload = ref({
  criterias: [] as { criteriaId: string, value: number }[],
  comment: ''
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
})

let commentTextArea: HTMLTextAreaElement | null
let commentInvalidFeedback: HTMLDivElement | null
let fieldset: HTMLFieldSetElement | null

const onCriteriaChange = (criteriaId: string, value: string) => {
  const index = evaluationPayload.value.criterias.findIndex(c => c.criteriaId === criteriaId)
  if (index === -1) {
    const criteria = { criteriaId, value: Number(value) }
    evaluationPayload.value.criterias.push(criteria)
  } else {
    evaluationPayload.value.criterias[index].value = Number(value)
  }
}

const createEvaluation = async () => {
  const validationErrors = validations()
  console.log(validationErrors)
  if (validationErrors.length > 0) {
    validationErrors.forEach((err) => showErrors(err))
    return
  }

  try {
    const res = await evaluationsService.createEvaluation(
      authStore.jwt,
      productId.value as string,
      evaluationPayload.value
    )

    if (res.errors && res.errors.length > 0) {
      res.errors.forEach((err) => showErrors(err))
      return
    }

    if (res.status === 201) {
      return push.success({
        title: 'Succès',
        message: res.message,
        duration: 3000
      })
    }


    push.error({
      title: 'Erreur',
      message: res.message,
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

const validations = (): ValidationError[] => {
  const errors: ValidationError[] = []

  const selectsInsideFieldset = document.querySelectorAll('fieldset select')
  let criteriasNotSelected = false
  selectsInsideFieldset.forEach((select) => {
    const selectElement = select as HTMLSelectElement
    if (selectElement.value === '' && !criteriasNotSelected) {
      // Pour afficher l'erreur une seule fois
      criteriasNotSelected = true
      errors.push({
        field: 'criteria',
        message: 'Vous devez donner une note à tous les critères.'
      })
    }
  })

  const comment = evaluationPayload.value.comment.trim()
  if (comment.length > 0) {
    if (comment.length < dataLengthValidations.optional_evaluationComment.minlength ||
      comment.length > dataLengthValidations.optional_evaluationComment.maxlength) {
      errors.push({
        field: 'comment',
        message: `Le commentaire doit comprendre entre
        ${dataLengthValidations.optional_evaluationComment.minlength} et
        ${dataLengthValidations.optional_evaluationComment.maxlength} caractères.`
      })
    }

  }

  return errors
}

const showErrors = (error: ValidationError) => {
  switch (error.field) {
    case 'criteria':
      fieldset = document.querySelector('fieldset')
      fieldset?.classList.add('border-danger')
      push.error({
        title: 'Erreur',
        message: error.message
      })
      break
    case 'comment':
      commentTextArea = document.getElementById('commentTextArea') as HTMLTextAreaElement
      commentInvalidFeedback = document.getElementById('commentInvalidFeedback') as HTMLDivElement
      commentTextArea?.classList.add('is-invalid')
      if (commentInvalidFeedback) commentInvalidFeedback.textContent = error.message
      break
    default:
      push.error({
        title: 'Erreur',
        message: error.message,
        duration: 5000
      })
  }
}

const removeErrors = (input: 'comment' | 'fieldset') => {
  switch (input) {
    case 'comment':
      commentTextArea?.classList.remove('is-invalid')
      if (commentInvalidFeedback) commentInvalidFeedback.textContent = ''
      break
    case 'fieldset':
      fieldset?.classList.remove('border-danger')
      break
  }
}
</script>