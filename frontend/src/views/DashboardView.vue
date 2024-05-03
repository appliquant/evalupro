<template>
  <div class="container mt-3">
    <h1>Panneau de contrôle</h1>
    <p>{{ data }}</p>
    <p>{{ error }}</p>
    <ul class="nav flex-column">
      <li class="nav-item" v-show="userData.role === UserRoles.ADMIN">
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

      <li class="nav-item" v-show="userData.role === UserRoles.ADMIN">
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
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/useCurrentUser'

const { data, error } = useCurrentUser()

type UserData = {
  role: UserRoles
}

const userData = ref({
  role: UserRoles.USER
})

// if (error.value !== null) {
//   switch (error.value.status) {
//     case 401:
//       authStore.logout()
//       router.push({name: 'signin'})
//         push.error({
//           title: "Erreur",
//           message: "Vous n'êtes pas autorisé à accéder à cette page",
//           duration: 13000
//         })
//       break
//     default:
//       push.error({
//         title: "Erreur",
//         message: error.value.message,
//         duration: 13000
//       })
//   }
// }

onMounted(async () => {
  // try {
  //   const res = await profileService.getProfile(authStore.jwt)
  //   if (res.status !== 200) {
  //     authStore.deleteJwt()
  //     await router.push({name: 'signin'})
  //   }
  //
  //   userData.value.role = (res.data as UserData).role
  // } catch (e) {
  //   const err = e as ApiResponseType
  //   push.error({
  //     title: "Erreur",
  //     message: err.message,
  //     duration: 13000
  //   })
  // }
})
</script>

<style scoped lang="scss">
//ul.nav >
.nav-link:first-child {
  padding-left: 0 !important;
}
</style>
