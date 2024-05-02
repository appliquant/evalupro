import express from "express";
import {signin, signup} from "../controllers/auth.controller";

const authRoute = express.Router();

authRoute.post("/signin", signin)
authRoute.post("/signup", signup)

export {authRoute}