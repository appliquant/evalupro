import express from "express";
import {authController} from "./controllers/auth.controller";
import {sequelize} from "./db";

const PORT = process.env.PORT ?? 3000;
const app = express()

app.use(express.json())

// cors
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

app.listen(PORT, () => {
    console.log(`🔥 Serveur Express sur http://localhost:${PORT}`)

    // Test de la connexion à la base de données
    sequelize.authenticate().then(() => {
            console.log("🗃️ Connexion à la base de données établie")
        }
    ).catch((error) => {
        console.error("❌ Erreur de connexion à la base de données", error)
    })
})