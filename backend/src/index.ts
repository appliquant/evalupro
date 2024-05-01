import express from "express";

const PORT = process.env.PORT ?? 3000;
const app = express()

app.get("/", (req, res) => {
    res.send("yooo")
})

app.listen(PORT, () => {
    console.log(`🔥 Serveur Express sur http://localhost:${PORT}`)
})