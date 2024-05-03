<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">💰💸 Evalupro</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <!-- /signup -->
          <li v-if="route.name === 'signin' || route.name === 'signup'" class="nav-item">
            <a class="nav-link active" aria-current="page">
              <RouterLink to="/signin" class="link-underline-opacity-0">Connexion</RouterLink>
            </a>
          </li>

          <!-- /signin -->
          <li v-if="route.name === 'signin' || route.name === 'signup'" class="nav-item">
            <a class="nav-link active" aria-current="page">
              <RouterLink to="/signup" class="link-underline-opacity-0">Devenir membre</RouterLink>
            </a>
          </li>

          <!-- /logout -->
          <li v-if="route.name !== 'signin' && route.name !== 'signup'" class="nav-item">
            <button @click="logout" class="btn btn-link">Déconnexion</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore";

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push({name: 'signin'})
}
</script>