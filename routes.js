/**
 * Created by YS on 2016-05-16.
 */
var routes = require('./routes/index');
var admin = require('./routes/admin');

module.exports = function(app){
    app.use('/', routes);
    app.use('/admin', admin);
};
