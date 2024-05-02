import {ApiResponseType, UserRoles} from "../types";
import express from "express";

export function requireRole(role: UserRoles) {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        {
            try {

            } catch (err) {
                next(err)
            }
        }
    }
}