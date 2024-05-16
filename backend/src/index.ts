import 'dotenv/config'
import express from 'express'
import { authRoute } from './routes/auth.route'
import { initDb } from './db'
import { ApiResponseType } from './types'
import { profileRoute } from './routes/profile.route'
import { errors } from 'jose'
import { categoriesRoute } from './routes/categories.route'
import { productsRoute } from './routes/products.route'
import * as path from 'node:path'
import { criteriasRoute } from './routes/criterias.route'
import { userFavoritesRoute } from './routes/userFavorites.route'
import { _evaluationsRoute } from './routes/_evaluations.route'
import { evaluationsRoute } from './routes/evaluations.route'

const PORT = 3000
const app = express()

app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  next()
})

// routes
app.use('/api/auth', authRoute)
app.use('/api/profile', profileRoute)
app.use('/api/categories', categoriesRoute)
app.use('/api/products', productsRoute)
app.use('/api/criterias', criteriasRoute)
app.use('/api/favorites', userFavoritesRoute)
// app.use('/api/evaluations', _evaluationsRoute)
app.use('/api/evaluations', evaluationsRoute)

// port
app.listen(PORT, () => {
  console.log(`🔥 Serveur Express sur http://localhost:${PORT}`)
  initDb()
})

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errResponse: ApiResponseType = {
    status: 500,
    message: 'Erreur interne :' + err
  }

  if (err instanceof errors.JOSEError) {
    errResponse.status = 401
    errResponse.message = 'Signature JWT invalide'
  }

  console.error(`Erreur interne : ${err.stack}`)
  res.status(errResponse.status).json(errResponse)
})