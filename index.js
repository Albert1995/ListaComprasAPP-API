const express = require('express');
const app = express();

// Configuração inicial do projeto
require('./config/app-config')(app);

// Inicializa o Firebase
require('./config/firebase-config')();

// Habilita as rotas
require('./config/routes-config')(app);

app.get('/', function(req, res) {
    res.send('Lista de Compras API');
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Servidor está online');
});