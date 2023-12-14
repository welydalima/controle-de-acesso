const Sequelize = require("sequelize");
const connection = require("./database");
const Visitante = connection.define('Visitante',{

    
nome:{
    type: Sequelize.STRING,
    allowNull: false
},
email:{
    type: Sequelize.STRING,
    allowNull: false
},
cpf:{
    type: Sequelize.STRING,
    allowNull:false
},
endereco:{
    type: Sequelize.STRING,
    allowNull:false
}
       

});

Visitante.sync({force:false}).then (() => { 
    console.log(" Sincronismo da Tabela Visitantes")
});

module.exports= Visitante











