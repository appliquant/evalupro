import express from "express";
import {ApiResponseType} from "../types";
import {dataLengthValidations} from "../validations";

const authController = express.Router();

authController.post("/signin", (req, res) => {
    // 1. Vérifier les données

    // 2. Vérifier si l'utilisateur existe

    // 3. Vérifier si le mot de passe est correct

    // 4. Créer un token

    // 5. Renvoyer le token

    res.json({message: "Signin"});
})

authController.post("/signup", (req, res) => {
    // 1. Vérifier les données
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        const missing = []
        if (!username) missing.push("username");
        if (!email) missing.push("email");
        if (!password) missing.push("password");

        const missingFieldsErrors: ApiResponseType = {
            status: 400,
            message: `Champs manquant(s)`,
            errors: missing.map(field => {
                    return {
                        field,
                        message: `${field} est manquant`
                    }
                }
            )
        };
        return res.status(missingFieldsErrors.status).json(missingFieldsErrors);
    }

    const validationErrors = signupValidations(username, email, password);
    console.log(validationErrors)
    if (validationErrors.errors !== undefined && validationErrors.errors.length > 0) {
        return res.status(validationErrors.status).json(validationErrors);
    }

    // 2. Vérifier si l'utilisateur existe

    // 3. Créer un utilisateur

    // 4. Renvoyer réponse

    const response: ApiResponseType = {
        status: 200,
        message: `Utilisateur ${username} créé`
    };
    
    res.json(response);
})

function signupValidations(username: string, email: string, password: string): ApiResponseType {
    const errorMessage: ApiResponseType = {
        status: 400,
        message: `Erreur de validation du formulaire de création de compte`,
        errors: []
    };

    // username
    if (username.trim().length < dataLengthValidations?.email?.minlength) {
        errorMessage.errors?.push({field: "username", message: `Nom d'utilisateur trop court`});
    }

    if (username.trim().length > dataLengthValidations?.email?.maxlength) {
        errorMessage.errors?.push({field: "username", message: `Nom d'utilisateur trop long`});
    }

    if (dataLengthValidations?.username?.regex && !username.match(dataLengthValidations?.username?.regex)) {
        errorMessage.errors?.push({field: "username", message: `Nom d'utilisateur invalide`});
    }

    // email
    if (email.trim().length < dataLengthValidations?.email?.minlength) {
        errorMessage.errors?.push({field: "email", message: `Adresse courriel trop courte`});
    }

    if (email.trim().length > dataLengthValidations?.email?.maxlength) {
        errorMessage.errors?.push({field: "email", message: `Adresse courriel trop longue`});
    }
    
    if (dataLengthValidations?.email?.regex && !email.match(dataLengthValidations?.email?.regex)) {
        errorMessage.errors?.push({field: "email", message: `Adresse courriel invalide`});
    }

    // password
    if (password.trim().length < dataLengthValidations?.password?.minlength) {
        errorMessage.errors?.push({field: "password", message: `Mot de passe trop court`});
    }

    if (password.trim().length > dataLengthValidations?.password?.maxlength) {
        errorMessage.errors?.push({field: "password", message: `Mot de passe trop long`});
    }

    if (dataLengthValidations?.password?.regex && !password.match(dataLengthValidations?.password?.regex)) {
        errorMessage.errors?.push({field: "password", message: `Mot de passe invalide`});
    }

    return errorMessage;
}

export {authController};