<template>
  <div class="container mt-3">
    <h1>Gérer mes évaluations de testeur</h1>

    <div class="row row-cols-1 row-cols-sm-2">
      <div class="col">

        <h2>Liste des mes évaluations</h2>

        <p v-if="data.length <= 0">Aucune évaluation</p>

        <!-- Liste des évaluations -->
        <ul class="list-group" id="list-container">
          <li class="list-group-item"
              style="cursor: pointer; user-select: none;"
              v-for="evaluation in data"
              :key="evaluation.evaluation.id">
            {{ evaluation.product.name }}
          </li>
        </ul>
      </div>

      <div class="col">
        <h2>Évaluation sélectionée</h2>

        <form class="needs-validation" novalidate>

        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ApiResponseType, Category, Criteria, CriteriasEvaluation, Evaluation, Product } from '@/types'
import { push } from 'notivue'
import { evaluationsService } from '@/services/evaluationsService'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

type Data = {
  category: Category
  criterias: Criteria[]
  criteriasEvaluations: CriteriasEvaluation[]
  evaluation: Evaluation
  product: Product
}

const data = ref<Data[]>([])


onMounted(() => {
  const getMyEvaluationsTester = async () => {
    try {
      const res = await evaluationsService.getMyEvaluationsTester(
        authStore.jwt
      )

      if (res.status !== 200) {
        return push.error({
          title: 'Erreur',
          message: 'Une erreur est survenue',
          duration: 5000
        })
      }

      data.value = res.data
      console.log(res.data)
    } catch (e) {
      const err = e as ApiResponseType
      push.error({
        title: 'Erreur',
        message: err.message,
        duration: 5000
      })
    }
  }

  getMyEvaluationsTester()
})
</script>

<style lang="scss">
#list-container {
  max-height: 50dvh;
  overflow-y: auto;
}
</style>
