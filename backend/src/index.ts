import express from "express";

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
app.use("/api/auth", require("./controllers/auth.controller"))

app.get("/", (req, res) => {
    res.send("yooo")
})

app.listen(PORT, () => {
    console.log(`🔥 Serveur Express sur http://localhost:${PORT}`)
})