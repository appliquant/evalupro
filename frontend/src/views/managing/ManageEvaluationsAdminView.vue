<template>
  <div class="container mt-3">
    <h1>Gérer les évaluations (administration)</h1>

    <div class="row row-cols-1 row-cols-sm-2">
      <div class="col">
        <h2>Liste de toutes les évaluations</h2>

        <p v-if="items.length <= 0">Aucune évaluation n'existe</p>

        <!-- Liste des évaluations -->
        <ul class="list-group" id="list-container">
          <li v-for="(item, index) in items"
              :key="item.evaluation.id"
              style="cursor: pointer; user-select: none;"
              @click="selectItem(index)"
              :class="`list-group-item ${selectedItem?.evaluation.id === item.evaluation.id && 'active'}`"
          >
            {{ item.product.name }}
          </li>
        </ul>

      </div>

      <div class="col">
        <h2>Évaluation sélectionée</h2>

        <form class="needs-validation" novalidate>
          <fieldset :disabled="selectedItem === null">
            <!-- Critères d'évaluation -->
            <div>
              <div class="mb-3"
                   v-for="criteria in selectedItem?.criterias"
                   :key="criteria.id">
                <label :for="`criteria-${criteria.id}`" class="form-label d-block">{{ criteria.name }} - Coefficient :
                  {{ criteria.coefficient }}</label>

                <select :id="`criteria-${criteria.id}`"
                        class="form-select"
                        :value="selectedItem?.criteriasEvaluation.find(c => c.criteriaId === criteria.id)?.value"
                        v-on:input="e => {
                          if (selectedItem) {
                            const value = (e.target as HTMLSelectElement).value
                            const criteriaEvaluation = selectedItem.criteriasEvaluation.find(c => c.criteriaId === criteria.id)
                            if (criteriaEvaluation) {
                              criteriaEvaluation.value = Number(value)
                            }
                            // removeErrors('fieldset')
                          }
                        }">
                  <option value="1">Excellent</option>
                  <option value="0.8">Très bon</option>
                  <option value="0.6">Acceptable</option>
                  <option value="0.4">Mauvais</option>
                  <option value="0.2">Très mauvais</option>
                </select>
              </div>
            </div>

            <!-- Commentaire -->
            <div>
              <label for="comment" class="form-label">(Facultatif) Commentaire</label>
              <textarea id="commentTextArea"
                        class="form-control"
                        :value="selectedItem?.evaluation.comment"
                        v-on:input="e => {
                         if (selectedItem) {
                            selectedItem.evaluation.comment = (e.target as HTMLTextAreaElement).value
                            // removeErrors('comment')
                         }
                        }"
                        aria-describedby="commentInvalidFeedback commentHelpBlock"></textarea>

              <div id="commentInvalidFeedback" class="invalid-feedback"></div>
              <div id="commentHelpBlock" class="form-text">
                Le commentaire doit comprendre entre
                {{ dataLengthValidations.optional_evaluationComment.minlength }}
                et {{ dataLengthValidations.optional_evaluationComment.maxlength }} caractères.
              </div>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-primary">Enregistrer</button>
              <button class="btn btn-outline-danger">Supprimer</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { ApiResponseType, Category, Criteria, CriteriasEvaluation, Evaluation, Product } from '@/types'
import { onMounted, ref, toRaw } from 'vue'
import { push } from 'notivue'
import { evaluationsService } from '@/services/evaluationsService'
import { dataLengthValidations } from '../../validations'

const authStore = useAuthStore()

type Data = {
  category: Category
  criterias: Criteria[]
  criteriasEvaluation: CriteriasEvaluation[]
  evaluation: Evaluation
  product: Product
}

const items = ref<Data[]>([])
const selectedItem = ref<Data | null>(null)

onMounted(() => {
  getEvaluations()
})

const getEvaluations = async () => {
  try {
    const res = await evaluationsService.getEvaluations(
      authStore.jwt
    )

    if (res.status !== 200) {
      return push.error({
        title: 'Erreur',
        message: res.message,
        duration: 5000
      })
    }

    items.value = res.data
    console.log(items.value)
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: 'Erreur',
      message: err.message,
      duration: 5000
    })
  }
}

const selectItem = (index: number) => {
  const item = items.value[index]

  if (selectedItem.value?.evaluation.id === item.evaluation.id) {
    return unSelectItem()
  }

  selectedItem.value = structuredClone(toRaw(item))
}

const unSelectItem = () => {
  selectedItem.value = null
}
</script>

<style lang="scss">
#list-container {
  max-height: 50dvh;
  overflow-y: auto;
}
</style>
