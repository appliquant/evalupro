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

const initDb = () => {
  sequelize.authenticate().then(() => {
    sequelize.sync({
      // alter: true
    }).then(() => {
    })
  }).catch((error) => {
    console.error('❌ Erreur de connexion à la base de données', error)
  })
}

export { sequelize, initDb, User, Category }