const auth = require('../app/auth');
const uuid = require('uuid/v1');

module.exports = function(app) {

    var urlBase = '/categorias';
    var firestore = require('../config/firebase-config').firestore();
    var categoriasCollection = "Categorias";

    app.post(urlBase, auth.validate, function(req, res) {
        var categoria = req.body;
        categoria.id = uuid();

        firestore.collection(categoriasCollection).doc(categoria.id).set(categoria)
        .then(function() {
            res.send({
                valid: true,
                code: 0,
                msg: 'Salvo com sucesso!'
            })
        }).catch(function(err) {
            res.send({
                code: -10,
                msg: 'Não foi possível criar a categoria',
                trace: err
            })
        });
    });


    app.get(urlBase + '/getAll/:uuid', auth.validate, function(req, res) {
        var lista = [];
        firestore.collection(categoriasCollection).where('idUsuario', '==', req.params.uuid).get().then(function(snapshot) {
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

    app.get(urlBase + '/:id', auth.validate, function(req, res) {
        firestore.collection(categoriasCollection).doc(req.params.id).get().then(function(doc) {
            if (!doc.exists) {
                res.send('Categoria não encontrada');
            } else {
                var c = doc.data();
                if (c.idUsuario == req.user)
                    res.send({
                        id: c.id,
                        nome: c.nome,
                        idUsuario: c.idUsuario
                    });
                else 
                    res.send('Categoria não encontrada');
            }
        });
    });

    app.delete(urlBase + '/excluirCategoria/:id/:idUsuario', auth.validate, function(req, res) {
        
        firestore.collection(categoriasCollection).doc(req.params.id).get().then(function(doc) {
            if (doc.data().idUsuario = req.params.idUsuario) {
                firestore.collection(categoriasCollection).doc(req.params.id).delete();
                firestore.collection(subCategoriasCollection).where('categoria', '==', req.params.id).delete();
            } else {
                res.send({
                    code: -21,
                    msg: 'Você não pode excluir categorias que não pertencem a seu usuário.'
                })
            }
        }).then(function() {
            res.json({ code: 0, msg: 'Deleted' });
        }).catch(function(err) {
            res.send({
                code: -20,
                msg: 'Não foi possível excluir a categoria',
                trace: err
            })
        });
        
        
    });

    app.put(urlBase + '/:id', auth.validate, function(req, res) {
        firestore.collection(categoriasCollection).doc(req.params.id).get().then(function(doc) {
            if (doc.data().idUsuario = req.user) {
                return firestore.collection(categoriasCollection).doc(req.params.id).update(req.body).then(function() {
                    res.json(req.body);
                }).catch(function(err) {
                    res.send({
                        code: -30,
                        msg: 'Não foi possível alterar a categoria',
                        trace: err
                    })
                })
            } else {
                res.send({
                    code: -31,
                    msg: 'Você não pode alterar categorias que não pertencem a seu usuário.'
                })
            }
        })
    });
}