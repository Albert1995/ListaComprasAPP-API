const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("../firebase.json");

module.exports = function () {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: "https://listacomprasapp-b51d0.firebaseio.com"
    });
}

module.exports.firestore = function() {
    return firebaseAdmin.firestore();
}