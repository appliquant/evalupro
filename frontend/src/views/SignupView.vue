<template>
  <div class="container text-left mt-3">

    <h1 class="mb-2">Créer un compte</h1>

    <form @submit.prevent="signup">
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
                 @input="removeServerErrors('email')"
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
                 @input="removeServerErrors('password')"
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
      <div class="mb-3">
        <div class="form-floating" id="passwdConfirmationInputContainer">
          <input type="password"
                 @input="showPasswordMatchError"
                 v-model="passwordConfirmation"
                 name="password"
                 :pattern="dataLengthValidations?.password?.regex"
                 :minlength="dataLengthValidations?.password?.minlength"
                 :maxlength="dataLengthValidations?.password?.maxlength"
                 id="passwdConfirmationInput"
                 class="form-control"
                 aria-describedby="passwordConfirmationHelp passwdConfirmationInputInvalidFeedback" required>
          <label for="passwdInput" class="form-label" aria-describedby="passwdConfirmationHelp">Confimer votre mot de
            passe</label>
          <div id="passwdConfirmationHelp" class="form-text">Doit contenir au minimum 6 caractères, 1 majuscule, 1
            chiffre et 1 des caractères spéciaux suivants : #?!@$ %^&*-
          </div>
        </div>
        <div id="passwdConfirmationInputInvalidFeedback" class="invalid-feedback">
        </div>
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
import {Notivue, push} from "notivue";

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
let passwdConfirmation: null | HTMLElement
let passwdConfirmationContainer: null | HTMLElement
let passwdConfirmationInvalidFeedback: null | HTMLElement
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
  passwdConfirmation = document.getElementById("passwdConfirmationInput")
  passwdConfirmationContainer = document.getElementById("passwdConfirmationInputContainer")
  passwdConfirmationInvalidFeedback = document.getElementById("passwdConfirmationInputInvalidFeedback")
  email = document.getElementById("emailInput")
  emailContainer = document.getElementById("emailInputContainer")
  emailInvalidFeedback = document.getElementById("emailInputInvalidFeedback")
})

const showPasswordMatchError = () => {
  if (!validatePasswordsMatch()) {
    return showServerErrors({field: "passwordConfirmation", message: "Les mots de passe ne correspondent pas"})
  }

  return removeServerErrors("passwordConfirmation")
}

const validatePasswordsMatch = (): boolean => {
  return payload.value.password === passwordConfirmation.value
}

const signup = async () => {
  try {
    if (!validatePasswordsMatch()) {
      showServerErrors({field: "passwordConfirmation", message: "Les mots de passe ne correspondent pas"})
      return
    }

    const res = await authService.signup(
        payload.value.username,
        payload.value.email,
        payload.value.password,
    )

    if (res.errors && res.errors.length > 0) {
      for (const error of res.errors) {
        showServerErrors(error)
      }
      return
    }

    if (res.status === 200) {
      return push.success({
        title: "Compte créé",
        message: "Vous pouvez maintenant vous connecter",
        duration: 3000
      })
    }

  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: "Erreur",
      message: err.message,
      duration: 13000
    })
  }
}

const showServerErrors = (error: { field: string, message: string }) => {
  switch (error.field) {
    case "username": {
      username?.classList.add("is-invalid")
      usernameContainer?.classList.add("is-invalid")
      if (usernameInvalidFeedback) usernameInvalidFeedback.innerText = error.message
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
    case "passwordConfirmation": {
      passwdConfirmation?.classList.add("is-invalid")
      passwdConfirmationContainer?.classList.add("is-invalid")
      if (passwdConfirmationInvalidFeedback) passwdConfirmationInvalidFeedback.innerText = error.message
      break
    }
    default:
  }
}

const removeServerErrors = (input: "username" | "email" | "password" | "passwordConfirmation") => {
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
    case "passwordConfirmation": {
      passwdConfirmation?.classList.remove("is-invalid")
      passwdConfirmationContainer?.classList.remove("is-invalid")
      if (passwdConfirmationInvalidFeedback) passwdConfirmationInvalidFeedback.innerText = ""
      break
    }
    default:
  }

}
</script>
