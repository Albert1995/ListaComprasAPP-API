const auth = require('../app/auth');
const postgres = require('../config/postgres-config');
const uuid = require('uuid/v1');
const uuidSalt = require('uuid/v4');
const crypto = require('crypto');

function validateUser (user) {
    var result = { valid: true, code: 0, msg: "OK" };
    const regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!user.email || user.email.length == 0) {
        result.valid = false;
        result.code = -1;
        result.msg = 'Campo "email" não informado';
        return result;
    } else if (!regexEmail.test(user.email.toLowerCase())) {
        result.valid = false;
        result.code = -2;
        result.msg = 'Campo "email" com formato inválido';
        return result;
    }

    if (!user.password || user.password.length == 0) {
        result.valid = false;
        result.code = -3;
        result.msg = 'Campo "password" não informado';
        return result;
    } else if (user.password.length < 5) {
        result.valid = false;
        result.code = -4;
        result.msg = 'Campo "password" deve conter no minimo 5 caracteres';
        return result;
    }

    return result;
}

async function createUser(user, callback) {
    var db = postgres.getClient();
    var salt = uuidSalt();
    
    await db.connect();
    db.query('INSERT INTO USERS VALUES ($1::text, $2::text, $3::text, $4::text)', [uuid(), user.email, crypto.createHmac('sha256', salt).update(user.password).digest('hex'), salt], function (err, res) {
        callback(err, res);
        db.end();
    });
}

module.exports = function (app) {

    var urlBase = '/user';

    app.post(urlBase + '/',function(req, res) {
        var user = req.body;
        var validation = validateUser(user);

        if (!validation.valid) {
            res.send(validation);
        } else {
            createUser(user, function(err) {
                console.log('lalalalla');
                if (err) {
                    res.send(err);
                } else {
                    res.send({ code: 0, msg: 'Usuário criado' });
                }
            })
        }
    });
    
    app.post('/login', async function(req, res){
        var userAuth = await auth.signin(req.body);
        res.send(userAuth);
    });



}