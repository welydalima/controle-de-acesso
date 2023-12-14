const Sequelize = require("sequelize");
const connection = require("./database");
const Usuarios = connection.define('Usuarios',{

    
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    // RFID:{ //tag do cartão
    //     type: Sequelize.STRING,
    //     allowNull:false
    // },
    senha:{
        type: Sequelize.STRING,
        allowNull:false
    },
    token:{
        type: Sequelize.STRING,
        allowNull:false
    },
  
    // Setor:{
    //     type: Sequelize.STRING,
    //     allowNull:false
    // },
    // Perfil:{
    //     type: Sequelize.STRING,
    //     allowNull:false
    // }
    
    

});

Usuarios.sync({force:false}).then (() => { 
    console.log(" Sincronismo da Tabela Usuarios")
});

module.exports= Usuarios