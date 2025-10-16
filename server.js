// Mudança no Handlebars app.engine('handlebars', exphbs.engine())

const conn =  require('./database/conn');
const cliente = require('./models/clienteModels');
const express = require('express');
const exphbs = require('express-handlebars');
const  bodyParser = require("body-parser");
const path = require('path');
const app = express();
const PORT = 3000;
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname, 'views','layouts')));
app.set('layouts', path.join(__dirname, 'layouts'));
app.set('views', 'views');
app.use(express.json());
app.use(bodyParser.json());
// Respond to GET request on the root route
app.get('/', (req, res) => {
  res.render('index');
});

const hoje = new Date()
const dia = hoje.getDate().toString().padStart(2,'0')
const mes = String(hoje.getMonth() + 1).padStart(2,'0')
const ano = hoje.getFullYear()
const hora = hoje.getHours().toString().padStart(2,'0');
const minutos = hoje.getMinutes().toString().padStart(2,'0');
const segundos = hoje.getSeconds()
const dataAtual = `${dia} / ${mes} / ${ano}`
const horaAtual = `${hora}:${minutos}:${segundos}`



// Respond to POST request on the root route
app.post('/clientesAdd', async (req, res) => {
  
    
   const nome = req.body.nome

   const email = req.body.email

   const senha = req.body.senha
  

   await cliente.create({nome, email, senha});
  
   res.status(201).redirect("clientesAll");
});

// Respond to GET request on the /about route
app.get('/clientesAll', async (req, res) => {

let todosClientes = (await cliente.findAll({raw:true})); 

 for (let index = 0; index < todosClientes.length; index++) {
   console.log(todosClientes[index]);
  
 }

 

res.render('clientesTodos', {todosClientes});

});

app.get('/clientesDel/:id', async (req, res) =>{

    const id = req.params.id;
    //conso
    
    const IdDelete = await cliente.destroy({
     where: {id: id,},

   });

   res.render('index');

});

app.get('/clientes/:id', async (req, res) => {

 
 
 const id = req.params.id;
  var findCliente =  await cliente.findByPk(id,{raw:true}); 
  
    


    res.render('clientesTodos', {findCliente});
  });



  // Rota de Atualização com PUT
app.post('/clientes/edit/', async (req, res) => {


  const id = req.body.id;
  

  const clienteUP = {
       
       nome : req.body.nome,
       email : req.body.email,
       senha : req.body.senha,
  
  }
const clienteAtualizado =  await cliente.update(clienteUP, {where: {id : id} })
 console.log("Cliente Atualizado", clienteAtualizado);


  res.render('clientesTodos');
 });

 
  
conn.authenticate().then(mensagem => {
    
    // Start the server  PORT = 3000;

    app.listen(PORT, () => {

    console.log(`App listening at http://localhost:${PORT}`);
    console.log("Data:",dataAtual);
   console.log("Hora:", horaAtual)
  
});
  }).catch(erro => {
    console.error(erro.message); 
  });;


