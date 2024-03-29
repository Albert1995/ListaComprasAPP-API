const jwt = require('jsonwebtoken');
const postgres = require('../config/postgres-config');
const crypto = require('crypto');

module.exports.signin = async function(user) {
    var db = postgres.getClient();
    var result = { auth: false, token: null, uuid: "" };
    //var result = { valid: true, code: 0, msg: "OK" };

    await db.connect();
    var res = await db.query('SELECT uid, email, password, salt FROM USERS WHERE EMAIL = $1::text', [user.email]);
    if (res) {
        if (res.rows[0].password === crypto.createHmac('sha256', res.rows[0].salt).update(user.password).digest('hex')) {
            result.auth = true;
            result.token = jwt.sign({ id: res.rows[0].uid }, process.env.SECRET);
            result.uuid = res.rows[0].uid;
        }
    }
    await db.end();
    
    return result;
}

module.exports.validate = function(req, res, next) {
    var token = req.headers['token'];

    if (!token)
        res.send({ code: -1, msg: 'Token não enviado' });
    else 
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err)
                res.send({ code: -2, msg: 'Token Invalido' });
            req.user = decoded.id;
            next();
        });

}