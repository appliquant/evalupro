import express from 'express'
import { Category } from '../db'


const createCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Vérifier les données
    const { newCategoryTitle, newParentCategoryTitle } = req.body

    if (!newCategoryTitle) {
      const missingFieldsErrors = {
        status: 400,
        message: 'Champs manquant(s)',
        errors: [
          {
            field: 'newCategoryTitle',
            message: 'Titre de la catégorie manquant'
          }
        ]
      }

      return res.status(missingFieldsErrors.status).json(missingFieldsErrors)
    }

    // 2. Vérifier si la catégorie existe
    const categoryExists = await Category.findOne({
      where: {
        title: newCategoryTitle
      }
    })

    if (categoryExists) {
      const categoryExistsError = {
        status: 400,
        message: 'Catégorie existe déjà',
        errors: [
          {
            field: 'newCategoryTitle',
            message: 'Catégorie avec ce nom existe déjà'
          }
        ]
      }

      return res.status(categoryExistsError.status).json(categoryExistsError)
    }


    // 3. Trouver la catégorie parent
    let parentCategory
    if (newParentCategoryTitle) {
      parentCategory = await Category.findOne({
        where: {
          title: newParentCategoryTitle
        }
      })

      if (!parentCategory) {
        const parentCategoryNotFoundError = {
          status: 404,
          message: 'Catégorie parente non trouvée',
          errors: [
            {
              field: 'newParentCategoryTitle',
              message: 'Catégorie parente non trouvée'
            }
          ]
        }

        return res.status(parentCategoryNotFoundError.status).json(parentCategoryNotFoundError)
      }
    }

    // 4. Créer la catégorie
    const newCategory = await Category.create({
      title: newCategoryTitle,
      parentId: parentCategory?.dataValues.id
    })

    // 5. Répondre
    const response = {
      status: 201,
      message: 'Catégorie créée',
      data: {
        category: newCategory
      }
    }

    // Location header
    res.setHeader('Location', `/api/categories/${newCategory.dataValues.id}`)
    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const getCategories = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Trouver les catégories
    const categories = await Category.findAll()

    // 2. Répondre
    const response = {
      status: 200,
      message: 'Catégories trouvées',
      data: {
        categories
      }
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

export { getCategories, createCategory }