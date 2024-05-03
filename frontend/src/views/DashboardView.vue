<template>
  <div class="container mt-3">
    <h1>Panneau de contrôle</h1>

    <p v-if="loading" class="text-info">Chargement...</p>
    <p v-if="error" class="text-danger">{{ error }}</p>

    <ul v-if="data" class="nav flex-column">
      <li class="nav-item" v-show="data?.data.role === UserRoles.ADMIN">
        <a class="nav-link" aria-current="page">
          <RouterLink
            to="/manage-categories"
            style="margin-right: 0.5rem"
            class="link-underline-opacity-0"
          >Gérer les catégories
          </RouterLink>
          <span class="badge rounded-pill text-bg-primary">{{ userData.role }}</span>
        </a>
      </li>

      <li class="nav-item" v-show="data?.data.role === UserRoles.ADMIN">
        <a class="nav-link" aria-current="page">
          <RouterLink
            to="/manage-products"
            style="margin-right: 0.5rem"
            class="link-underline-opacity-0"
          >Gérer les produits
          </RouterLink>
          <span class="badge rounded-pill text-bg-primary">{{ userData.role }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { UserRoles } from '@/types'
import { useCurrentUser } from '@/composables/useCurrentUser'

const { data, loading, error } = useCurrentUser()

const userData = ref({
  role: UserRoles.USER
})

onMounted(async () => {
})
</script>

<style scoped lang="scss">
//ul.nav >
.nav-link:first-child {
  padding-left: 0 !important;
}
</style>
