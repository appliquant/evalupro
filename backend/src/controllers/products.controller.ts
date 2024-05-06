import express from 'express'
import { ApiResponseType } from '../types'
import { Category, Product } from '../db'
import formidable from 'formidable'
import { dataLengthValidations } from '../validations'

const getProducts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Trouver tous les produits
    const products = await Product.findAll()

    // 2. Retourner les produits
    const successResponse: ApiResponseType = {
      status: 200,
      message: 'Produits trouvés',
      data: { products }
    }

    return res.status(successResponse.status).json(successResponse)
  } catch (error) {
    next(error)
  }
}

const createProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Extraire les données de la requête
    // const { name, brand, categoryId, description, price } = req.body
    // console.log(name, brand, categoryId, description, price)
    const form = formidable({
      uploadDir: `${__dirname}/../public/uploads`,
      maxFiles: 1,
      keepExtensions: true
    })

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
    const validationErrors = createProductValidations(
      name.toString(),
      brand.toString(),
      description.toString(),
      price.toString()
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

const createProductValidations = (name: string, brand: string, description: string, price: string): ApiResponseType => {
  const errors: ApiResponseType = {
    status: 400,
    message: 'Erreurs de validation',
    errors: []
  }

  // name
  if (name.trim().length < dataLengthValidations?.productName?.minlength ||
    name.trim().length > dataLengthValidations?.productName?.maxlength) {
    errors.errors?.push({
      field: 'newProductNameInput',
      message: `Le nom du produit doit contenir entre ${dataLengthValidations?.productName?.minlength}
    et ${dataLengthValidations?.productName?.maxlength} caractères.`
    })
  }

  // brand
  if (brand.trim().length < dataLengthValidations?.productBrand?.minlength ||
    brand.trim().length > dataLengthValidations?.productBrand?.maxlength) {
    errors.errors?.push({
      field: 'newProductBrandInput',
      message: `La marque du produit doit contenir entre ${dataLengthValidations?.productBrand?.minlength}
    et ${dataLengthValidations?.productBrand?.maxlength} caractères.`
    })
  }

  // description
  if (description.trim().length < dataLengthValidations?.productDescription?.minlength ||
    description.trim().length > dataLengthValidations?.productDescription?.maxlength) {
    errors.errors?.push({
      field: 'newProductDescriptionTextarea',
      message: `La description du produit doit contenir entre ${dataLengthValidations?.productDescription?.minlength}
    et ${dataLengthValidations?.productDescription?.maxlength} caractères.`
    })
  }

  // price
  const parsedPrice = parseFloat(price)

  if (isNaN(parsedPrice)) {
    errors.errors?.push({
      field: 'newProductPriceInput',
      message: 'Le prix doit être un nombre'
    })
  }

  if (!isNaN(parsedPrice) && (parsedPrice < dataLengthValidations.productPrice.minlength || parsedPrice > dataLengthValidations.productPrice.maxlength)) {
    errors.errors?.push({
      field: 'newProductPriceInput',
      message: `Le prix doit être compris entre ${dataLengthValidations.productPrice.minlength} et ${dataLengthValidations.productPrice.maxlength}`
    })
  }

  return errors
}

export { getProducts, createProduct }