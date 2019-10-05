const jwt = require('jsonwebtoken');
const uuid = require('uuid/v1');


const userDB = [
    {
        "id": "c0664960-e711-11e9-9ccd-d76cfb639b15",
        "email": "albert@gmail.com",
        "password": 123
    }
]

module.exports.signin = function(user) {
    for (var i in userDB) {
        var x = userDB[i];
        if (x.email == user.email && x.password == user.password) {
            return { auth: true, token: jwt.sign({ id: x.id }, process.env.SECRET) };
        }
    }
    return { auth: false, token: null };
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