<template>
  <div class="container text-left mt-5">

    <h1 class="mb-4">Créer un compte</h1>

    <form @submit.prevent="login">
      <!-- pseudo -->
      <div class="mb-3">
        <div class="input-group">
          <span class="input-group-text">@</span>
          <div class="form-floating">
            <input type="text"
                   v-model="payload.username"
                   name="username"
                   :pattern="dataLengthValidations?.username?.regex"
                   :minlength="dataLengthValidations?.username?.minlength"
                   :maxlength="dataLengthValidations?.username?.maxlength"
                   class="form-control" id="usernameInput" placeholder="Nom d'utilisateur" required>
            <label for="usernameInput" aria-describedby="usernameHelp">Nom d'utilisateur</label>
          </div>
        </div>
        <div id="usernameHelp" class="form-text">Entre 3 et 50 caractères alphabétiques plus le tiret et
          l’espace
        </div>
      </div>

      <!-- courriel -->
      <div class="form-floating mb-3">
        <input type="email"
               v-model="payload.email"
               name="email"
               :minlength="dataLengthValidations?.email?.minlength"
               :maxlength="dataLengthValidations?.email?.maxlength"
               class="form-control" id="emailInput" placeholder="nom@example.com" required>
        <label for="emailInput">Adresse courriel</label>
      </div>

      <!-- mdp -->
      <div class="form-floating mb-3">
        <input type="password"
               v-model="payload.password"
               name="password"
               :pattern="dataLengthValidations?.password?.regex"
               :minlength="dataLengthValidations?.password?.minlength"
               :maxlength="dataLengthValidations?.password?.maxlength"
               id="passwdInput" class="form-control"
               aria-describedby="passwordHelpBlock" required>
        <label for="passwdInput" class="form-label" aria-describedby="passwdHelp">Mot de passe</label>
        <div id="passwdHelp" class="form-text">Doit contenir au minimum 6 caractères, 1 majuscule, 1
          chiffre et 1 des caractères spéciaux suivants : #?!@$ %^&*-
        </div>
      </div>

      <!-- mdp confirmation -->
      <div class="form-floating mb-3">
        <input type="password"
               v-model="passwordConfirmation"
               :minlength="dataLengthValidations?.password?.minlength"
               name="passwordConfirmation"
               :maxlength="dataLengthValidations?.password?.maxlength"
               :pattern="dataLengthValidations?.password?.regex"
               id="passwdInput2" class="form-control" aria-describedby="passwordHelpBlock" required>
        <label for="passwdInput2" class="form-label">Confirmer mot de passe</label>
      </div>
      <button class="btn btn-primary" style="margin-right: 2%;">Créer</button>
      <a>
        <RouterLink to="/signin" class="link-underline-opacity-0">Vous avez déja un compte?</RouterLink>
      </a></form>
  </div>
</template>
<script setup lang="ts">
import {dataLengthValidations} from "@/validations.js";
import {authService} from "@/services/authService";
import type {ApiResponseType} from "@/types";
import {ref} from "vue";

const payload = ref({
  username: "",
  email: "",
  password: "",
  passwordConfirmation: ""
})

const passwordConfirmation = ref("")

const validatePasswordsMatch = (): boolean => {
  return payload.value.password === passwordConfirmation.value
}

const login = async () => {
  try {
    console.log(payload.value)
    console.log(passwordConfirmation.value)

    if (!validatePasswordsMatch()) {
      console.log("Passwords do not match")
      return
    }

    const res = await authService.signup(payload.value.username,
        // payload.value.email,
        "fakeemail",
        payload.value.password,
    )

    console.log(`res: ${JSON.stringify(res)}`)
  } catch (e) {
    const err = e as ApiResponseType
    console.log(err)
  }
}
</script>