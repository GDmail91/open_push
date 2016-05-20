/**
 * Created by YS on 2016-05-20.
 */
var jwt = require('jsonwebtoken');
var SECRET = 'token_secret'; // TODO secret key
var EXPIRES = '6h'; // TODO expire time

// Generate JWT token
function signToken(id) {
    return jwt.sign({id: id}, SECRET, { expiresIn: EXPIRES });
}

// Verify token info
function isAuthenticated(authorization, callback) {
    // Validate jwt
    var decoded = jwt.verify(authorization, SECRET);

    callback(decoded);
}


exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;