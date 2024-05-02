<template>
  <div class="container mt-3">
    <h1>dashboard</h1>
    <span class="badge rounded-pill text-bg-primary mb-3">{{ userData.role }}</span>

    <ul class="nav flex-wrap">
      <li class="nav-item">
        <a class="nav-link" aria-current="page">Géréer les catégorie</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {push} from "notivue";
import {type ApiResponseType, UserRoles} from "@/types";
import {profileService} from "@/services/profileService";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "vue-router";

const authStore = useAuthStore()
const router = useRouter()

type UserData = {
  role: UserRoles
}

const userData = ref({
  role: UserRoles.USER
})

onMounted(async () => {
  try {
    const res = await profileService.getProfile(authStore.jwt)
    if (res.status !== 200) {
      authStore.deleteJwt()
      await router.push({name: 'signin'})
    }

    userData.value.role = (res.data as UserData).role
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: "Erreur",
      message: err.message,
      duration: 13000
    })
  }
})
</script>

<style scoped lang="scss">
//ul.nav > 
.nav-link:first-child {
  padding-left: 0 !important;
}
</style>