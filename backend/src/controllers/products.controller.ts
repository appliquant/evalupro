import express from 'express'
import { ApiResponseType } from '../types'
import { Category, CriteriaEvaluation, Evaluation, Product } from '../db'
import formidable from 'formidable'
import { dataLengthValidations } from '../validations'
import { Op } from 'sequelize'
import { getCategoryAndAncestorCriterias } from './getCategoryAndAncestorCriterias'

const formidableOpt: formidable.Options = {
  uploadDir: `${__dirname}/../public/uploads`,
  maxFiles: 1,
  keepExtensions: true
}

const getProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Extraire les données de la requête
    const { id } = req.params
    if (!id) {
      const missingIdError: ApiResponseType = {
        status: 400,
        message: 'ID manquant',
        errors: [
          {
            field: 'id',
            message: 'ID manquant'
          }
        ]
      }

      return res.status(missingIdError.status).json(missingIdError)
    }

    // 2. Trouver le produit
    const product = await Product.findByPk(id)
    if (!product) {
      const productNotFoundError: ApiResponseType = {
        status: 404,
        message: 'Produit non trouvé',
        errors: [
          {
            field: 'id',
            message: 'Produit non trouvé'
          }
        ]
      }

      return res.status(productNotFoundError.status).json(productNotFoundError)
    }

    // 3. Trouver catégorie du produit
    const category = await Category.findByPk(product.dataValues.categoryId)
    if (!category) {
      const categoryNotFoundError: ApiResponseType = {
        status: 404,
        message: 'Catégorie non trouvée',
        errors: [
          {
            field: 'category',
            message: 'Catégorie non trouvée'
          }
        ]
      }

      return res.status(categoryNotFoundError.status).json(categoryNotFoundError)
    }

    // 4. Trouver critères
    const criterias = await getCategoryAndAncestorCriterias(category)

    // 5. Trouver le pointage de chaque critère évalués de ce produit
    // Le pointage correspond à la moyenne des évaluations de chaque critère par les testeurs
    // Resulat ressemble à : { criteriaId: "1", averageScore: "60%" }
    let criteriasScores: { criteriaId: string, averageScore: string }[] = []

    // 5.1 Trouver les évaluations de ce produit
    const productEvaluations = await Evaluation.findAll({
      where: {
        productId: id
      }
    })

    if (productEvaluations.length > 0) {
      // 5.2 Trouver les CriteriaEvaluations
      const productCriteriaEvaluations = await CriteriaEvaluation.findAll({
        where: {
          evaluationId: [productEvaluations.map(evaluation => evaluation.dataValues.id)]
        }
      })


      // 5.3 Créer un Map pour stocker les scores de chaque critère
      const res = new Map<string, number>()

      // Itérer sur les CriteriaEvaluations pour caculer le pointage de évaluation
      for (let i = 0; i < productCriteriaEvaluations.length; i++) {
        const elm = productCriteriaEvaluations[i]
        if (!res.has(elm.dataValues.evaluationId)) {
          res.set(elm.dataValues.criteriaId, elm.dataValues.value)
        }
      }

      // Calculer la moyenne des scores pour chaque critère
      for (let [key, value] of res) {
        const averageScore = productCriteriaEvaluations.filter(criteriaEvaluation => criteriaEvaluation.dataValues.criteriaId === key).reduce((acc, criteriaEvaluation) => acc + criteriaEvaluation.dataValues.value, 0) / productCriteriaEvaluations.filter(criteriaEvaluation => criteriaEvaluation.dataValues.criteriaId === key).length
        criteriasScores.push({
          criteriaId: key,
          averageScore: (averageScore * 100).toFixed(2) + '%'
        })
      }
    }

    // 6. Calculer la moyenne du score accordé par les testeurs à ce produit
    let averageScore = productEvaluations.reduce((acc, evaluation) => acc + evaluation.dataValues.average, 0) / productEvaluations.length
    averageScore = Math.round(averageScore * 100) / 100

    // 7. Retourner le produit
    const successResponse: ApiResponseType = {
      status: 200,
      message: 'Produit trouvé',
      data: {
        product,
        category,
        criterias,
        criteriasScores,
        averageScore
      }
    }

    return res.status(successResponse.status).json(successResponse)
  } catch (err) {
    next(err)
  }
}

const getProducts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Extraire les données de la requête
    const { productNameFilter, productCategoryFilterId, productResultSort } = req.query

    // 2. Trouver tous les produits (avec ou sans filtres)
    // les filtres sont facultatifs
    // les filtres s'additionnent
    // si les deux filtres sont présents, les produits doivent correspondre aux deux filtres
    // si un seul filtre est présent, les produits doivent correspondre à ce filtre
    // si aucun filtre n'est présent, tous les produits sont retournés
    // productResultSort = 'name-asc' | 'averageScore-desc'
    const whereClause: { [key: string]: any } = {}

    if (productNameFilter) {
      whereClause.name = {
        [Op.substring]: productNameFilter.toString()
      }
    }

    if (productCategoryFilterId) {
      whereClause.categoryId = productCategoryFilterId.toString()
    }

    const queryOptions: { [key: string]: any } = {
      where: whereClause
    }

    if (productResultSort) {
      const [field, order] = (productResultSort as string).split('-')
      if (!field || !order) {
        return
      }

      queryOptions.order = [[field, order.toUpperCase()]] // Sequelize expects the order array
    }

    // 2. Trouver les produits
    const products = await Product.findAll(queryOptions)

    // 3. Retourner les produits
    const successResponse: ApiResponseType = {
      status: 200,
      message: 'Produits trouvés',
      data: { products }
    }

    return res.status(successResponse.status).json(successResponse)
  } catch
    (error) {
    next(error)
  }
}

const createProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Extraire les données de la requête
    const form = formidable(formidableOpt)

    const [fields, file] = await form.parse(req)
    const { name, brand, category: categoryId, description, price } = fields
    const imageFileName = file?.image?.[0]?.newFilename

    if (!name || !brand || !categoryId || !description || !price || !imageFileName) {
      const missing = []
      if (!name) missing.push('name')
      if (!brand) missing.push('brand')
      if (!categoryId) missing.push('category')
      if (!description) missing.push('description')
      if (!price) missing.push('price')
      if (!imageFileName) missing.push('image')

      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champs manquants',
        errors: missing.map(field => ({
          field,
          message: `Champ ${field} manquant`
        }))
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    // 2. Vérifier les données
    const validationErrors = validations(
      name.toString(),
      brand.toString(),
      description.toString(),
      price.toString(),
      'createProduct'
    )
    if (validationErrors.errors !== undefined && validationErrors.errors.length > 0) {
      return res.status(validationErrors.status).json(validationErrors)
    }

    // 3. Vérifier si le produit existe (pas de doublons)
    const productExists = await Product.findOne({
      where: {
        name: name.toString()
      }
    })

    if (productExists) {
      const productExistsError: ApiResponseType = {
        status: 400,
        message: 'Produit existe déjà',
        errors: [
          {
            field: 'newProductNameInput',
            message: 'Un produit avec ce nom existe déjà'
          }
        ]
      }

      res.setHeader('Location', `/api/products/${productExists.dataValues.id}`)
      return res.status(productExistsError.status).json(productExistsError)
    }


    // 4. Vérifier si la catégorie existe
    const categoryExists = await Category.findByPk(categoryId.toString())
    if (!categoryExists) {
      const categoryNotFoundError: ApiResponseType = {
        status: 404,
        message: 'Catégorie non trouvée',
        errors: [
          {
            field: 'newProductCategorySelect',
            message: 'Catégorie non trouvée'
          }
        ]
      }

      return res.status(categoryNotFoundError.status).json(categoryNotFoundError)
    }

    // 5. Créer le produit
    console.log('Prix : ', parseFloat(price.toString()))
    const newProduct = await Product.create({
      name: name.toString(),
      brand: brand.toString(),
      categoryId: categoryId.toString(),
      description: description.toString(),
      price: parseFloat(price.toString()),
      image: imageFileName.toString()
    })

    // 6. Répondre
    const response: ApiResponseType = {
      status: 201,
      message: 'Produit créé',
      data: {}
    }

    res.setHeader('Location', `/api/products/${newProduct.dataValues.id}`)
    return res.status(response.status).json(response)
  } catch
    (err) {
    next(err)
  }
}

const validations = (name: string, brand: string, description: string, price: string, partToValidate: 'createProduct' | 'updateProduct'): ApiResponseType => {
  const errors: ApiResponseType = {
    status: 400,
    message: 'Erreurs de validation',
    errors: []
  }

  const prefix = partToValidate === 'createProduct' ? 'new' : 'selected'

  // name
  if (name.trim().length < dataLengthValidations?.productName?.minlength ||
    name.trim().length > dataLengthValidations?.productName?.maxlength) {
    errors.errors?.push({
      field: `${prefix}ProductNameInput`,
      message: `Le nom du produit doit contenir entre ${dataLengthValidations?.productName?.minlength}
    et ${dataLengthValidations?.productName?.maxlength} caractères.`
    })
  }

  // brand
  if (brand.trim().length < dataLengthValidations?.productBrand?.minlength ||
    brand.trim().length > dataLengthValidations?.productBrand?.maxlength) {
    errors.errors?.push({
      field: `${prefix}ProductBrandInput`,
      message: `La marque du produit doit contenir entre ${dataLengthValidations?.productBrand?.minlength}
    et ${dataLengthValidations?.productBrand?.maxlength} caractères.`
    })
  }

  // description
  if (description.trim().length < dataLengthValidations?.productDescription?.minlength ||
    description.trim().length > dataLengthValidations?.productDescription?.maxlength) {
    errors.errors?.push({
      field: `${prefix}ProductDescriptionInput`,
      message: `La description du produit doit contenir entre ${dataLengthValidations?.productDescription?.minlength}
    et ${dataLengthValidations?.productDescription?.maxlength} caractères.`
    })
  }

  // price
  const parsedPrice = parseFloat(price)

  if (isNaN(parsedPrice)) {
    errors.errors?.push({
      field: `${prefix}ProductPriceInput`,
      message: 'Le prix doit être un nombre'
    })
  }

  if (!isNaN(parsedPrice) && (parsedPrice < dataLengthValidations.productPrice.minlength || parsedPrice > dataLengthValidations.productPrice.maxlength)) {
    errors.errors?.push({
      field: `${prefix}ProductPriceInput`,
      message: `Le prix doit être compris entre ${dataLengthValidations.productPrice.minlength} et ${dataLengthValidations.productPrice.maxlength}`
    })
  }

  return errors
}

const updateProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Extraire données de la requête
    const form = formidable(formidableOpt)
    const [fields, file] = await form.parse(req)
    const { id, name, brand, description, price } = fields
    const imageFileName = file?.image?.[0]?.newFilename

    // 2. Vérifier les données
    if (!id || !name || !brand || !description || !price) {
      const missing = []
      if (!id) missing.push('id')
      if (!name) missing.push('name')
      if (!brand) missing.push('brand')
      if (!description) missing.push('description')
      if (!price) missing.push('price')

      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champs manquants',
        errors: missing.map(field => ({
          field,
          message: `Champ ${field} manquant`
        }))
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    const validationErrors = validations(
      name.toString(),
      brand.toString(),
      description.toString(),
      price.toString(),
      'updateProduct'
    )

    if (validationErrors.errors !== undefined && validationErrors.errors.length > 0) {
      return res.status(validationErrors.status).json(validationErrors)
    }

    // 3. Vérifier si le produit existe
    const product = await Product.findByPk(id.toString())
    if (!product) {
      const productNotFoundError: ApiResponseType = {
        status: 404,
        message: 'Produit non trouvé',
        errors: [
          {
            field: 'selectedProductNameInput',
            message: 'Produit non trouvé'
          }
        ]
      }

      return res.status(productNotFoundError.status).json(productNotFoundError)
    }

    // 4. Vérifier si un produit avec le même nom existe déjà (sauf si c'est le produit actuel)
    if (product.dataValues.name !== name.toString()) {
      const productExists = await Product.findOne({
        where: {
          name: name.toString()
        }
      })

      if (productExists) {
        const productExistsError: ApiResponseType = {
          status: 400,
          message: 'Produit existe déjà',
          errors: [
            {
              field: 'selectedProductNameInput',
              message: 'Un produit avec ce nom existe déjà'
            }
          ]
        }

        res.setHeader('Location', `/api/products/${productExists.dataValues.id}`)
        return res.status(productExistsError.status).json(productExistsError)
      }
    }

    // 4. Vérifier si une nouvelle image a été envoyée
    const image = imageFileName ? imageFileName : product.dataValues.image

    // 5. Mettre à jour le produit
    await Product.update({
      name: name.toString(),
      brand: brand.toString(),
      description: description.toString(),
      price: parseFloat(price.toString()),
      image
    }, {
      where: {
        id: id.toString()
      }
    })

    // 6. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Produit mis à jour'
    }

    res.setHeader('Location', `/api/products/${id}`)
    return res.status(response.status).json(response)
  } catch
    (e) {
    next(e)
  }
}

const deleteProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Vérifier les données
    const { id } = req.params

    if (!id) {
      const missingIdError: ApiResponseType = {
        status: 400,
        message: 'ID manquant',
        errors: [
          {
            field: 'id',
            message: 'ID manquant'
          }
        ]
      }

      return res.status(missingIdError.status).json(missingIdError)
    }

    // 2. Vérifier si le produit existe
    const product = await Product.findByPk(id)
    if (!product) {
      const productNotFoundError: ApiResponseType = {
        status: 404,
        message: 'Produit non trouvé',
        errors: [
          {
            field: 'deleteProduct',
            message: 'Produit non trouvé'
          }
        ]
      }

      return res.status(productNotFoundError.status).json(productNotFoundError)
    }

    // 3. todo: Vérifer si le produit n'est pas associé à des évaluations

    // 4. Supprimer le produit
    await product.destroy()

    // 5. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Produit supprimé'
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const getTestersComments = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 1. Extraire les données de la requête
  const { productId } = req.params

  if (!productId) {
    const missingIdError: ApiResponseType = {
      status: 400,
      message: 'ID manquant',
      errors: [
        {
          field: 'id',
          message: 'Id manquant'
        }
      ]
    }

    return res.status(missingIdError.status).json(missingIdError)
  }

  // 2. Trouver les commentaires des testeurs
  const comments = await Evaluation.findAll({
    where: {
      productId: productId
    },
    attributes: ['id', 'comment']
  })


  // 3. Seulement garder les commentaires non vides (car les testeurs ne sont pas obligés de laisser un commentaire)
  const definedComments = comments.filter(comment =>
    comment.dataValues.comment !== null && comment.dataValues.comment.trim().length > 0)

  // 4. Répondre
  const successResponse: ApiResponseType = {
    status: 200,
    message: 'Commentaires trouvés',
    data: {
      comments: definedComments
    }
  }

  return res.status(successResponse.status).json(successResponse)
}

export { getProducts, getProduct, getTestersComments, createProduct, updateProduct, deleteProduct }