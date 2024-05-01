<template>
  <div class="container text-left mt-5">

    <h1 class="mb-4">Créer un compte</h1>

    <form action="">
      <!-- pseudo -->
      <div class="input-group mb-3">
        <span class="input-group-text">@</span>
        <div class="form-floating">
          <input type="text" class="form-control" id="usernameInput" placeholder="Nom d'utilisateur" required>
          <label for="usernameInput">Nom d'utilisateur</label>
        </div>
      </div>

      <!-- courriel -->
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="emailInput" placeholder="nom@example.com" required>
        <label for="emailInput">Email address</label>
      </div>

      <!-- mdp -->
      <div class="form-floating mb-3">
        <input type="password" id="passwdInput" class="form-control" aria-describedby="passwordHelpBlock" required>
        <label for="passwdInput" class="form-label">Password</label>
      </div>

      <button class="btn btn-primary">Créer</button>
    </form>
  </div>
</template>
