const express = require('express');
const app = express();
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("./firebase.json");
const itemsCollection = 'items';

var firestore;

/**
 * Inicializa uma conexao com o Firebase
 */
function initializeFirebase() {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: "https://listacomprasapp-b51d0.firebaseio.com"
    });

    firestore = firebaseAdmin.firestore();
}

app.get('/', function(req, res) {
    res.send('Hello World');
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