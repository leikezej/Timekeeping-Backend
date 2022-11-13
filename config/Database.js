import { Sequelize } from "sequelize";
 
const db = new Sequelize('auth_user', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});
 
export default db;