const Sequelize = require('sequelize')
const connection = new Sequelize('controledeacesso','root','admin',{ 
    host:'localhost',
    dialect:'mysql'
}); //informando ao sequileze qual o nome do banco de dados que ele vai se conectar.

module.exports = connection;