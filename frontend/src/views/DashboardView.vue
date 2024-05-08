<template>
  <div class="container mt-3">
    <h1>Panneau de contrôle</h1>

    <p v-if="loading" class="text-info">Chargement...</p>
    <p v-if="error" class="text-danger">{{ error }}</p>

    <ul v-if="data" class="nav flex-column">

      <!-- Gérer les catégories -->
      <li class="nav-item" v-show="data?.data.role === UserRoles.ADMIN">
        <RouterLink
          to="/manage-categories"
          style="margin-right: 0.5rem"
          class="link-underline-opacity-0"
        >Gérer les catégories
        </RouterLink>
        <span class="badge rounded-pill text-bg-primary">{{ data?.data.role }}</span>
      </li>

      <!-- Gérer les produits -->
      <li class="nav-item mt-2" v-show="data?.data.role === UserRoles.ADMIN">
        <RouterLink
          to="/manage-products"
          style="margin-right: 0.5rem"
          class="link-underline-opacity-0"
        >Gérer les produits
        </RouterLink>
        <span class="badge rounded-pill text-bg-primary">{{ data?.data.role }}</span>
      </li>

      <!-- Gérer les critères -->
      <li class="nav-item mt-2" v-show="data?.data.role === UserRoles.ADMIN">
        <RouterLink
          to="/manage-criteria"
          style="margin-right: 0.5rem"
          class="link-underline-opacity-0"
        >Gérer les critères
        </RouterLink>
        <span class="badge rounded-pill text-bg-primary">{{ data?.data.role }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { UserRoles } from '@/types'
import { useCurrentUser } from '@/composables/useCurrentUser'

const { data, loading, error } = useCurrentUser()

</script>

<style scoped lang="scss">
.nav-link:first-child {
  padding-left: 0 !important;
}
</style>
