'use strict'
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require("./routes")
global.sqlPool = require("./app/connections/database.connection")
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    server.route(routes)
    await server.start();
};
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();