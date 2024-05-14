import express from 'express'
import { Category } from '../db'
import { ApiResponseType } from '../types'

const createCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Vérifier les données
    const { newCategoryTitle, newParentCategoryId } = req.body

    if (!newCategoryTitle) {
      const missingFieldsErrors: ApiResponseType = {
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


    // todo: validation des données (longueur, caractères spéciaux, etc.)

    // 2. Vérifier si la catégorie existe
    const categoryExists = await Category.findOne({
      where: {
        title: newCategoryTitle
      }
    })

    if (categoryExists) {
      const categoryExistsError: ApiResponseType = {
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
    if (newParentCategoryId) {
      parentCategory = await Category.findOne({
        where: {
          id: newParentCategoryId
        }
      })

      if (!parentCategory) {
        const parentCategoryNotFoundError: ApiResponseType = {
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
    const response: ApiResponseType = {
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
    const response: ApiResponseType = {
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

const updateCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Vérifier les données
    const { id, title, parentId } = req.body
    if (!id || !title) {
      const missing = []
      if (!id) missing.push('selectedCategoryId')
      if (!title) missing.push('selectedCategoryTitle')

      const missingFieldsErrors: ApiResponseType = {
        status: 400,
        message: 'Champs manquant(s)',
        errors: missing.map(field => ({
          field,
          message: `Champ ${field} manquant`
        }))
      }

      return res.status(missingFieldsErrors.status).json(missingFieldsErrors)
    }

    // 2. Vérifier si la catégorie existe
    const category = await Category.findByPk(id)
    if (!category) {
      const categoryNotFoundError: ApiResponseType = {
        status: 404,
        message: 'Catégorie non trouvée',
        errors: [
          {
            field: 'selectedCategoryTitle',
            message: 'Cette catégorie n\'existe pas'
          }
        ]
      }

      return res.status(categoryNotFoundError.status).json(categoryNotFoundError)
    }

    // 3. Vérifier si la catégorie parente existe
    let parentCategory
    if (parentId) {
      parentCategory = await Category.findByPk(parentId)
      if (!parentCategory) {
        const parentCategoryNotFoundError: ApiResponseType = {
          status: 404,
          message: 'Catégorie parente non trouvée',
          errors: [
            {
              field: 'selectedCategoryParent',
              message: 'Catégorie parente non trouvée'
            }
          ]
        }

        return res.status(parentCategoryNotFoundError.status).json(parentCategoryNotFoundError)
      }
    }

    // 4. Vérifier si une catégorie avec le même nom existe (sauf si c'est la catégorie actuelle)
    if (category.dataValues.title !== title) {
      const categoryExists = await Category.findOne({
        where: {
          title
        }
      })

      if (categoryExists) {
        const categoryExistsError: ApiResponseType = {
          status: 400,
          message: 'Catégorie avec le même titre existe déjà',
          errors: [
            {
              field: 'selectedCategoryTitle',
              message: 'Catégorie avec ce nom existe déjà'
            }
          ]
        }

        return res.status(categoryExistsError.status).json(categoryExistsError)
      }
    }

    // 5. Vérifier que la catégorie parente n'est pas la catégorie elle-même
    if (parentCategory && parentCategory.dataValues.id === category.dataValues.id) {
      const parentCategoryItselfError: ApiResponseType = {
        status: 400,
        message: 'Catégorie parente ne peut pas être la catégorie elle-même',
        errors: [
          {
            field: 'selectedCategoryParentId',
            message: 'Catégorie parente ne peut pas être la catégorie elle-même'
          }
        ]
      }

      return res.status(parentCategoryItselfError.status).json(parentCategoryItselfError)
    }

    // 6. Vérifier que la catégorie parente n'est pas un enfant de la catégorie elle-même 
    // (pas d'héritage circulaire/boucle infinie)
    if (parentCategory) {
      let currentParent: Category | null = parentCategory
      while (currentParent) {
        if (currentParent.dataValues.id === category.dataValues.id) {
          const circularParentError: ApiResponseType = {
            status: 400,
            message: 'Catégorie parente ne peut pas être un enfant de la catégorie elle-même (héritage circulaire)',
            errors: [
              {
                field: 'selectedCategoryParentId',
                message: 'Catégorie parente ne peut pas être un enfant de la catégorie elle-même'
              }
            ]
          }

          return res.status(circularParentError.status).json(circularParentError)
        }

        // Remonter d'un niveau jusqu'à la racine
        currentParent = await Category.findByPk(currentParent.dataValues.parentId)
      }
    }

    // 6. Mettre à jour la catégorie
    await category.update({
      title,
      // Si parentId est null, on met null, sinon on met parentCategory.id
      parentId: parentCategory ? parentCategory.dataValues.id : null
    })

    // 7. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Catégorie mise à jour'
    }

    res.setHeader('Location', `/api/categories/${category.dataValues.id}`)
    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const deleteCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Vérifier les données
    const { id } = req.params
    if (!id) {
      const missingFieldsErrors: ApiResponseType = {
        status: 400,
        message: 'Champs manquant(s)',
        errors: [
          {
            field: 'deleteCategory',
            message: 'Id de la catégorie manquant'
          }
        ]
      }

      return res.status(missingFieldsErrors.status).json(missingFieldsErrors)
    }

    // 2. Vérifier si la catégorie existe
    const category = await Category.findByPk(id)
    if (!category) {
      const categoryNotFoundError = {
        status: 404,
        message: 'Catégorie non trouvée',
        errors: [
          {
            field: 'deleteCategory',
            message: 'Catégorie non trouvée'
          }
        ]
      }

      return res.status(categoryNotFoundError.status).json(categoryNotFoundError)
    }

    // 3. todo: Vérifier si la catégorie n'est pas associée à des produits ou caractériques

    // 4. Supprimer la catégorie
    await category.destroy()

    // 5. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Catégorie supprimée'
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

export { getCategories, createCategory, updateCategory, deleteCategory }