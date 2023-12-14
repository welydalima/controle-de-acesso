const  Sequelize = require('sequelize') 
const connection = require("./database")
const Tema= connection.define('Estatistica',{
    tema:{
        type:Sequelize.STRING,
        allowNull:true
    },
    qtdauser:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
})
Tema.sync({force:false}).then(() =>{
    
console.log("Sincronismo da tabela Tema ok")
})
module.exports = Tema