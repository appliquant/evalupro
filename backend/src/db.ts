import { DataTypes, Sequelize, Options, Model, Dialect } from 'sequelize'
import { UserRoles } from './types'

const options: Options = {
  host: process.env.DB_HOST ?? 'localhost',
  dialect: process.env.DB_DIALECT as Dialect ?? 'mariadb',
  port: parseInt(process.env.DB_PORT ?? '3306')

}
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, options)

class User extends Model {
}

class Category extends Model {
}

class Product extends Model {
}

class Criteria extends Model {
}

class CriteriaEvaluation extends Model {
}

class Evaluation extends Model {
}

class Favorite extends Model {
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM(...Object.values(UserRoles)),
    allowNull: false,
    defaultValue: UserRoles.USER
  }
}, {
  sequelize,
  timestamps: true
})

Category.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },

  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'id'
    }
  }
}, {
  sequelize,
  timestamps: true
})


Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },

  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false
  },

  averageScore: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    defaultValue: 0
  }
}, {
  sequelize,
  timestamps: true
})

Criteria.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  coefficient: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  }
}, {
  sequelize,
  timestamps: true
})

Favorite.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  }
}, { sequelize, timestamps: true })

Evaluation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Moyenne pondérée des évaluations des critères
  average: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true
})

CriteriaEvaluation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  criteriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Criteria,
      key: 'id'
    }
  },

  evaluationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Evaluation,
      key: 'id'
    }
  },

  // Choix :
  // 1 : excellent
  // 0.8 : very good
  // 0.6 : good
  // 0.4 : bad
  // 0.2 : very bad
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true
})

// Relations :
//
//     User et Product ont une relation many-to-many relationship par Favorite.
//     Category possède une relation sur elle-même.
//     Product appartient à Category.
//     Category contient plusieurs Criteria.
//     Evaluation appartient à Product et User.
//     CriteriaEvaluation appartient à Criteria et Evaluation.

// Relation User -> Favorite
User.belongsToMany(Product, { through: Favorite, as: 'FavoriteProducts', foreignKey: 'userId' })
Product.belongsToMany(User, { through: Favorite, as: 'FavoritedByUsers', foreignKey: 'productId' })

// Relation Category -> Parent Category
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' })
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' })

// Relation Product -> Category
Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' })
Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' })


Criteria.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' })
Category.hasMany(Criteria, { as: 'criteria', foreignKey: 'categoryId' })

// Relation Evaluation -> Product
Evaluation.belongsTo(Product, { as: 'product', foreignKey: 'productId' })
Product.hasMany(Evaluation, { as: 'evaluations', foreignKey: 'productId' })

// Relation Evaluation -> User
Evaluation.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(Evaluation, { as: 'evaluations', foreignKey: 'userId' })

// Relation CriteriaEvaluation -> Criteria (one-to-many)
CriteriaEvaluation.belongsTo(Criteria, { as: 'criteria', foreignKey: 'criteriaId' })
Criteria.hasMany(CriteriaEvaluation, { as: 'criteriaEvaluations', foreignKey: 'criteriaId' })

// Relation CriteriaEvaluation -> Evaluation (one-to-many)
CriteriaEvaluation.belongsTo(Evaluation, { as: 'evaluation', foreignKey: 'evaluationId' })
Evaluation.hasMany(CriteriaEvaluation, { as: 'evaluationCriteria', foreignKey: 'evaluationId' })


const initDb = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({
      // force: true
      // alter: true
    })
    console.log('✅ Db connectée et synchronisée.')
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données', error)
  }
}

export { sequelize, initDb, User, Category, Product, Criteria, Favorite, Evaluation, CriteriaEvaluation }