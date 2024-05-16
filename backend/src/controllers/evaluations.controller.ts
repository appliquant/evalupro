import { Category, CriteriaEvaluation, Evaluation, Product } from '../db'
import { getCategoryAndAncestorCriterias } from './getCategoryAndAncestorCriterias'
import { ApiResponseType } from '../types'
import express from 'express'
import { dataLengthValidations } from '../validations'


const fetchEvaluationDetails = async (productId: number) => {
  const product = await Product.findByPk(productId)
  if (!product) {
    return { error: 'Produit non trouvé', status: 404 }
  }

  const category = await Category.findByPk(product.dataValues.categoryId)
  if (!category) {
    return { error: 'Catégorie du produit non trouvée', status: 404 }
  }

  const criterias = await getCategoryAndAncestorCriterias(category)
  return { product, category, criterias }
}

const calculateWeightedAverage = (criterias: any[], productCriterias: any[]) => {
  let sumValues = 0
  let sumCoefficients = 0
  for (const criteria of productCriterias) {
    const criteriaId = criteria.dataValues.id
    const criteriaReceived = criterias.find(c => c.criteriaId === criteriaId)
    if (criteriaReceived) {
      const coefficient = criteria.dataValues.coefficient
      const testerValue = criteriaReceived.value
      sumValues += coefficient * testerValue
      sumCoefficients += coefficient
    }
  }
  return Math.round((sumValues / sumCoefficients) * 10000) / 100
}

const createEvaluation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Récupérer les données
    const { criterias, comment } = req.body
    const { productId } = req.params

    if (!criterias || comment === undefined || !productId) {
      const missing = []
      if (!criterias) missing.push('criterias')
      if (comment === undefined) missing.push('comment')
      if (!productId) missing.push('productId')

      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champ manquant',
        errors: missing.map(field => ({
          field,
          message: `Le champ ${field} est manquant`
        }))
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    // 2. Validation
    const validationErrors = validations(criterias, comment)
    if (validationErrors.errors?.length) {
      return res.status(validationErrors.status).json(validationErrors)
    }

    // 3. Récupérer les détails du produit et de la catégorie, ainsi que les critères
    const details = await fetchEvaluationDetails(Number(productId))
    if (details.error) {
      const errorResponse: ApiResponseType = {
        status: details.status,
        message: details.error
      }
      return res.status(details.status).json(errorResponse)
    }

    const { product, criterias: productCriterias } = details

    // 4. Vérifier que les critères envoyés correspondent à ceux de la catégorie du produit
    const receivedCriteriasIds = criterias.map((criteria: {
      criteriaId: number,
      value: number
    }) => criteria.criteriaId)
    // @ts-ignore
    const productCriteriasIds = productCriterias.map(criteria => criteria.dataValues.id)
    // @ts-ignore
    const criteriasMatch = receivedCriteriasIds.every(id => productCriteriasIds.includes(id))

    if (!criteriasMatch) {
      const criteriaMismatchResponse: ApiResponseType = {
        status: 400,
        message: 'Les critères envoyés ne correspondent pas à ceux de la catégorie du produit'
      }
      return res.status(criteriaMismatchResponse.status).json(criteriaMismatchResponse)
    }

    // 5. Vérifier que le testeur n'a pas déjà évalué ce produit
    const alreadyEvaluated = await Evaluation.findOne({
      where: {
        productId,
        userId: req.jwtToken?.userId
      }
    })

    if (alreadyEvaluated) {
      const alreadyEvaluatedResponse: ApiResponseType = {
        status: 400,
        message: 'Vous avez déjà évalué ce produit'
      }
      return res.status(alreadyEvaluatedResponse.status).json(alreadyEvaluatedResponse)
    }

    // 6. Calculer la moyenne pondérée
    // @ts-ignore
    const average = calculateWeightedAverage(criterias, productCriterias)

    // 7. Créer l'évaluation
    const evaluation = await Evaluation.create({
      productId,
      userId: req.jwtToken?.userId,
      average,
      comment
    })

    // 8. Créer les EvaluationCriteria
    // @ts-ignore
    for (const criteria of productCriterias) {
      const criteriaId = criteria.dataValues.id
      const criteriaReceived = criterias.find((criteria: {
        criteriaId: number,
        value: number
      }) => criteria.criteriaId === criteriaId)

      if (criteriaReceived) {
        const value = criteriaReceived.value
        await CriteriaEvaluation.create({
          evaluationId: evaluation.dataValues.id,
          criteriaId,
          value
        })
      }
    }

    // 9. Répondre
    const response: ApiResponseType = {
      status: 201,
      message: 'Evaluation créée'
    }

    // todo: faire header Location
    // res.setHeader('Location', '/evaluations/' + evaluation.dataValues.id);
    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const getEvaluations = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const isAdmin = req.jwtToken?.role === 'admin'
    const userId = isAdmin ? undefined : req.jwtToken?.userId

    const evaluations = await Evaluation.findAll({
      where: isAdmin ? {} : { userId }
    })

    const evaluationsWithDetails = await Promise.all(
      evaluations.map(async evaluation => {
        const product = await Product.findByPk(evaluation.dataValues.productId)

        if (!product) {
          return { error: 'Produit non trouvé', status: 404 }
        }

        const category = await Category.findByPk(product.dataValues.categoryId)

        if (!category) {
          return { error: 'Catégorie du produit non trouvée', status: 404 }
        }

        const criterias = await getCategoryAndAncestorCriterias(category)

        const criteriasEvaluation = await CriteriaEvaluation.findAll({
          where: {
            evaluationId: evaluation.dataValues.id
          }
        })

        return {
          evaluation,
          product,
          category,
          criterias,
          criteriasEvaluation
        }
      })
    )

    const filteredEvaluations = evaluationsWithDetails.filter(
      detail => !(detail as any).error
    ) as {
      evaluation: Evaluation;
      product: Product;
      category: Category;
      criterias: any[];
      criteriasEvaluation: CriteriaEvaluation[];
    }[]

    const response: ApiResponseType = {
      status: 200,
      message: 'Evaluations récupérées',
      data: filteredEvaluations
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const updateEvaluations = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { criterias, comment } = req.body
    const { evaluationId } = req.params

    if (!criterias || comment === undefined || !evaluationId) {
      const missing = []
      if (!criterias) missing.push('criterias')
      if (comment === undefined) missing.push('comment')
      if (!evaluationId) missing.push('evaluationId')

      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champ manquant',
        errors: missing.map(field => ({
          field,
          message: `Le champ ${field} est manquant`
        }))
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    const validationErrors = validations(criterias, comment)
    if (validationErrors.errors?.length) {
      return res.status(validationErrors.status).json(validationErrors)
    }

    const evaluation = await Evaluation.findByPk(evaluationId)
    if (!evaluation) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Evaluation non trouvée'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    if (evaluation.dataValues.userId !== req.jwtToken?.userId && req.jwtToken?.role !== 'admin') {
      const forbiddenResponse: ApiResponseType = {
        status: 403,
        message: 'Vous n\'êtes pas autorisé à modifier cette évaluation'
      }
      return res.status(forbiddenResponse.status).json(forbiddenResponse)
    }

    const product = await Product.findByPk(evaluation.dataValues.productId)
    if (!product) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Produit non trouvé'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    const productCategory = await Category.findByPk(product.dataValues.categoryId)
    if (!productCategory) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Catégorie du produit non trouvée'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    const productCriterias = await getCategoryAndAncestorCriterias(productCategory)

    const receivedCriteriasIds = criterias.map((criteria: {
      criteriaId: number,
      value: number
    }) => criteria.criteriaId)
    const productCriteriasIds = productCriterias.map(criteria => criteria.dataValues.id)
    // @ts-ignore
    const criteriasMatch = receivedCriteriasIds.every(id => productCriteriasIds.includes(id))

    if (!criteriasMatch) {
      const criteriaMismatchResponse: ApiResponseType = {
        status: 400,
        message: 'Les critères envoyés ne correspondent pas à ceux de la catégorie du produit'
      }
      return res.status(criteriaMismatchResponse.status).json(criteriaMismatchResponse)
    }

    const average = calculateWeightedAverage(criterias, productCriterias)

    await Evaluation.update(
      { average, comment },
      { where: { id: evaluationId } }
    )

    const evaluationCriterias = await CriteriaEvaluation.findAll({
      where: { evaluationId }
    })

    for (const criteria of productCriterias) {
      const criteriaId = criteria.dataValues.id
      const criteriaReceived = criterias.find((criteria: {
        criteriaId: number,
        value: number
      }) => criteria.criteriaId === criteriaId)

      if (criteriaReceived) {
        const value = criteriaReceived.value
        const evaluationCriteria = evaluationCriterias.find(ec => ec.dataValues.criteriaId === criteriaId)

        if (evaluationCriteria) {
          await evaluationCriteria.update({ value })
        }
      }
    }

    const response: ApiResponseType = {
      status: 200,
      message: 'Evaluation mise à jour'
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const deleteEvaluations = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { evaluationId } = req.params

    if (!evaluationId) {
      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champ manquant',
        errors: [{ field: 'evaluationId', message: 'Le champ evaluationId est manquant' }]
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    const evaluation = await Evaluation.findByPk(evaluationId)
    if (!evaluation) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Evaluation non trouvée'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    if (evaluation.dataValues.userId !== req.jwtToken?.userId && req.jwtToken?.role !== 'admin') {
      const forbiddenResponse: ApiResponseType = {
        status: 403,
        message: 'Vous n\'êtes pas autorisé à supprimer cette évaluation'
      }
      return res.status(forbiddenResponse.status).json(forbiddenResponse)
    }

    await evaluation.destroy()

    const response: ApiResponseType = {
      status: 200,
      message: 'Evaluation supprimée'
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const validations = (criterias: {}[], comment: string | undefined): ApiResponseType => {
  const errors: ApiResponseType = {
    status: 400,
    message: 'Erreur de validation',
    errors: []
  }

  // criterias (verifier que c'est un tableau)
  if (!Array.isArray(criterias)) {
    errors.errors?.push({
      field: 'criteria',
      message: 'Les critères doivent être un tableau'
    })
  }

  // comment
  if (comment) {
    console.log(`comment >> ${comment}`)
    if (comment.trim().length < dataLengthValidations.optional_evaluationComment.minlength
      || comment.trim().length > dataLengthValidations.optional_evaluationComment.maxlength) {
      errors.errors?.push({
        field: 'comment',
        message: `Le commentaire doit contenir entre ${dataLengthValidations.optional_evaluationComment.minlength} et ${dataLengthValidations.optional_evaluationComment.maxlength} caractères`
      })
    }
  }

  return errors
}

export { getEvaluations, createEvaluation, updateEvaluations, deleteEvaluations }