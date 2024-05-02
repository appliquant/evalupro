import {DataTypes, Sequelize, Options, Model} from "sequelize";
import {UserRoles} from "./types";
import * as constants from "node:constants";

// todo: utiliser .env pour les variables d'environnement
const options: Options = {
    host: "localhost",
    dialect: "mariadb",
    port: 3306,

}
const sequelize = new Sequelize("evalupro", "admin", "admin", options);

class User extends Model {
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
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(...Object.values(UserRoles)),
        allowNull: false,
        defaultValue: UserRoles.USER
    },
}, {
    sequelize,
    modelName: "User",
    timestamps: true
})


const initDb = () => {
    sequelize.authenticate().then(() => {
        sequelize.sync().then(() => {
        })
    }).catch((error) => {
        console.error("❌ Erreur de connexion à la base de données", error)
    })
}

export {sequelize, initDb, User}