import {Sequelize} from "sequelize";

// todo: utiliser .env pour les variables d'environnement
// const sequelize =
//     new Sequelize('mariadb://admin:admin@localhost:5432/evalupro');

const sequelize = new Sequelize("evalupro", "admin", "admin",
    {
        host: "localhost",
        dialect: "mariadb",
        port: 3306,
})


export {sequelize};