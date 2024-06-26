import express from 'express'
import { Category, Criteria, CriteriaEvaluation } from '../db'
import { ApiResponseType } from '../types'
import { dataLengthValidations } from '../validations'

const getCriterias = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Trouver les critères
    // Trier par ordre hiérarchique (catégorie parente, catégorie enfant, critère)
    const criterias = await Criteria.findAll({
      include: {
        model: Category,
        as: 'category'
      },
      order: [
        [{ model: Category, as: 'category' }, 'parentId', 'ASC'],
        [{ model: Category, as: 'category' }, 'id', 'ASC'],
        ['id', 'ASC']
      ]
    })


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
    const { name, coefficient, categoryId } = req.body

    if (!name || !coefficient || !categoryId) {
      const missing = []
      if (!name) missing.push('name')
      if (!coefficient) missing.push('coefficient')
      if (!categoryId) missing.push('categoryId')

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
    const validationErrors = validations(
      name,
      coefficient,
      'createCriteria'
    )

    if (validationErrors.errors?.length) {
      return res.status(validationErrors.status).json(validationErrors)
    }

    // 3. Vérifier si la catégorie existe
    let existingCategory = await Category.findByPk(categoryId)
    if (!existingCategory) {
      const existingCategoryResponse: ApiResponseType = {
        status: 400,
        message: 'Catégorie inexistante',
        errors: [
          {
            field: 'newCriteriaCategoryIdInput',
            message: 'La catégorie n\'existe pas'
          }
        ]
      }

      return res.status(existingCategoryResponse.status).json(existingCategoryResponse)
    }


    // 4. Vérifier si le critère existe pour la même catégorie ou une catégorie parente
    // (qui hérite des critères de la catégorie parente)
    while (existingCategory) {
      let existingCriteria = await Criteria.findOne({
        where: {
          name,
          categoryId: existingCategory.dataValues.id
        }
      })

      if (existingCriteria) {
        const existingCriteriaResponse: ApiResponseType = {
          status: 400,
          message: 'Critère existant',
          errors: [
            {
              field: 'newCriteriaNameInput',
              message: 'Un critère avec ce nom existe déjà dans la catégorie ou une catégorie parente'
            }
          ]
        }

        return res.status(existingCriteriaResponse.status).json(existingCriteriaResponse)
      }

      existingCategory = await Category.findByPk(existingCategory.dataValues.parentId)
    }

    // 5. Vérifier si la catégorie qu'on veut créer existe déja sur un des enfants
    // (qui hérite des critères de la catégorie qu'on veut créer)
    let existingChildCategory = await Category.findOne({
      where: {
        parentId: categoryId
      }
    })

    while (existingChildCategory) {
      let existingCriteria = await Criteria.findOne({
        where: {
          name,
          categoryId: existingChildCategory.dataValues.id
        }
      })

      if (existingCriteria) {
        const existingCriteriaResponse: ApiResponseType = {
          status: 400,
          message: 'Critère existant',
          errors: [
            {
              field: 'newCriteriaNameInput',
              message: 'Un critère avec ce nom existe déjà dans un des enfants de la catégorie'
            }
          ]
        }

        return res.status(existingCriteriaResponse.status).json(existingCriteriaResponse)
      }

      existingChildCategory = await Category.findOne({
        where: {
          parentId: existingChildCategory.dataValues.id
        }
      })
    }


    // 6. Créer le critère
    const newCriteria = await Criteria.create({
      name,
      coefficient,
      categoryId
    })

    // 7. Répondre
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

const updateCriteria = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Extraire les données
    const { name, coefficient, categoryId } = req.body
    const { id } = req.params

    if (!id || !name || !coefficient || !categoryId) {
      const missing = []
      if (!id) missing.push('id')
      if (!name) missing.push('name')
      if (!coefficient) missing.push('coefficient')
      if (!categoryId) missing.push('categoryId')

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
    const validationErrors = validations(
      name,
      coefficient,
      'updateCriteria'
    )

    if (validationErrors.errors?.length) {
      return res.status(validationErrors.status).json(validationErrors)
    }

    // 3. Vérifier si le critère existe
    const criteria = await Criteria.findByPk(req.params.id)
    if (!criteria) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Critère non trouvé',
        errors: [
          {
            field: 'id',
            message: 'Le critère n\'existe pas'
          }
        ]
      }

      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 4. Vérifier si la catégorie existe
    const existingCategory = await Category.findByPk(categoryId)
    if (!existingCategory) {
      const existingCategoryResponse: ApiResponseType = {
        status: 400,
        message: 'Catégorie inexistante',
        errors: [
          {
            field: 'selectedCriteriaCategoryIdInput',
            message: 'La catégorie n\'existe pas'
          }
        ]
      }

      return res.status(existingCategoryResponse.status).json(existingCategoryResponse)
    }

    // Vérifier que le nom du critère ne peut pas exister en double pour la même catégorie
    // ou sur une catégorie parente
    let existingCategoryToCheck: Category | null = existingCategory
    while (existingCategoryToCheck) {
      let existingCriteria = await Criteria.findOne({
        where: {
          name,
          categoryId: existingCategoryToCheck.dataValues.id
        }
      })

      if (existingCriteria && existingCriteria.dataValues.id !== parseInt(id)) {
        const existingCriteriaResponse: ApiResponseType = {
          status: 400,
          message: 'Critère existant',
          errors: [
            {
              field: 'selectedCriteriaNameInput',
              message: 'Un critère avec ce nom existe déjà dans la catégorie ou une catégorie parente'
            }
          ]
        }

        return res.status(existingCriteriaResponse.status).json(existingCriteriaResponse)
      }

      existingCategoryToCheck = await Category.findByPk(existingCategoryToCheck.dataValues.parentId)
    }

    // 5. Mettre à jour le critère
    await Criteria.update({
      name,
      coefficient,
      categoryId
    }, {
      where: {
        id: id
      }
    })

    // 6. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Critère mis à jour'
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const deleteCriteria = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Vérifier les données
    const { id } = req.params

    if (!id) {
      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champ manquant',
        errors: [
          {
            field: 'id',
            message: 'L\'id est manquant'
          }
        ]
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    // 2. Vérifier si le critère existe
    const criteria = await Criteria.findByPk(req.params.id)
    if (!criteria) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Critère non trouvé',
        errors: [
          {
            field: 'deleteCriteria',
            message: 'Le critère n\'existe pas'
          }
        ]
      }

      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 3. Vérifier si le critère est déjà utilisé quelque part dans une évaluation
    const criteriaUsed = await CriteriaEvaluation.findOne({
      where: {
        criteriaId: id
      }
    })

    if (criteriaUsed) {
      const criteriaUsedResponse: ApiResponseType = {
        status: 400,
        message: 'Critère utilisé',
        errors: [
          {
            field: 'deleteCriteria',
            message: 'Le critère est déjà utilisé dans une évaluation'
          }
        ]
      }

      return res.status(criteriaUsedResponse.status).json(criteriaUsedResponse)
    }

    // 4. Supprimer le critère
    await Criteria.destroy({
      where: {
        id: id
      }
    })

    // 5. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Critère supprimé'
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const validations = (name: string, coefficient: number, partToValidate: 'createCriteria' | 'updateCriteria') => {
  const errors: ApiResponseType = {
    status: 400,
    message: 'Erreurs de validation',
    errors: []
  }

  const prefix = partToValidate === 'createCriteria' ? 'new' : 'selected'

  // name
  if (name.trim().length < dataLengthValidations.criteriaName.minlength ||
    name.trim().length > dataLengthValidations.criteriaName.maxlength) {
    errors.errors?.push({
      field: `${prefix}CriteriaNameInput`,
      message: `Le nom doit être entre ${dataLengthValidations.criteriaName.minlength} et ${dataLengthValidations.criteriaName.maxlength} caractères`
    })
  }

  // coefficient
  const parsedCoefficient = parseInt(coefficient.toString())
  if (isNaN(parsedCoefficient)) {
    errors.errors?.push({
      field: `${prefix}CriteriaCoefficientInput`,
      message: 'Le coefficient doit être un nombre'
    })
  }

  if (!isNaN(parsedCoefficient) && (parsedCoefficient < dataLengthValidations.criteriaCoefficient.minlength ||
    coefficient > dataLengthValidations.criteriaCoefficient.maxlength)) {
    errors.errors?.push({
      field: `${prefix}CriteriaCoefficientInput`,
      message: `Le coefficient doit être entre ${dataLengthValidations.criteriaCoefficient.minlength} et ${dataLengthValidations.criteriaCoefficient.maxlength}`
    })
  }

  return errors
}

export { getCriterias, createCriteria, updateCriteria, deleteCriteria }