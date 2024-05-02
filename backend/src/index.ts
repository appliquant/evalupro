import 'dotenv/config'
import express from "express";
import {authController} from "./controllers/auth.controller";
import {initDb} from "./db";
import {ApiResponseType} from "./types";

const PORT = process.env.PORT ?? 3000;
const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    res.setHeader("Access-Control-Allow-Methods", "*")
    next()
})

// routes
app.use("/api/auth", authController)

app.get("/", (req, res) => {
    res.send("yooo")
})

// port
app.listen(PORT, () => {
    console.log(`🔥 Serveur Express sur http://localhost:${PORT}`)
    initDb()
})

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err)
    const errResponse: ApiResponseType = {
        status: 500,
        message: "Erreur interne" + err,
    }

    res.status(errResponse.status).json(errResponse)
})