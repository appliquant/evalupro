import { Category, Criteria } from '../db'

/**
 * Récupère les critères de la catégorie donnée et de ses catégories parentes
 * @param category La catégorie dont on veut récupérer les critères
 */
export const getCategoryAndAncestorCriterias = async (category: Category) => {
  let criterias: any[] = []
  let currentCategory: Category | null = category

  while (currentCategory) {
    const categoryCriterias = await Criteria.findAll({
      where: { categoryId: currentCategory.dataValues.id }
    })
    criterias = criterias.concat(categoryCriterias)
    currentCategory = await Category.findByPk(currentCategory.dataValues.parentId)
  }

  return criterias
}

