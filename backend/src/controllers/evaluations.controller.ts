import express from 'express'
import { ApiResponseType } from '../types'
import { dataLengthValidations } from '../validations'
import { Category, CriteriaEvaluation, Evaluation, Product } from '../db'
import { getCategoryAndAncestorCriterias } from './getCategoryAndAncestorCriterias'

const getMyEvaluationsTester = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Récupérer les évaluations, le produit, la catégorie et les critères
    const evaluations = await Evaluation.findAll({
      where: {
        userId: req.jwtToken?.userId
      }
    })

    const evaluationsWithProductAndCategory =
      await Promise.all(evaluations.map(async evaluation => {
        const product = await Product.findByPk(evaluation.dataValues.productId)

        if (!product) {
          const notFoundResponse: ApiResponseType = {
            status: 404,
            message: 'Produit non trouvé'
          }
          return res.status(notFoundResponse.status).json(notFoundResponse)
        }

        const category = await Category.findByPk(product?.dataValues.categoryId)

        if (!category) {
          const notFoundResponse: ApiResponseType = {
            status: 404,
            message: 'Catégorie du produit non trouvée'
          }
          return res.status(notFoundResponse.status).json(notFoundResponse)
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
      }))

    // 2. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Evaluations récupérées',
      data: evaluationsWithProductAndCategory
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const createEvaluation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Récupérer les données
    const { criterias, comment } = req.body
    const { productId } = req.params

    if (!criterias || comment === undefined || !productId) {
      const missing = []
      if (!criterias) missing.push('criterias')
      if (!comment) missing.push('comment')
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

    // 3. Vérifier que le produit existe
    const product = await Product.findByPk(productId)

    if (!product) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Produit non trouvé'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 4. Trouver la catégorie du produit
    const productCategory = await Category.findByPk(product.dataValues.categoryId)

    if (!productCategory) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Catégorie du produit non trouvée'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 5. Vérifier que les critères envoyés correspondent à ceux de la catégorie du produit
    const productCriterias = await getCategoryAndAncestorCriterias(productCategory)

    const receivedCriteriasIds = criterias.map((criteria: { criteriaId: number, value: number }) => criteria.criteriaId)
    const productCriteriasIds = productCriterias.map(criteria => criteria.id)
    // @ts-ignore
    const criteriasMatch = receivedCriteriasIds.every(id => productCriteriasIds.includes(id))

    if (!criteriasMatch) {
      const criteriaMismatchResponse: ApiResponseType = {
        status: 400,
        message: 'Les critères envoyés ne correspondent pas à ceux de la catégorie du produit'
      }
      return res.status(criteriaMismatchResponse.status).json(criteriaMismatchResponse)
    }

    // 6. Vérifier que le testeur n'a pas déjà évalué ce produit
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

    // 7. Calculer la moyenne pondérée
    // formule :
    // moyenne = (coefficient du critère n * note du testeur pour ce critère n) / nombre total de critères

    let sumValues = 0 // partie en haut de l'équation sur le tp
    let sumCoefficients = 0
    for (const criteria of productCriterias) {
      // Trouver le critère à évaluer
      const criteriaId = criteria.dataValues.id
      const criteriaReceived = criterias.find((criteria: {
        criteriaId: number,
        value: number
      }) => criteria.criteriaId === criteriaId)

      if (criteriaReceived) {
        const coefficient = criteria.dataValues.coefficient
        const testerValue = criteriaReceived.value
        const res = coefficient * testerValue

        sumValues += res
        sumCoefficients += coefficient
        // console.log(`Resultat pour ${criteria.dataValues.name} : ${res}`)
      }
    }

    let average = (sumValues / sumCoefficients) * 100
    average = Math.round(average * 100) / 100

    // 8. Créer l'évaluation
    // Créer une évaluation et une EvaluationCriteria pour chaque critère
    const evaluation = await Evaluation.create({
      productId,
      userId: req.jwtToken?.userId,
      average,
      comment
    })

    // Créer les EvaluationCriteria
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
    // res.setHeader('Location', '/evaluations/'id)
    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const updateMyEvaluationsTester = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Récupérer les données
    const { criterias, comment } = req.body
    const { evaluationId } = req.params

    if (!criterias || comment === undefined || !evaluationId) {
      const missing = []
      if (!criterias) missing.push('criterias')
      if (!comment) missing.push('comment')
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

    // 2. Validation
    const validationErrors = validations(criterias, comment)
    if (validationErrors.errors?.length) {
      return res.status(validationErrors.status).json(validationErrors)
    }

    // 3. Vérifier que l'évaluation existe
    const evaluation = await Evaluation.findByPk(evaluationId)

    if (!evaluation) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Evaluation non trouvée'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 4. Vérifier que l'évaluation appartient au testeur
    if (evaluation.dataValues.userId !== req.jwtToken?.userId) {
      const forbiddenResponse: ApiResponseType = {
        status: 403,
        message: 'Vous n\'êtes pas autorisé à modifier cette évaluation'
      }
      return res.status(forbiddenResponse.status).json(forbiddenResponse)
    }

    // 5. Trouver le produit de l'évaluation
    const product = await Product.findByPk(evaluation.dataValues.productId)

    if (!product) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Produit non trouvé'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 6. Trouver la catégorie du produit
    const productCategory = await Category.findByPk(product.dataValues.categoryId)

    if (!productCategory) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Catégorie du produit non trouvée'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 7. Vérifier que les critères envoyés correspondent à ceux de la catégorie du produit
    const productCriterias = await getCategoryAndAncestorCriterias(productCategory)

    const receivedCriteriasIds = criterias.map((criteria: { criteriaId: number, value: number }) => criteria.criteriaId)
    const productCriteriasIds = productCriterias.map(criteria => criteria.id)
    // @ts-ignore
    const criteriasMatch = receivedCriteriasIds.every(id => productCriteriasIds.includes(id))

    if (!criteriasMatch) {
      const criteriaMismatchResponse: ApiResponseType = {
        status: 400,
        message: 'Les critères envoyés ne correspondent pas à ceux de la catégorie du produit'
      }
      return res.status(criteriaMismatchResponse.status).json(criteriaMismatchResponse)
    }

    // 8. Calculer la moyenne pondérée
    // formule :
    // moyenne = (coefficient du critère n * note du testeur pour ce critère n) / nombre total de critères

    let sumValues = 0 // partie en haut de l'équation sur le tp
    let sumCoefficients = 0

    for (const criteria of productCriterias) {
      // Trouver le critère à évaluer
      const criteriaId = criteria.dataValues.id
      const criteriaReceived = criterias.find((criteria: {
        criteriaId: number,
        value: number
      }) => criteria.criteriaId === criteriaId)

      if (criteriaReceived) {
        const coefficient = criteria.dataValues.coefficient
        const testerValue = criteriaReceived.value
        const res = coefficient * testerValue

        sumValues += res
        sumCoefficients += coefficient
        // console.log(`Resultat pour ${criteria.dataValues.name} : ${res}`)
      }
    }

    let average = (sumValues / sumCoefficients) * 100
    average = Math.round(average * 100) / 100

    // 9. Mettre à jour l'évaluation
    await Evaluation.update({
      average,
      comment
    }, {
      where: {
        id: evaluationId
      }
    })

    // 10. Mettre à jour les EvaluationCriteria
    const evaluationCriterias = await CriteriaEvaluation.findAll({
      where: {
        evaluationId
      }
    })

    for (const criteria of productCriterias) {
      const criteriaId = criteria.dataValues.id
      const criteriaReceived = criterias.find((criteria: {
        criteriaId: number,
        value: number
      }) => criteria.criteriaId === criteriaId)

      if (criteriaReceived) {
        const value = criteriaReceived.value
        const evaluationCriteria = evaluationCriterias.find(criteria => criteria.dataValues.criteriaId === criteriaId)

        if (evaluationCriteria) {
          evaluationCriteria.dataValues.value = value
          await evaluationCriteria.save()
        }
      }
    }

    // 11. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Evaluation mise à jour'
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

export { createEvaluation, getMyEvaluationsTester, updateMyEvaluationsTester }