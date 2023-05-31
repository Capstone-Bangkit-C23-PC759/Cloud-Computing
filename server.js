'use strict'
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require("./routes")
const Jwt = require('@hapi/jwt');
const afterTokenValidate = require("./app/utils/afterTokenValidate")

global.sqlPool = require("./app/connections/database.connection")
const init = async () => {
    const server = Hapi.server({
        port:  process.env.PORT || 3000,
        host: 'localhost'
    });
    await server.register(Jwt);
    server.auth.strategy('jwt', 'jwt', {
        keys: process.env.JWT_SECRET,
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate:afterTokenValidate
    })

     // Set the strategy
     server.auth.default('jwt');

    server.route(routes)
    await server.start();
};
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();