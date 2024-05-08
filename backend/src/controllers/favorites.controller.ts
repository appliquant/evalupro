import express from 'express'

const getFavorites = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {

  } catch (err) {
    next(err)
  }
}

export { getFavorites }