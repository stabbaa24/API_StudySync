let jwt = require('jsonwebtoken');
let config = require('../config');

//https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'Pas de token' });
    
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Erreru authentification token' });
      
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;