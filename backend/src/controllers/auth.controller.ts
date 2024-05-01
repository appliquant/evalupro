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

        const errorMessage: ApiResponseType = {message: `Champs manquant(s): ${missing.join(", ")}`};
        return res.status(400).json(errorMessage);
    }

    const errors = signupValidations(username, email, password);
    console.log(errors)
    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

    // 2. Vérifier si l'utilisateur existe

    // 3. Créer un utilisateur

    // 4. Renvoyer réponse


    res.json({message: "Signup"});
})

function signupValidations(username: string, email: string, password: string): ApiResponseType[] {
    const errors = []

    // username
    if (username.trim().length < dataLengthValidations?.email?.minlength) {
        const errorMessage: ApiResponseType = {message: `Nom d'utilisateur trop court`};
        errors.push(errorMessage);
    }

    if (username.trim().length > dataLengthValidations?.email?.maxlength) {
        const errorMessage: ApiResponseType = {message: `Nom d'utilisateur trop long`};
        errors.push(errorMessage);
    }

    if (dataLengthValidations?.username?.regex && !username.match(dataLengthValidations?.username?.regex)) {
        const errorMessage: ApiResponseType = {message: `Nom d'utilisateur invalide`};
        errors.push(errorMessage);
    }

    // email
    if (email.trim().length < dataLengthValidations?.email?.minlength) {
        const errorMessage: ApiResponseType = {message: `Adresse courriel trop courte`};
        errors.push(errorMessage);
    }

    if (email.trim().length > dataLengthValidations?.email?.maxlength) {
        const errorMessage: ApiResponseType = {message: `Adresse courriel trop longue`};
        errors.push(errorMessage);
    }

    // password
    if (password.trim().length < dataLengthValidations?.password?.minlength) {
        const errorMessage: ApiResponseType = {message: `Mot de passe trop court`};
        errors.push(errorMessage);
    }

    if (password.trim().length > dataLengthValidations?.password?.maxlength) {
        const errorMessage: ApiResponseType = {message: `Mot de passe trop long`};
        errors.push(errorMessage);
    }

    if (dataLengthValidations?.password?.regex && !password.match(dataLengthValidations?.password?.regex)) {
        const errorMessage: ApiResponseType = {message: `Mot de passe invalide`};
        errors.push(errorMessage);
    }

    return errors;
}

export {authController};