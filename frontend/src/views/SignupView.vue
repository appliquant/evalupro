<template>
  <div class="container text-left mt-5">

    <h1 class="mb-4">Créer un compte</h1>

    <form @submit.prevent="login">
      <!-- pseudo -->
      <div class="mb-3">
        <div class="input-group has-validation" id="usernameInputContainer">
          <span class="input-group-text">@</span>
          <div class="form-floating">
            <input type="text"
                   @input="removeServerErrors('username')"
                   v-model="payload.username"
                   name="username"
                   :pattern="dataLengthValidations?.username?.regex"
                   :minlength="dataLengthValidations?.username?.minlength"
                   :maxlength="dataLengthValidations?.username?.maxlength"
                   class="form-control"
                   aria-describedby="usernameHelp usernameInputInvalidFeedback"
                   id="usernameInput" placeholder="Nom d'utilisateur" required>
            <label for="usernameInput">Nom
              d'utilisateur</label>
          </div>
        </div>
        <div id="usernameHelp" class="form-text">Entre 3 et 50 caractères alphabétiques plus le tiret et
          l’espace
        </div>
        <div class="invalid-feedback" id="usernameInputInvalidFeedback">
        </div>
      </div>

      <!-- courriel -->
      <div class="mb-3">
        <div class="form-floating is-invalid" id="emailInputContainer">
          <input type="email"
                 v-model="payload.email"
                 name="email"
                 :minlength="dataLengthValidations?.email?.minlength"
                 :maxlength="dataLengthValidations?.email?.maxlength"
                 class="form-control"
                 aria-describedby="emailInputInvalidFeedback"
                 id="emailInput" placeholder="nom@example.com" required>
          <label for="emailInput">Adresse courriel</label>
        </div>
        <div id="emailInputInvalidFeedback" class="invalid-feedback">
        </div>
      </div>

      <!-- mdp -->
      <div class="mb-3">
        <div class="form-floating" id="passwdInputContainer">
          <input type="password"
                 v-model="payload.password"
                 name="password"
                 :pattern="dataLengthValidations?.password?.regex"
                 :minlength="dataLengthValidations?.password?.minlength"
                 :maxlength="dataLengthValidations?.password?.maxlength"
                 id="passwdInput"
                 class="form-control"
                 aria-describedby="passwordHelp passwdInputInvalidFeedback" required>
          <label for="passwdInput" class="form-label" aria-describedby="passwdHelp">Mot de passe</label>
          <div id="passwdHelp" class="form-text">Doit contenir au minimum 6 caractères, 1 majuscule, 1
            chiffre et 1 des caractères spéciaux suivants : #?!@$ %^&*-
          </div>
        </div>
        <div id="passwdInputInvalidFeedback" class="invalid-feedback">
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
import {onMounted, ref} from "vue";

const payload = ref({
  username: "",
  email: "",
  password: "",
  passwordConfirmation: ""
})

const passwordConfirmation = ref("")

let username: null | HTMLElement
let usernameContainer: null | HTMLElement
let usernameInvalidFeedback: null | HTMLElement
let password: null | HTMLElement
let passwordContainer: null | HTMLElement
let passwordInvalidFeedback: null | HTMLElement
let email: null | HTMLElement
let emailContainer: null | HTMLElement
let emailInvalidFeedback: null | HTMLElement

onMounted(() => {
  username = document.getElementById("usernameInput")
  usernameContainer = document.getElementById("usernameInputContainer")
  usernameInvalidFeedback = document.getElementById("usernameInputInvalidFeedback")
  password = document.getElementById("passwdInput")
  passwordContainer = document.getElementById("passwdInputContainer")
  passwordInvalidFeedback = document.getElementById("passwdInputInvalidFeedback")
  email = document.getElementById("emailInput")
  emailContainer = document.getElementById("emailInputContainer")
  emailInvalidFeedback = document.getElementById("emailInputInvalidFeedback")
})

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

    const res = await authService.signup(
        "fa123",
        // payload.value.username,
        // payload.value.email,
        "fakeemail",
        // payload.value.password,
        "fakepas"
    )

    console.log(`res: ${JSON.stringify(res)}`)

    if (res.errors && res.errors.length > 0) {
      for (const error of res.errors) {
        showServerErrors(error)
      }
      return
    }

    // success
    console.log("success")

  } catch (e) {
    const err = e as ApiResponseType
    console.log(err)
  }
}

const showServerErrors = (error: { field: string, message: string }) => {
  switch (error.field) {
    case "username": {
      console.log(username)
      console.log(document.getElementById("usernameInput"))
      username?.classList.add("is-invalid")
      usernameContainer?.classList.add("is-invalid")
      if (usernameInvalidFeedback) usernameInvalidFeedback.innerText = error.message
      console.log("username errr")
      break
    }
    case "email": {
      email?.classList.add("is-invalid")
      emailContainer?.classList.add("is-invalid")
      if (emailInvalidFeedback) emailInvalidFeedback.innerText = error.message
      break
    }
    case "password": {
      password?.classList.add("is-invalid")
      passwordContainer?.classList.add("is-invalid")
      if (passwordInvalidFeedback) passwordInvalidFeedback.innerText = error.message
      break
    }
    default:
      console.log("default error")
  }
}

const removeServerErrors = (input: "username" | "email" | "password" | "confirmPassword") => {
  switch (input) {
    case "username": {
      username?.classList.remove("is-invalid")
      usernameContainer?.classList.remove("is-invalid")
      if (usernameInvalidFeedback) usernameInvalidFeedback.innerText = ""
      break
    }
    case "email": {
      email?.classList.remove("is-invalid")
      emailContainer?.classList.remove("is-invalid")
      if (emailInvalidFeedback) emailInvalidFeedback.innerText = ""
      break
    }
    case "password": {
      password?.classList.remove("is-invalid")
      passwordContainer?.classList.remove("is-invalid")
      if (passwordInvalidFeedback) passwordInvalidFeedback.innerText = ""
      break
    }
    default:
  }

}
</script>
