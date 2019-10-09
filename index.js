const express = require('express');
const app = express();


async function init() {
    // Configuração inicial do projeto
    require('./config/app-config')(app);

    // Inicializa o Firebase
    require('./config/firebase-config')();

    await require('./config/postgres-config')();

    // Habilita as rotas
    require('./config/routes-config')(app);
}

app.get('/', function(req, res) {
    res.send('Lista de Compras API');
});

app.listen(process.env.PORT || 3000, async function () {
    await init();
    console.log('Servidor está online');
});