import express from "express";
import {isSignedIn} from "../middlewares/isSignedIn";
import {getProfile} from "../controllers/profile.controller";

const profileRoute = express.Router();

profileRoute.get("/", isSignedIn, getProfile)

export {profileRoute}