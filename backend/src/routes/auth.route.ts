import express from "express";
import { checkIfEmailIsUsed, signin, signup } from '../controllers/auth.controller'

const authRoute = express.Router();

authRoute.get("/check-email-is-used", checkIfEmailIsUsed)
authRoute.post("/signin", signin)
authRoute.post("/signup", signup)

export {authRoute}