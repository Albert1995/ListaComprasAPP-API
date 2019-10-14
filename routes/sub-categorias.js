const auth = require('../app/auth');
const uuid = require('uuid/v1');

module.exports = function(app) {

    var urlBase = '/subCategorias';
    var firestore = require('../config/firebase-config').firestore();
    var subCategoriasCollection = "SubCategorias";

    app.get(urlBase + '/:id', auth.validate, function(req, res) {
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

    app.post(urlBase, auth.validate, function(req, res) {
        var subCategoria = req.body;
        firestore.collection(subCategoriasCollection).doc(subCategoria.id).set(subCategoria)
        .then(function() {
            res.json(jsonOK);
        }).catch(function(e) {
            console.error(e);
            res.send('Erro');
        });
    });

    app.delete(urlBase + '/:id', auth.validate, function(req, res) {
        firestore.collection(subCategoriasCollection).doc(req.params.id).delete().then(function() {
            res.json(jsonOK);
        }).catch(function(e) {
            console.error(e);
            res.send('Erro');
        });
    });

    app.put(urlBase + '/:id', auth.validate, function(req, res) {
        firestore.collection(subCategoriasCollection).doc(req.params.id).update(req.body)
        .then(function() {
            res.json(jsonOK);
        }).catch(function(e) {
            console.error(e);
            res.send('Falha');
        })
    });

}