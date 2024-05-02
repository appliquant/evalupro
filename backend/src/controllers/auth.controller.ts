import express from "express";
import {ApiResponseType} from "../types";
import {dataLengthValidations} from "../validations";
import {User} from "../db";
import {hash, compare} from "bcrypt"
import * as jose from "jose"

const signin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // 1. Vérifier les données
        const {email, password} = req.body;

        if (!email || !password) {
            const missing = []
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

        // 2. Vérifier si l'utilisateur existe
        const userExists = await User.findOne({
            where: {
                email: email
            },
            attributes: ["email", "password", "role"]
        })

        if (!userExists) {
            const userExistsError: ApiResponseType = {
                status: 400,
                message: `Courriel et/ou mot de passe invalide`,
            }
            return res.status(userExistsError.status).json(userExistsError);
        }


        // 3. Vérifier si le mot de passe est correct
        const hashedPassword = userExists.dataValues.password
        const passwordMatch = await compare(password, hashedPassword);
        if (!passwordMatch) {
            const passwordMatchError: ApiResponseType = {
                status: 400,
                message: `Courriel et/ou mot de passe invalide`,
            }
            return res.status(passwordMatchError.status).json(passwordMatchError);
        }

        // 4. Créer un token
        const token = await new jose.SignJWT({
            email: userExists.dataValues.email,
        })
            .setIssuedAt()
            .setProtectedHeader({alg: "HS256"})
            .setExpirationTime("2h")
            .sign(new TextEncoder().encode(
                process.env.JWT_SECRET
            ))

        // 5. Renvoyer le token
        const response: ApiResponseType = {
            status: 200,
            message: `Connecté`,
            data: {
                token,
                role: userExists.dataValues.role
            }
        };

        res.status(response.status).json(response);
    } catch (err) {
        next(err)
    }
}

const signup = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
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
        if (validationErrors.errors !== undefined && validationErrors.errors.length > 0) {
            return res.status(validationErrors.status).json(validationErrors);
        }

        // 2. Vérifier si courriel existe & si username existe
        const userExists = User.findOne({
            where: {
                email: email
            }
        })

        const usernameExists = User.findOne({
            where: {
                username: username
            }
        })

        const exists = await Promise.all([userExists, usernameExists])

        if (exists[0]) {
            const userExistsError: ApiResponseType = {
                status: 400,
                message: `Utilisateur déjà existant`,
                errors: [
                    {
                        field: "email",
                        message: `Adresse courriel déjà utilisée`
                    }
                ]
            }
            return res.status(userExistsError.status).json(userExistsError);
        }

        if (exists[1]) {
            const usernameExistsError: ApiResponseType = {
                status: 400,
                message: `Utilisateur déjà existant`,
                errors: [
                    {
                        field: "username",
                        message: `Nom d'utilisateur déjà utilisé`
                    }
                ]
            }
            return res.status(usernameExistsError.status).json(usernameExistsError);
        }

        // Hash mdp
        const hashedPassword = await hash(password, 10);

        // 3. Créer un utilisateur
        await User.create({
            username,
            email,
            password: hashedPassword,
        })

        // 4. Renvoyer réponse
        const response: ApiResponseType = {
            status: 200,
            message: `Utilisateur ${username} créé`
        };

        res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
}

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

export {signin, signup};