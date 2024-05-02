import express from "express";
import {isSignedIn} from "../middlewares/isSignedIn";
import {User} from "../db";
import {ApiResponseType} from "../types";

const profileController = express.Router();

profileController.get("/", isSignedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.jwtToken?.email
            }
        })
        if (!user) {
            const userNotFoundError = {
                status: 404,
                message: "Utilisateur non trouvé"
            }

            return res.status(userNotFoundError.status).json(userNotFoundError)
        }

        const response: ApiResponseType = {
            status: 200,
            message: "Utilisateur trouvé",
            data: {
                role: user.dataValues.role
            }
        }

        return res.status(response.status).json(response)
    } catch (err) {
        next(err)
    }
})

export {profileController}