
//apenas configurações do servidor
const express = require("express");
const app = express();
// configurar o body-parse
const bodyParser = require('body-parser');
const connection = require('./database/database')
const bcrypt=require('bcryptjs')
const session=require('express-session')
//BANCO DE DADOS
const Usuarios = require("./database/Usuarios");
const Visitantes = require("./database/Visitante");
// const Registros = require("./database/Registros");
const Tema = require("./database/Tema");


app.use(bodyParser.urlencoded({ extended: false }));

//estou dizendo para o Express usar o Ejs como View engine
app.set('view engine', 'ejs');
app.use(express.static("public"))

app.use(session({
    secret: 'welyda',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: false
    }
}));

//         TESTAR TOKEN
async function testartoken(req, res, next ){
    if (req.session.user) {
        let usuario= req.session.user.usuario
        let token= req.session.user.token
        console.log("token sessio"+token)
        Usuarios.findOne({
            where:{email:usuario}
        }).then((user) => {
            console.log("token bd"+user.token)
            if(user != undefined) {
                if (user.token == token){
                next();  
                } else res.redirect("/logout")
            }else res.redirect("/logout")
        }).catch(() => {
            res.redirect("/logout")
        })
    }else res.redirect("/logout")
}



// let bdPerguntasVetor;
// funcbdPergunta()
// let bdTema
funcbdTema()


// async function funcbdPergunta() {
//     bdPerguntasVetor = await Pergunta.findAll({ raw: true, order: [['id', 'DESC']] })
// }


async function funcbdTema() {
    let contadorUser= await Usuarios.count({ raw: true})
    Tema.findOne({ where: { id: "1" } })
    .then((selectTema) => {
        if(selectTema==undefined){
            Tema.create({
                tema:"Primeiro tema",
                qtdauser:contadorUser
            
            })
            bdTema={
                tema:"Primeiro tema",
                qtdauser:contadorUser
            }
        }else{
            bdTema=selectTema
            selectTema.update({
                qtdauser: contadorUser
            }).then(()=>{
                bdTema.qtdauser =contadorUser  
            })
        }
           
        })
}



//Database

connection.authenticate()
    .then(() => {
        console.log("Conexão ok com o BD")
    })

    .catch((msgErro) => {
        console.log(msgErro);
    })





//rota Login
app.get("/", (req, res) => { //referente ao login

    res.render("login", {
        cadastrar: 0,
        feedback: 0
    })

});

app.get('/logout', (req, res) => {
    // Destruir a sessão (remove todos os dados da sessão)
    req.session.destroy
    req.session.user = {
        usuario: "",
        token: ""
    }
    res.redirect('/');
});


app.get('/formcadastro/:feedback?', (req, res) => {
    let feedback = req.params.feedback
    if (feedback != undefined) {
        res.render("login", {
            cadastrar: 1,
            feedback: feedback
        })

    } else {
        res.render("login", {
            cadastrar: 1,
            feedback: "0"
        })
    }

});


// Rota para lidar com o envio do formulário de cadastro
app.post('/cadastrar', async (req, res) => {
    
    try {
        const  nome= req.body.nome;
        const  email= req.body.email;
        const  senha= req.body.senha;
        const  confirmar= req.body.confirmar;

     
    //   console.log( "Nome: " + nome + " Usuário: " + email + " Senha: " + senha )
      
    // Verifique se algum campo está em branco
    if ( !nome || !email || !senha || !confirmar) {
        return res.send('Por favor, preencha todos os campos.');
      }
      // Verifique se a senha e a confirmação são iguais
      if (senha != confirmar) {
        return res.send('As senhas não correspondem.');
      }
      // Verifique se o email já está em uso
      const emailExistente = await Usuarios.findOne({ where:{email:email} });
      if (emailExistente) {
        return res.send('Este email já está em uso.');
      }
      //criptografando
         const salt = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(senha, salt);
         let token= bcrypt.hashSync(email,salt)
      // Crie o registro no banco de dados 
       await Usuarios.create({
        nome:nome,
        email:email,
        senha: hash,
        token:token
      });
      res.redirect('/');  
    }catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
      res.send('Ocorreu um erro ao cadastrar o usuário.');
    }
});





app.post("/login", (req, res) => {

    let email = req.body.email
    let senha = req.body.senha
    
    if ((email)&&(senha)) {    
    Usuarios.findOne({ where: { email: email } })
    .then(user => {
        
     let testehash=bcrypt.compareSync(senha, user.senha)
     
        if ((email == user.email )&& (testehash == true)) {
            const salt= bcrypt.genSaltSync(10)
            let token=bcrypt.hashSync(user.email,salt)
        
            user.update({
                token:token
            }).then(() =>{ // importante a promessa por causa da demora na atualização do token 
                req.session.user={
                    usuario:user.email,
                    token:token
                    // setor: user.setor
                } 
               
                // funcbdTema()
                res.redirect("/index")
            }).catch(()=>{
                
            })
            
        } else {
            res.redirect("/");
        }
    }).catch(() => {
        
        res.redirect("/");
    })
 }
})



// ÁREA PARA O PAGINA INCIAL (VISITANTE)

// //rota pagina inicial
app.get("/index", testartoken, (req, res) => {

    let userlogado = req.session.user.usuario

            res.render("index", { //reenderizando

                // pergunta: bdPerguntasVetor,
                userlogado: userlogado,
                cadvisit:0
                // tema: bdTema.tema,
                // qtdauser: bdTema.qtdauser  //variavel recebendo valor
               
            })
        
});


app.post("/procurar", (req, res) => {

    let nome = req.body.nome
    let cpf = req.body.cpf
    
    if ((nome)&&(cpf)) {    
    Visitantes.findOne({ where: { cpf: cpf } })
    .then(user => {
        
    //  let testehash=bcrypt.compareSync(senha, user.senha)
     
        if ((cpf == user.cpf )&& (nome == user.nome)) {
            // const salt= bcrypt.genSaltSync(10)
            // let token=bcrypt.hashSync(user.email,salt)
        
           then(() =>{ // importante a promessa por causa da demora na atualização do token 
                req.session.user={
                    usuario:user.cpf,
                    // token:token
                    // setor: user.setor
                } 
               
                // funcbdTema()
                res.redirect("/index")
            }).catch(()=>{
                
            })
            
        } else {
            res.redirect("/");
        }
    }).catch(() => {
        
        res.redirect("/");
    })
 }
})


 //Formulário de cadastro de visitante
app.get('/formcadv /:feedback?', (req, res) => {
    let feedback = req.params.feedback
    if (feedback != undefined) {
        res.render("index", {
            cadvisit: 1,
            feedback: feedback
        })

    } else {
        res.render("index", {
            cadvisit: 1,
            feedback: "0"
        })
    }

});


app.post('/cadastrarvisit', async (req, res) => {
    
    try {
        const  nome= req.body.nome;
        const  email= req.body.email;
        const  cpf= req.body.cpf;
        // 

     
    //   console.log( "Nome: " + nome + " Usuário: " + email + " Senha: " + senha )
      
    // Verifique se algum campo está em branco
    if ( !nome || !email || !cpf ) {
        return res.send('Por favor, preencha todos os campos.');
      }
    //   // Verifique se a senha e a confirmação são iguais
    //   if (senha != confirmar) {
    //     return res.send('As senhas não correspondem.');
    //   }
      // Verifique se o email já está em uso
      const emailExistente = await Visitantes.findOne({ where:{email:email} });
      if (emailExistente) {
        return res.send('Este email já está em uso.');
      }
    //   //criptografando
    //      const salt = bcrypt.genSaltSync(10);
    //      const hash = bcrypt.hashSync(senha, salt);
    //      let token= bcrypt.hashSync(email,salt)
      // Crie o registro no banco de dados 
       await Visitantes.create({
        nome:nome,
        email:email,
        cpf: cpf
    
      });
      res.redirect('/index');  
    }catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
      res.send('Ocorreu um erro ao cadastrar o usuário.');
    }
});


// /*app.get("/rotaderegistroV", (req, res) => {
//     const uid= req.query.uidV;
//     const setor= req.query.setor;
//     console.log(uid)
//     Usuarios.findOne({
//         where:{
//             rfid:uid
//         }
//     }).then((usuarioRFID) => {
//          if(usuarioRFID==" "||usuarioRFID==undefined||usuarioRFID==null){
//             res.send("[recusado")
//          }else{
//             Acesso.create({
//                 nome: usuarioRFID.nome,
//                 rfid:uid,
//                 setor:setor
//             }).then(() =>{
//                 res.send("[autorizado")
//                 funcbdAcesso()
//             }).catch((err) =>{
//                 console.error(err)
//                 res.send('[erro');
//             });
//          }
//         }).catch(() =>{
//             console.error(err)
//             res.send('[erro');
//         })

    
// }):*/

        








// //rota perguntar
// app.get("/perguntar", testartoken,  (req, res)  => {
//  let userlogado= req.session.user.usuario
//     res.render("perguntar",{
//         qtdauser: bdTema.qtdauser,
//         userlogado: userlogado,
//         atualizar: 0
//     })

// });


// //rota salvar pergunta
// app.post("/salvarpergunta", testartoken, (req, res) => {

//     let titulo = req.body.titulo
//     let descricao = req.body.descricao //parametros para capturar



//     if (descricao != "" && titulo != "") {
//         Tema.findOne({ where: { id: "1" } })
//         .then((selectTema) => {
//             let userlogado = req.session.user.usuario
//             Pergunta.create({
//                 titulo: titulo,
//                 descricao: descricao,
//                 email: userlogado,
//                 tema: selectTema.tema,
//                 qtdaRespostas:0
//             }).then(() => {
//                 funcbdPergunta();
//                 res.redirect("/index");
//             }).catch(() => {
//                 res.redirect("/");
//             })
//         })

//     } else {
//         res.redirect("/logout");
//     }


//     // res.send(" <h2>Titulo:</h2> " + titulo + " <h2>Descrição:</h2> " + descricao )


// });

// app.get("/pergunta/:id", (req, res) => {

//     let id = req.params.id

//     Pergunta.findOne({
//          where: {
//              id: id 
//             } }).then(pergunta => {
//         if (pergunta != undefined) {//pergunta encontrada
//             Resposta.findAll({
//                 where: { perguntaId: pergunta.id },
//                 order: [['id', 'DESC']]
//             }).then(respostas => {
//                 let userlogado = req.session.user.usuario
//                 res.render("pergunta", {
//                     qtdauser: bdTema.qtdauser,
//                     pergunta: pergunta,
//                     respostas: respostas,
//                     userlogado: userlogado
//                 })
//             })
//         } else {
//             res.redirect("/") //pergunta não encontrada
//         }

//         //estrutura para conseguir pesquisar cada pergunta pelo id
//     })

// });






// //rota salvar resposta
// app.post("/salvarresposta", (req, res) => {

//     let corpo = req.body.corpo
//     let perguntaid = req.body.perguntaid



//     if (corpo != "" && perguntaid != "") {
//         let userlogado = req.session.user.usuario
//         Resposta.create({
//             corpo: corpo,
//             perguntaid: perguntaid,
//             email: userlogado
//         }).then(() => {
//             Pergunta.findOne({
//                 where: { id: perguntaid }
//             }).then((pergunta) => {
                
//                 if (pergunta) {
//                     // Se o registro for encontrado, atualize os valores
//                     pergunta.update({
//                         qtdaRespostas:pergunta.qtdaRespostas + 1
//                     }).then(() => {
//                     funcbdPergunta()
//                     res.redirect("/pergunta/" + perguntaid);
//                     })
//                 }
//             }).catch(() => {
//                 res.redirect("/logout");
//             })
//         })
//     } else {
//         res.redirect("/index");
//     }



// });

// //rota deletar pergunta
// app.get("/deletarPergunta/:id", testartoken, (req, res) => {
//     let id = req.params.id;
//     Pergunta.destroy({
//         where: { id: id }
//     }).then(() => {
//         Resposta.destroy({
//             where: { perguntaID: id }
//         }).then(() => {
//             funcbdPergunta()
//             res.redirect("/index");
//         })
//     })
// })

// app.get("/deletarResposta/:id", testartoken, (req, res) => {
//     let id = req.params.id;
//     Resposta.findOne({
//         where: { id: id }
//     }).then((resposta)=>{
        
//         Pergunta.findOne({
//             where: { id: resposta.perguntaId }
//         }).then((pergunta) => {
            
//             if (pergunta) {
//                 // Se o registro for encontrado, atualize os valores
//                 pergunta.update({
//                     qtdaRespostas:pergunta.qtdaRespostas - 1
//                 }).then(() => {
//                 funcbdPergunta()
//                 Resposta.destroy({
//                     where: { id: id }
//                 }).then(() => {
            
//                     res.redirect("/pergunta/" + id);
//                 })
//                 res.redirect("/pergunta/" + id);
//                 })
//             }
//         }).catch(() => {
//             res.redirect("/logout");
//         })
    
//     })

    

   
// })
// funcbdPergunta


// app.get("/queromudarpergunta/:id", testartoken, (req, res) => {
//     let id = req.params.id;// aqui estou pegando id da pergunta 
//     let userlogado = req.session.user.usuario;// aqui estou pegando o nome do usuario com session 
//     let idvetor = 0// variavel responsavel em salvar a posoção vetorial do id na variavel global da pergunta 
//     for (let index = 0; index < bdPerguntasVetor.length; index++) {
//         if (bdPerguntasVetor[index].id == id) {
//             idvetor = index
//             index = bdPerguntasVetor.length
//         }

//     }

//     res.render("perguntar", {
//         qtdauser: bdTema.qtdauser,
//         pergunta: bdPerguntasVetor[idvetor],
//         userlogado: userlogado,
//         atualizar: 1,
//         id: id
//     })

// })

// app.post("/atualizarpergunta/:id", testartoken, (req, res) => {

//     let id = req.params.id;
//     let descricao = req.body.descricao
//     let titulo = req.body.titulo
//     Pergunta.findOne({
//         where: { id: id },
//     })
//         .then((pergunta) => {
//             if (pergunta) {
//                 // Se o registro for encontrado, atualize os valores
//                 pergunta.update({
//                     titulo: titulo,
//                     descricao: descricao
//                 })
//                     .then((updatedPergunta) => {
//                         funcbdPergunta()
//                         res.redirect("/index")
//                     })
//                     .catch((error) => {
//                         res.redirect("/index")
//                     });
//             } else {
//                 res.redirect("/index")
//             }
//         })
//         .catch((error) => {
//             res.redirect("/index")
//         })
// })


// app.post("/temaprincipaladm", testartoken, (req, res) => {
//     let tema = req.body.tema

//     Tema.findOne({ where: { id: "1" } })
//         .then((selectTema) => {
          
//             if (selectTema != "") {
             
//                 // Se o registro for encontrado, atualize os valores
//                 selectTema.update({
//                     tema: tema
//                 })
//                     .then((ok) => {
//                         funcbdTema()
//                         res.redirect("/index")
//                     })
//                     .catch((error) => {
//                         res.redirect("/index")
//                     });
//             } else {
//                 Tema.create({
//                     tema:tema,
//                     qtdauser:bdTema.qtdauser
//                 }).then(() => {
//                     funcbdTema()
//                     res.redirect("/index");
//                 }).catch(() => {
//                     res.redirect("/index");
//                 })
//                 res.redirect("/index")
//             }
//         })
//         .catch((error) => {
//             res.redirect("/index")
//         });


// })







// Fazendo o meu servidor rodar
app.listen(80, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro!");                  //or
        // app.listen(8080,()=> {console.log("Servidor iniciado!");});
    }
    else {
        console.log("app iniciado com sucesso!");
    }
})






