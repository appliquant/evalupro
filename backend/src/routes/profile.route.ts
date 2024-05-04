import express from "express";
import {requireIsSignedin} from "../middlewares/requireIsSignedin";
import {getProfile} from "../controllers/profile.controller";

const profileRoute = express.Router();

profileRoute.get("/", requireIsSignedin, getProfile)

export {profileRoute}