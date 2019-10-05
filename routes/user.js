const auth = require('../app/auth');

module.exports = function (app) {

    var urlBase = '/user';

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
        var userAuth = auth.signin(req.body);
        res.send(userAuth);
    });



}