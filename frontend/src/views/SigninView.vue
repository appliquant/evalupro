<template>
  <div class="container text-left mt-3">

    <h1 class="mb-2">Connexion</h1>

    <form @submit.prevent="login">
      <!-- courriel -->
      <div class="form-floating mb-3">
        <input type="email"
               v-model="payload.email"
               :minlength="dataLengthValidations?.email?.minlength"
               :maxlength="dataLengthValidations?.email?.maxlength"
               class="form-control" id="emailInput" placeholder="nom@example.com" required>
        <label for="emailInput">Adresse courriel</label>
      </div>

      <!-- mdp -->
      <div class="form-floating mb-3">
        <input type="password"
               v-model="payload.password"
               :pattern="dataLengthValidations?.password?.regex"
               :minlength="dataLengthValidations?.password?.minlength"
               :maxlength="dataLengthValidations?.password?.maxlength"
               id="passwdInput" class="form-control" aria-describedby="passwordHelpBlock" required>
        <label for="passwdInput" class="form-label">Mot de passe</label>
      </div>


      <button class="btn btn-primary" style="margin-right: 1%">Se connecter</button>
      <a>
        <RouterLink to="/signup" class="link-underline-opacity-0">Pas de compte ?</RouterLink>
      </a>
    </form>
  </div>
</template>
<script setup lang="ts">
import {dataLengthValidations} from "@/validations.js";
import {ref} from "vue";
import {authService} from "@/services/authService";
import type {ApiResponseType} from "@/types";
import {push} from "notivue";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "vue-router";

const authStore = useAuthStore()
const router = useRouter()

const payload = ref(
    {
      email: "",
      password: ""
    }
)

const login = async () => {
  try {
    const res = await authService.signin(
        payload.value.email,
        payload.value.password
    )

    if (res.status !== 200) {
      return push.error({
        title: "Erreur",
        message: res.message,
        duration: 5000
      })
    }
    
    authStore.setJwt(res.data.jwt)
    await router.push({name: "dashboard"})
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: "Erreur",
      message: err.message,
      duration: 13000
    })
  }
}
</script>