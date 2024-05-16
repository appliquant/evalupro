<template>
  <div class="container mt-3">
    <h1>Gérer les évaluations (administration)</h1>

    <div class="row row-cols-1 row-cols-sm-2">
      <div class="col">
        <h2>Liste de toutes les évaluations</h2>

        <p v-if="items.length <= 0">Aucune évaluation n'existe</p>

        <!-- Liste des évaluations -->
<!--        <div v-else>-->
<!--          <div v-for="item in items" :key="item.evaluation.id">-->
<!--            <div class="card mb-3">-->
<!--              <div class="card-body">-->
<!--                <h5 class="card-title">{{ item.product.name }}</h5>-->
<!--                <p class="card-text">{{ item.evaluation.comment }}</p>-->
<!--                <button class="btn btn-primary">Voir</button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <ul class="list-group" id="list-container">
         <li v-for="(item, index) in items"
             :key="item.evaluation.id"
             class="list-group-item"
         >
          {{ item.product.name}} 
         </li> 
        </ul>

      </div>

      <div class="col">
        <h2>Évaluation sélectionée</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { ApiResponseType, Category, Criteria, CriteriasEvaluation, Evaluation, Product } from '@/types'
import { onMounted, ref } from 'vue'
import { push } from 'notivue'
import { evaluationsService } from '@/services/evaluationsService'

const authStore = useAuthStore()

type Data = {
  category: Category
  criterias: Criteria[]
  criteriasEvaluation: CriteriasEvaluation[]
  evaluation: Evaluation
  product: Product
}

const items = ref<Data[]>([])

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
</script>

<style lang="scss">
#list-container {
  max-height: 50dvh;
  overflow-y: auto;
}
</style>
