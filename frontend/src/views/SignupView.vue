<template>
  <div class="container text-left mt-5">

    <h1 class="mb-4">Créer un compte</h1>

    <form action="">
      <!-- pseudo -->
      <div class="input-group mb-3">
        <span class="input-group-text">@</span>
        <div class="form-floating">
          <input type="text" 
                 name="username"
                 :pattern="dataLengthValidations?.username?.regex"
                 :minlength="dataLengthValidations?.username?.minlength"
                 :maxlength="dataLengthValidations?.username?.maxlength"
                 class="form-control" id="usernameInput" placeholder="Nom d'utilisateur" required>
          <label for="usernameInput">Nom d'utilisateur</label>
        </div>
      </div>

      <!-- courriel -->
      <div class="form-floating mb-3">
        <input type="email"
               name="email"
               :pattern="dataLengthValidations?.email?.regex"
               :minlength="dataLengthValidations?.email?.minlength"
               :maxlength="dataLengthValidations?.email?.maxlength"
               class="form-control" id="emailInput" placeholder="nom@example.com" required>
        <label for="emailInput">Adresse courriel</label>
      </div>

      <!-- mdp -->
      <div class="form-floating mb-3">
        <input type="password"
                name="password"
               :pattern="dataLengthValidations?.password?.regex"
               :minlength="dataLengthValidations?.password?.minlength"
               :maxlength="dataLengthValidations?.password?.maxlength"
               id="passwdInput" class="form-control"
               aria-describedby="passwordHelpBlock" required>
        <label for="passwdInput" class="form-label">Mot de passe</label>
      </div>

      <!-- mdp confirmation -->
      <div class="form-floating mb-3">
        <input type="password"
                name="passwordConfirmation"
               :minlength="dataLengthValidations?.password?.minlength"
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
</script>