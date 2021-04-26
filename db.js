const {Sequelize} = require("sequelize");
const db = new Sequelize(process.env.DATABASE_URL, {
    ssl: true
});
module.exports = db;