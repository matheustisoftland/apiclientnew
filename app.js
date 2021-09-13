const express = require('express');1
const app = express();
const morgan = require ('morgan')
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotamerege = require('./routes/meregetech');
const { restart } = require('nodemon');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //apenas dados simples
app.use(bodyParser.json()); // json de entradano body


app.use((req, res, next)=>{
 res.header('Acces-Control-Allow-Origin', '*');
 res.header(
     'Acces-Control-Allow-Header', 
     'Origin, X-Requrested-With, Content-Type, Accept, Authorization'
     
     );
     if (req.method === 'OPTION') {
         res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
         return res.status(200).send({});

     }

     next();
})

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/meregetech', rotamerege);


//quando não encontra rota
app.use((req, res, next) => {
 const erro = new Error('Não encontrado');
 erro.status = 404;
 next(erro);
});

app.use((error, req, res, next) => {
 res.status(error.status || 500);
return res.send({
erro: {
    mensagem: error.message
}

});
});

module.exports = app;