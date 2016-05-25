/**
 * Created by YS on 2016-05-16.
 */
var routes = require('./routes/index');
var admin = require('./routes/admin');
var user = require('./routes/user');
var message = require('./routes/message');

module.exports = function(app){
    app.use('/', routes);
    app.use('/admin', admin);
    app.use('/user', user);
    app.use('/message', message);
};
