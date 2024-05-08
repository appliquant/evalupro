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

// Relation Category -> Parent Category
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' })
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' })

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

// Relation Product -> Category
Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' })
Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' })

Criteria.init({
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

  coefficient: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true
})

const initDb = () => {
  sequelize.authenticate().then(() => {
    sequelize.sync({}).then(() => {
    })
  }).catch((error) => {
    console.error('❌ Erreur de connexion à la base de données', error)
  })
}

export { sequelize, initDb, User, Category, Product, Criteria }