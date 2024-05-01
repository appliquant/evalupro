<template>
  <div class="container text-left mt-5">

    <h1 class="mb-4">Connexion</h1>

    <form action="">
      <!-- courriel -->
      <div class="form-floating mb-3">
        <input type="email" 
               :minlength="dataLengthValidations?.email?.minlength"
               :maxlength="dataLengthValidations?.email?.maxlength"
               class="form-control" id="emailInput" placeholder="nom@example.com" required>
        <label for="emailInput">Adresse courriel</label>
      </div>

      <!-- mdp -->
      <div class="form-floating mb-3">
        <input type="password" 
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
</script>