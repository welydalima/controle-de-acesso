const Sequelize = require("sequelize");
const connection = require("./database");
const Registros = connection.define('Registros',{

    
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    Setor:{  //setor que o funcionario trabalha
        type: Sequelize.STRING,
        allowNull: false
    },
    Sala:{
        type: Sequelize.STRING,
        allowNull:false
    },
    RFID:{
        type: Sequelize.STRING,
        allowNull:false
    }
  
    

});

Registros.sync({force:false}).then (() => { 
    console.log(" Sincronismo da Tabela Registros")
});

module.exports= Registros