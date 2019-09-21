const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
require('firebase/auth');
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("./firebase.json");
const uuid = require('uuid');
const app = express();

const itemsCollection = 'items';
const categoriasCollection = 'Categorias';
const subCategoriasCollection = 'SubCategorias';
const jsonOK = {code: 0, msg: 'OK'};

app.use(bodyParser.json());

var firestore, auth;

/**
 * Inicializa uma conexao com o Firebase
 */
function initializeFirebase() {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: "https://listacomprasapp-b51d0.firebaseio.com"
    });
    
    firestore = firebaseAdmin.firestore();
    auth = firebaseAdmin.auth();
}

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.post('/criarUsuario',function(req, res) {
    var usuario = req.body;
    firebaseAdmin.auth().createUser({
        email: usuario.email,
        password: usuario.senha
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
          res.json(userRecord.uid);
        })
        .catch(function(error) {
          console.log('Error creating new user:', error);
        });
});

app.post('/login', function(req, res){
    var usuario = req.body;
    firebaseAdmin.auth().getUserByEmail(usuario.email)
        .then(function(userRecord) {
            res.send(userRecord.toJSON());
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully fetched user data:', userRecord.toJSON());
        })
        .catch(function(error) {
        console.log('Error fetching user data:', error);
        });
});

app.get('/categorias', function(req, res) {
    var lista = [];
    firestore.collection(categoriasCollection).get().then(function(snapshot) {
        for (var d in snapshot.docs) {
            var id = snapshot.docs[d].id;
            var doc = snapshot.docs[d].data();
            lista.push({
                id: id,
                nome: doc.nome,
                idUsuario: doc.idUsuario
            });
        }
        res.json(lista);
    })
});

app.post('/novaCategoria', function(req, res) {
    var categoria = req.body;
    firestore.collection(categoriasCollection).doc(categoria.id).set(categoria)
    .then(function() {
        res.json(jsonOK);
    }).catch(function(e) {
        console.error(e);
        res.send('Erro');
    });
});

app.delete('/excluirCategoria/:id', function(req, res) {
    firestore.collection(categoriasCollection).doc(req.params.id).delete().then(function() {
        res.json(jsonOK);
    }).catch(function(e) {
        console.error(e);
        res.send('Erro');
    });
});

app.put('/atualizarCategoria/:id', function(req, res) {
    firestore.collection(categoriasCollection).doc(req.params.id).update(req.body)
    .then(function() {
        res.json(jsonOK);
    }).catch(function(e) {
        console.error(e);
        res.send('Falha');
    })
});

app.get('/subCategorias/:id', function(req, res) {
    var lista = [];
    firestore.collection(subCategoriasCollection).where('categoria', '==', req.params.id).get().then(function(snapshot) {
        for (var d in snapshot.docs) {
            var id = snapshot.docs[d].id;
            var doc = snapshot.docs[d].data();
            lista.push({
                id: id,
                categoria: doc.categoria,
                descricao: doc.descricao
            });
        }
        res.json(lista);
    })
});

app.post('/novaSubCategoria', function(req, res) {
    var subCategoria = req.body;
    firestore.collection(subCategoriasCollection).doc(subCategoria.id).set(subCategoria)
    .then(function() {
        res.json(jsonOK);
    }).catch(function(e) {
        console.error(e);
        res.send('Erro');
    });
});

app.delete('/excluirSubCategoria/:id', function(req, res) {
    firestore.collection(subCategoriasCollection).doc(req.params.id).delete().then(function() {
        res.json(jsonOK);
    }).catch(function(e) {
        console.error(e);
        res.send('Erro');
    });
});

app.put('/atualizarSubCategoria/:id', function(req, res) {
    firestore.collection(subCategoriasCollection).doc(req.params.id).update(req.body)
    .then(function() {
        res.json(jsonOK);
    }).catch(function(e) {
        console.error(e);
        res.send('Falha');
    })
});

/**
 * Retorna todos os itens cadastrados
 */
app.get('/items', function(req, res) {
    var lista = [];
    firestore.collection(itemsCollection).get().then(function(snapshot) {
        for (var d in snapshot.docs) {
            var id = snapshot.docs[d].id;
            var doc = snapshot.docs[d].data();
            lista.push({
                id: id,
                descricao: doc.descricao
            });
        }
        res.send(lista);
    })
});

app.get('/items/:id', function(req, res) {
    firestore.collection(itemsCollection).doc(req.params.id).get()
    .then(function(doc) {
        if (doc.exists)
            res.send(doc.data());
        else
            res.send('ID não existe na base');
    }).catch(function(e) {
        console.error(e);
        res.send('Falha');
    });
})

/**
 * Adiciona um novo item no firebase
 */
app.post('/items', function(req, res) {
    firestore.collection(itemsCollection).add(req.body)
    .then(function() {
        res.send('OK');
    }).catch(function(e) {
        console.error(e);
        res.send('Falha');
    });
});

/**
 * Exclui item da lista
 */
app.delete('/items/:id', function(req, res) {
    firestore.collection(itemsCollection).doc(req.params.id).delete().then(function() {
        res.send('OK');
    }).catch(function(e) {
        console.error(e);
        res.send('Falha');
    });
});

app.put('/items/:id', function(req, res) {
    firestore.collection(itemsCollection).doc(req.params.id).update(req.body)
    .then(function() {
        res.send('OK');
    }).catch(function(e) {
        console.error(e);
        res.send('Falha');
    })
});

app.listen(process.env.PORT || 3000, function () {
    initializeFirebase();

    console.log('Servidor está online');
});