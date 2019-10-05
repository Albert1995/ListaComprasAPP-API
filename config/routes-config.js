module.exports = function(app) {

    require('../routes/user')(app);
    require('../routes/items')(app);
    require('../routes/categorias')(app);
    //require('../routes/sub-categorias')(app);

}