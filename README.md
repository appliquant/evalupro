https://github.com/appliquant/evalupro/assets/29934021/82be7730-27ec-42ba-87bf-5fb58598ab40

[*english*](#En)

# Evalupro - Application d'évaluation de produits

Evalupro est une application Web dédiée à l'évaluation de produits divers. Elle permet aux visiteurs de trier et de rechercher des produits, aux membres inscrits de consulter et sauvegarder des produits, et aux testeurs de créer des évaluations détaillées.

## Utilisation

1. Installer Node.js (version récente)

### Backend

1. Aller dans le dossier `backend`
2. Lancer `npm install`
3. Lancer `npm run dev` ou `node --run dev`

### Frontend

1. Aller dans le dossier `frontend`
2. Lancer `npm install`
3. Lancer `npm run dev` ou `node --run dev`

## Fonctionnalités

### Authentification et Gestion des Comptes

- Menu pour l’authentification et la création de comptes accessible sur toutes les pages du site
- Création d’un compte utilisateur avec les informations suivantes :
  - Nom d’utilisateur (pseudo) : unique dans toute l’application
  - Courriel : unique dans toute l’application (à utiliser pour la connexion)
  - Mot de passe : minimum 6 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial (#?!@$ %^&*-) 
  - Rôle par défaut : utilisateur
  - Validation dynamique (Ajax ou Fetch) pour vérifier l’unicité de l’adresse courriel
- Page de connexion

### Gestion des Catégories et Produits

- Gestion des catégories par l’administrateur :
  - Créer ou modifier une catégorie avec nom et catégorie parent optionnelle
  - Supprimer une catégorie non associée à un produit ou une caractéristique
  - Accéder à la liste des catégories
- Gestion des produits par l’administrateur :
  - Créer ou modifier un produit avec nom, catégorie, marque, description, prix et image
  - Supprimer un produit non associé à une évaluation
  - Accéder à la liste des produits

### Recherche et Détails des Produits

- Formulaire de recherche de produit sur la page d’accueil
  - Recherche par nom partiel et catégorie
  - Tri des résultats par nom ou pointage total
  - Accès aux détails du produit depuis les résultats de recherche
- Page de détails d’un produit affichant :
  - Informations et pointage total du produit
  - Critères d’évaluation du produit (pointage affiché uniquement pour les utilisateurs authentifiés)
  - Commentaires des testeurs

### Gestion des Critères

- Chaque catégorie dispose d’une liste de critères pour évaluer les produits
- Gestion des critères par l’administrateur :
  - Créer ou modifier un critère avec nom et coefficient de pondération
  - Supprimer un critère non associé à une évaluation
  - Accéder à la liste des critères par catégorie

### Gestion des Évaluations

- Une évaluation comprend :
  - Liste des critères d’évaluation avec notes (excellent (1), très bon (0,8), acceptable (0,6), mauvais (0,4), très mauvais (0,2))
  - Note totale représentant la moyenne pondérée des notes attribuées à chaque critère
  - Commentaire
- Gestion des évaluations par les testeurs :
  - Créer, modifier, consulter et supprimer leurs évaluations
- Gestion des évaluations par les administrateurs :
  - Modifier, consulter et supprimer toutes les évaluations

### Comparaisons de Produits

- Comparaison de deux produits de la même catégorie pour les utilisateurs authentifiés
- Affichage des critères d’évaluation des deux produits sous forme de tableau
- Comparaison des pointages des deux produits pour chaque critère

### Gestion des Favoris

- Les utilisateurs authentifiés peuvent :
  - Consulter la liste de leurs produits favoris
  - Ajouter un produit à la liste de leurs favoris
  - Supprimer un produit de la liste de leurs favoris

## Rôles des Utilisateurs

### Administrateur

- Permissions :
  - Consulter, créer, modifier et supprimer des catégories de produit
  - Consulter, créer, modifier et supprimer des produits
  - Consulter, créer, modifier et supprimer les critères d’évaluation d’un produit
  - Consulter, modifier et supprimer toutes les évaluations des testeurs

### Visiteur (non authentifié)

- Permissions :
  - Rechercher un produit
  - Consulter une fiche de détails d’un produit
  - Consulter seulement le pointage total obtenu par un produit
- Restrictions :
  - Ne peut pas comparer entre des produits
  - Ne peut pas consulter le pointage obtenu pour chaque critère d’évaluation

### Utilisateur (authentifié)

- Permissions :
  - Tout ce qu’un visiteur peut faire
  - Consulter la fiche détaillée d’un produit, y compris les pointages obtenus pour chaque critère d’évaluation
  - Ajouter ou supprimer un produit de ses favoris
  - Consulter la liste de ses produits favoris
  - Comparer des produits d’une même catégorie
- Restrictions :
  - Ne peut pas évaluer des produits

### Testeur

- Permissions :
  - Tout ce qu’un utilisateur peut faire
  - Créer des évaluations
- Restrictions :
  - Ne peut pas gérer la liste des catégories
  - Ne peut pas gérer la liste des produits
  - Ne peut pas définir les critères d’évaluation d’une catégorie

## Tests Automatisés

- Tests automatisés avec Postman pour l'authentification

## Technologies

Technologies utilisées : HTML, CSS, JavaScript, TypeScript, Node.js, Express.js, Vue.js, Bootstrap 5, SASS, Sequelize, MariaDB, Postman

---

# En
# Evalupro - Product Evaluation Application

Evalupro is a web application dedicated to evaluating various products. It allows visitors to sort and search for products, registered members to view and save products, and testers to create detailed evaluations.

## Usage

1. Install Node.js (recent version)

### Backend

1. Go to the `backend` folder
2. Run `npm install`
3. Run `npm run dev` or `node --run dev`

### Frontend

1. Go to the `frontend` folder
2. Run `npm install`
3. Run `npm run dev` or `node --run dev`

## Features

### Authentication and Account Management

- Menu for authentication and account creation accessible on all pages of the site
- User account creation with the following information:
  - Username: unique within the application
  - Email: unique within the application (used for login)
  - Password: minimum 6 characters, 1 uppercase letter, 1 number, 1 special character (#?!@$ %^&*-) 
  - Default role: user
  - Dynamic validation (Ajax or Fetch) to check the uniqueness of the email address
- Login page

### Category and Product Management

- Category management by the administrator:
  - Create or edit a category with name and optional parent category
  - Delete a category not associated with a product or feature
  - Access the list of categories
- Product management by the administrator:
  - Create or edit a product with name, category, brand, description, price, and image
  - Delete a product not associated with an evaluation
  - Access the list of products

### Product Search and Details

- Product search form on the homepage
  - Search by partial name and category
  - Sort results by name or total score
  - Access product details from the search results
- Product detail page displaying:
  - Information and total score of the product
  - Product evaluation criteria (score displayed only for authenticated users)
  - Tester comments

### Criteria Management

- Each category has a list of criteria for evaluating products
- Criteria management by the administrator:
  - Create or edit a criterion with name and weighting coefficient
  - Delete a criterion not associated with an evaluation
  - Access the list of criteria by category

### Evaluation Management

- An evaluation includes:
  - List of evaluation criteria with scores (excellent (1), very good (0.8), acceptable (0.6), poor (0.4), very poor (0.2))
  - Total score representing the weighted average of the scores assigned to each criterion
  - Comment
- Evaluation management by testers:
  - Create, edit, view, and delete their evaluations
- Evaluation management by administrators:
  - Edit, view, and delete all evaluations

### Product Comparisons

- Comparison of two products in the same category for authenticated users
- Display of the evaluation criteria of the two products in a table format
- Comparison of the scores of the two products for each criterion

### Favorites Management

- Authenticated users can:
  - View the list of their favorite products
  - Add a product to their favorites list
  - Remove a product from their favorites list

## User Roles

### Administrator

- Permissions:
  - View, create, edit, and delete product categories
  - View, create, edit, and delete products
  - View, create, edit, and delete product evaluation criteria
  - View, edit, and delete all tester evaluations

### Visitor (unauthenticated)

- Permissions:
  - Search for a product
  - View a product detail page
  - View only the total score of a product
- Restrictions:
  - Cannot compare products
  - Cannot view the score for each evaluation criterion

### User (authenticated)

- Permissions:
  - Everything a visitor can do
  - View the detailed product page, including scores for each evaluation criterion
  - Add or remove a product from their favorites
  - View the list of their favorite products
  - Compare products in the same category
- Restrictions:
  - Cannot evaluate products

### Tester

- Permissions:
  - Everything a user can do
  - Create evaluations
- Restrictions:
  - Cannot manage the list of categories
  - Cannot manage the list of products
  - Cannot define the evaluation criteria for a category

## Automated Tests

- Automated tests with Postman for authentication

## Technologies

Technologies used: HTML, CSS, JavaScript, TypeScript, Node.js, Express.js, Vue.js, Bootstrap 5, SASS, Sequelize, MariaDB, Postman
