const auth = require('../app/auth');

module.exports = function(app) {

    var urlBase = '/categorias';
    var firestore = require('../config/firebase-config').firestore();
    var categoriasCollection = "Categorias";

    app.get(urlBase, auth.validate, function(req, res) {
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
        });
    });

    app.post(urlBase, function(req, res) {
        var categoria = req.body;

        firestore.collection(categoriasCollection).doc(categoria.id).set(categoria)
        .then(function() {
            res.json(jsonOK);
        }).catch(function(e) {
            console.error(e);
            res.send('Erro');
        });
    });

    app.delete(urlBase + '/:id', function(req, res) {
        firestore.collection(categoriasCollection).doc(req.params.id).delete().then(function() {
            res.json(jsonOK);
        }).catch(function(e) {
            console.error(e);
            res.send('Erro');
        });
    });

    app.put(urlBase + '/:id', function(req, res) {
        firestore.collection(categoriasCollection).doc(req.params.id).update(req.body)
        .then(function() {
            res.json(jsonOK);
        }).catch(function(e) {
            console.error(e);
            res.send('Falha');
        })
    });
}