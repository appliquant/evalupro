import express from 'express'
import { Criteria } from '../db'
import { ApiResponseType } from '../types'
import { dataLengthValidations } from '../validations'

const getCriterias = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Trouver les critères
    const criterias = await Criteria.findAll()

    // 2. Retourner les critères
    const response: ApiResponseType = {
      status: 200,
      message: 'Critères trouvés',
      data: criterias
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const createCriteria = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Extraire les données
    const { name, coefficient } = req.body

    if (!name || !coefficient) {
      const missing = []
      if (!name) missing.push('name')
      if (!coefficient) missing.push('coefficient')

      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champs manquants',
        errors: missing.map(field => ({
          field,
          message: `Le champ ${field} est manquant`
        }))
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    // 2. Vérifier les données
    const validationErrors = createCriteriaValidations(
      name,
      coefficient
    )

    if (validationErrors.errors?.length) {
      return res.status(validationErrors.status).json(validationErrors)
    }

    // todo: le nom ne doit pas exister en double pour la même catégorie

    // 3. Créer le critère
    const newCriteria = await Criteria.create({
      name,
      coefficient
    })

    // 4. Répondre
    const response: ApiResponseType = {
      status: 201,
      message: 'Critère créé',
      data: newCriteria
    }

    res.setHeader('Location', `/api/criterias/${newCriteria.dataValues.id}`)
    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const createCriteriaValidations = (name: string, coefficient: number) => {
  const errors: ApiResponseType = {
    status: 400,
    message: 'Erreurs de validation',
    errors: []
  }

  // name
  if (name.trim().length < dataLengthValidations.criteriaName.minlength ||
    name.trim().length > dataLengthValidations.criteriaName.maxlength) {
    errors.errors?.push({
      field: 'newCriteriaNameInput',
      message: `Le nom doit être entre ${dataLengthValidations.criteriaName.minlength} et ${dataLengthValidations.criteriaName.maxlength} caractères`
    })
  }

  // coefficient
  const parsedCoefficient = parseInt(coefficient.toString())
  if (isNaN(parsedCoefficient)) {
    errors.errors?.push({
      field: 'newCriteriaCoefficientInput',
      message: 'Le coefficient doit être un nombre'
    })
  }

  if (!isNaN(parsedCoefficient) && (parsedCoefficient < dataLengthValidations.criteriaCoefficient.minlength ||
    coefficient > dataLengthValidations.criteriaCoefficient.maxlength)) {
    errors.errors?.push({
      field: 'newCriteriaCoefficientInput',
      message: `Le coefficient doit être entre ${dataLengthValidations.criteriaCoefficient.minlength} et ${dataLengthValidations.criteriaCoefficient.maxlength}`
    })
  }

  return errors
}

export { getCriterias, createCriteria }