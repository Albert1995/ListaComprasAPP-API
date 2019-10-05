const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv-safe').config();

module.exports = function(app) {
    app.use(bodyParser.json());
}