import express from "express";
import * as jose from "jose";
import {ApiResponseType} from "../types";

export async function isSignedIn(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const token = req.headers["authorization"]?.split(" ")[1]
        if (!token) {
            const missingTokenError: ApiResponseType = {
                status: 401,
                message: "Bearer token manquant",
            }

            return res.status(missingTokenError.status).json(missingTokenError)
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const jwt = await jose.jwtVerify(token, secret)
        console.log(jwt)
        req.jwtToken = {
            email: jwt.payload.email as string
        }

        next()
    } catch (err) {
        next(err)
    }
}