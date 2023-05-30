const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET

module.exports = userInfo => jwt.sign({
    aud: 'urn:audience:test',
    iss: 'urn:issuer:test',
    userInfo
}, secretKey, {
     expiresIn: '4h', algorithm: 'HS256' 
 }
 );